import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface InfoCardProps {
  title: string;
  variant?: "teal" | "purple" | "info" | "success" | "warning";
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  teal: "text-teal",
  purple: "text-purple",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
};

export function InfoCard({ title, variant = "teal", children }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-card p-5 my-4">
      <h4 className={cn("font-semibold text-sm mb-2", variantStyles[variant])}>
        {title}
      </h4>
      <div className="text-sm text-text-secondary leading-relaxed">
        {children}
      </div>
    </div>
  );
}
