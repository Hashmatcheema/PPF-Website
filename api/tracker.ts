import type { VercelRequest, VercelResponse } from "@vercel/node"
import { handleCorsPreflight, forbidWithoutCors } from "../server/lib/http.js"
import {
  readTrackerState,
  TRACKER_READ_FAILED,
} from "../server/lib/tracker.js"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (handleCorsPreflight(req, res)) return
  if (forbidWithoutCors(req, res)) return

  if (req.method === "GET") {
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

  res.setHeader("Allow", "GET, OPTIONS")
  res.status(405).json({ error: "Method not allowed" })
}
