import { NextRequest, NextResponse } from "next/server";
import { ragQuery } from "@/lib/rag/pipeline";
import { generateScriptSchema, parseBody } from "@/lib/api-schemas";
import { logApiRequest } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(generateScriptSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const start = Date.now();
    const result = await ragQuery(parsed.data.description, "scripts");

    logApiRequest("/api/generate-script", {
      inputLength: parsed.data.description.length,
      durationMs: Date.now() - start,
      status: "success",
    });

    return NextResponse.json({
      content: result.content,
      script: result.script || null,
      sources: result.sources,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logApiRequest("/api/generate-script", { status: "error", error: msg });
    return NextResponse.json(
      { error: "Failed to generate script. Ensure Ollama and ChromaDB are running." },
      { status: 500 }
    );
  }
}
