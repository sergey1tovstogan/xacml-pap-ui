# Architecture

## Route Structure
```
/                          → Home (hero + journey feature grid)
/[section]/[slug]          → MDX documentation pages (sidebar, TOC, prev/next)
/sandbox                   → Interactive policy testing sandbox
/assistant                 → AI assistant page
/api/*                     → All API routes pass through middleware (auth + rate limiting)
/api/chat                  → RAG-powered Q&A streaming (POST)
/api/generate-policy       → XACML policy generation (POST)
/api/evaluate-policy       → Policy evaluation (POST)
/api/generate-script       → Script generation (POST)
/api/guided-setup          → Step-by-step setup assistant (POST)
```

## API Security Layer
All `/api/*` requests pass through `src/middleware.ts` before reaching route handlers:
1. **Authentication** — API key validation (optional, enabled via `API_KEY` env var)
2. **Rate limiting** — 20 requests/min per IP

Route handlers then apply:
3. **Input validation** — Zod schemas from `src/lib/api-schemas.ts`
4. **Structured logging** — Pino logger via `src/lib/logger.ts`

## Navigation
Defined in `src/config/site.ts` — 5 sections:
1. **Overview** — what-is-xacml, pap-ui-overview, key-concepts, quick-start
2. **Architecture** — xacml-flow, temenos-integration, data-flow
3. **Integration** — keycloak-setup, gc-microservice, tex-configuration, production-deployment
4. **Policies** — first-policy, policy-sets-rules, conditions-obligations, example-policies
5. **Sandbox** — policy-sandbox

## RAG Pipeline (`src/lib/rag/`)
1. **Ingestion**: `scripts/ingest.ts` → reads `content/` + `docs/` → chunks text → embeds via Ollama (nomic-embed-text) → stores in ChromaDB
2. **Query flow**: API route → embed query → ChromaDB similarity search (top_k) → inject context into Ollama prompt (with `<context>` / `<user_query>` delimiters) → stream response → validate XML output
3. **Files**: content-processor.ts → embeddings.ts → vector-store.ts → prompts.ts → llm.ts → pipeline.ts (orchestrator)

## Data Flow
- MDX: `content/*.mdx` → gray-matter parse → next-mdx-remote render → page
- Chat: user input → `useStreamingChat` hook → `/api/chat` → RAG pipeline → SSE stream → UI
- Sandbox: policy XML + request → `/api/evaluate-policy` → evaluation result → UI

## Key Integration Points
- `FloatingAssistant` — global chat widget (in root layout), uses `useStreamingChat`
- `Sidebar` — per-section layout, reads `siteConfig` for nav items
- MDX pages — `content.ts` for loading, `mdx-components.tsx` for custom rendering
- AI modes — `ai-modes.ts` defines 4 chat modes (qa, policy, setup, scripts) with labels, icons, placeholders

## Future Enhancements
- **Policy graph visualization** — visual representation of policy hierarchies and rule relationships
- **Decision tree visualization** — interactive tree showing evaluation paths for a given request
- **Policy diff engine** — compare two policies and highlight structural/semantic differences
