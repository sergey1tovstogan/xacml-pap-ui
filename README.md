# Temenos PAP UI Explorer

Documentation & AI-powered assistant for XACML Policy Administration Point (PAP) in the Temenos ecosystem.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript 5, Tailwind CSS 4, Framer Motion
- **Content:** MDX with gray-matter frontmatter
- **AI Backend:** Ollama (llama3.1:8b) + ChromaDB (RAG)

## Prerequisites

- Node.js 22+
- npm 10+
- (Optional) [Ollama](https://ollama.ai) for AI assistant features
- (Optional) [ChromaDB](https://www.trychroma.com/) for RAG vector store

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### AI Features (Optional)

To enable the AI assistant with RAG:

```bash
# Copy environment config
cp .env.example .env.local

# Start Ollama and pull model
ollama pull llama3.1:8b
ollama pull nomic-embed-text

# Start ChromaDB (via Docker)
docker run -p 8000:8000 chromadb/chroma

# Ingest documentation into vector store
npm run ingest
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── overview/           # XACML fundamentals docs
│   ├── architecture/       # System design docs
│   ├── integration/        # Setup & configuration guides
│   ├── policies/           # Policy creation guides
│   ├── sandbox/            # Interactive policy testing
│   ├── assistant/          # AI-powered assistant
│   └── api/                # Backend API routes
├── components/
│   ├── ui/                 # Atomic UI components
│   ├── layout/             # Header, Sidebar, Footer
│   ├── mdx/                # MDX rendering components
│   ├── journey/            # Section layout wrappers
│   └── assistant/          # AI chat components
├── config/                 # Site & AI mode configuration
├── lib/                    # Utilities & content loader
└── types/                  # TypeScript interfaces
content/                    # MDX documentation files
scripts/                    # Service management scripts
```

## Module Overview

| Module | Path | Description |
|--------|------|-------------|
| **Core** | `components/`, `lib/`, `types/`, `config/` | Shared UI, layout, utilities, and types |
| **Overview** | `app/overview/`, `content/overview/` | XACML fundamentals and PAP UI introduction |
| **Architecture** | `app/architecture/`, `content/architecture/` | XACML component flow, Temenos integration, data flow |
| **Integration** | `app/integration/`, `content/integration/` | Keycloak, GC Microservice, TEX, deployment guides |
| **Policies** | `app/policies/`, `content/policies/` | Policy creation, sets & rules, conditions & obligations |
| **Sandbox** | `app/sandbox/`, `content/sandbox/` | Interactive client-side policy evaluation |
| **AI Assistant** | `app/assistant/`, `components/assistant/` | Multi-mode AI chat (Q&A, policy gen, guided setup, scripts) |
| **API Routes** | `app/api/` | Backend endpoints for chat, evaluation, generation |

## Branching Strategy

This project uses a **modified Git Flow** with module-aligned feature branches:

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases |
| `develop` | Integration branch (default) |
| `feature/core` | Shared components, types, config, layout |
| `feature/docs-*` | Documentation modules (overview, architecture, integration, policies) |
| `feature/home` | Landing page |
| `feature/sandbox` | Policy testing sandbox |
| `feature/ai-assistant` | AI assistant & floating chat widget |
| `feature/api-routes` | Backend API endpoints |
| `feature/ci-cd` | CI/CD pipeline & DevOps |

**Merge order:** `feature/core` merges first, then all other feature branches can merge in parallel.

## Contributing

1. Check out your assigned `feature/*` branch from `develop`
2. Work within your module's file boundaries
3. Open a PR targeting `develop`
4. Ensure CI passes (lint + build)
5. Get 1 approval, then squash merge

For cross-module changes, open a PR to `feature/core` first, then rebase your feature branch.

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run ingest    # Ingest docs into ChromaDB for RAG
```

## License

Private - Temenos internal use.
