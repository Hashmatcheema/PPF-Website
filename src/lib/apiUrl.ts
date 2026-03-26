/**
 * Remote API base for CTAs, admin, contact.
 * - Empty VITE_CTAS_API_URL: same-origin `/api/*` (Vercel serverless + static).
 * - Set to e.g. http://localhost:3001 when using the Express dev server.
 * - VITE_NO_API=1: skip server (bundled defaults + optional client-only admin for local demos).
 */
export const DISABLE_REMOTE_API = import.meta.env.VITE_NO_API === "1"

export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_CTAS_API_URL ?? "").replace(/\/$/, "")
  if (base) return `${base}${path}`
  return path
}
