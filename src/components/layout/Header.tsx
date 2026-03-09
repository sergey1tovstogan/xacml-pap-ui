"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

export function Header() {
  const pathname = usePathname();

  const activeSection = siteConfig.sections.find(
    (s) => pathname === s.href || pathname.startsWith(s.href + "/")
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-(--spacing-header) bg-navy">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal text-navy font-bold text-sm">
            P
          </div>
          <span className="text-text-inverse font-semibold text-lg tracking-tight">
            Temenos PAP UI Explorer
          </span>
          <span className="ml-1 rounded-full bg-teal/20 px-2.5 py-0.5 text-xs font-medium text-teal">
            DEMO
          </span>
        </Link>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1">
          {siteConfig.sections.map((section) => {
            const isActive = activeSection?.id === section.id;
            return (
              <Link
                key={section.id}
                href={section.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {section.title}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-teal rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/assistant"
            className="flex items-center gap-2 rounded-md bg-teal/10 px-3 py-1.5 text-sm font-medium text-teal hover:bg-teal/20 transition-colors"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            AI Assistant
          </Link>
          <span className="text-white/40 text-xs">
            v{siteConfig.version}
          </span>
        </div>
      </div>
    </header>
  );
}
