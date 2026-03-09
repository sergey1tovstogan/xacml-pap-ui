export interface NavItem {
  title: string;
  slug: string;
  order: number;
  icon?: string;
}

export interface NavSection {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  items: NavItem[];
}

export interface SiteConfig {
  name: string;
  description: string;
  version: string;
  sections: NavSection[];
}
