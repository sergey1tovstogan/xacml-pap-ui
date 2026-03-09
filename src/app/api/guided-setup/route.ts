import { NextRequest, NextResponse } from "next/server";
import { ragQuery } from "@/lib/rag/pipeline";

export async function POST(request: NextRequest) {
  try {
    const { topic } = (await request.json()) as { topic: string };

    if (!topic?.trim()) {
      return NextResponse.json(
        { error: "Setup topic is required" },
        { status: 400 }
      );
    }

    const result = await ragQuery(topic.trim(), "setup");

    return NextResponse.json({
      content: result.content,
      sources: result.sources,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Guided setup error:", msg);
    return NextResponse.json(
      { error: "Failed to generate setup guide. Ensure Ollama and ChromaDB are running." },
      { status: 500 }
    );
  }
}
