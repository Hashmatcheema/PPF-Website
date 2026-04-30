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
  deleteTrackerHistoryEntry,
  removeCurrentTrackerLocation,
  TRACKER_READ_FAILED,
} from "../../server/lib/tracker.js"

function firstQueryParam(
  q: string | string[] | undefined
): string | undefined {
  if (q == null) return undefined
  return Array.isArray(q) ? q[0] : q
}

function hasOwnQueryParam(
  q: VercelRequest["query"] | undefined,
  key: string
): boolean {
  return Boolean(q && Object.prototype.hasOwnProperty.call(q, key))
}

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
    } catch (e) {
      const msg = e instanceof Error ? e.message : ""
      if (msg === TRACKER_READ_FAILED) {
        res
          .status(503)
          .json({ error: "Tracker temporarily unavailable" })
        return
      }
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
      if (msg === TRACKER_READ_FAILED) {
        res
          .status(503)
          .json({ error: "Tracker temporarily unavailable" })
        return
      }
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

  // DELETE: ?historyIndex=n (one history row), ?current=1 (remove live pin; revert if possible), else clear all
  if (req.method === "DELETE") {
    const admin = requireAdminUser(req)
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const rawIdx =
      firstQueryParam(req.query?.historyIndex as string | string[] | undefined) ??
      firstQueryParam(req.query?.history_index as string | string[] | undefined)
    const rawCurrent = firstQueryParam(
      req.query?.current as string | string[] | undefined
    )

    const hasHistoryIndex =
      rawIdx !== undefined && String(rawIdx).trim() !== ""
    const currentKeyPresent = hasOwnQueryParam(req.query, "current")

    try {
      if (hasHistoryIndex && currentKeyPresent) {
        res.status(400).json({
          error: "Specify only one of historyIndex or current",
        })
        return
      }

      if (hasHistoryIndex) {
        const index = Number.parseInt(String(rawIdx).trim(), 10)
        if (!Number.isFinite(index)) {
          res.status(400).json({ error: "Invalid historyIndex" })
          return
        }
        const state = await deleteTrackerHistoryEntry(index)
        res.status(200).json(state)
        return
      }

      if (currentKeyPresent) {
        const v = String(rawCurrent ?? "").trim().toLowerCase()
        if (v === "" || !["1", "true", "yes"].includes(v)) {
          res.status(400).json({ error: "Invalid current parameter" })
          return
        }
        const state = await removeCurrentTrackerLocation()
        res.status(200).json(state)
        return
      }

      const state = await clearTrackerHistory()
      res.status(200).json(state)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ""
      if (msg === "INVALID_HISTORY_INDEX") {
        res.status(400).json({ error: "Invalid history index" })
        return
      }
      if (msg === "NO_CURRENT_LOCATION") {
        res.status(400).json({ error: "No current location to remove" })
        return
      }
      if (msg === TRACKER_READ_FAILED) {
        res
          .status(503)
          .json({ error: "Tracker temporarily unavailable" })
        return
      }
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

  res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS")
  res.status(405).json({ error: "Method not allowed" })
}
