/** Stable short fingerprint for cache keys when deploy tag is unset (e.g. local dev). */
function urlFingerprint(s: string): string {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

/**
 * Same-origin `/images/…` posters are cached aggressively by path alone.
 * Append a query so new deploys (or a changed URL string) fetch fresh bytes.
 */
export function posterSrcForDisplay(url: string): string {
  const u = url.trim()
  if (!u) return u
  if (u.startsWith("data:") || /^https?:\/\//i.test(u)) return u
  if (!u.startsWith("/") || u.startsWith("//")) return u

  const deploy =
    typeof __PPF_DEPLOY_TAG__ === "string" && __PPF_DEPLOY_TAG__.length > 0
      ? __PPF_DEPLOY_TAG__.slice(0, 16)
      : ""
  const id = deploy || urlFingerprint(u)
  const sep = u.includes("?") ? "&" : "?"
  return `${u}${sep}ppf=${encodeURIComponent(id)}`
}
