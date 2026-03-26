import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  forbidWithoutCors,
  getClientIp,
  handleCorsPreflight,
} from "../lib/http.js"
import {
  adminCredentials,
  setAuthCookie,
} from "../lib/auth.js"
import { ratelimitLogin } from "../lib/ratelimit.js"
import { getJsonBody } from "../lib/body.js"

function clean(s: unknown): string {
  return String(s ?? "").replace(/\r/g, "").trim()
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (handleCorsPreflight(req, res)) return
  if (forbidWithoutCors(req, res)) return

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS")
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const cred = adminCredentials()
  if (!cred) {
    res.status(503).json({ error: "Admin login not configured" })
    return
  }

  const ip = getClientIp(req)
  const { success } = await ratelimitLogin().limit(ip)
  if (!success) {
    res.status(429).json({ error: "Too many requests" })
    return
  }

  const json = getJsonBody(req) as { username?: unknown; password?: unknown } | null
  const u = clean(json?.username)
  const p = clean(json?.password)

  if (u !== cred.user || p !== cred.pass) {
    res.status(401).json({ error: "Invalid credentials" })
    return
  }

  setAuthCookie(res, cred.user)
  res.status(200).json({ ok: true })
}
