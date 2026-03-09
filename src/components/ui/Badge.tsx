import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "green" | "violet" | "warm-blue" | "light-blue" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-green/10 text-green",
  violet: "bg-violet/10 text-violet",
  "warm-blue": "bg-warm-blue/10 text-warm-blue",
  "light-blue": "bg-light-blue/30 text-warm-blue",
  default: "bg-surface text-text-secondary",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
