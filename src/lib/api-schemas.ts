import { z } from "zod";
import type { ChatMode } from "@/types";

const VALID_MODES: ChatMode[] = ["qa", "policy", "setup", "scripts"];

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message exceeds maximum length of 2000 characters"),
  mode: z.enum(["qa", "policy", "setup", "scripts"] as const, {
    error: `Invalid mode. Must be one of: ${VALID_MODES.join(", ")}`,
  }),
  stream: z.boolean().optional(),
});

export const generatePolicySchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Policy description is required")
    .max(2000, "Description exceeds maximum length of 2000 characters"),
});

export const generateScriptSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Script description is required")
    .max(2000, "Description exceeds maximum length of 2000 characters"),
});

export const guidedSetupSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(1, "Setup topic is required")
    .max(2000, "Topic exceeds maximum length of 2000 characters"),
});

export const evaluatePolicySchema = z.object({
  policy: z
    .string()
    .trim()
    .min(1, "Policy XML is required")
    .max(50000, "Policy XML exceeds maximum length of 50000 characters"),
  request: z.object({
    subject: z.record(z.string(), z.string()),
    resource: z.record(z.string(), z.string()),
    action: z.string().min(1, "Request with action is required"),
    environment: z.record(z.string(), z.string()).optional(),
  }),
});

/**
 * Parse request body with a zod schema. Returns the validated data or a 400 error response.
 */
export function parseBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid request body";
    return { success: false, error: firstError };
  }
  return { success: true, data: result.data };
}
