import { cn } from "@/lib/utils/cn";

interface StepBadgeProps {
  step: number;
  variant?: "green" | "violet" | "warm-blue" | "light-blue";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  green: "bg-green text-white",
  violet: "bg-violet text-white",
  "warm-blue": "bg-warm-blue text-white",
  "light-blue": "bg-light-blue text-warm-blue",
};

const sizeStyles = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export function StepBadge({ step, variant = "green", size = "md" }: StepBadgeProps) {
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
