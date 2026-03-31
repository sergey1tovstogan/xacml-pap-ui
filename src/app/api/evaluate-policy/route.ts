import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { evaluatePolicySchema, parseBody } from "@/lib/api-schemas";
import { logApiRequest } from "@/lib/logger";

import type { z } from "zod";

type EvaluateInput = z.infer<typeof evaluatePolicySchema>;

type Decision = "Permit" | "Deny" | "NotApplicable" | "Indeterminate";

interface Obligation {
  obligationId: string;
  fulfillOn: string;
  attributes: Array<{ attributeId: string; value: string }>;
}

interface EvaluateResponse {
  decision: Decision;
  explanation: string;
  matchedRules: string[];
  obligations: Obligation[];
}

interface ParsedRule {
  id: string;
  effect: "Permit" | "Deny";
  hasTarget: boolean;
  attributeValues: string[];
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
});

/**
 * Safely extract an array from a parsed XML value that may be a single item or array.
 */
function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Recursively collect all AttributeValue text content from a parsed XML node.
 */
function collectAttributeValues(node: unknown): string[] {
  const values: string[] = [];
  if (node === null || node === undefined) return values;

  if (typeof node === "object" && node !== null) {
    const obj = node as Record<string, unknown>;
    if ("AttributeValue" in obj) {
      const attrVals = asArray(obj.AttributeValue);
      for (const v of attrVals) {
        if (typeof v === "string") values.push(v.trim());
        else if (typeof v === "object" && v !== null && "#text" in (v as Record<string, unknown>)) {
          values.push(String((v as Record<string, unknown>)["#text"]).trim());
        }
      }
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        values.push(...collectAttributeValues(obj[key]));
      }
    }
  }
  return values;
}

/**
 * Extract ObligationExpressions from parsed policy XML.
 */
function extractObligations(policyNode: Record<string, unknown>): Obligation[] {
  const obligations: Obligation[] = [];

  // Find ObligationExpressions container
  const oblExprs = policyNode.ObligationExpressions as Record<string, unknown> | undefined;
  if (!oblExprs) return obligations;

  const exprList = asArray(
    (oblExprs.ObligationExpression ?? oblExprs) as Record<string, unknown> | Record<string, unknown>[]
  );

  for (const expr of exprList) {
    if (typeof expr !== "object" || expr === null) continue;
    const e = expr as Record<string, unknown>;

    const obligationId = String(e["@_ObligationId"] || "unknown");
    const fulfillOn = String(e["@_FulfillOn"] || "Permit");

    const attributes: Array<{ attributeId: string; value: string }> = [];
    const attrAssignments = asArray(e.AttributeAssignmentExpression as Record<string, unknown> | Record<string, unknown>[]);

    for (const assignment of attrAssignments) {
      if (typeof assignment !== "object" || assignment === null) continue;
      const a = assignment as Record<string, unknown>;
      const attrId = String(a["@_AttributeId"] || "");
      const attrValue = a.AttributeValue;
      let value = "";
      if (typeof attrValue === "string") {
        value = attrValue;
      } else if (typeof attrValue === "object" && attrValue !== null && "#text" in (attrValue as Record<string, unknown>)) {
        value = String((attrValue as Record<string, unknown>)["#text"]);
      }
      if (attrId) attributes.push({ attributeId: attrId, value });
    }

    obligations.push({ obligationId, fulfillOn, attributes });
  }

  return obligations;
}

/**
 * Simplified XACML policy evaluator using proper XML parsing.
 * Matches subject attributes and action against policy targets and rules.
 * Now also extracts and returns ObligationExpressions.
 */
