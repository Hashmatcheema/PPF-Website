import { useEffect, useRef, useState } from "react"

/** Split display strings like "300+", "3.5M+", "PKR 10M+", "24/7" into animatable numeric + suffix */
function parseStatParts(value: string): { prefix: string; num: number; decimals: number; suffix: string; skip: boolean } {
  const t = value.trim()
  if (/^\d+\s*\/\s*\d+/.test(t)) {
    return { prefix: "", num: 0, decimals: 0, suffix: value, skip: true }
  }
  const m = value.match(/^(.+?)(\d+(?:[.,]\d+)?)(.*)$/s)
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

export function AnimatedStatValue({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { prefix, num, decimals, suffix, skip } = parseStatParts(value)
  // Avoid confusing intermediate values (e.g. "30+") for large stats during the count-up.
  const shouldAnimate = !skip && num < 100
  const [shown, setShown] = useState(shouldAnimate ? 0 : num)
  const started = useRef(false)

  useEffect(() => {
    if (!shouldAnimate) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - (1 - t) ** 3
          setShown(num * eased)
          if (t < 1) requestAnimationFrame(tick)
          else setShown(num)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [num, shouldAnimate])

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
