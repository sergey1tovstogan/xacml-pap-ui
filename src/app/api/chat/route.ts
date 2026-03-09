import { NextRequest, NextResponse } from "next/server";
import { ragQuery, ragQueryStream } from "@/lib/rag/pipeline";
import type { ChatMode } from "@/types";

const VALID_MODES: ChatMode[] = ["qa", "policy", "setup", "scripts"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, mode, stream } = body as {
      message: string;
      mode: ChatMode;
      stream?: boolean;
    };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!VALID_MODES.includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Must be one of: qa, policy, setup, scripts" },
        { status: 400 }
      );
    }

    // Streaming mode: return SSE stream
    if (stream) {
      const sseStream = await ragQueryStream(message.trim(), mode);
      return new Response(sseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming mode: return full JSON response
    const response = await ragQuery(message.trim(), mode);
    return NextResponse.json(response);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Chat API error:", msg);
    return NextResponse.json(
      {
        error:
          "Failed to generate response. Ensure Ollama and ChromaDB are running.",
      },
      { status: 500 }
    );
  }
}
