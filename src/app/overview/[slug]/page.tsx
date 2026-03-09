import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import {
  getDocBySlug,
  getAllDocsForSection,
  getTableOfContents,
  getAdjacentDocs,
} from "@/lib/content";
import { StepContent } from "@/components/journey";
import {
  mdxComponents,
  Breadcrumbs,
  TableOfContents,
  PrevNextNav,
} from "@/components/mdx";

const SECTION = "overview";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OverviewSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(SECTION, slug);
  if (!doc) notFound();

  const toc = getTableOfContents(doc.rawContent);
  const adjacent = getAdjacentDocs(SECTION, slug);

  return (
    <>
      <Breadcrumbs section={SECTION} title={doc.frontmatter.title} />
      <StepContent
        step={doc.frontmatter.order}
        title={doc.frontmatter.title}
        description={doc.frontmatter.description}
      >
        {toc.length > 0 && <TableOfContents items={toc} />}
        <MDXRemote
          source={doc.rawContent}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode, { theme: "one-dark-pro", keepBackground: false }],
              ],
            },
          }}
        />
      </StepContent>
      <PrevNextNav prev={adjacent.prev} next={adjacent.next} />
    </>
  );
}

export function generateStaticParams() {
  const docs = getAllDocsForSection(SECTION);
  return docs.map((doc) => ({ slug: doc.slug }));
}
