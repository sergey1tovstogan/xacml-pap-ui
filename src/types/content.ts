export interface DocPage {
  title: string;
  description: string;
  category: string;
  slug: string;
  order: number;
  tags?: string[];
  lastUpdated?: string;
  content: string;
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  articleCount: number;
  icon: string;
}

export interface MDXFrontmatter {
  title: string;
  description: string;
  section: string;
  order: number;
  tags?: string[];
  lastUpdated?: string;
}

export interface MDXDoc {
  frontmatter: MDXFrontmatter;
  rawContent: string;
  slug: string;
}

export interface TOCItem {
  depth: number;
  text: string;
  slug: string;
}

export interface AdjacentDoc {
  title: string;
  slug: string;
  section: string;
  href: string;
}
