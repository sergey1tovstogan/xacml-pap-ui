import { StepContent } from "@/components/journey";
import { StepBadge } from "@/components/ui";

const steps = [
  {
    step: 1,
    title: "Keycloak Setup",
    description: "Configure identity provider and role mappings for PAP UI access",
    color: "teal" as const,
  },
  {
    step: 2,
    title: "GC Micro Service",
    description: "Deploy and configure the Generic Config Micro Service for policy storage",
    color: "purple" as const,
  },
  {
    step: 3,
    title: "TEX Configuration",
    description: "Set up Temenos Explorer with PERMISSIONSURL and role-based policy retrieval",
    color: "success" as const,
  },
  {
    step: 4,
    title: "Production Deployment",
    description: "Security hardening, scaling, monitoring, and go-live checklist",
    color: "warning" as const,
  },
];

export default function IntegrationPage() {
  return (
    <StepContent
      step={1}
      title="Integration Guide"
      description="A step-by-step guide to integrating PAP UI and XACML authorization into your Temenos environment. Follow the phases from initial setup to production deployment."
    >
      {/* Phase overview — like the Composable Explorer's Project Lifecycle */}
      <div className="mt-8">
        {/* Phase indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((s, i) => (
            <div key={s.step} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StepBadge step={s.step} variant={s.color} size="md" />
                <span className="text-sm font-medium text-text-primary">
                  {s.title.split(" ")[0]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-12 border-t border-dashed border-border" />
              )}
            </div>
          ))}
        </div>

        {/* Step cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {steps.map((s) => (
            <a
              key={s.step}
              href={`/integration/${
                s.step === 1
                  ? "keycloak-setup"
                  : s.step === 2
                    ? "gc-microservice"
                    : s.step === 3
                      ? "tex-configuration"
                      : "production-deployment"
              }`}
              className="rounded-xl border border-border bg-surface-card p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-teal/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <StepBadge step={s.step} variant={s.color} size="sm" />
                <div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </StepContent>
  );
}
