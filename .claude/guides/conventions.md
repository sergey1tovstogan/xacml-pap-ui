# Coding Conventions

## Component Patterns
- Named exports only (no default exports)
- Props interface defined above component, extending HTML attributes when appropriate
- `cn()` from `@/lib/utils/cn` for all className composition: `cn("base", condition && "conditional", className)`
- One component per file, PascalCase filename matching component name
- Components grouped by domain: `ui/`, `layout/`, `mdx/`, `journey/`, `assistant/`, `docs/`, `home/`, `sandbox/`

## TypeScript
- Strict mode, no `any`
- `import type { }` for type-only imports
- `interface` over `type` for object shapes
- All config objects typed (SiteConfig, AIModeConfig, ChatMode, etc.)
- Types live in `src/types/` — one file per domain (chat.ts, content.ts, site.ts)

## API Routes
- App Router route handlers at `src/app/api/[name]/route.ts`
- Chat modes: qa, policy, setup, scripts (defined in `src/config/ai-modes.ts`)
- RAG pipeline: query → embed → vector search → LLM with context → stream response
- Use `NextResponse` and standard Web API Request/Response

## CSS & Styling
- Tailwind 4 with `@theme inline` block in `globals.css` for all design tokens
- No arbitrary values when a token exists — use the token
- Responsive: mobile-first approach
- Single theme (no dark mode currently)
- Use CSS variables from `@theme` for colors, shadows, radii, spacing, fonts

## MDX Content
- Content in `content/[section]/[slug].mdx`
- Frontmatter: `title`, `description`, `order` (parsed by gray-matter)
- Custom MDX components in `src/components/mdx/mdx-components.tsx`
- Navigation structure defined in `src/config/site.ts` — 5 sections: overview, architecture, integration, policies, sandbox
- Content loaded via `src/lib/content.ts`

## File Organization
- Barrel exports (`index.ts`) where multiple components share a directory
- Hooks in `src/hooks/` — prefixed with `use`
- Utilities in `src/lib/utils/`
- Config in `src/config/`
