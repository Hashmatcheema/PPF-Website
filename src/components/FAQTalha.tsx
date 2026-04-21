import { useState } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { FaqJoinHowAnswer } from "@/components/FaqJoinHowAnswer"

/** FAQ section — Talha layout (centered label, accordion cards) with app color scheme */
export function FAQTalha({ lang }: { lang: Locale }) {
  const t = content[lang].faq
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-black py-24"
    >
      <div className="wrap">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {lang === "en" ? "Common Questions" : "عام سوالات"}
          </p>
          <div className="h-px w-8 bg-[var(--color-accent)]" />
        </div>
        <h2
          id="faq-heading"
          className="font-display mt-4 text-center text-balance break-words text-3xl font-semibold text-[var(--color-text)] md:text-4xl"
        >
          {t.title}
        </h2>
        <div className="mt-10 space-y-2">
          {t.items.map((item, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl border backdrop-blur-sm transition-colors duration-200 ${
                openFaq === i
                  ? "border-white/20 bg-white/[0.08]"
                  : "border-white/10 bg-white/[0.06] hover:border-white/20 hover:bg-white/[0.08]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.06] sm:px-6 sm:py-4"
                aria-expanded={openFaq === i}
              >
                <span className="min-w-0 flex-1 pr-1 font-semibold text-[var(--color-text)] sm:pr-4">
                  <span className="text-pretty break-words">{item.q}</span>
                </span>
                <span
                  className={`flex-shrink-0 text-[var(--color-text)] transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="border-t border-white/5 px-4 pb-4 pt-1 text-pretty break-words whitespace-pre-line text-[var(--color-text-muted)] sm:px-6 sm:pb-5 sm:pt-0">
                  {"rich" in item && item.rich === "joinHow" ? (
                    <FaqJoinHowAnswer lang={lang} />
                  ) : (
                    "a" in item && item.a
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
