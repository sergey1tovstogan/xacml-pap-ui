import type { OntologyMatch, TemplateMatch, ValidationResult } from "@/lib/ontology/types";
import { matchTermsToOntology, findRequiredPIPConnectors } from "@/lib/ontology/matcher";
import { matchTemplate } from "@/lib/ontology/template-matcher";
import { getPIPConnector } from "@/lib/ontology/loader";
import { generateJsonResponse } from "./llm";
import { EXTRACTION_PROMPT } from "./prompts";

/** Structured representation of extracted policy intent. */
export interface PolicyIntent {
  subjects: string[];
  resources: string[];
  actions: string[];
  environment: string[];
  conditions: string[];
  rawExtraction: Record<string, unknown>;
}

/** Full result of the extraction + ontology matching pipeline. */
export interface ExtractionResult {
  intent: PolicyIntent;
  ontologyMatches: OntologyMatch[];
  templateMatch: TemplateMatch | undefined;
  requiredPIPConnectors: Array<{
    connectorId: string;
    type: string;
    endpoint: string;
    cacheTTL: string;
  }>;
}

/**
 * Extract structured policy intent from natural language using LLM + ontology matching.
 *
 * Step 1: LLM call with JSON mode to decompose NL into structured categories
 * Step 2: Match extracted terms against ontology for attribute resolution
 * Step 3: Check for matching policy templates
 * Step 4: Identify required PIP connectors
 */
export async function extractPolicyIntent(userInput: string): Promise<ExtractionResult> {
  // Step 1: LLM-based structured extraction
  const extraction = await generateJsonResponse(EXTRACTION_PROMPT, userInput, "");

  const intent: PolicyIntent = {
    subjects: asStringArray(extraction.subjects),
    resources: asStringArray(extraction.resources),
    actions: asStringArray(extraction.actions),
    environment: asStringArray(extraction.environment),
    conditions: asStringArray(extraction.conditions),
    rawExtraction: extraction,
  };

  // Step 2: Match all extracted terms against ontology
  const allTerms = [
    ...intent.subjects,
    ...intent.resources,
    ...intent.actions,
    ...intent.environment,
    ...intent.conditions,
  ];
  const ontologyMatches = matchTermsToOntology(allTerms);

  // Step 3: Check for matching policy template
  const templateMatch = matchTemplate(userInput);

  // Step 4: Identify required PIP connectors
  const connectorIds = findRequiredPIPConnectors(ontologyMatches);
  const requiredPIPConnectors = connectorIds
    .map((id) => getPIPConnector(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .map(({ connectorId, type, endpoint, cacheTTL }) => ({
      connectorId,
      type,
      endpoint,
      cacheTTL,
    }));

  return {
    intent,
    ontologyMatches,
    templateMatch,
    requiredPIPConnectors,
  };
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") return [value];
  return [];
}

/**
 * Format extraction results as context for the policy generation prompt.
 */
export function formatExtractionContext(result: ExtractionResult): string {
  const sections: string[] = [];

  // Extracted intent
  sections.push("## Extracted Policy Intent");
  sections.push(`Subjects: ${result.intent.subjects.join(", ") || "none"}`);
  sections.push(`Resources: ${result.intent.resources.join(", ") || "none"}`);
  sections.push(`Actions: ${result.intent.actions.join(", ") || "none"}`);
  sections.push(`Environment: ${result.intent.environment.join(", ") || "none"}`);
  sections.push(`Conditions: ${result.intent.conditions.join(", ") || "none"}`);

  // Ontology-resolved attributes
  if (result.ontologyMatches.length > 0) {
    sections.push("\n## Ontology-Resolved XACML Attributes");
    sections.push("Use these exact attributeId values and dataTypes in the generated policy:\n");
    for (const match of result.ontologyMatches) {
      const value = match.resolvedValue ? ` → standard value: "${match.resolvedValue}"` : "";
      sections.push(
        `- "${match.term}" → attributeId="${match.attribute.attributeId}" ` +
        `dataType="${match.attribute.dataType}" ` +
        `category="${match.category}"${value}`
      );
    }
  }

  // Template match
  if (result.templateMatch) {
    sections.push(`\n## Matched Policy Template`);
    sections.push(`Template: ${result.templateMatch.template.name} (${result.templateMatch.template.templateId})`);
    sections.push(`Required attributes: ${result.templateMatch.template.requiredAttributes.join(", ")}`);
  }

  // PIP connectors (informational)
  if (result.requiredPIPConnectors.length > 0) {
    sections.push("\n## Required PIP Connectors (for runtime attribute resolution)");
    for (const pip of result.requiredPIPConnectors) {
      sections.push(`- ${pip.connectorId} (${pip.type}): ${pip.endpoint} [cache: ${pip.cacheTTL}]`);
    }
  }

  return sections.join("\n");
}
