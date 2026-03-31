"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Database, GitBranch, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ExtractionResult } from "@/lib/rag/extractor";
import type { ValidationResult } from "@/lib/ontology/types";

interface ExtractionPanelProps {
  extraction: ExtractionResult;
  validation?: ValidationResult[];
}

export function ExtractionPanel({ extraction, validation }: ExtractionPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const { intent, ontologyMatches, templateMatch, requiredPIPConnectors } = extraction;

  return (
    <div className="mt-3 rounded-lg border border-violet/30 bg-violet/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-violet-light hover:bg-violet/10 transition-colors cursor-pointer"
      >
        {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <GitBranch className="h-3.5 w-3.5" />
        NLP Extraction Pipeline
        <span className="ml-auto text-text-muted font-normal">
          {ontologyMatches.length} attribute{ontologyMatches.length !== 1 ? "s" : ""} resolved
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-3 text-xs">
          {/* Extracted Intent */}
          <div>
            <p className="text-text-muted mb-1.5 font-medium">Extracted Intent</p>
            <div className="grid grid-cols-2 gap-1.5">
              {intent.subjects.length > 0 && (
                <div className="rounded bg-surface px-2 py-1">
                  <span className="text-green">Subjects:</span>{" "}
                  <span className="text-text-secondary">{intent.subjects.join(", ")}</span>
                </div>
              )}
              {intent.resources.length > 0 && (
                <div className="rounded bg-surface px-2 py-1">
                  <span className="text-green">Resources:</span>{" "}
                  <span className="text-text-secondary">{intent.resources.join(", ")}</span>
                </div>
              )}
              {intent.actions.length > 0 && (
                <div className="rounded bg-surface px-2 py-1">
                  <span className="text-green">Actions:</span>{" "}
                  <span className="text-text-secondary">{intent.actions.join(", ")}</span>
                </div>
              )}
              {intent.environment.length > 0 && (
                <div className="rounded bg-surface px-2 py-1">
                  <span className="text-green">Environment:</span>{" "}
                  <span className="text-text-secondary">{intent.environment.join(", ")}</span>
                </div>
              )}
              {intent.conditions.length > 0 && (
                <div className="col-span-2 rounded bg-surface px-2 py-1">
                  <span className="text-green">Conditions:</span>{" "}
                  <span className="text-text-secondary">{intent.conditions.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ontology Matches */}
          {ontologyMatches.length > 0 && (
            <div>
              <p className="text-text-muted mb-1.5 font-medium">Ontology-Resolved Attributes</p>
              <div className="space-y-1">
                {ontologyMatches.map((match, i) => (
                  <div key={i} className="flex items-center gap-2 rounded bg-surface px-2 py-1">
                    <span className="text-violet-light">&quot;{match.term}&quot;</span>
                    <span className="text-text-muted">&rarr;</span>
                    <code className="text-green text-[11px]">{match.attribute.attributeId}</code>
                    <span className="text-text-muted">({match.attribute.dataType})</span>
                    <span className={cn(
                      "ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium",
                      match.category === "subject" && "bg-green/10 text-green",
                      match.category === "resource" && "bg-violet/10 text-violet-light",
                      match.category === "action" && "bg-warning/10 text-warning",
                      match.category === "environment" && "bg-light-blue/20 text-light-blue",
                      match.category === "temenos" && "bg-warm-blue/20 text-white/70",
                    )}>
                      {match.category}
                    </span>
                    {match.resolvedValue && (
                      <span className="text-text-muted">= &quot;{match.resolvedValue}&quot;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Match */}
          {templateMatch && (
            <div className="rounded bg-green/5 border border-green/20 px-2 py-1.5">
              <span className="text-green font-medium">Template matched:</span>{" "}
              <span className="text-text-secondary">{templateMatch.template.name}</span>
              <span className="text-text-muted ml-2">
                (requires: {templateMatch.template.requiredAttributes.join(", ")})
              </span>
            </div>
          )}

          {/* PIP Connectors */}
          {requiredPIPConnectors.length > 0 && (
            <div>
              <p className="text-text-muted mb-1.5 font-medium flex items-center gap-1.5">
                <Database className="h-3 w-3" />
                Required PIP Connectors (runtime)
              </p>
              <div className="space-y-1">
                {requiredPIPConnectors.map((pip, i) => (
                  <div key={i} className="flex items-center gap-2 rounded bg-surface px-2 py-1 text-text-secondary">
                    <span className="text-violet-light font-mono">{pip.connectorId}</span>
                    <span className="rounded bg-violet/10 px-1.5 py-0.5 text-[10px] text-violet-light">{pip.type}</span>
                    <span className="text-text-muted truncate">{pip.endpoint}</span>
                    <span className="ml-auto text-text-muted">cache: {pip.cacheTTL}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Results */}
          {validation && validation.length > 0 && (
            <div>
              <p className="text-text-muted mb-1.5 font-medium">Policy Validation</p>
              <div className="space-y-1">
                {validation.map((result, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2 rounded px-2 py-1.5",
                      result.passed ? "bg-green/5" : result.severity === "ERROR" ? "bg-error/5" : "bg-warning/5"
                    )}
                  >
                    {result.passed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                    ) : result.severity === "ERROR" ? (
                      <XCircle className="h-3.5 w-3.5 text-error shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={cn(
                        "font-medium",
                        result.passed ? "text-green" : result.severity === "ERROR" ? "text-error" : "text-warning"
                      )}>
                        {result.ruleId}
                      </span>
                      <p className="text-text-secondary">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
