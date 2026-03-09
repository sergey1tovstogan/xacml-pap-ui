import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");
const SECTIONS = ["overview", "architecture", "integration", "policies", "sandbox"];

export interface ProcessedChunk {
  id: string;
  content: string;
  metadata: {
    section: string;
    slug: string;
    title: string;
    heading: string;
    tags: string[];
    source: string;
  };
}

/**
 * Remove MDX/JSX component tags while preserving inner text content.
 */
export function stripMdxComponents(content: string): string {
  // Remove opening and closing tags for custom components
  let stripped = content.replace(
    /<\/?(?:InfoCard|Steps|Step|TableOfContents|Breadcrumbs|PrevNextNav)[^>]*>/g,
    ""
  );
  // Remove import statements
  stripped = stripped.replace(/^import\s+.*$/gm, "");
  // Collapse multiple blank lines into one
  stripped = stripped.replace(/\n{3,}/g, "\n\n");
  return stripped.trim();
}

/**
 * Split content into chunks by H2 headings.
 * If no H2 headings exist, the entire content becomes a single chunk.
 */
export function chunkByH2(content: string): { heading: string; body: string }[] {
  const lines = content.split("\n");
  const chunks: { heading: string; body: string }[] = [];
  let currentHeading = "Introduction";
  let currentBody: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      // Save previous chunk if it has content
      const body = currentBody.join("\n").trim();
      if (body) {
        chunks.push({ heading: currentHeading, body });
      }
      currentHeading = h2Match[1].trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  // Save last chunk
  const body = currentBody.join("\n").trim();
  if (body) {
    chunks.push({ heading: currentHeading, body });
  }

  return chunks;
}

/**
 * Process all MDX docs into chunks ready for embedding.
 */
export function processAllDocs(): ProcessedChunk[] {
  const slugger = new GithubSlugger();
  const allChunks: ProcessedChunk[] = [];

  for (const section of SECTIONS) {
    const sectionDir = path.join(CONTENT_DIR, section);
    if (!fs.existsSync(sectionDir)) continue;

    const files = fs.readdirSync(sectionDir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(sectionDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const title = (data.title as string) || slug;
      const tags = (data.tags as string[]) || [];
      const cleaned = stripMdxComponents(content);
      const chunks = chunkByH2(cleaned);

      slugger.reset();
      for (const chunk of chunks) {
        const headingSlug = slugger.slug(chunk.heading);
        allChunks.push({
          id: `${section}/${slug}#${headingSlug}`,
          content: `${chunk.heading}\n\n${chunk.body}`,
          metadata: {
            section,
            slug,
            title,
            heading: chunk.heading,
            tags,
            source: `/${section}/${slug}`,
          },
        });
      }
    }
  }

  return allChunks;
}
