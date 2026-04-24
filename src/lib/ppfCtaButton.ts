import { cn } from "@/lib/utils"

/** Solid CTA fill, type, focus — compose with layout + sizing. */
export const ppfCtaSolid =
  "font-semibold text-[var(--color-on-cta)] bg-[var(--color-cta)] shadow-[0_8px_28px_rgba(255,31,34,0.28)] transition-all duration-200 hover:bg-[var(--color-cta-hover)] hover:shadow-[0_10px_36px_rgba(255,31,34,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)] disabled:pointer-events-none disabled:opacity-50"

/** Row / block primary actions (links & buttons). */
export const ppfCtaFlex =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full"

export function ppfCtaPrimaryClassName(className?: string) {
  return cn(ppfCtaFlex, ppfCtaSolid, "min-h-12 px-8 text-sm", className)
}

/** Nav / dense toolbar (still same fill as primary). */
export function ppfCtaPrimaryCompactClassName(className?: string) {
  return cn(ppfCtaFlex, ppfCtaSolid, "min-h-9 px-4 text-sm", className)
}

/** Same paint as compact, without `inline-flex` — pair with `hidden md:inline-flex`. */
export function ppfCtaHeaderSolidPaintClassName(className?: string) {
  return cn(ppfCtaSolid, "min-h-9 rounded-full px-4 text-sm", className)
}

/** Icon-only round control (FAB, square circle). */
export function ppfCtaIconCircleClassName(className?: string) {
  return cn(ppfCtaFlex, ppfCtaSolid, className)
}