function evaluatePolicy(policyXml: string, request: EvaluateInput["request"]): EvaluateResponse {
  const matchedRules: string[] = [];

  try {
    const parsed = xmlParser.parse(policyXml);

    // Find the Policy element (handle namespace prefixes)
    const policyKey = Object.keys(parsed).find((k) => k.endsWith("Policy") || k === "Policy");
    if (!policyKey) {
      return {
        decision: "Indeterminate",
        explanation: "No Policy element found in the provided XML.",
        matchedRules: [],
        obligations: [],
      };
    }

    const policy = parsed[policyKey] as Record<string, unknown>;

    // Extract obligations from the policy
    const allObligations = extractObligations(policy);

    // Extract all attribute values from the entire policy for target matching
    const allAttributeValues = collectAttributeValues(policy);

    // Check subject attributes
    const subjectValues = Object.values(request.subject) as string[];
    const subjectMatch = subjectValues.some((val) => allAttributeValues.includes(val));

    // Check action
    const actionMatch = allAttributeValues.includes(request.action);

    // Determine combining algorithm
    const combiningAlg = String(policy["@_RuleCombiningAlgId"] || "");
    const isFirstApplicable = combiningAlg.includes("first-applicable");
    const isDenyOverrides = combiningAlg.includes("deny-overrides");

    // Extract rules
    const rawRules = asArray(policy.Rule as Record<string, unknown> | Record<string, unknown>[]);
    const rules: ParsedRule[] = rawRules.map((r: Record<string, unknown>) => ({
      id: String(r["@_RuleId"] || "unknown"),
      effect: (r["@_Effect"] === "Permit" ? "Permit" : "Deny") as "Permit" | "Deny",
      hasTarget: "Target" in r,
      attributeValues: collectAttributeValues(r),
    }));

    if (!subjectMatch) {
      return {
        decision: "NotApplicable",
        explanation: `Policy target did not match. No subject attribute matched the request attributes [${subjectValues.join(", ")}].`,
        matchedRules: [],
        obligations: [],
      };
    }

    // Filter obligations based on decision
    const getObligationsForDecision = (decision: Decision) =>
      allObligations.filter((o) => o.fulfillOn === decision);

    for (const rule of rules) {
      const ruleMatches = !rule.hasTarget ||
        rule.attributeValues.includes(request.action) ||
        subjectValues.some((v) => rule.attributeValues.includes(v));

      if (ruleMatches) {
        matchedRules.push(rule.id);

        if (isFirstApplicable) {
          return {
            decision: rule.effect,
            explanation: `Policy target matched. Rule "${rule.id}" (Effect: ${rule.effect}) was the first applicable rule.${actionMatch ? ` Action "${request.action}" matched.` : ""}`,
            matchedRules,
            obligations: getObligationsForDecision(rule.effect),
          };
        }
      }
    }

    // Deny-overrides: if any deny rule matched, deny
    if (isDenyOverrides && matchedRules.some((id) => rules.find((r) => r.id === id)?.effect === "Deny")) {
      return {
        decision: "Deny",
        explanation: `Policy target matched. Deny-overrides algorithm applied. A Deny rule was found among matched rules: [${matchedRules.join(", ")}].`,
        matchedRules,
        obligations: getObligationsForDecision("Deny"),
      };
    }

    // If rules matched, use the last one's effect (permit-overrides default)
    if (matchedRules.length > 0) {
      const lastRule = rules.find((r) => r.id === matchedRules[matchedRules.length - 1]);
      const decision = lastRule?.effect || "Deny";
      return {
        decision,
        explanation: `Policy target matched. ${matchedRules.length} rule(s) evaluated: [${matchedRules.join(", ")}].`,
        matchedRules,
        obligations: getObligationsForDecision(decision),
      };
    }

    return {
      decision: "NotApplicable",
      explanation: "Policy target matched but no rules were applicable for the given request.",
      matchedRules: [],
      obligations: [],
    };
  } catch {
    return {
      decision: "Indeterminate",
      explanation: "An error occurred during policy evaluation. Check the policy XML syntax.",
      matchedRules: [],
      obligations: [],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(evaluatePolicySchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const start = Date.now();
    const result = evaluatePolicy(parsed.data.policy, parsed.data.request);

    logApiRequest("/api/evaluate-policy", {
      inputLength: parsed.data.policy.length,
      durationMs: Date.now() - start,
      status: "success",
    });

    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logApiRequest("/api/evaluate-policy", { status: "error", error: msg });
    return NextResponse.json({ error: "Failed to evaluate policy" }, { status: 500 });
  }
}
