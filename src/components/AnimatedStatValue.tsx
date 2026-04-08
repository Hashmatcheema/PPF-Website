import { useEffect, useRef, useState } from "react"

/** Split display strings like "300+", "3.5M+", "PKR 10M+", "24/7" into animatable numeric + suffix */
function parseStatParts(value: string): { prefix: string; num: number; decimals: number; suffix: string; skip: boolean } {
  const t = value.trim()
  if (/^\d+\s*\/\s*\d+/.test(t)) {
    return { prefix: "", num: 0, decimals: 0, suffix: value, skip: true }
  }
  // Use \D* (not .+?) so we never swallow leading digits — e.g. "300+" stays 300, not 30.
  const m = t.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/s)
  if (!m) {
    return { prefix: "", num: 0, decimals: 0, suffix: value, skip: true }
  }
  const [, prefix, numRaw, suffix] = m
  const normalized = numRaw.replace(/,/g, "")
  const num = parseFloat(normalized)
  if (Number.isNaN(num)) {
    return { prefix: prefix ?? "", num: 0, decimals: 0, suffix: value, skip: true }
  }
  const decimals = normalized.includes(".") ? normalized.split(".")[1]?.length ?? 0 : 0
  return { prefix: prefix ?? "", num, decimals, suffix: suffix ?? "", skip: false }
}

function formatNum(n: number, decimals: number): string {
  if (decimals > 0) return n.toFixed(decimals)
  return Math.round(n).toLocaleString("en-US")
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/** Waypoints for a gradual count-up on decimals in a small range (e.g. 3.5M+ → 1, 2, 2.5, …, 3.5). */
function decimalWaypoints(target: number, decimals: number): number[] {
  const d = Math.min(6, Math.max(0, decimals))
  const roundTo = (x: number) => {
    const p = 10 ** d
    return Math.round(x * p) / p
  }

  const w: number[] = [0]
  if (target <= 0) return [0]

  const cap = Math.min(target, 12)
  let i = 1
  while (i < Math.floor(cap)) {
    w.push(i)
    i += 1
  }

  const f = Math.floor(target)
  if (f >= 1 && target > f && f - 0.5 >= 1 && !w.includes(f - 0.5)) {
    w.push(roundTo(f - 0.5))
  }
  if (!w.includes(f) && f > 0 && target >= f) w.push(f)

  let x = f + 0.2
  while (x < target - 10 ** -(d + 1)) {
    w.push(roundTo(x))
    x += 0.2
  }

  if (!w.some((v) => Math.abs(v - target) < 10 ** -(d + 1))) w.push(roundTo(target))
  // monotone unique
  const out: number[] = []
  let last = -Infinity
  for (const v of w.sort((a, b) => a - b)) {
    if (v > last + 10 ** -(d + 2)) {
      out.push(v)
      last = v
    }
  }
  if (out[out.length - 1] !== roundTo(target)) out.push(roundTo(target))
  return out
}

function valueAlongWaypoints(waypoints: number[], t: number): number {
  if (waypoints.length === 0) return 0
  if (waypoints.length === 1) return waypoints[0] ?? 0
  const u = Math.min(1, Math.max(0, t))
  const max = waypoints.length - 1
  const pos = u * max
  const i = Math.min(max - 1, Math.floor(pos))
  const f = pos - i
  const a = waypoints[i] ?? 0
  const b = waypoints[i + 1] ?? a
  return a + (b - a) * f
}

export function AnimatedStatValue({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { prefix, num, decimals, suffix, skip } = parseStatParts(value)
  const shouldAnimate = !skip
  const waypointsRef = useRef<number[]>([])
  const [shown, setShown] = useState(shouldAnimate ? 0 : num)
  const started = useRef(false)

  useEffect(() => {
    if (!shouldAnimate) return
    waypointsRef.current =
      decimals > 0 && num > 0 && num <= 12
        ? decimalWaypoints(num, decimals)
        : decimals > 0 && num > 12
          ? [0, num]
          : [0, num]
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const duration = decimals > 0 && num <= 12 ? 2400 : num >= 200 ? 2600 : 1800
        const tick = (now: number) => {
          const rawT = Math.min(1, (now - start) / duration)
          const t = easeOutCubic(rawT)
          const w = waypointsRef.current
          const next =
            w.length > 2 ? valueAlongWaypoints(w, t) : num * t
          setShown(next)
          if (rawT < 1) requestAnimationFrame(tick)
          else setShown(num)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [num, decimals, shouldAnimate])

  if (!shouldAnimate) {
    return (
      <span ref={ref} className={className}>
        {skip ? value : `${prefix}${formatNum(num, decimals)}${suffix}`}
      </span>
    )
  }

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`.trim()}>
      {prefix}
      {formatNum(shown, decimals)}
      {suffix}
    </span>
  )
}
