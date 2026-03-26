import type { VercelRequest, VercelResponse } from "@vercel/node"
import { forbidWithoutCors, handleCorsPreflight } from "../lib/http"
import { clearAuthCookie } from "../lib/auth"

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

  clearAuthCookie(res)
  res.status(200).json({ ok: true })
}
