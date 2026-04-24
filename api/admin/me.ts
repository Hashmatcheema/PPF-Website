import type { VercelRequest, VercelResponse } from "@vercel/node"
import { forbidWithoutCors, handleCorsPreflight } from "../../server/lib/http.js"
import { requireAdminUser } from "../../server/lib/auth.js"

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

  const marchPosterBlobUpload =
    String(process.env.BLOB_READ_WRITE_TOKEN ?? "").trim().length > 0

  res.status(200).json({ ok: true, user, marchPosterBlobUpload })
}
