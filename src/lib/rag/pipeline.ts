import type { ChatMode, ChatResponse, SourceCitation } from "@/types";
import { XMLParser } from "fast-xml-parser";
import { getEmbedding } from "./embeddings";
import { getOrCreateCollection, queryDocuments, type RetrievedChunk } from "./vector-store";
import { generateResponse, generateResponseStream } from "./llm";
import { SYSTEM_PROMPTS } from "./prompts";
import { extractPolicyIntent, formatExtractionContext } from "./extractor";
import { validatePolicy } from "@/lib/ontology/validator";

const xmlValidator = new XMLParser({ allowBooleanAttributes: true });

const TOP_K = parseInt(process.env.RETRIEVAL_TOP_K || "5");

/**
 * Extract a fenced code block by language tag from LLM output.
 */
function extractFencedBlock(text: string, lang: string): string | undefined {
  const regex = new RegExp("```" + lang + "\\s*\\n([\\s\\S]*?)```", "i");
  const match = text.match(regex);
  return match ? match[1].trim() : undefined;
}

/**
 * Validate that a string is well-formed XML.
 * Returns the XML if valid, undefined if malformed.
 */
function validateXml(xml: string): string | undefined {
  try {
    xmlValidator.parse(xml);
    return xml;
  } catch {
    return undefined;
  }
}

/**
 * Build source citations from retrieved chunks.
 */
function buildSources(chunks: RetrievedChunk[]): SourceCitation[] {
  // Deduplicate by source path
  const seen = new Set<string>();
  const sources: SourceCitation[] = [];

  for (const chunk of chunks) {
    const key = chunk.metadata.source;
    if (seen.has(key)) continue;
    seen.add(key);

    sources.push({
      title: `${chunk.metadata.title} — ${chunk.metadata.heading}`,
      source: chunk.metadata.source,
      snippet: chunk.content.slice(0, 150) + (chunk.content.length > 150 ? "..." : ""),
    });
  }

  return sources;
}

/**
 * Retrieve RAG context from ChromaDB. Returns empty on failure (graceful fallback).
 */
async function retrieveContext(query: string): Promise<{ retrieved: RetrievedChunk[]; context: string }> {
  try {
    const queryEmbedding = await getEmbedding(query);
    const collection = await getOrCreateCollection();
    const retrieved = await queryDocuments(collection, queryEmbedding, TOP_K);
    const context = retrieved
      .map(
        (r, i) =>
          `[Source ${i + 1}: ${r.metadata.title} > ${r.metadata.heading}]\n${r.content}`
      )
      .join("\n\n---\n\n");
    return { retrieved, context };
  } catch {
    return { retrieved: [], context: "" };
  }
}

/**
 * Parse the raw LLM response into a structured ChatResponse.
 */
function parseResponse(
  rawResponse: string,
  retrieved: RetrievedChunk[],
  mode: ChatMode
): ChatResponse {
  const sources = buildSources(retrieved);
  const response: ChatResponse = { content: rawResponse, sources };

  if (mode === "policy") {
    const rawXml = extractFencedBlock(rawResponse, "xacml") || extractFencedBlock(rawResponse, "xml");
    if (rawXml) {
      const validXml = validateXml(rawXml);
      response.policyXml = validXml ?? rawXml;
      if (!validXml) response.xmlWarning = "Generated XML may contain syntax errors.";
    }
  }

  if (mode === "scripts") {
    const script =
      extractFencedBlock(rawResponse, "script") ||
      extractFencedBlock(rawResponse, "bash") ||
      extractFencedBlock(rawResponse, "sh") ||
      extractFencedBlock(rawResponse, "shell");
    if (script) response.script = script;
  }

  return response;
}

/**
 * Full RAG query: embed → retrieve → generate → parse.
 * For policy mode: extract intent → match ontology → generate with resolved attributes.
 */
export async function ragQuery(
  query: string,
  mode: ChatMode
): Promise<ChatResponse> {
  // 1. Retrieve RAG context
  const { retrieved, context } = await retrieveContext(query);

  // 2. For policy mode, run extraction pipeline first
  let enrichedContext = context;
  let extractionResult = undefined;

  if (mode === "policy") {
    try {
      extractionResult = await extractPolicyIntent(query);
      const extractionContext = formatExtractionContext(extractionResult);
      enrichedContext = extractionContext + "\n\n---\n\n" + context;
    } catch {
      // Extraction failed — fall back to standard RAG without ontology
    }
  }

  // 3. Generate response with mode-specific system prompt
  const systemPrompt = SYSTEM_PROMPTS[mode];
  const rawResponse = await generateResponse(systemPrompt, query, enrichedContext);

  // 4. Parse and structure the response
  const response = parseResponse(rawResponse, retrieved, mode);

  // 5. For policy mode, attach extraction data and run validation
  if (mode === "policy" && extractionResult) {
    response.extraction = extractionResult;

    if (response.policyXml) {
      response.validation = validatePolicy(response.policyXml);
    }
  }

  return response;
}

/**
 * Streaming RAG query: embed → retrieve → stream tokens via SSE.
 * For policy mode: runs extraction first, then streams generation with ontology context.
 */
export async function ragQueryStream(
  query: string,
  mode: ChatMode
): Promise<ReadableStream<Uint8Array>> {
  // 1. Retrieve RAG context
  const { retrieved, context } = await retrieveContext(query);

  // 2. For policy mode, run extraction pipeline
  let enrichedContext = context;
  let extractionResult = undefined;

  if (mode === "policy") {
    try {
      extractionResult = await extractPolicyIntent(query);
      const extractionContext = formatExtractionContext(extractionResult);
      enrichedContext = extractionContext + "\n\n---\n\n" + context;
    } catch {
      // Extraction failed — fall back to standard RAG
    }
  }

  // 3. Build sources upfront
  const sources = buildSources(retrieved);
  const systemPrompt = SYSTEM_PROMPTS[mode];

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        // Send sources as the first event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`)
        );

        // Send extraction results (policy mode only)
        if (mode === "policy" && extractionResult) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "extraction", extraction: extractionResult })}\n\n`)
          );
        }

        // Stream content tokens
        const stream = generateResponseStream(systemPrompt, query, enrichedContext);
        let fullContent = "";

        for await (const token of stream) {
          fullContent += token;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "token", token })}\n\n`)
          );
        }

        // Send final parsed artifacts (policyXml, script, validation) after streaming completes
        const parsed = parseResponse(fullContent, retrieved, mode);
        const done: Record<string, unknown> = { type: "done" };
        if (parsed.policyXml) {
          done.policyXml = parsed.policyXml;

          // Run validation on generated policy
          if (mode === "policy") {
            done.validation = validatePolicy(parsed.policyXml);
          }
        }
        if (parsed.script) done.script = parsed.script;

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(done)}\n\n`)
        );
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : "Stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: msg })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });
}
