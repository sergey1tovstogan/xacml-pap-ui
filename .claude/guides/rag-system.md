# RAG System

## Environment Variables
```
OLLAMA_BASE_URL=http://localhost:11434    # Ollama API endpoint
LLM_MODEL=llama3.1:8b                    # LLM model for generation
LLM_TEMPERATURE=0.1                      # Low temp for factual responses
CHROMA_URL=http://localhost:8000          # ChromaDB endpoint
CHROMA_COLLECTION=pap-ui-docs            # Collection name
EMBEDDING_MODEL=nomic-embed-text         # Embedding model
RETRIEVAL_TOP_K=5                        # Number of chunks to retrieve
API_KEY=                                 # Optional — enables API key auth on all routes
LOG_LEVEL=info                           # Pino log level (debug, info, warn, error)
```

## Pipeline Files (`src/lib/rag/`)
| File | Purpose |
|------|---------|
| content-processor.ts | Chunks documents for embedding |
| embeddings.ts | Generates embeddings via Ollama |
| vector-store.ts | ChromaDB operations (store, query) |
| prompts.ts | System prompts per chat mode |
| llm.ts | Ollama LLM streaming calls |
| pipeline.ts | Orchestrates the full RAG flow |
| index.ts | Barrel export |

## Ingestion (`scripts/ingest.ts`)
Run via `npm run ingest`. Reads from:
- `content/` — MDX documentation files
- `docs/` — Additional user documentation

Process: read files → extract text → chunk → embed with nomic-embed-text → upsert into ChromaDB collection

## Query Flow
1. User sends message via chat UI (one of 4 modes: qa, policy, setup, scripts)
2. `useStreamingChat` hook POSTs to `/api/chat`
3. Middleware validates auth + rate limit
4. API route validates input with Zod schema (`src/lib/api-schemas.ts`)
5. RAG pipeline processes request:
   - Embed query with nomic-embed-text
   - Search ChromaDB for top_k similar chunks
   - Build prompt with `<context>` / `<user_query>` delimiters (prompt injection mitigation)
   - Stream response from Ollama LLM
6. Generated XML validated with `fast-xml-parser` before returning (`xmlWarning` set if malformed)
7. Request logged via pino (`src/lib/logger.ts`)
8. SSE stream renders in chat UI

## Adding Content
1. Add `.mdx` files to `content/[section]/` or docs to `docs/`
2. Run `npm run ingest` to re-embed
3. New content is immediately available for RAG queries
