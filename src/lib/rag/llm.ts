import { Ollama } from "ollama";

const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
});

const MODEL = process.env.LLM_MODEL || "llama3.1:8b";
const TEMPERATURE = parseFloat(process.env.LLM_TEMPERATURE || "0.1");

function buildMessages(systemPrompt: string, userMessage: string, context: string) {
  return [
    { role: "system" as const, content: systemPrompt },
    {
      role: "user" as const,
      content: [
        "<context>",
        context,
        "</context>",
        "",
        "<user_query>",
        userMessage,
        "</user_query>",
      ].join("\n"),
    },
  ];
}

export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
  context: string
): Promise<string> {
  const response = await ollama.chat({
    model: MODEL,
    messages: buildMessages(systemPrompt, userMessage, context),
    options: { temperature: TEMPERATURE },
  });

  return response.message.content;
}

export async function* generateResponseStream(
  systemPrompt: string,
  userMessage: string,
  context: string
): AsyncGenerator<string> {
  const response = await ollama.chat({
    model: MODEL,
    messages: buildMessages(systemPrompt, userMessage, context),
    options: { temperature: TEMPERATURE },
    stream: true,
  });

  for await (const chunk of response) {
    yield chunk.message.content;
  }
}
