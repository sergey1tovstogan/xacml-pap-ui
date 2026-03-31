import type { TemplateMatch } from "./types";
import { getPolicyTemplates } from "./loader";

/**
 * Match user input against policy template regex patterns.
 * Returns the first matching template, or undefined if none match.
 */
export function matchTemplate(userInput: string): TemplateMatch | undefined {
  const templates = getPolicyTemplates();
  const normalizedInput = userInput.toLowerCase();

  for (const template of templates) {
    try {
      const regex = new RegExp(template.naturalLanguagePattern, "i");
      if (regex.test(normalizedInput)) {
        return {
          template,
          matchedPattern: template.naturalLanguagePattern,
        };
      }
    } catch {
      // Invalid regex in ontology — skip this template
      continue;
    }
  }

  return undefined;
}

/**
 * Return all available templates for reference/display.
 */
export function listTemplates() {
  return getPolicyTemplates().map((t) => ({
    id: t.templateId,
    name: t.name,
    requiredAttributes: t.requiredAttributes,
  }));
}
