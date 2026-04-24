import type { VercelRequest, VercelResponse } from "@vercel/node"
import { put } from "@vercel/blob"
import { forbidWithoutCors, handleCorsPreflight } from "../../server/lib/http.js"
import { requireAdminUser } from "../../server/lib/auth.js"
import { getJsonBody } from "../../server/lib/body.js"

/** With Vercel Blob token */
const MAX_BYTES = 1.8 * 1024 * 1024
/** Without Blob: embed as data URL in Redis — keep small for Upstash payload limits */
const MAX_EMBED_BYTES_NO_BLOB = 420 * 1024

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

  if (buffer.length === 0) {
    res.status(400).json({ error: "Empty image" })
    return
  }

  const token = String(process.env.BLOB_READ_WRITE_TOKEN ?? "").trim()

  if (!token) {
    if (buffer.length > MAX_EMBED_BYTES_NO_BLOB) {
      res.status(413).json({
        error: `Without BLOB_READ_WRITE_TOKEN, images must be under ${Math.floor(MAX_EMBED_BYTES_NO_BLOB / 1024)} KB. Compress the file, add a Vercel Blob token for larger uploads, or use an /images/… URL.`,
      })
      return
    }
    const dataUrl = `data:${mimeType};base64,${base64}`
    res.status(200).json({
      url: dataUrl,
      embedded: true,
      hint: "Stored as embedded data when you click Save (no Blob). Add BLOB_READ_WRITE_TOKEN for larger files.",
    })
    return
  }

  if (buffer.length > MAX_BYTES) {
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
