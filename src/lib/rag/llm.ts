import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const TEMPERATURE = parseFloat(process.env.LLM_TEMPERATURE || "0.1");

function buildMessages(
  systemPrompt: string,
  userMessage: string,
  context: string
): OpenAI.ChatCompletionMessageParam[] {
  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
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
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: buildMessages(systemPrompt, userMessage, context),
    temperature: TEMPERATURE,
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function* generateResponseStream(
  systemPrompt: string,
  userMessage: string,
  context: string
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: MODEL,
    messages: buildMessages(systemPrompt, userMessage, context),
    temperature: TEMPERATURE,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}

/**
 * Generate a structured JSON response using OpenAI's JSON mode.
 * Used for intent extraction where deterministic structure is required.
 */
export async function generateJsonResponse(
  systemPrompt: string,
  userMessage: string,
  context: string
): Promise<Record<string, unknown>> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: buildMessages(systemPrompt, userMessage, context),
    temperature: TEMPERATURE,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content) as Record<string, unknown>;
}
