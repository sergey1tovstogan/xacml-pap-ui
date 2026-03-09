import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "teal" | "purple" | "success" | "warning" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  teal: "bg-teal/10 text-teal",
  purple: "bg-purple/10 text-purple",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
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
