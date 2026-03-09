import { StepContent } from "@/components/journey";
import { StepBadge } from "@/components/ui";

const components = [
  {
    abbr: "PAP",
    name: "Policy Administration Point",
    description:
      "Where policies are created and managed. In Temenos, this is the PAP UI within Temenos Explorer.",
    color: "bg-teal/10 text-teal",
    phase: "Design",
  },
  {
    abbr: "PRP",
    name: "Policy Retrieval Point",
    description:
      "Retrieves policies from storage. In Temenos, policies are stored in the Generic Config Micro Service.",
    color: "bg-purple/10 text-purple",
    phase: "Build",
  },
  {
    abbr: "PDP",
    name: "Policy Decision Point",
    description:
      "Evaluates access requests against policies and returns Permit, Deny, or NotApplicable.",
    color: "bg-info/10 text-info",
    phase: "Deploy",
  },
  {
    abbr: "PEP",
    name: "Policy Enforcement Point",
    description:
      "Intercepts access requests and enforces the PDP's decision. In Temenos, this is the API Gateway.",
    color: "bg-success/10 text-success",
    phase: "Deploy",
  },
  {
    abbr: "PIP",
    name: "Policy Information Point",
    description:
      "Provides additional attribute data needed for policy evaluation (user attributes, resource metadata, etc.).",
    color: "bg-warning/10 text-warning",
    phase: "Operate",
  },
];

export default function ArchitecturePage() {
  return (
    <StepContent
      step={1}
      title="XACML Component Flow"
      description="A comprehensive view of how XACML authorization components work together in the Temenos ecosystem, from policy creation to runtime enforcement."
    >
      {/* Timeline/flow */}
      <div className="mt-8 space-y-0">
        <div className="flex items-center gap-3 mb-6">
          <StepBadge step={1} variant="teal" size="sm" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Design &mdash; Author policies
          </span>
          <div className="flex-1 border-t border-dashed border-teal/30" />
          <StepBadge step={2} variant="purple" size="sm" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Store
          </span>
          <div className="flex-1 border-t border-dashed border-purple/30" />
          <StepBadge step={3} variant="success" size="sm" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Evaluate &amp; Enforce
          </span>
        </div>

        {/* Component cards */}
        <div className="grid gap-4">
          {components.map((comp, i) => (
            <div
              key={comp.abbr}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface-card p-5"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${comp.color}`}
              >
                {comp.abbr}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary text-sm">
                    {comp.name}
                  </h3>
                  <span className="text-xs text-text-muted">
                    ({comp.abbr})
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {comp.description}
                </p>
              </div>
              {i < components.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Request flow */}
      <div className="mt-8 rounded-xl border border-border bg-surface-code p-6">
        <h3 className="font-semibold text-teal-light text-sm mb-4">
          Authorization Request Flow
        </h3>
        <pre className="text-xs text-gray-400 leading-relaxed">
{`User Request → PEP (API Gateway)
    │
    ├── PEP extracts subject, resource, action attributes
    │
    └── PEP sends authorization request to PDP
            │
            ├── PDP queries PIP for additional attributes
            │
            ├── PDP retrieves policies via PRP (from GC MS)
            │
            ├── PDP evaluates request against policies
            │
            └── PDP returns decision: Permit | Deny | NotApplicable
                    │
                    └── PEP enforces the decision
                            │
                            ├── Permit → Allow the request
                            └── Deny → Block the request`}
        </pre>
      </div>
    </StepContent>
  );
}
