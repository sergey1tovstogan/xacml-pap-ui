import { NextRequest, NextResponse } from "next/server";
import { ragQuery } from "@/lib/rag/pipeline";
import { generatePolicySchema, parseBody } from "@/lib/api-schemas";
import { logApiRequest } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(generatePolicySchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const start = Date.now();
    const result = await ragQuery(parsed.data.description, "policy");

    logApiRequest("/api/generate-policy", {
      inputLength: parsed.data.description.length,
      durationMs: Date.now() - start,
      status: "success",
    });

    return NextResponse.json({
      content: result.content,
      policyXml: result.policyXml || null,
      sources: result.sources,
      extraction: result.extraction || null,
      validation: result.validation || null,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logApiRequest("/api/generate-policy", { status: "error", error: msg });
    return NextResponse.json(
      { error: "Failed to generate policy. Ensure OpenAI API key is set and ChromaDB is running." },
      { status: 500 }
    );
  }
}
