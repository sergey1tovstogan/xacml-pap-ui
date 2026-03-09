import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { MDXFrontmatter, MDXDoc, TOCItem, AdjacentDoc } from "@/types";
import { siteConfig } from "@/config/site";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getDocBySlug(
  section: string,
  slug: string
): MDXDoc | null {
  const filePath = path.join(CONTENT_DIR, section, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    frontmatter: data as MDXFrontmatter,
    rawContent: content,
    slug,
  };
}

export function getAllDocsForSection(section: string): MDXDoc[] {
  const sectionDir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(sectionDir)) return [];

  const files = fs.readdirSync(sectionDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      return getDocBySlug(section, slug)!;
    })
    .filter(Boolean)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getTableOfContents(rawContent: string): TOCItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(rawContent)) !== null) {
    items.push({
      depth: match[1].length,
      text: match[2].trim(),
      slug: slugger.slug(match[2].trim()),
    });
  }

  return items;
}

export function getAdjacentDocs(
  section: string,
  slug: string
): { prev: AdjacentDoc | null; next: AdjacentDoc | null } {
  const sections = siteConfig.sections;
  const sectionIndex = sections.findIndex((s) => s.id === section);
  if (sectionIndex === -1) return { prev: null, next: null };

  const currentSection = sections[sectionIndex];
  const itemIndex = currentSection.items.findIndex((i) => i.slug === slug);
  if (itemIndex === -1) return { prev: null, next: null };

  let prev: AdjacentDoc | null = null;
  let next: AdjacentDoc | null = null;

  // Previous: prior item in section, or last item of previous section
  if (itemIndex > 0) {
    const item = currentSection.items[itemIndex - 1];
    prev = {
      title: item.title,
      slug: item.slug,
      section: currentSection.id,
      href: `${currentSection.href}/${item.slug}`,
    };
  } else if (sectionIndex > 0) {
    const prevSection = sections[sectionIndex - 1];
    const lastItem = prevSection.items[prevSection.items.length - 1];
    if (lastItem) {
      prev = {
        title: lastItem.title,
        slug: lastItem.slug,
        section: prevSection.id,
        href: `${prevSection.href}/${lastItem.slug}`,
      };
    }
  }

  // Next: next item in section, or first item of next section
  if (itemIndex < currentSection.items.length - 1) {
    const item = currentSection.items[itemIndex + 1];
    next = {
      title: item.title,
      slug: item.slug,
      section: currentSection.id,
      href: `${currentSection.href}/${item.slug}`,
    };
  } else if (sectionIndex < sections.length - 1) {
    const nextSection = sections[sectionIndex + 1];
    const firstItem = nextSection.items[0];
    if (firstItem) {
      next = {
        title: firstItem.title,
        slug: firstItem.slug,
        section: nextSection.id,
        href: `${nextSection.href}/${firstItem.slug}`,
      };
    }
  }

  return { prev, next };
}
