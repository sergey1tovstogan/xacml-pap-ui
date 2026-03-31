import { ChromaClient, type Collection } from "chromadb";
import type { ProcessedChunk } from "./content-processor";

const chromaUrl = new URL(process.env.CHROMA_URL || "http://localhost:8000");

const chroma = new ChromaClient({
  host: chromaUrl.hostname,
  port: parseInt(chromaUrl.port || "8000", 10),
  ssl: chromaUrl.protocol === "https:",
});

const COLLECTION_NAME = process.env.CHROMA_COLLECTION || "pap-ui-docs";

export async function getOrCreateCollection(): Promise<Collection> {
  return chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
    embeddingFunction: null,
  });
}

export async function deleteCollection(): Promise<void> {
  try {
    await chroma.deleteCollection({ name: COLLECTION_NAME });
  } catch {
    // Collection doesn't exist yet, that's fine
  }
}

export async function addDocuments(
  collection: Collection,
  chunks: ProcessedChunk[],
  embeddings: number[][]
): Promise<void> {
  await collection.add({
    ids: chunks.map((c) => c.id),
    embeddings,
    documents: chunks.map((c) => c.content),
    metadatas: chunks.map((c) => c.metadata),
  });
}

export interface RetrievedChunk {
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
  distance: number;
}

export async function queryDocuments(
  collection: Collection,
  queryEmbedding: number[],
  topK: number
): Promise<RetrievedChunk[]> {
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  const chunks: RetrievedChunk[] = [];
  const ids = results.ids[0] || [];
  const documents = results.documents[0] || [];
  const metadatas = results.metadatas[0] || [];
  const distances = results.distances?.[0] || [];

  for (let i = 0; i < ids.length; i++) {
    const meta = metadatas[i] as Record<string, unknown>;
    chunks.push({
      id: ids[i],
      content: documents[i] || "",
      metadata: {
        section: (meta.section as string) || "",
        slug: (meta.slug as string) || "",
        title: (meta.title as string) || "",
        heading: (meta.heading as string) || "",
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        source: (meta.source as string) || "",
      },
      distance: distances[i] || 0,
    });
  }

  return chunks;
}
