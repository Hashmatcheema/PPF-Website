const EM_DASH = /\u2014/g
const EN_DASH = /\u2013/g

/**
 * Replaces Unicode dashes in user-facing strings so copy files can keep em dashes.
 * Em dash → comma + space (typical clause break); en dash → ASCII hyphen (ranges, pairs).
 * Collapses accidental double commas from adjacent em dashes.
 */
export function stripEmDashes(s: string): string {
  return s
    .replace(EM_DASH, ", ")
    .replace(EN_DASH, "-")
    .replace(/,\s*,/g, ",")
}

/** Deep walk: only string leaves are transformed (objects/arrays cloned shallowly per level). */
export function stripEmDashesDeep<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value === "string") return stripEmDashes(value) as T
  if (Array.isArray(value)) return value.map(stripEmDashesDeep) as T
  if (typeof value === "object") {
    const o = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(o)) {
      out[k] = stripEmDashesDeep(o[k])
    }
    return out as T
  }
  return value
}
