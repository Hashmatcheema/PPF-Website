import type { VercelRequest, VercelResponse } from "@vercel/node"
import { forbidWithoutCors, handleCorsPreflight } from "../lib/http"
import { requireAdminUser } from "../lib/auth"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (handleCorsPreflight(req, res)) return
  if (forbidWithoutCors(req, res)) return

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS")
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const user = requireAdminUser(req)
  if (!user) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  res.status(200).json({ ok: true, user })
}
