import type { ReactNode } from "react";
import { MotionSection, MotionItem } from "@/components/ui";

const iconColorMap: Record<string, string> = {
  green: "text-green",
  violet: "text-violet",
  "warm-blue": "text-warm-blue",
};

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description?: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  iconColor?: string;
}

export function FeatureGrid({ items, columns = 4, iconColor = "green" }: FeatureGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <MotionSection className={`grid ${gridCols[columns]} gap-4`}>
      {items.map((item) => (
        <MotionItem key={item.title}>
          <div className="rounded-xl border border-border bg-surface-card p-5 text-center hover:shadow-[var(--shadow-card-hover)] hover:border-green/20 transition-all duration-200 h-full">
            <div className={`flex justify-center mb-3 ${iconColorMap[iconColor] ?? "text-green"}`}>{item.icon}</div>
            <h3 className="font-semibold text-sm text-text-primary">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </MotionItem>
      ))}
    </MotionSection>
  );
}
