import { useState } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { FaqJoinHowAnswer } from "@/components/FaqJoinHowAnswer"

/** FAQ section — Talha layout (centered label, accordion cards) with app color scheme */
export function FAQTalha({ lang }: { lang: Locale }) {
  const t = content[lang].faq
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-[var(--color-bg)] py-16 sm:py-20 md:py-24">
      <div className="wrap">
        <div className="mb-4 flex items-center justify-center gap-2 sm:mb-5 sm:gap-3">
          <div className="h-px w-6 bg-[var(--color-accent)] sm:w-8" />
          <p className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-label-red)] sm:text-xs sm:tracking-[0.25em]">
            {lang === "en" ? "Common Questions" : "عام سوالات"}
          </p>
          <div className="h-px w-6 bg-[var(--color-accent)] sm:w-8" />
        </div>
        <h2
          id="faq-heading"
          className="font-display mt-3 text-center text-balance break-words text-2xl font-semibold leading-tight text-[var(--color-text)] sm:mt-4 sm:text-3xl md:text-4xl"
        >
          {t.title}
        </h2>
        <div className="mt-8 space-y-2.5 sm:mt-10 sm:space-y-3">
          {t.items.map((item, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-lg border backdrop-blur-sm transition-colors duration-200 sm:rounded-xl ${
                openFaq === i
                  ? "border-white/20 bg-white/[0.08]"
                  : "border-white/10 bg-white/[0.06] hover:border-white/20 hover:bg-white/[0.08]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex min-h-[3rem] w-full min-w-0 touch-manipulation items-start justify-between gap-2 px-3 py-3.5 text-left transition-colors hover:bg-white/[0.06] active:bg-white/[0.05] sm:min-h-0 sm:items-center sm:gap-3 sm:px-6 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-expanded={openFaq === i}
              >
                <span className="min-w-0 flex-1 py-0.5 font-semibold leading-snug text-[var(--color-text)] sm:py-0 sm:pr-4 sm:leading-normal">
                  <span className="text-pretty text-sm break-words sm:text-base">{item.q}</span>
                </span>
                <span
                  className={`mt-0.5 flex shrink-0 text-[var(--color-text)] transition-transform duration-200 sm:mt-0 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="border-t border-white/5 px-3 pb-4 pt-2 text-pretty break-words text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-line sm:px-6 sm:pb-5 sm:pt-1 sm:text-base">
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
