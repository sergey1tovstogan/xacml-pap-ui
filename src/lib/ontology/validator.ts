import { XMLParser } from "fast-xml-parser";
import type { ValidationResult } from "./types";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
});

/**
 * Recursively collect all text content from a parsed XML tree,
 * mapping AttributeId designators to their associated values.
 */
function collectPolicyInfo(node: unknown): {
  attributeIds: string[];
  attributeValues: string[];
  hasObligations: boolean;
  effects: string[];
} {
  const result = {
    attributeIds: [] as string[],
    attributeValues: [] as string[],
    hasObligations: false,
    effects: [] as string[],
  };

  if (!node || typeof node !== "object") return result;

  const obj = node as Record<string, unknown>;

  // Collect AttributeDesignator AttributeIds
  if ("@_AttributeId" in obj) {
    result.attributeIds.push(String(obj["@_AttributeId"]));
  }

  // Collect AttributeValues
  if ("AttributeValue" in obj) {
    const vals = Array.isArray(obj.AttributeValue) ? obj.AttributeValue : [obj.AttributeValue];
    for (const v of vals) {
      if (typeof v === "string") result.attributeValues.push(v);
      else if (typeof v === "object" && v !== null && "#text" in (v as Record<string, unknown>)) {
        result.attributeValues.push(String((v as Record<string, unknown>)["#text"]));
      }
    }
  }

  // Check for obligations
  if ("ObligationExpressions" in obj || "ObligationExpression" in obj) {
    result.hasObligations = true;
  }

  // Collect rule effects
  if ("@_Effect" in obj) {
    result.effects.push(String(obj["@_Effect"]));
  }

  // Recurse into child elements
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      const child = collectPolicyInfo(obj[key]);
      result.attributeIds.push(...child.attributeIds);
      result.attributeValues.push(...child.attributeValues);
      if (child.hasObligations) result.hasObligations = true;
      result.effects.push(...child.effects);
    }
  }

  return result;
}

/**
 * Run the 5 ontology-defined business validation rules against generated XACML XML.
 */
export function validatePolicy(policyXml: string): ValidationResult[] {
  const results: ValidationResult[] = [];

  let parsed: Record<string, unknown>;
  try {
    parsed = xmlParser.parse(policyXml) as Record<string, unknown>;
  } catch {
    results.push({
      ruleId: "xml-syntax",
      description: "Policy must be well-formed XML",
      severity: "ERROR",
      passed: false,
      message: "Policy XML is malformed and cannot be parsed.",
    });
    return results;
  }

  // Find the Policy element
  const policyKey = Object.keys(parsed).find((k) => k.endsWith("Policy") || k === "Policy");
  if (!policyKey) {
    results.push({
      ruleId: "policy-element",
      description: "A Policy element must be present",
      severity: "ERROR",
      passed: false,
      message: "No Policy element found in the XML.",
    });
    return results;
  }

  const info = collectPolicyInfo(parsed[policyKey]);
  const allAttrIds = info.attributeIds.map((id) => {
    // Extract the short name from full URN if present
    const parts = id.split(":");
    return parts[parts.length - 1];
  });
  const allValues = info.attributeValues.map((v) => v.toLowerCase());

  // Rule 1: mandatory-subject-attributes
  const hasSubjectId = allAttrIds.some((id) => id.includes("subject-id") || id.includes("subject:subject-id"));
  const hasRole = allAttrIds.some((id) => id === "role" || id.includes("subject:role"));
  results.push({
    ruleId: "mandatory-subject-attributes",
    description: "All policies must include subject-id and role attributes",
    severity: "ERROR",
    passed: hasSubjectId && hasRole,
    message: hasSubjectId && hasRole
      ? "Policy includes required subject-id and role attributes."
      : `Missing required subject attributes: ${!hasSubjectId ? "subject-id" : ""}${!hasSubjectId && !hasRole ? ", " : ""}${!hasRole ? "role" : ""}.`,
  });

  // Rule 2: pii-export-mfa
  const hasPII = allValues.some((v) => v === "pii");
  const hasExport = allValues.some((v) => v === "export" || v === "export-data");
  const hasMFA = allAttrIds.some((id) => id.includes("mfa-status")) || allValues.some((v) => v === "verified");
  if (hasPII && hasExport) {
    results.push({
      ruleId: "pii-export-mfa",
      description: "PII export policies must require MFA verification",
      severity: "ERROR",
      passed: hasMFA,
      message: hasMFA
        ? "PII export policy correctly requires MFA verification."
        : "PII export policy is missing MFA verification requirement. Add a condition checking mfa-status = 'verified'.",
    });
  }

  // Rule 3: mas-cross-border-logging
  const hasGeoLocation = allAttrIds.some((id) => id.includes("geo-location"));
  const hasJurisdiction = allAttrIds.some((id) => id.includes("jurisdiction"));
  if (hasGeoLocation && hasJurisdiction) {
    results.push({
      ruleId: "mas-cross-border-logging",
      description: "Cross-border data access must include audit obligation",
      severity: "ERROR",
      passed: info.hasObligations,
      message: info.hasObligations
        ? "Cross-border policy includes audit obligations."
        : "Cross-border data access policy is missing audit obligation. Add an ObligationExpression for 'log-cross-border-access'.",
    });
  }

  // Rule 4: high-value-approval
  const hasHighValue = allAttrIds.some((id) => id.includes("transaction-amount"));
  const hasApproval = allAttrIds.some((id) => id.includes("approval-action"));
  if (hasHighValue) {
    results.push({
      ruleId: "high-value-approval",
      description: "High-value transactions must require approval workflow",
      severity: "WARNING",
      passed: hasApproval,
      message: hasApproval
        ? "High-value transaction policy includes approval workflow."
        : "High-value transaction policy should include an approval-action condition for amounts over 100,000.",
    });
  }

  // Rule 5: reval-category-protection
  const hasCategory53000 = allValues.some((v) => v.startsWith("53000"));
  if (hasCategory53000) {
    const allowedRoles = ["complianceofficer", "financemanager", "internalaudit"];
    const hasAllowedRole = allValues.some((v) => allowedRoles.includes(v.toLowerCase()));
    results.push({
      ruleId: "reval-category-protection",
      description: "Category 53000 (Revaluation P&L) access restricted to Finance/Compliance roles",
      severity: "ERROR",
      passed: hasAllowedRole,
      message: hasAllowedRole
        ? "Category 53000 access is correctly restricted to authorized roles."
        : "Category 53000 access must be restricted to ComplianceOfficer, FinanceManager, or InternalAudit roles.",
    });
  }

  return results;
}
