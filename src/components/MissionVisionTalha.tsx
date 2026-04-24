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
      className="relative overflow-hidden bg-[var(--color-bg)] py-16 sm:py-20 md:py-24"
    >
      <div className="wrap">
        <div className="mb-4 flex items-center justify-center gap-2 sm:mb-5 sm:gap-3">
          <div className="h-px w-6 bg-[var(--color-accent)] sm:w-8" />
          <p className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-label-red)] sm:text-xs sm:tracking-[0.25em]">
            {lang === "en" ? "Our Mission" : "ہمارا مشن"}
          </p>
          <div className="h-px w-6 bg-[var(--color-accent)] sm:w-8" />
        </div>
        <h2
          id="vision-heading"
          className="font-display mt-3 text-center text-balance break-words text-2xl font-semibold leading-tight text-[var(--color-text)] sm:mt-4 sm:text-3xl md:text-4xl"
        >
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-4xl px-0 text-center text-pretty break-words text-base leading-relaxed text-[var(--color-text-muted)] sm:mt-6 sm:px-0 sm:text-lg">
          {t.intro}
        </p>
      </div>
      <div className="relative mx-auto mt-8 max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="w-full min-w-0 text-left lg:text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text)] sm:text-xl">
              {lang === "en" ? "Key Objectives" : "اہم مقاصد"}
            </h3>
            {"objectivePoints" in t && Array.isArray(t.objectivePoints) && (
              <ul className="mt-3 flex w-full flex-col gap-3.5 sm:mt-4 sm:gap-4 lg:mx-auto lg:max-w-xl lg:items-center">
                {t.objectivePoints.map((card, i) => (
                  <li
                    key={i}
                    className="flex w-full min-w-0 items-start gap-2.5 text-left text-sm leading-snug text-[var(--color-text-muted)] sm:max-w-xl sm:gap-3 sm:text-base sm:leading-relaxed"
                  >
                    <span className="mt-0.5 shrink-0 text-[var(--color-accent)] sm:mt-1" aria-hidden>
                      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 text-pretty break-words">
                      <strong className="text-[var(--color-text)]">{card.title}</strong>
                      {": "}
                      {card.body}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative aspect-[5/3] w-full min-h-0 overflow-hidden rounded-lg shadow-2xl ring-1 ring-[var(--color-border)] sm:aspect-auto sm:h-96 sm:rounded-xl lg:min-h-[480px]">
            <img
              src={images.missionVision}
              alt="Pak-Palestine Forum protest and awareness campaign in Pakistan"
              className="h-full w-full object-cover object-center sm:rounded-xl"
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5 sm:rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
