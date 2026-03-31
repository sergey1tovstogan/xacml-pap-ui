import { readFileSync } from "fs";
import { join } from "path";
import type {
  OntologyData,
  OntologyAttribute,
  AttributeValueMapping,
  PolicyTemplate,
  PIPConnector,
  ValidationRule,
} from "./types";

let cached: OntologyData | null = null;

function loadOntology(): OntologyData {
  if (cached) return cached;

  const filePath = join(process.cwd(), "suggestions", "Ontology.json");
  const raw = readFileSync(filePath, "utf-8");
  cached = JSON.parse(raw) as OntologyData;
  return cached;
}

/** All attributes across all categories, with their category label. */
export function getAllAttributes(): Array<{
  category: "subject" | "resource" | "action" | "environment" | "temenos";
  attribute: OntologyAttribute;
}> {
  const data = loadOntology();
  const categories = [
    { key: "subject" as const, section: data.subjectAttributes },
    { key: "resource" as const, section: data.resourceAttributes },
    { key: "action" as const, section: data.actionAttributes },
    { key: "environment" as const, section: data.environmentAttributes },
    { key: "temenos" as const, section: data.temenosSpecificAttributes },
  ];

  return categories.flatMap(({ key, section }) =>
    section.attributes.map((attribute) => ({ category: key, attribute }))
  );
}

/** All natural-language-to-standard-value mappings. */
export function getValueMappings(): AttributeValueMapping[] {
  return loadOntology().attributeValueMappings.mappings;
}

/** All policy templates. */
export function getPolicyTemplates(): PolicyTemplate[] {
  return loadOntology().policyTemplates.templates;
}

/** All PIP connector definitions. */
export function getPIPConnectors(): PIPConnector[] {
  return loadOntology().pipConnectors.connectors;
}

/** All validation rules. */
export function getValidationRules(): ValidationRule[] {
  return loadOntology().validationRules.rules;
}

/** Look up a PIP connector by its ID. */
export function getPIPConnector(connectorId: string): PIPConnector | undefined {
  return getPIPConnectors().find((c) => c.connectorId === connectorId);
}

/** Get the full ontology metadata (name, version, compatibility). */
export function getOntologyMeta() {
  return loadOntology().ontology;
}
