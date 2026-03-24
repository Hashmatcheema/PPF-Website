import type { VercelRequest, VercelResponse } from "@vercel/node"

function mergeOriginSets(): Set<string> {
  const out = new Set<string>()
  const fromList = process.env.ALLOWED_ORIGINS ?? process.env.CORS_ORIGIN ?? ""
  for (const part of fromList.split(",")) {
    const s = part.trim()
    if (s) out.add(s)
  }
  if (process.env.VERCEL_URL) {
    out.add(`https://${process.env.VERCEL_URL}`)
  }
  return out
}

export function parseAllowedOrigins(): Set<string> {
  return mergeOriginSets()
}

function sameHostAsRequest(origin: string, host: string | undefined): boolean {
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/**
 * Set CORS headers when Origin is allowed or missing (non-browser / same-site).
 * Allows configured origins, preview URLs, and same-host Origin (production custom domain).
 * Returns false if Origin is present but not allowed.
 */
export function setCorsHeaders(
  req: VercelRequest,
  res: VercelResponse,
  allowed: Set<string>
): boolean {
  const origin = req.headers.origin
  if (!origin || origin === "null") {
    return true
  }
  const o = String(origin)
  const host = req.headers.host
  if (!allowed.has(o) && !sameHostAsRequest(o, host)) {
    return false
  }
  res.setHeader("Access-Control-Allow-Origin", o)
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Vary", "Origin")
  return true
}
