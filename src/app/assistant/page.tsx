"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  MessageCircle,
  FileCode,
  BookOpen,
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { aiModes } from "@/config/ai-modes";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import type { ChatMode, Message } from "@/types";

const iconMap = {
  MessageCircle,
  FileCode,
  BookOpen,
  Terminal,
};

export default function AssistantPage() {
  const [mode, setMode] = useState<ChatMode>("qa");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMsgId = useRef<string | null>(null);
  const { streamChat } = useStreamingChat();

  const currentMode = aiModes.find((m) => m.id === mode)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const updateStreamingMessage = useCallback(
    (updates: Partial<Message>) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMsgId.current ? { ...msg, ...updates } : msg
        )
      );
    },
    []
  );

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      mode,
      timestamp: new Date(),
    };

    const assistantMsgId = crypto.randomUUID();
    streamingMsgId.current = assistantMsgId;

    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      mode,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let accumulated = "";

      await streamChat(input, mode, {
        onSources: (sources) => {
          updateStreamingMessage({ sources });
        },
        onToken: (token) => {
          accumulated += token;
          updateStreamingMessage({ content: accumulated });
        },
        onDone: (artifacts) => {
          updateStreamingMessage(artifacts);
        },
        onError: (error) => {
          updateStreamingMessage({
            content: `Sorry, an error occurred: ${error}\n\nMake sure Ollama and ChromaDB are running.`,
          });
        },
      });
    } catch (error) {
      const errorContent =
        error instanceof Error ? error.message : "An unexpected error occurred";
      updateStreamingMessage({
        content: `Sorry, I couldn't generate a response. ${errorContent}\n\nMake sure Ollama and ChromaDB are running.`,
      });
    } finally {
      streamingMsgId.current = null;
      setIsLoading(false);
    }
  };

  const copyContent = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-var(--spacing-header))] flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-warm-blue px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-green" />
            <h1 className="text-xl font-bold text-white">
              PAP UI AI Assistant
            </h1>
          </div>

          {/* Mode selector */}
          <div className="flex gap-2">
            {aiModes.map((m) => {
              const Icon = iconMap[m.icon as keyof typeof iconMap];
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all cursor-pointer",
                    mode === m.id
                      ? "bg-green/20 text-green font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
          </div>
          <p className="text-white/40 text-xs mt-2">
            {currentMode.description}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles className="h-12 w-12 text-green/20 mb-4" />
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                {currentMode.label} Mode
              </h2>
              <p className="text-sm text-text-secondary max-w-md">
                {currentMode.description}. Type your question below to get
                started. The AI assistant will use local Ollama + RAG to provide
                accurate answers based on the documentation.
              </p>
              <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-text-secondary">
                <strong className="text-warning">Setup required:</strong>{" "}
                Connect Ollama (llama3.1:8b) and ChromaDB for full functionality.
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] rounded-2xl px-5 py-4",
                msg.role === "user"
                  ? "ml-auto bg-green/10 text-text-primary"
                  : "bg-surface border border-border"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>

              {/* Policy XML output */}
              {msg.policyXml && (
                <div className="mt-3 rounded-lg bg-surface-code p-3 overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-green-light font-medium">
                      Generated XACML Policy
                    </span>
                    <button
                      onClick={() => copyContent(msg.policyXml!, msg.id + "-xml")}
                      className="text-xs text-text-muted hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id + "-xml" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <pre className="text-xs text-text-inverse/80">{msg.policyXml}</pre>
                </div>
              )}

              {/* Script output */}
              {msg.script && (
                <div className="mt-3 rounded-lg bg-surface-code p-3 overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-violet-light font-medium">
                      Generated Script
                    </span>
                    <button
                      onClick={() => copyContent(msg.script!, msg.id + "-script")}
                      className="text-xs text-text-muted hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id + "-script" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <pre className="text-xs text-text-inverse/80">{msg.script}</pre>
                </div>
              )}

              {/* Source citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 border-t border-border/50 pt-2">
                  <p className="text-xs text-text-muted mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.source}
                        className="text-xs text-green hover:text-green-light underline"
                      >
                        {src.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && !messages.some((m) => m.id === streamingMsgId.current && m.content) && (
            <div className="max-w-[80%] rounded-2xl bg-surface border border-border">
              <TypingIndicator />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-surface-card px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={currentMode.placeholder}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-text-muted focus:outline-none focus:border-green transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-green text-warm-blue disabled:opacity-40 hover:bg-green-dark transition-colors cursor-pointer"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
