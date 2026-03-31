export type {
  OntologyAttribute,
  OntologyMatch,
  AttributeValueMapping,
  PolicyTemplate,
  PIPConnector,
  ValidationRule,
  TemplateMatch,
  ValidationResult,
} from "./types";

export {
  getAllAttributes,
  getValueMappings,
  getPolicyTemplates,
  getPIPConnectors,
  getPIPConnector,
  getValidationRules,
  getOntologyMeta,
} from "./loader";

export { matchTermsToOntology, resolveValue, findRequiredPIPConnectors } from "./matcher";
export { matchTemplate, listTemplates } from "./template-matcher";
export { validatePolicy } from "./validator";
