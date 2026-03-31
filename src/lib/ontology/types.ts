export interface TemenosSource {
  table: string;
  field: string;
  pipConnector: string;
}

export interface OntologyAttribute {
  naturalLanguageTerms: string[];
  attributeId: string;
  dataType: string;
  temenosSource: TemenosSource;
  exampleValues: string[];
  required: boolean;
}

export interface AttributeCategory {
  description: string;
  attributes: OntologyAttribute[];
}

export interface AttributeValueMapping {
  naturalLanguage: string;
  standardValue: string;
  attributeId: string;
  validation: string;
  operator?: string;
}

export interface PolicyTemplate {
  templateId: string;
  name: string;
  naturalLanguagePattern: string;
  xacmlTemplate: string;
  requiredAttributes: string[];
}

export interface PIPConnector {
  connectorId: string;
  type: string;
  endpoint: string;
  authMethod: string;
  tables?: string[];
  cacheTTL: string;
}

export interface ValidationRule {
  ruleId: string;
  description: string;
  severity: "ERROR" | "WARNING";
  check: string;
}

export interface AuditField {
  field: string;
  type: string;
  required: boolean;
  description: string;
}

export interface OntologyData {
  ontology: {
    name: string;
    version: string;
    description: string;
    lastUpdated: string;
    compatibleWith: {
      xacmlVersion: string;
      authzforceVersion: string;
      temenosVersion: string;
    };
  };
  subjectAttributes: AttributeCategory;
  resourceAttributes: AttributeCategory;
  actionAttributes: AttributeCategory;
  environmentAttributes: AttributeCategory;
  temenosSpecificAttributes: AttributeCategory;
  attributeValueMappings: {
    description: string;
    mappings: AttributeValueMapping[];
  };
  policyTemplates: {
    description: string;
    templates: PolicyTemplate[];
  };
  pipConnectors: {
    description: string;
    connectors: PIPConnector[];
  };
  validationRules: {
    description: string;
    rules: ValidationRule[];
  };
  auditMetadata: {
    description: string;
    fields: AuditField[];
  };
}

/** Result of matching a natural language term against the ontology. */
export interface OntologyMatch {
  term: string;
  category: "subject" | "resource" | "action" | "environment" | "temenos";
  attribute: OntologyAttribute;
  resolvedValue?: string;
}

/** Result of matching against a policy template. */
export interface TemplateMatch {
  template: PolicyTemplate;
  matchedPattern: string;
}

/** Validation result from running business rules. */
export interface ValidationResult {
  ruleId: string;
  description: string;
  severity: "ERROR" | "WARNING";
  passed: boolean;
  message: string;
}
