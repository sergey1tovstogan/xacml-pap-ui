import type { ReactNode } from "react";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description?: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ items, columns = 4 }: FeatureGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-border bg-surface-card p-5 text-center hover:shadow-[var(--shadow-card-hover)] hover:border-teal/20 transition-all duration-200"
        >
          <div className="flex justify-center mb-3 text-teal">{item.icon}</div>
          <h3 className="font-semibold text-sm text-text-primary">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
