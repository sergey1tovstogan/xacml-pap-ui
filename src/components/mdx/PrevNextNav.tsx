import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { AdjacentDoc } from "@/types";

interface PrevNextNavProps {
  prev: AdjacentDoc | null;
  next: AdjacentDoc | null;
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="flex items-stretch gap-4 mt-12 pt-8 border-t border-border">
      {prev ? (
        <Link
          href={prev.href}
          className="flex-1 group rounded-xl border border-border bg-surface-card p-5 hover:border-green/30 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <ArrowLeft className="h-3 w-3" />
            Previous
          </div>
          <div className="font-semibold text-sm text-text-primary group-hover:text-green transition-colors">
            {prev.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex-1 group rounded-xl border border-border bg-surface-card p-5 hover:border-green/30 transition-colors text-right"
        >
          <div className="flex items-center justify-end gap-2 text-xs text-text-muted mb-1">
            Next
            <ArrowRight className="h-3 w-3" />
          </div>
          <div className="font-semibold text-sm text-text-primary group-hover:text-green transition-colors">
            {next.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
