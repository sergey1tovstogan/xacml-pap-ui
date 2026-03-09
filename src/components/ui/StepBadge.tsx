import { cn } from "@/lib/utils/cn";

interface StepBadgeProps {
  step: number;
  variant?: "teal" | "purple" | "success" | "warning";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  teal: "bg-teal text-white",
  purple: "bg-purple text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
};

const sizeStyles = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export function StepBadge({ step, variant = "teal", size = "md" }: StepBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold",
        variantStyles[variant],
        sizeStyles[size]
      )}
    >
      {step}
    </span>
  );
}
