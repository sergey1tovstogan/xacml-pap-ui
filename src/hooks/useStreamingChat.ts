"use client";

import { useRef, useCallback } from "react";
import type { ChatMode, SourceCitation } from "@/types";
import type { ExtractionResult } from "@/lib/rag/extractor";
import type { ValidationResult } from "@/lib/ontology/types";

interface StreamCallbacks {
  onSources: (sources: SourceCitation[]) => void;
  onToken: (token: string) => void;
  onExtraction: (extraction: ExtractionResult) => void;
  onDone: (artifacts: {
    policyXml?: string;
    script?: string;
    validation?: ValidationResult[];
  }) => void;
  onError: (error: string) => void;
}

export function useStreamingChat() {
  const abortRef = useRef<AbortController | null>(null);

  const streamChat = useCallback(
    async (message: string, mode: ChatMode, callbacks: StreamCallbacks) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode, stream: true }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const json = trimmed.slice(6);
          try {
            const event = JSON.parse(json);

            switch (event.type) {
              case "sources":
                callbacks.onSources(event.sources);
                break;
              case "extraction":
                callbacks.onExtraction(event.extraction);
                break;
              case "token":
                callbacks.onToken(event.token);
                break;
              case "done":
                callbacks.onDone({
                  policyXml: event.policyXml,
                  script: event.script,
                  validation: event.validation,
                });
                break;
              case "error":
                callbacks.onError(event.error);
                break;
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    },
    []
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { streamChat, abort };
}
