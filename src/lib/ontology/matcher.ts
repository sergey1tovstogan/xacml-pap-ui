import type { OntologyMatch } from "./types";
import { getAllAttributes, getValueMappings } from "./loader";

/**
 * Match an array of extracted terms against the ontology's naturalLanguageTerms.
 * Returns all matching attributes with their category and optional resolved value.
 */
export function matchTermsToOntology(terms: string[]): OntologyMatch[] {
  const attributes = getAllAttributes();
  const valueMappings = getValueMappings();
  const matches: OntologyMatch[] = [];
  const seen = new Set<string>();

  for (const term of terms) {
    const normalizedTerm = term.toLowerCase().trim();
    if (!normalizedTerm) continue;

    // Match against attribute naturalLanguageTerms
    for (const { category, attribute } of attributes) {
      const isMatch = attribute.naturalLanguageTerms.some(
        (nlTerm) => normalizedTerm.includes(nlTerm.toLowerCase()) || nlTerm.toLowerCase().includes(normalizedTerm)
      );

      if (isMatch) {
        const key = `${category}:${attribute.attributeId}`;
        if (seen.has(key)) continue;
        seen.add(key);

        // Try to resolve a standard value via attributeValueMappings
        const valueMapping = valueMappings.find(
          (m) =>
            m.attributeId === attribute.attributeId &&
            normalizedTerm.includes(m.naturalLanguage.toLowerCase())
        );

        matches.push({
          term,
          category,
          attribute,
          resolvedValue: valueMapping?.standardValue,
        });
      }
    }
  }

  return matches;
}

/**
 * Resolve a single natural language value to its standard XACML value
 * using the attributeValueMappings section of the ontology.
 */
export function resolveValue(term: string, attributeId: string): string | undefined {
  const valueMappings = getValueMappings();
  const normalizedTerm = term.toLowerCase().trim();

  const mapping = valueMappings.find(
    (m) =>
      m.attributeId === attributeId &&
      normalizedTerm.includes(m.naturalLanguage.toLowerCase())
  );

  return mapping?.standardValue;
}

/**
 * Given a set of ontology matches, find the PIP connectors that would be needed
 * to resolve runtime attribute values.
 */
export function findRequiredPIPConnectors(matches: OntologyMatch[]): string[] {
  const connectorIds = new Set<string>();
  for (const match of matches) {
    const connectorId = match.attribute.temenosSource.pipConnector;
    if (connectorId) connectorIds.add(connectorId);
  }
  return [...connectorIds];
}
