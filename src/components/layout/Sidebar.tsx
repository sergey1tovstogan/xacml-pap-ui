"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { NavSection } from "@/types";

interface SidebarProps {
  section: NavSection;
}

export function Sidebar({ section }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-(--spacing-header) bottom-0 w-(--spacing-sidebar) border-r border-border bg-surface-card overflow-y-auto">
      <div className="p-6">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-teal">{section.title}</h2>
          {section.subtitle && (
            <p className="text-sm text-text-secondary mt-0.5">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Step navigation */}
        <nav className="space-y-1">
          {section.items.map((item, index) => {
            const href = `${section.href}/${item.slug}`;
            const isActive =
              pathname === href ||
              (index === 0 && pathname === section.href);
            const isCompleted = false; // TODO: track visited pages

            return (
              <Link
                key={item.slug}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-purple/10 text-purple font-medium border-l-3 border-purple -ml-px"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                {/* Step number */}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-purple text-white"
                      : isCompleted
                        ? "bg-success text-white"
                        : "bg-surface text-text-secondary group-hover:bg-border group-hover:text-text-primary"
                  )}
                >
                  {item.order}
                </span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
