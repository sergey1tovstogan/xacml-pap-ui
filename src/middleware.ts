import { NextRequest, NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  Rate Limiting                                                      */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // requests per window per IP

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  // Use forwarded headers (set by reverse proxy / platform like Vercel/Cloudflare).
  // Take only the rightmost untrusted IP to reduce spoofing risk — the last hop
  // before a trusted proxy is the most reliable client IP.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((s) => s.trim());
    // Last entry is closest to the server (added by the trusted proxy)
    return ips[ips.length - 1] || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(ip);
    }
  }
}, WINDOW_MS);

/* ------------------------------------------------------------------ */
/*  API Key Authentication                                             */
/* ------------------------------------------------------------------ */

const API_KEY = process.env.API_KEY;

/**
 * Extract hostname from a URL string safely.
 * Returns empty string if the URL is invalid.
 */
function getHostname(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

function isAuthenticated(request: NextRequest): boolean {
  // When no API_KEY is configured, skip auth (local dev)
  if (!API_KEY) return true;

  // Same-origin requests from the app's own frontend are trusted.
  // Use proper URL parsing to prevent substring bypass
  // (e.g. "evil-example.com".includes("example.com") would be true with .includes())
  const host = request.headers.get("host") || "";
  const refererHost = getHostname(request.headers.get("referer") || "");
  const originHost = getHostname(request.headers.get("origin") || "");

  if (
    (refererHost && refererHost === host) ||
    (originHost && originHost === host)
  ) {
    return true;
  }

  // External requests must provide the API key
  const providedKey = request.headers.get("x-api-key");
  return providedKey === API_KEY;
}

/* ------------------------------------------------------------------ */
/*  Structured Logging (Edge-compatible — pino unavailable here)       */
/* ------------------------------------------------------------------ */

function logSecurityEvent(
  event: string,
  meta: { route: string; ip: string }
) {
  console.warn(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "warn",
      event,
      ...meta,
    })
  );
}

/* ------------------------------------------------------------------ */
/*  Middleware                                                         */
/* ------------------------------------------------------------------ */

export function middleware(request: NextRequest) {
  const ip = getClientIp(request);
  const route = request.nextUrl.pathname;

  // 1. Authentication check
  if (!isAuthenticated(request)) {
    logSecurityEvent("auth_rejected", { route, ip });
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  // 2. Rate limiting check
  if (isRateLimited(ip)) {
    logSecurityEvent("rate_limited", { route, ip });
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
