import { NextRequest, NextResponse } from "next/server";
import { ragQuery } from "@/lib/rag/pipeline";

export async function POST(request: NextRequest) {
  try {
    const { description } = (await request.json()) as { description: string };

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Policy description is required" },
        { status: 400 }
      );
    }

    const result = await ragQuery(description.trim(), "policy");

    return NextResponse.json({
      content: result.content,
      policyXml: result.policyXml || null,
      sources: result.sources,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate policy error:", msg);
    return NextResponse.json(
      { error: "Failed to generate policy. Ensure Ollama and ChromaDB are running." },
      { status: 500 }
    );
  }
}
