import type { ChatMode } from "@/types";

export interface AIModeConfig {
  id: ChatMode;
  label: string;
  description: string;
  placeholder: string;
  icon: string;
}

export const aiModes: AIModeConfig[] = [
  {
    id: "qa",
    label: "Q&A",
    description: "Ask questions about PAP UI and XACML",
    placeholder: "Ask anything about XACML policies, PAP UI, or authorization...",
    icon: "MessageCircle",
  },
  {
    id: "policy",
    label: "Policy Generator",
    description: "Generate XACML policies from natural language",
    placeholder: "Describe the access control rule you need...",
    icon: "FileCode",
  },
  {
    id: "setup",
    label: "Guided Setup",
    description: "Step-by-step configuration walkthrough",
    placeholder: "What would you like to set up?",
    icon: "BookOpen",
  },
  {
    id: "scripts",
    label: "Script Generator",
    description: "Generate API calls and deployment scripts",
    placeholder: "What API operation do you need a script for?",
    icon: "Terminal",
  },
];
