import { NextRequest, NextResponse } from "next/server";

interface EvaluateRequest {
  policy: string;
  request: {
    subject: Record<string, string>;
    resource: Record<string, string>;
    action: string;
    environment?: Record<string, string>;
  };
}

type Decision = "Permit" | "Deny" | "NotApplicable" | "Indeterminate";

interface EvaluateResponse {
  decision: Decision;
  explanation: string;
  matchedRules: string[];
}

/**
 * Simplified XACML policy evaluator.
 * Matches subject attributes and action against policy targets and rules.
 */
function evaluatePolicy(policy: string, request: EvaluateRequest["request"]): EvaluateResponse {
  const matchedRules: string[] = [];

  try {
    // Extract all attribute values from the policy for matching
    const attributeValues = [...policy.matchAll(/<AttributeValue[^>]*>([^<]+)<\/AttributeValue>/g)]
      .map((m) => m[1].trim());

    // Check subject attributes
    const subjectValues = Object.values(request.subject);
    const subjectMatch = subjectValues.some((val) => attributeValues.includes(val));

    // Check action
    const actionMatch = attributeValues.includes(request.action);

    // Extract rule IDs and effects
    const rules = [...policy.matchAll(/<Rule\s+RuleId="([^"]+)"\s+Effect="([^"]+)"[^>]*>/g)]
      .map((m) => ({ id: m[1], effect: m[2] as "Permit" | "Deny" }));

    if (!subjectMatch) {
      return {
        decision: "NotApplicable",
        explanation: `Policy target did not match. No subject attribute matched the request attributes [${subjectValues.join(", ")}].`,
        matchedRules: [],
      };
    }

    // Check combining algorithm
    const isFirstApplicable = policy.includes("first-applicable");
    const isDenyOverrides = policy.includes("deny-overrides");

    for (const rule of rules) {
      // Rules with no target match everything in the policy scope
      const ruleSection = policy.slice(
        policy.indexOf(`RuleId="${rule.id}"`),
        policy.indexOf("</Rule>", policy.indexOf(`RuleId="${rule.id}"`)) + 7
      );

      const ruleHasTarget = ruleSection.includes("<Target>");
      const ruleAttributeValues = [...ruleSection.matchAll(/<AttributeValue[^>]*>([^<]+)<\/AttributeValue>/g)]
        .map((m) => m[1].trim());

      const ruleMatches = !ruleHasTarget || ruleAttributeValues.includes(request.action) ||
        subjectValues.some((v) => ruleAttributeValues.includes(v));

      if (ruleMatches) {
        matchedRules.push(rule.id);

        if (isFirstApplicable) {
          return {
            decision: rule.effect,
            explanation: `Policy target matched. Rule "${rule.id}" (Effect: ${rule.effect}) was the first applicable rule.${actionMatch ? ` Action "${request.action}" matched.` : ""}`,
            matchedRules,
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
      };
    }

    // If rules matched, use the last one's effect (permit-overrides default)
    if (matchedRules.length > 0) {
      const lastRule = rules.find((r) => r.id === matchedRules[matchedRules.length - 1]);
      return {
        decision: lastRule?.effect || "Deny",
        explanation: `Policy target matched. ${matchedRules.length} rule(s) evaluated: [${matchedRules.join(", ")}].`,
        matchedRules,
      };
    }

    return {
      decision: "NotApplicable",
      explanation: "Policy target matched but no rules were applicable for the given request.",
      matchedRules: [],
    };
  } catch {
    return {
      decision: "Indeterminate",
      explanation: "An error occurred during policy evaluation. Check the policy XML syntax.",
      matchedRules: [],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EvaluateRequest = await request.json();

    if (!body.policy?.trim()) {
      return NextResponse.json({ error: "Policy XML is required" }, { status: 400 });
    }

    if (!body.request?.action) {
      return NextResponse.json({ error: "Request with action is required" }, { status: 400 });
    }

    const result = evaluatePolicy(body.policy, body.request);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Evaluate policy error:", msg);
    return NextResponse.json({ error: "Failed to evaluate policy" }, { status: 500 });
  }
}
