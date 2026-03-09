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
  timestamp: Date;
}

export interface ChatResponse {
  content: string;
  sources?: SourceCitation[];
  policyXml?: string;
  xmlWarning?: string;
  script?: string;
}
