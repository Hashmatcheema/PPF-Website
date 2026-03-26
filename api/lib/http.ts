import type { VercelRequest, VercelResponse } from "@vercel/node"
import { parseAllowedOrigins, setCorsHeaders } from "./cors.js"

export function getClientIp(req: VercelRequest): string {
  const xf = req.headers["x-forwarded-for"]
  if (typeof xf === "string" && xf.trim()) {
    return xf.split(",")[0]?.trim() ?? "unknown"
  }
  if (Array.isArray(xf) && xf[0]) {
    return String(xf[0]).split(",")[0]?.trim() ?? "unknown"
  }
  return (req.socket?.remoteAddress as string | undefined) || "unknown"
}

/** Returns true if preflight was handled; response already sent. */
export function handleCorsPreflight(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== "OPTIONS") return false
  const allowed = parseAllowedOrigins()
  if (!setCorsHeaders(req, res, allowed)) {
    res.status(403).end()
    return true
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Max-Age", "86400")
  res.status(204).end()
  return true
}

export function forbidWithoutCors(req: VercelRequest, res: VercelResponse): boolean {
  const allowed = parseAllowedOrigins()
  if (!setCorsHeaders(req, res, allowed)) {
    res.status(403).json({ error: "Forbidden" })
    return true
  }
  return false
}
