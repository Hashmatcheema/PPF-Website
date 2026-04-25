import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  forbidWithoutCors,
  getClientIp,
  handleCorsPreflight,
} from "../../server/lib/http.js"
import { requireAdminUser } from "../../server/lib/auth.js"
import { ratelimitCtasPut } from "../../server/lib/ratelimit.js"
import { getJsonBody } from "../../server/lib/body.js"
import {
  readTrackerState,
  addTrackerLocation,
  clearTrackerHistory,
} from "../../server/lib/tracker.js"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (handleCorsPreflight(req, res)) return
  if (forbidWithoutCors(req, res)) return

  // GET: retrieve current tracker state
  if (req.method === "GET") {
    const admin = requireAdminUser(req)
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    try {
      const state = await readTrackerState()
      res.status(200).json(state)
    } catch {
      res.status(500).json({ error: "Failed to read tracker state" })
    }
    return
  }

  // PUT: update tracker location
  if (req.method === "PUT") {
    const ip = getClientIp(req)
    const rl = ratelimitCtasPut()
    if (rl) {
      const { success } = await rl.limit(ip)
      if (!success) {
        res.status(429).json({ error: "Too many requests" })
        return
      }
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

      const { lat, lng, message } = body as Record<string, unknown>

      // Validate coordinates
      if (typeof lat !== "number" || typeof lng !== "number") {
        res.status(400).json({ error: "Invalid coordinates" })
        return
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        res.status(400).json({ error: "Coordinates out of range" })
        return
      }

      const msg = typeof message === "string" ? message.trim() : ""
      if (msg.length > 500) {
        res.status(400).json({ error: "Message too long (max 500 chars)" })
        return
      }

      const state = await addTrackerLocation(lat, lng, msg)
      res.status(200).json(state)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ""
      if (msg === "REDIS_NOT_CONFIGURED") {
        res.status(503).json({
          error: "Tracker storage not configured (set Upstash Redis in .env.local).",
        })
        return
      }
      res.status(500).json({ error: "Failed to update tracker" })
    }
    return
  }

  // DELETE: clear tracker history
  if (req.method === "DELETE") {
    const admin = requireAdminUser(req)
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    try {
      const state = await clearTrackerHistory()
      res.status(200).json(state)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ""
      if (msg === "REDIS_NOT_CONFIGURED") {
        res.status(503).json({
          error: "Tracker storage not configured (set Upstash Redis in .env.local).",
        })
        return
      }
      res.status(500).json({ error: "Failed to clear tracker" })
    }
    return
  }

  res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS")
  res.status(405).json({ error: "Method not allowed" })
}
