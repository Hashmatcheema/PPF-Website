import type { Locale } from "@/data/content"
import type { CtasConfig } from "@/data/ctasSchema"
import {
  ppfCtaHeaderSolidPaintClassName,
  ppfCtaPrimaryClassName,
} from "@/lib/ppfCtaButton"
import { cn } from "@/lib/utils"

type JoinUsButtonProps = {
  lang: Locale
  ctas: CtasConfig
  className?: string
  variant?: "primary" | "header"
  /** When variant is header: true = scrolled (solid bg), false = transparent */
  solid?: boolean
}

export function JoinUsButton({ lang, ctas, className, variant = "primary", solid = false }: JoinUsButtonProps) {
  const hasJoinUrl = Boolean(ctas.joinUrl?.trim())

  const label = ctas.joinLabel[lang]

  const baseClass =
    variant === "header"
      ? solid
        ? "hidden items-center justify-center md:inline-flex"
        : "hidden items-center justify-center md:inline-flex"
      : ppfCtaPrimaryClassName()

  const headerVariantClass =
    variant === "header"
      ? solid
        ? ppfCtaHeaderSolidPaintClassName()
        : "rounded-full px-4 py-2 text-sm font-medium bg-white/10 text-white hover:bg-white/20"
      : ""

  return (
    <>
      {hasJoinUrl ? (
        <a
          href={ctas.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(baseClass, headerVariantClass, className)}
        >
          {label}
        </a>
      ) : (
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdwj320Vrztwsz5QbK9dOzIALaUhShFgSwfsw-LWbKkGoKCZg/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(baseClass, headerVariantClass, className)}
        >
          {label}
        </a>
      )}

    </>
  )
}
