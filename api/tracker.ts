import type { VercelRequest, VercelResponse } from "@vercel/node"
import { handleCorsPreflight, forbidWithoutCors } from "../server/lib/http.js"
import { readTrackerState } from "../server/lib/tracker.js"

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
    } catch {
      res.status(500).json({ error: "Failed to read tracker state" })
    }
    return
  }

  res.setHeader("Allow", "GET, OPTIONS")
  res.status(405).json({ error: "Method not allowed" })
}
