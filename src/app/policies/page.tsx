import { StepContent } from "@/components/journey";
import Link from "next/link";
import { StepBadge } from "@/components/ui";

const topics = [
  {
    step: 1,
    slug: "first-policy",
    title: "Your First Policy",
    description: "Step-by-step guide to creating a basic XACML policy using PAP UI",
  },
  {
    step: 2,
    slug: "policy-sets-rules",
    title: "Policy Sets & Rules",
    description: "Understand the hierarchical structure: PolicySet → Policy → Rule",
  },
  {
    step: 3,
    slug: "conditions-obligations",
    title: "Conditions & Obligations",
    description: "Advanced policy features: conditional logic, obligations, and advice",
  },
  {
    step: 4,
    slug: "example-policies",
    title: "Example Policies",
    description: "Ready-to-use policies for common banking authorization scenarios",
  },
];

export default function PoliciesPage() {
  return (
    <StepContent
      step={1}
      title="Policy Management"
      description="Learn to create, organize, and deploy XACML policies for your Temenos environment. From basic role-based rules to complex attribute-based authorization."
    >
      <div className="mt-8 space-y-4">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/policies/${topic.slug}`}
            className="flex items-start gap-4 rounded-xl border border-border bg-surface-card p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-teal/20 transition-all duration-200 group"
          >
            <StepBadge step={topic.step} variant="teal" size="md" />
            <div>
              <h3 className="font-semibold text-text-primary text-sm mb-1 group-hover:text-teal transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {topic.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </StepContent>
  );
}
