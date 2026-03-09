import Link from "next/link";
import {
  Shield,
  Layers,
  Settings,
  FileCode,
  FlaskConical,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Cpu,
  BookOpen,
  Terminal,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui";

const sections = [
  {
    title: "Overview",
    description: "Understand XACML and PAP UI fundamentals",
    href: "/overview",
    icon: BookOpen,
    color: "text-green",
    bg: "bg-green/10",
  },
  {
    title: "Architecture",
    description: "How PAP, PDP, PEP, and PIP connect",
    href: "/architecture",
    icon: Layers,
    color: "text-violet",
    bg: "bg-violet/10",
  },
  {
    title: "Integration",
    description: "Keycloak, GC MS, and TEX configuration",
    href: "/integration",
    icon: Settings,
    color: "text-warm-blue",
    bg: "bg-warm-blue/10",
  },
  {
    title: "Policies",
    description: "Create and manage XACML policies",
    href: "/policies",
    icon: FileCode,
    color: "text-green-dark",
    bg: "bg-green/10",
  },
  {
    title: "Sandbox",
    description: "Test policies with simulated requests",
    href: "/sandbox",
    icon: FlaskConical,
    color: "text-violet",
    bg: "bg-light-blue/30",
  },
];

const features = [
  {
    icon: Shield,
    title: "Fine-Grained Access Control",
    description: "Attribute-based policies beyond simple roles",
  },
  {
    icon: Zap,
    title: "Real-Time Evaluation",
    description: "Instant policy decision at the API gateway",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade authorization for Temenos ecosystem",
  },
  {
    icon: Globe,
    title: "Standards-Based",
    description: "OASIS XACML 3.0 for interoperability",
  },
  {
    icon: Cpu,
    title: "AI-Native Design",
    description: "Generate policies with natural language",
  },
  {
    icon: Layers,
    title: "Composable Policies",
    description: "Reusable rules across services and roles",
  },
];

const aiCapabilities = [
  {
    icon: MessageCircle,
    title: "Q&A Assistant",
    description: "Ask anything about PAP UI and XACML",
    color: "border-green",
  },
  {
    icon: FileCode,
    title: "Policy Generator",
    description: "Describe access rules, get valid XACML",
    color: "border-violet",
  },
  {
    icon: BookOpen,
    title: "Guided Setup",
    description: "Step-by-step configuration walkthrough",
    color: "border-warm-blue",
  },
  {
    icon: Terminal,
    title: "Script Generator",
    description: "Ready-to-use API calls and scripts",
    color: "border-light-blue",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-warm-blue py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-green)_0%,_transparent_50%)] opacity-10" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Badge variant="green" className="mb-6">
            Policy Administration Point
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            XACML Authorization
            <br />
            <span className="text-green">Made Simple</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            Your comprehensive guide to Temenos PAP UI and XACML integration.
            From understanding core concepts to deploying production policies
            &mdash; with an AI assistant to help every step of the way.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/overview"
              className="inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 font-semibold text-warm-blue hover:bg-green-dark transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <Badge variant="violet" className="mb-3">
              Why XACML?
            </Badge>
            <h2 className="text-2xl font-bold text-text-primary">
              Enterprise-Grade Authorization
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-surface-card p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-green/20 transition-all duration-200"
              >
                <feature.icon className="h-6 w-6 text-green mb-3" />
                <h3 className="font-semibold text-sm text-text-primary mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-16 px-6 bg-surface-card border-y border-border">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <Badge variant="green" className="mb-3">
              AI-Powered
            </Badge>
            <h2 className="text-2xl font-bold text-text-primary">
              Your Intelligent XACML Assistant
            </h2>
            <p className="text-text-secondary mt-2 max-w-xl mx-auto">
              Don&apos;t know XACML? No problem. Describe what you need in plain
              English and let the AI handle the rest.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiCapabilities.map((cap) => (
              <div
                key={cap.title}
                className={`rounded-xl border-t-3 ${cap.color} border border-border bg-white p-5 text-center`}
              >
                <cap.icon className="h-8 w-8 text-warm-blue mx-auto mb-3" />
                <h3 className="font-semibold text-sm text-text-primary mb-1">
                  {cap.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section links */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-text-primary">
              Explore the Documentation
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group rounded-xl border border-border bg-surface-card p-5 hover:shadow-[var(--shadow-card-hover)] hover:border-green/20 transition-all duration-200"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.bg} mb-3`}
                >
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <h3 className="font-semibold text-sm text-text-primary mb-1">
                  {section.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {section.description}
                </p>
                <ArrowRight className="h-4 w-4 text-green mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-warm-blue py-8 px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between text-sm text-white/40">
          <p>Temenos PAP UI Explorer &mdash; XACML Policy Administration</p>
          <p>Powered by Temenos</p>
        </div>
      </footer>
    </div>
  );
}
