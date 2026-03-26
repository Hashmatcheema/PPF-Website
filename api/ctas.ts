import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  forbidWithoutCors,
  getClientIp,
  handleCorsPreflight,
} from "./lib/http.js"
import { readCtas, writeCtas, mergeCtasPatch, parseCtasBody } from "./lib/ctas.js"
import { requireAdminUser } from "./lib/auth.js"
import { ratelimitCtasPut } from "./lib/ratelimit.js"
import { getJsonBody } from "./lib/body.js"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (handleCorsPreflight(req, res)) return
  if (forbidWithoutCors(req, res)) return

  if (req.method === "GET") {
    try {
      const ctas = await readCtas()
      res.status(200).json(ctas)
    } catch {
      res.status(500).json({ error: "Failed to read CTA config" })
    }
    return
  }

  if (req.method === "PUT") {
    const ip = getClientIp(req)
    const { success } = await ratelimitCtasPut().limit(ip)
    if (!success) {
      res.status(429).json({ error: "Too many requests" })
      return
    }

    const admin = requireAdminUser(req)
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    try {
      const body = getJsonBody(req)
      if (!body || typeof body !== "object") {
        res.status(400).json({ error: "JSON body required" })
        return
      }
      const merged = await mergeCtasPatch(body as Record<string, unknown>)
      const valid = parseCtasBody(merged)
      if (!valid) {
        res.status(400).json({ error: "Invalid CTA payload" })
        return
      }
      await writeCtas(valid)
      res.status(200).json(valid)
    } catch {
      res.status(500).json({ error: "Failed to write CTA config" })
    }
    return
  }

  res.setHeader("Allow", "GET, PUT, OPTIONS")
  res.status(405).json({ error: "Method not allowed" })
}
