"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const borderColorMap: Record<string, string> = {
  green: "border-l-green",
  violet: "border-l-violet",
  "warm-blue": "border-l-warm-blue",
  "light-blue": "border-l-light-blue",
};

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  accentColor = "green",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-card overflow-hidden transition-all",
        isOpen && `border-l-3 ${borderColorMap[accentColor] ?? "border-l-green"}`
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-green transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={`${contentId}-trigger`}
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
