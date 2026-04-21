import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { images } from "@/data/images"

/** Mission & Vision section — Talha layout (gradient, two columns, objectives list) with app color scheme */
export function MissionVisionTalha({ lang }: { lang: Locale }) {
  const t = content[lang].vision
  return (
    <section
      id="mission"
      aria-labelledby="vision-heading"
      className="relative overflow-hidden bg-black py-24"
    >
      <div className="wrap">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {lang === "en" ? "Our Mission" : "ہمارا مشن"}
          </p>
          <div className="h-px w-8 bg-[var(--color-accent)]" />
        </div>
        <h2
          id="vision-heading"
          className="font-display mt-4 text-center text-balance break-words text-3xl font-semibold text-[var(--color-text)] md:text-4xl"
        >
          {t.title}
        </h2>
        <p className="mx-auto mt-6 max-w-4xl px-1 text-center text-pretty break-words text-lg leading-relaxed text-[var(--color-text-muted)] sm:px-0">
          {t.intro}
        </p>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[var(--color-text)]">
              {lang === "en" ? "Key Objectives" : "اہم مقاصد"}
            </h3>
            <ul className="mt-4 flex flex-col items-center gap-4">
              {t.cards.map((card, i) => (
                <li key={i} className="flex max-w-xl min-w-0 items-start gap-3 text-left text-[var(--color-text-muted)]">
                  <span
                    className="mt-1 flex-shrink-0 text-[var(--color-accent)]"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 text-pretty break-words">
                    <strong className="text-[var(--color-text)]">{card.title}</strong>
                    {" — "}
                    {card.body}
                  </span>
                </li>
              ))}
            </ul>
            {"objectives" in t && t.objectives && (
              <div className="mt-7 text-left">
                <p className="max-w-xl text-pretty break-words text-[var(--color-text-muted)]">{t.objectives}</p>
              </div>
            )}
          </div>
          <div className="relative h-80 overflow-hidden rounded-xl shadow-2xl ring-1 ring-[var(--color-border)] sm:h-96 lg:min-h-[480px]">
            <img
              src={images.missionVision}
              alt="Pak-Palestine Forum protest and awareness campaign in Pakistan"
              className="h-full w-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
          </div>
        </div>
      </div>
    </section>
  )
}
