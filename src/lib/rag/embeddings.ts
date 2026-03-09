import { Ollama } from "ollama";

const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
});

const MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text";

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await ollama.embed({ model: MODEL, input: text });
  return response.embeddings[0];
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await ollama.embed({ model: MODEL, input: texts });
  return response.embeddings;
}
