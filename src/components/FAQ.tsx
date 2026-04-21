import { useState } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { FaqJoinHowAnswer } from "@/components/FaqJoinHowAnswer"

export function FAQ({ lang }: { lang: Locale }) {
  const t = content[lang].faq
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-24 md:py-32">
      <div className="wrap">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          FAQ
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold text-[var(--color-text)] md:text-4xl">
          {t.title}
        </h2>
        <div className="mt-12 space-y-0 border-t border-[var(--color-border)]">
          {t.items.map((item, i) => (
            <div
              key={i}
              className="border-b border-[var(--color-border)]"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
              >
                <span>{item.q}</span>
                <span className="text-[var(--color-text-muted)]">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="whitespace-pre-line pb-5 pr-8 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {"rich" in item && item.rich === "joinHow" ? (
                    <FaqJoinHowAnswer lang={lang} />
                  ) : (
                    "a" in item && item.a
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
