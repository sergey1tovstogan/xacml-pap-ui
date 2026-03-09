import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Temenos PAP UI Explorer",
  description:
    "Documentation & AI-powered assistant for XACML Policy Administration Point",
  version: "0.1.0",
  sections: [
    {
      id: "overview",
      title: "Overview",
      subtitle: "Your XACML Journey",
      href: "/overview",
      items: [
        { title: "What is XACML?", slug: "what-is-xacml", order: 1 },
        { title: "PAP UI Overview", slug: "pap-ui-overview", order: 2 },
        { title: "Key Concepts", slug: "key-concepts", order: 3 },
        { title: "Quick Start", slug: "quick-start", order: 4 },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      subtitle: "How It All Connects",
      href: "/architecture",
      items: [
        { title: "XACML Component Flow", slug: "xacml-flow", order: 1 },
        {
          title: "Temenos Integration",
          slug: "temenos-integration",
          order: 2,
        },
        { title: "Data Flow", slug: "data-flow", order: 3 },
      ],
    },
    {
      id: "integration",
      title: "Integration",
      subtitle: "Set Up Your Environment",
      href: "/integration",
      items: [
        { title: "Keycloak Setup", slug: "keycloak-setup", order: 1 },
        { title: "GC Micro Service", slug: "gc-microservice", order: 2 },
        { title: "TEX Configuration", slug: "tex-configuration", order: 3 },
        {
          title: "Production Deployment",
          slug: "production-deployment",
          order: 4,
        },
      ],
    },
    {
      id: "policies",
      title: "Policies",
      subtitle: "Create & Manage",
      href: "/policies",
      items: [
        { title: "Your First Policy", slug: "first-policy", order: 1 },
        { title: "Policy Sets & Rules", slug: "policy-sets-rules", order: 2 },
        {
          title: "Conditions & Obligations",
          slug: "conditions-obligations",
          order: 3,
        },
        { title: "Example Policies", slug: "example-policies", order: 4 },
      ],
    },
    {
      id: "sandbox",
      title: "Sandbox",
      subtitle: "Test & Experiment",
      href: "/sandbox",
      items: [
        { title: "Policy Sandbox", slug: "policy-sandbox", order: 1 },
      ],
    },
  ],
};
