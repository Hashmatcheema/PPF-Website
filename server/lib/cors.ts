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

function isLoopbackHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname === "0.0.0.0"
  )
}

function parseHostHeaderUrl(host: string): URL | null {
  try {
    if (/^[a-z]+:\/\//i.test(host)) return new URL(host)
    return new URL(`http://${host}`)
  } catch {
    return null
  }
}

/**
 * Vite dev (e.g. :5173) proxies `/api` to `vercel dev` on :3000 with `changeOrigin`, so `Host` is the API
 * host while `Origin` is the page — both loopback but not equal strings. Without this, credentialed
 * `/api/admin/login` gets 403 unless `ALLOWED_ORIGINS` lists every dev origin.
 */
function isLocalLoopbackDevPair(origin: string, hostHeader: string | undefined): boolean {
  if (!hostHeader) return false
  try {
    const o = new URL(origin)
    const h = parseHostHeaderUrl(hostHeader)
    if (!h) return false
    if (o.protocol !== "http:" && o.protocol !== "https:") return false
    if (h.protocol !== "http:" && h.protocol !== "https:") return false
    return isLoopbackHostname(o.hostname) && isLoopbackHostname(h.hostname)
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
  if (!allowed.has(o) && !sameHostAsRequest(o, host) && !isLocalLoopbackDevPair(o, host)) {
    return false
  }
  res.setHeader("Access-Control-Allow-Origin", o)
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Vary", "Origin")
  return true
}
