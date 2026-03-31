"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { aiModes } from "@/config/ai-modes";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import type { ChatMode } from "@/types";

interface WidgetMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("qa");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMsgId = useRef<string | null>(null);
  const { streamChat } = useStreamingChat();

  const currentMode = aiModes.find((m) => m.id === mode)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const updateStreamingMessage = useCallback(
    (content: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMsgId.current ? { ...msg, content } : msg
        )
      );
    },
    []
  );

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    const assistantId = crypto.randomUUID();
    streamingMsgId.current = assistantId;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: userMessage },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      let accumulated = "";

      await streamChat(userMessage, mode, {
        onSources: () => {},
        onExtraction: () => {},
        onToken: (token) => {
          accumulated += token;
          updateStreamingMessage(accumulated);
        },
        onDone: () => {},
        onError: (error) => {
          updateStreamingMessage(`Sorry, an error occurred: ${error}`);
        },
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      updateStreamingMessage(`Sorry, couldn't generate a response. ${msg}`);
    } finally {
      streamingMsgId.current = null;
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer",
          isOpen
            ? "bg-warm-blue text-white rotate-0"
            : "bg-green text-warm-blue hover:scale-105 hover:shadow-xl"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] rounded-2xl border border-border bg-surface-card shadow-[var(--shadow-panel)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-warm-blue p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-green" />
                <h3 className="text-white font-semibold">PAP UI Assistant</h3>
              </div>
              {/* Mode tabs */}
              <div className="flex gap-1">
                {aiModes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer",
                      mode === m.id
                        ? "bg-green/20 text-green font-medium"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-3" aria-live="polite" aria-label="Chat messages">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-8 w-8 text-green/30 mb-3" />
                  <p className="text-sm text-text-secondary">
                    {currentMode.description}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Type a message to get started
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-green/10 text-text-primary"
                      : "bg-surface text-text-primary"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && !messages.some((m) => m.id === streamingMsgId.current && m.content) && (
                <div className="max-w-[85%] rounded-xl bg-surface">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={currentMode.placeholder}
                  aria-label="Type your message"
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:border-green"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-green text-warm-blue disabled:opacity-40 hover:bg-green-dark transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
