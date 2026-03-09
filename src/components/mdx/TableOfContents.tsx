import type { TOCItem } from "@/types";

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav className="rounded-xl border border-border bg-surface-card p-5 mb-8">
      <h4 className="font-semibold text-sm text-text-primary mb-3">
        On this page
      </h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={`block text-sm text-text-secondary hover:text-teal transition-colors ${
                item.depth === 3 ? "pl-4" : ""
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
