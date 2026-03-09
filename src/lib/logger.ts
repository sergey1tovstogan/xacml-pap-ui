import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(process.env.NODE_ENV === "development" && {
    transport: {
      target: "pino/file",
      options: { destination: 1 }, // stdout
    },
    formatters: {
      level: (label: string) => ({ level: label }),
    },
  }),
});

/**
 * Log an API request with structured metadata.
 */
export function logApiRequest(
  route: string,
  meta: {
    ip?: string;
    inputLength?: number;
    mode?: string;
    durationMs?: number;
    status: "success" | "error";
    error?: string;
  }
) {
  const entry = { route, ...meta };

  if (meta.status === "error") {
    logger.error(entry, `API error: ${route}`);
  } else {
    logger.info(entry, `API request: ${route}`);
  }
}
