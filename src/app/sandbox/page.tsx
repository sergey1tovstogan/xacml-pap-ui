"use client";

import { useState } from "react";
import { Play, RotateCcw, Copy, Check, Wrench } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

const SAMPLE_POLICY = `<Policy xmlns="urn:oasis:names:tc:xacml:3.0:core:schema:wd-17"
        PolicyId="TellerAccountAccess"
        RuleCombiningAlgId="urn:oasis:names:tc:xacml:3.0:rule-combining-algorithm:first-applicable">
  <Target>
    <AnyOf>
      <AllOf>
        <Match MatchId="urn:oasis:names:tc:xacml:1.0:function:string-equal">
          <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">TELLER</AttributeValue>
          <AttributeDesignator
            Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject"
            AttributeId="urn:temenos:xacml:attribute:role"
            DataType="http://www.w3.org/2001/XMLSchema#string"/>
        </Match>
      </AllOf>
    </AnyOf>
  </Target>
  <Rule RuleId="PermitViewAccounts" Effect="Permit">
    <Target>
      <AnyOf>
        <AllOf>
          <Match MatchId="urn:oasis:names:tc:xacml:1.0:function:string-equal">
            <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">GET</AttributeValue>
            <AttributeDesignator
              Category="urn:oasis:names:tc:xacml:3.0:attribute-category:action"
              AttributeId="urn:oasis:names:tc:xacml:1.0:action:action-id"
              DataType="http://www.w3.org/2001/XMLSchema#string"/>
          </Match>
        </AllOf>
      </AnyOf>
    </Target>
  </Rule>
  <Rule RuleId="DefaultDeny" Effect="Deny"/>
</Policy>`;

const SAMPLE_REQUEST = {
  subject: { role: "TELLER", userId: "user001" },
  resource: { type: "account", id: "/accounts/12345" },
  action: "GET",
  environment: { time: "10:30:00", ip: "192.168.1.100" },
};

type Decision = "Permit" | "Deny" | "NotApplicable" | null;

export default function SandboxPage() {
  const [policy, setPolicy] = useState(SAMPLE_POLICY);
  const [request, setRequest] = useState(JSON.stringify(SAMPLE_REQUEST, null, 2));
  const [decision, setDecision] = useState<Decision>(null);
  const [explanation, setExplanation] = useState("");
  const [copied, setCopied] = useState(false);

  const evaluate = () => {
    // Simple client-side evaluation for demo
    try {
      const req = JSON.parse(request);
      const role = req.subject?.role || "";
      const action = req.action || "";

      // Check if policy target matches
      const policyMatchesRole = policy.includes(`>${role}<`);
      const ruleMatchesAction = policy.includes(`>${action}<`);

      if (policyMatchesRole && ruleMatchesAction) {
        setDecision("Permit");
        setExplanation(
          `Policy "TellerAccountAccess" matched subject role "${role}". ` +
          `Rule "PermitViewAccounts" matched action "${action}". Decision: Permit.`
        );
      } else if (policyMatchesRole) {
        setDecision("Deny");
        setExplanation(
          `Policy "TellerAccountAccess" matched subject role "${role}". ` +
          `No permit rule matched action "${action}". Default deny rule applied.`
        );
      } else {
        setDecision("NotApplicable");
        setExplanation(
          `Policy target did not match. Subject role "${role}" does not match any policy target.`
        );
      }
    } catch {
      setDecision("Deny");
      setExplanation("Invalid request JSON. Please check the format.");
    }
  };

  const reset = () => {
    setPolicy(SAMPLE_POLICY);
    setRequest(JSON.stringify(SAMPLE_REQUEST, null, 2));
    setDecision(null);
    setExplanation("");
  };

  const copyPolicy = () => {
    navigator.clipboard.writeText(policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center rounded-full bg-green text-white h-10 w-10 justify-center font-bold">
            1
          </span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary text-center mb-2">
          Policy Sandbox
        </h1>
        <p className="text-text-secondary text-center max-w-2xl mx-auto">
          Test XACML policies against simulated access requests. Edit the policy
          or request, then evaluate to see the authorization decision.
        </p>
      </div>

      {/* Advanced Sandbox Banner */}
      <div className="mb-6 rounded-xl border border-violet/30 bg-violet/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet/10">
            <Wrench className="h-5 w-5 text-violet" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Advanced Sandbox — Coming Soon
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              A full-featured XACML evaluation engine is currently in development. It will include
              real PDP-based policy evaluation, policy set support, obligation handling, and
              detailed decision trace logging. For now, use the simplified evaluator below to
              test basic policy matching.
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet/10 px-3 py-1 text-xs font-medium text-violet">
              <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
              Development ongoing
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Policy Editor */}
        <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-surface">
            <h3 className="text-sm font-semibold text-text-primary">
              XACML Policy
            </h3>
            <button
              onClick={copyPolicy}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            className="w-full h-[400px] p-4 font-mono text-xs bg-surface-code text-text-inverse/80 resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Request & Result */}
        <div className="space-y-4">
          {/* Request Builder */}
          <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
            <div className="border-b border-border px-4 py-2.5 bg-surface">
              <h3 className="text-sm font-semibold text-text-primary">
                Access Request (JSON)
              </h3>
            </div>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              className="w-full h-[180px] p-4 font-mono text-xs bg-surface-code text-text-inverse/80 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={evaluate} className="flex-1">
              <Play className="h-4 w-4" />
              Evaluate
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Result */}
          {decision && (
            <div
              className={cn(
                "rounded-xl border p-5",
                decision === "Permit"
                  ? "border-success/30 bg-success/5"
                  : decision === "Deny"
                    ? "border-error/30 bg-error/5"
                    : "border-warning/30 bg-warning/5"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    "text-lg font-bold",
                    decision === "Permit"
                      ? "text-success"
                      : decision === "Deny"
                        ? "text-error"
                        : "text-warning"
                  )}
                >
                  {decision}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-green/30 bg-green/5 p-4 text-sm text-text-secondary">
        <strong className="text-green">Note:</strong> This sandbox uses a
        simplified evaluation engine for demonstration. For production policy
        testing, use the full XACML PDP or the AI Assistant for complex evaluation.
      </div>
    </div>
  );
}
