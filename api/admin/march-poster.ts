import type { VercelRequest, VercelResponse } from "@vercel/node"
import { put } from "@vercel/blob"
import { forbidWithoutCors, handleCorsPreflight } from "../lib/http.js"
import { requireAdminUser } from "../lib/auth.js"
import { getJsonBody } from "../lib/body.js"

const MAX_BYTES = 1.8 * 1024 * 1024

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

function extForMime(mime: string): string {
  if (mime === "image/jpeg") return ".jpg"
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  if (mime === "image/gif") return ".gif"
  return ""
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

  if (!requireAdminUser(req)) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    res.status(503).json({
      error:
        "Upload is not configured (missing BLOB_READ_WRITE_TOKEN). Paste an https:// image URL in the poster field, or add a Vercel Blob token for this project.",
    })
    return
  }

  const raw = getJsonBody(req)
  if (!raw || typeof raw !== "object") {
    res.status(400).json({ error: "JSON body required" })
    return
  }
  const body = raw as Record<string, unknown>
  const base64 =
    typeof body.base64 === "string" ? body.base64.replace(/\s/g, "") : ""
  const mimeType = typeof body.mimeType === "string" ? body.mimeType.trim() : ""

  if (!base64) {
    res.status(400).json({ error: "base64 is required" })
    return
  }
  if (!ALLOWED_MIME.has(mimeType)) {
    res.status(400).json({ error: "mimeType must be a supported image type" })
    return
  }

  const ext = extForMime(mimeType)
  if (!ext) {
    res.status(400).json({ error: "Unsupported image type" })
    return
  }

  let buffer: Buffer
  try {
    buffer = Buffer.from(base64, "base64")
  } catch {
    res.status(400).json({ error: "Invalid base64" })
    return
  }

  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    res.status(400).json({ error: `Image must be under ${Math.floor(MAX_BYTES / (1024 * 1024))} MB` })
    return
  }

  try {
    const pathname = `ppf/march-poster${ext}`
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType: mimeType,
      token,
      addRandomSuffix: true,
    })
    res.status(200).json({ url: blob.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed"
    res.status(500).json({ error: msg })
  }
}
