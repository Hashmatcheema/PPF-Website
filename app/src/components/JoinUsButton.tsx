import type { Locale } from "@/data/content"
import type { CtasConfig } from "@/data/ctasSchema"
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
      ? "hidden rounded-md px-4 py-2 text-sm font-medium md:inline-block"
      : "inline-flex h-12 items-center justify-center rounded-md bg-[var(--color-accent)] px-8 font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"

  const headerVariantClass =
    variant === "header"
      ? solid
        ? "bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)]"
        : "bg-white/10 text-white hover:bg-white/20"
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
