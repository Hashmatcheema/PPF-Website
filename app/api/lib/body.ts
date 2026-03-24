import type { VercelRequest } from "@vercel/node"

export function getJsonBody(req: VercelRequest): unknown {
  const b = req.body
  if (b == null || b === "") return null
  if (typeof b === "string") {
    try {
      return JSON.parse(b) as unknown
    } catch {
      return null
    }
  }
  if (typeof b === "object") return b
  return null
}
