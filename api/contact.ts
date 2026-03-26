import type { VercelRequest, VercelResponse } from "@vercel/node"
import { forbidWithoutCors, getClientIp, handleCorsPreflight } from "./lib/http"
import { getRedis, CONTACT_LIST_KEY } from "./lib/redis"
import { ratelimitContact } from "./lib/ratelimit"
import { getJsonBody } from "./lib/body"

const MAX_LIST = 500

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

  const ip = getClientIp(req)
  const { success } = await ratelimitContact().limit(ip)
  if (!success) {
    res.status(429).json({ error: "Too many requests" })
    return
  }

  try {
    const body = getJsonBody(req) as {
      name?: unknown
      email?: unknown
      message?: unknown
      website?: unknown
    } | null

    if (body?.website && String(body.website).trim()) {
      res.status(400).json({ error: "Invalid submission" })
      return
    }

    const name = body?.name != null ? String(body.name).slice(0, 200) : ""
    const email = body?.email != null ? String(body.email).slice(0, 254) : ""
    const message = body?.message != null ? String(body.message).slice(0, 5000) : ""

    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" })
      return
    }

    const entry = {
      name,
      email,
      message,
      at: new Date().toISOString(),
    }

    const r = getRedis()
    await r.rpush(CONTACT_LIST_KEY, JSON.stringify(entry))
    await r.ltrim(CONTACT_LIST_KEY, -MAX_LIST, -1)

    res.status(201).json({ ok: true })
  } catch {
    res.status(500).json({ error: "Failed to save submission" })
  }
}
