"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout";
import { siteConfig } from "@/config/site";

interface SectionLayoutProps {
  sectionId: string;
  children: React.ReactNode;
}

export function SectionLayout({ sectionId, children }: SectionLayoutProps) {
  const section = siteConfig.sections.find((s) => s.id === sectionId);
  if (!section) return <>{children}</>;

  return (
    <div className="flex min-h-[calc(100vh-var(--spacing-header))]">
      <Sidebar section={section} />
      <div className="ml-(--spacing-sidebar) flex-1 p-8 max-w-4xl">
        {children}
      </div>
    </div>
  );
}
