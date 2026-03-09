import { processAllDocs } from "../src/lib/rag/content-processor";
import { getEmbeddings } from "../src/lib/rag/embeddings";
import {
  deleteCollection,
  getOrCreateCollection,
  addDocuments,
} from "../src/lib/rag/vector-store";

async function main() {
  console.log("=== PAP UI Documentation Ingestion ===\n");

  // 1. Process all MDX docs into chunks
  console.log("Processing MDX documents...");
  const chunks = processAllDocs();
  console.log(`  Found ${chunks.length} chunks across documents\n`);

  // Log section breakdown
  const sectionCounts: Record<string, number> = {};
  for (const chunk of chunks) {
    sectionCounts[chunk.metadata.section] =
      (sectionCounts[chunk.metadata.section] || 0) + 1;
  }
  console.log("  Chunks per section:");
  for (const [section, count] of Object.entries(sectionCounts)) {
    console.log(`    ${section}: ${count}`);
  }
  console.log();

  // 2. Generate embeddings
  console.log("Generating embeddings with nomic-embed-text...");
  const texts = chunks.map((c) => c.content);
  const embeddings = await getEmbeddings(texts);
  console.log(`  Generated ${embeddings.length} embeddings\n`);

  // 3. Store in ChromaDB
  console.log("Storing in ChromaDB...");
  await deleteCollection();
  const collection = await getOrCreateCollection();
  await addDocuments(collection, chunks, embeddings);
  console.log(`  Stored ${chunks.length} documents in collection "${collection.name}"\n`);

  console.log("=== Ingestion complete! ===");
}

main().catch((error) => {
  console.error("\nIngestion failed:", error.message);
  console.error(
    "\nMake sure Ollama and ChromaDB are running:\n" +
      "  - Ollama: ollama serve\n" +
      "  - ChromaDB: chroma run --port 8000\n" +
      "  - Pull embedding model: ollama pull nomic-embed-text"
  );
  process.exit(1);
});
