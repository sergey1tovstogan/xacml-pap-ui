import {
  Shield,
  Zap,
  Lock,
  Globe,
  Cpu,
  Layers,
  FileCode,
  Users,
} from "lucide-react";
import { StepContent } from "@/components/journey";
import { FeatureGrid } from "@/components/journey";
import { Accordion } from "@/components/ui";

export default function OverviewPage() {
  return (
    <StepContent
      step={1}
      title="Future-Proof Authorization"
      description="Modern banking systems need fine-grained, attribute-based access control that goes beyond simple role assignments. XACML and PAP UI empower your business to define precise authorization rules without drowning in complexity."
    >
      <FeatureGrid
        items={[
          {
            icon: <Shield className="h-6 w-6" />,
            title: "Fine-Grained Control",
          },
          {
            icon: <Zap className="h-6 w-6" />,
            title: "Real-Time Decisions",
          },
          {
            icon: <Lock className="h-6 w-6" />,
            title: "Enterprise Security",
          },
          {
            icon: <Globe className="h-6 w-6" />,
            title: "Standards-Based",
          },
          {
            icon: <Cpu className="h-6 w-6" />,
            title: "AI-Assisted",
          },
          {
            icon: <Layers className="h-6 w-6" />,
            title: "Composable Policies",
          },
          {
            icon: <FileCode className="h-6 w-6" />,
            title: "GUI-Based Authoring",
          },
          {
            icon: <Users className="h-6 w-6" />,
            title: "Role & Attribute Based",
          },
        ]}
      />

      <div className="mt-10 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface-card p-6">
            <h3 className="font-bold text-green text-lg mb-2">
              PAP UI Approach
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Visual policy authoring with attribute-based access control.
              Define who can access what, under which conditions, using a
              graphical interface that generates standard XACML policies.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-card p-6">
            <h3 className="font-bold text-violet text-lg mb-2">
              Traditional RBAC
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Simple role-to-permission mapping. Users get roles, roles have
              permissions. Limited flexibility for complex banking scenarios
              requiring contextual or resource-level decisions.
            </p>
          </div>
        </div>

        <Accordion title="The Authorization Gap" defaultOpen>
          <p>
            Despite the clear need for fine-grained authorization, most banking
            platforms still rely on basic role-based access control. XACML bridges
            this gap by providing a standardized language for defining complex
            access control policies that consider subjects, resources, actions,
            and environmental conditions.
          </p>
          <p className="mt-3">
            Temenos PAP UI makes XACML accessible to policy administrators who
            may not be familiar with XML or access control markup languages,
            providing a visual interface to create, manage, and deploy policies
            across the Temenos ecosystem.
          </p>
        </Accordion>

        <Accordion title="Why Move Beyond Simple Roles?">
          <p>
            Banking operations require nuanced access decisions: a teller may
            approve transactions up to a certain amount during business hours,
            but a different limit applies for foreign currency operations. A
            compliance officer might need read access to all accounts but write
            access only within their jurisdiction.
          </p>
          <p className="mt-3">
            XACML policies express these complex rules naturally, evaluating
            multiple attributes simultaneously to reach a Permit or Deny decision
            in real time.
          </p>
        </Accordion>
      </div>
    </StepContent>
  );
}
