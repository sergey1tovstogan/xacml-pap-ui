import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  section: string;
  title: string;
}

export function Breadcrumbs({ section, title }: BreadcrumbsProps) {
  const sectionConfig = siteConfig.sections.find((s) => s.id === section);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-text-muted mb-6"
    >
      <Link href="/" className="hover:text-green transition-colors">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" />
      {sectionConfig && (
        <>
          <Link
            href={sectionConfig.href}
            className="hover:text-green transition-colors"
          >
            {sectionConfig.title}
          </Link>
          <ChevronRight className="h-3 w-3" />
        </>
      )}
      <span className="text-text-secondary">{title}</span>
    </nav>
  );
}
