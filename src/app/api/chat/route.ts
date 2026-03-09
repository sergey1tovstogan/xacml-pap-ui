import { NextRequest, NextResponse } from "next/server";
import { ragQuery, ragQueryStream } from "@/lib/rag/pipeline";
import { chatSchema, parseBody } from "@/lib/api-schemas";
import { logApiRequest } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(chatSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { message, mode, stream } = parsed.data;
    const start = Date.now();

    // Streaming mode: return SSE stream
    if (stream) {
      const sseStream = await ragQueryStream(message, mode);
      logApiRequest("/api/chat", {
        inputLength: message.length,
        mode,
        status: "success",
      });
      return new Response(sseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming mode: return full JSON response
    const response = await ragQuery(message, mode);
    logApiRequest("/api/chat", {
      inputLength: message.length,
      mode,
      durationMs: Date.now() - start,
      status: "success",
    });
    return NextResponse.json(response);
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    logApiRequest("/api/chat", { status: "error", error: msg });
    return NextResponse.json(
      {
        error: `Failed to generate response: ${msg}. Ensure Ollama and ChromaDB are running.`,
      },
      { status: 500 }
    );
  }
}
