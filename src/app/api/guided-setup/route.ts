import { NextRequest, NextResponse } from "next/server";
import { ragQuery } from "@/lib/rag/pipeline";
import { guidedSetupSchema, parseBody } from "@/lib/api-schemas";
import { logApiRequest } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(guidedSetupSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const start = Date.now();
    const result = await ragQuery(parsed.data.topic, "setup");

    logApiRequest("/api/guided-setup", {
      inputLength: parsed.data.topic.length,
      durationMs: Date.now() - start,
      status: "success",
    });

    return NextResponse.json({
      content: result.content,
      sources: result.sources,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logApiRequest("/api/guided-setup", { status: "error", error: msg });
    return NextResponse.json(
      { error: "Failed to generate setup guide. Ensure Ollama and ChromaDB are running." },
      { status: 500 }
    );
  }
}
