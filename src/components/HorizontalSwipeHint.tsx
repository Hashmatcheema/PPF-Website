import { ChevronLeft, ChevronRight } from "lucide-react"

/** White + soft shadow so chevrons + label read on dark sections and photos */
const swipeCueClass = "text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.82)]"

const toneClass = {
  /** Default (Join, Locations, etc.) */
  red: swipeCueClass,
  impact: swipeCueClass,
} as const

export type HorizontalSwipeHintTone = keyof typeof toneClass

type Props = {
  label: string
  tone?: HorizontalSwipeHintTone
  className?: string
}

/** Swipe cue: chevrons + label in white (`tone` kept for call-site clarity). */
export function HorizontalSwipeHint({ label, tone = "red", className }: Props) {
  return (
    <p
      className={`flex w-full items-center justify-center gap-1.5 text-center text-[9px] font-medium leading-none sm:text-[10px] ${toneClass[tone]}${className ? ` ${className}` : ""}`}
    >
      <ChevronLeft className="size-3 shrink-0 opacity-60 sm:size-3.5" strokeWidth={2} aria-hidden />
      <span className="text-pretty">{label}</span>
      <ChevronRight className="size-3 shrink-0 opacity-60 sm:size-3.5" strokeWidth={2} aria-hidden />
    </p>
  )
}
