import { NextRequest, NextResponse } from "next/server";
import { ragQuery } from "@/lib/rag/pipeline";

export async function POST(request: NextRequest) {
  try {
    const { description } = (await request.json()) as { description: string };

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Script description is required" },
        { status: 400 }
      );
    }

    const result = await ragQuery(description.trim(), "scripts");

    return NextResponse.json({
      content: result.content,
      script: result.script || null,
      sources: result.sources,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate script error:", msg);
    return NextResponse.json(
      { error: "Failed to generate script. Ensure Ollama and ChromaDB are running." },
      { status: 500 }
    );
  }
}
