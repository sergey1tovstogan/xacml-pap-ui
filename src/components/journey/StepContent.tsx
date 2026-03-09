import type { ReactNode } from "react";
import { StepBadge } from "@/components/ui";

interface StepContentProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function StepContent({ step, title, description, children }: StepContentProps) {
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <StepBadge step={step} variant="teal" size="lg" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary text-center mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary text-center max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  );
}
