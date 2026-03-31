import type { ExtractionResult } from "@/lib/rag/extractor";
import type { ValidationResult } from "@/lib/ontology/types";

export type ChatMode = "qa" | "policy" | "setup" | "scripts";

export interface SourceCitation {
  title: string;
  source: string;
  snippet: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: ChatMode;
  sources?: SourceCitation[];
  policyXml?: string;
  script?: string;
  extraction?: ExtractionResult;
  validation?: ValidationResult[];
  timestamp: Date;
}

export interface ChatResponse {
  content: string;
  sources?: SourceCitation[];
  policyXml?: string;
  xmlWarning?: string;
  script?: string;
  extraction?: ExtractionResult;
  validation?: ValidationResult[];
}
