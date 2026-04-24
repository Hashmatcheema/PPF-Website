/** Without Vercel Blob: embedded data URL in Redis (sync `api/admin/march-poster.ts`). */
export const MARCH_POSTER_MAX_EMBED_BYTES = 420 * 1024

/** With Blob: server accepts up to this (sync `api/admin/march-poster.ts` MAX_BYTES). */
export const MARCH_POSTER_MAX_BLOB_BYTES = Math.floor(1.8 * 1024 * 1024)

/** Client upload pick limit when Blob is on — slightly under server cap after base64 overhead. */
export const MARCH_POSTER_MAX_BLOB_CLIENT_BYTES = Math.floor(1.65 * 1024 * 1024)

export function formatPosterSizeLimit(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}
