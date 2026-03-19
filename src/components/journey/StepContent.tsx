import type { ReactNode } from "react";
import { StepBadge, MotionSection, MotionItem } from "@/components/ui";

interface StepContentProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function StepContent({ step, title, description, children }: StepContentProps) {
  return (
    <div>
      <MotionSection className="mb-8">
        <MotionItem>
          <div className="flex justify-center mb-4">
            <StepBadge step={step} variant="green" size="lg" />
          </div>
        </MotionItem>
        <MotionItem>
          <h1 className="text-3xl font-bold text-text-primary text-center mb-2">
            {title}
          </h1>
        </MotionItem>
        {description && (
          <MotionItem>
            <p className="text-text-secondary text-center max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </MotionItem>
        )}
      </MotionSection>
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  );
}
