import type { ReactNode } from "react";

interface StepProps {
  number: number;
  title: string;
  last?: boolean;
  children: ReactNode;
}

export function Step({ number, title, last = false, children }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white text-sm font-bold">
          {number}
        </span>
        {!last && <div className="w-px h-full bg-border my-1" />}
      </div>
      <div className="pb-6">
        <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
        <div className="text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <div className="space-y-0 my-4">{children}</div>;
}
