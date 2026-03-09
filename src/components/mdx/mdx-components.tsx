import type { MDXComponents } from "mdx/types";
import GithubSlugger from "github-slugger";
import { InfoCard } from "./InfoCard";
import { Steps, Step } from "./Steps";
import { Accordion } from "@/components/ui/Accordion";

const slugger = new GithubSlugger();

function getHeadingId(children: React.ReactNode): string {
  const text = typeof children === "string" ? children : String(children);
  return slugger.slug(text);
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => {
    slugger.reset();
    const id = getHeadingId(children);
    return (
      <h2
        id={id}
        className="text-xl font-bold text-text-primary mt-10 mb-4 scroll-mt-20"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const id = getHeadingId(children);
    return (
      <h3
        id={id}
        className="text-lg font-semibold text-text-primary mt-8 mb-3 scroll-mt-20"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => (
    <h4
      className="text-base font-semibold text-text-primary mt-6 mb-2"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p
      className="text-sm text-text-secondary leading-relaxed mb-4"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="text-sm text-text-secondary space-y-2 mb-4 list-disc pl-5"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="text-sm text-text-secondary space-y-2 mb-4 list-decimal pl-5"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-green hover:text-green-dark underline underline-offset-2 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-3 border-green bg-green/5 rounded-r-lg px-4 py-3 my-4 text-sm text-text-secondary"
      {...props}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-text-primary" {...props}>
      {children}
    </strong>
  ),
  code: ({ children, ...props }) => {
    // Inline code (not inside pre — rehype-pretty-code handles pre > code)
    return (
      <code
        className="bg-surface-hover text-green-dark rounded px-1.5 py-0.5 text-xs font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table
        className="w-full text-sm border-collapse border border-border rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="bg-surface-hover text-left px-4 py-2 font-semibold text-text-primary border border-border"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-4 py-2 text-text-secondary border border-border"
      {...props}
    >
      {children}
    </td>
  ),
  hr: (props) => <hr className="border-border my-8" {...props} />,
  // Custom components available in MDX files
  InfoCard,
  Steps,
  Step,
  Accordion,
};
