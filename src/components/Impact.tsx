import type { CSSProperties } from "react"
import { images } from "@/data/images"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { AnimatedStatValue } from "@/components/AnimatedStatValue"
import { HorizontalSwipeHint } from "@/components/HorizontalSwipeHint"

export function Impact({ lang }: { lang: Locale }) {
  const t = content[lang].impact
  const swipeHint = content[lang].swipeHint
  const achievements: string[] =
    "achievements" in t && Array.isArray(t.achievements) ? (t.achievements as string[]) : []
  const n = achievements.length

  return (
    <section
      id="impact"
      className="relative overflow-hidden py-20 sm:py-24 md:py-32"
      aria-labelledby="impact-section-title"
      aria-describedby="impact-intro"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={images.humanitarian}
          alt=""
          className="h-full w-full object-cover object-[center_30%] sm:object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/[0.72] to-black/88 backdrop-blur-[2px] sm:backdrop-blur-[6px]" />
      </div>

      <div className="wrap wrap--impact-wide relative z-10">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-label-red)]/75" aria-hidden />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]">
            Impact
          </p>
          <div className="h-px w-8 bg-[var(--color-label-red)]/75" aria-hidden />
        </div>
        <h2
          id="impact-section-title"
          className="font-display mt-5 text-center text-balance break-words text-2xl font-semibold tracking-tight text-white sm:mt-6 sm:text-3xl md:text-4xl lg:text-[2.5rem] lg:leading-tight"
        >
          {t.title}
        </h2>
        <p
          id="impact-intro"
          className="mx-auto mt-4 max-w-2xl text-center text-pretty break-words text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-base sm:leading-relaxed"
        >
          {t.intro}
        </p>
        <div
          className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-[var(--color-border)]/50 bg-gradient-to-br from-[var(--color-card)]/92 via-[var(--color-bg-elevated)]/88 to-black/80 px-4 py-7 text-center shadow-[0_16px_48px_rgba(0,0,0,0.42)] ring-1 ring-inset ring-white/[0.06] backdrop-blur-xl sm:mt-12 sm:px-5 sm:py-9 md:mt-16 md:px-7 md:py-11"
          aria-label={lang === "en" ? "Key figures" : "اہم اعداد"}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 md:gap-0 md:divide-x md:divide-white/10">
            {t.stats.map((stat, i) => (
              <div key={i} className="flex min-w-0 flex-col items-center px-2 sm:px-4 md:flex-1 md:px-8 lg:px-10">
                <AnimatedStatValue
                  value={stat.value}
                  className="impact-stat-stroke font-display text-4xl font-bold leading-none tracking-[-0.03em] text-[var(--color-accent)] tabular-nums sm:text-5xl md:text-5xl lg:text-[3.25rem] lg:leading-none"
                />
                <p className="mx-auto mt-3 max-w-[14rem] text-balance break-words text-[0.6875rem] font-semibold uppercase leading-snug tracking-[0.2em] text-[var(--color-text-muted)] sm:mt-4 sm:max-w-none sm:text-xs sm:tracking-[0.22em] md:text-[0.8125rem]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        {n > 0 && (
          <div className="mt-12 md:mt-20">
            <div className="relative max-md:-mx-5">
              <ul
                className="impact-mobile-scroll impact-mobile-strip--revealed list-none max-md:flex max-md:flex-row max-md:items-stretch max-md:gap-3 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:px-4 max-md:pb-2 max-md:scroll-pl-4 max-md:scroll-pr-4 max-md:snap-x max-md:snap-mandatory md:grid md:auto-rows-fr md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-3 lg:gap-6 xl:gap-7"
                aria-labelledby="impact-section-title"
              >
                {achievements.map((item, i) => (
                  <li
                    key={i}
                    className="impact-mobile-card max-md:snap-center max-md:min-h-0 max-md:min-w-0 max-md:flex-[0_0_min(17.5rem,calc(100vw-2.75rem))] max-md:self-stretch md:flex md:h-full md:min-h-0 md:min-w-0"
                    style={
                      {
                        "--impact-m-stagger": `${Math.min(i, 14) * 70}ms`,
                      } as CSSProperties
                    }
                  >
                    <article
                      className="impact-card-animate relative flex h-full min-h-0 w-full cursor-default flex-col overflow-hidden rounded-2xl border border-white/[0.12] border-l-4 border-l-[var(--color-accent)]/45 bg-gradient-to-br from-white/[0.15] via-white/[0.07] to-black/55 p-4 shadow-[0_10px_36px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-amber-50/[0.04] backdrop-blur-xl max-md:rounded-2xl md:p-5 lg:p-6"
                      style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
                    >
                      <p className="min-h-0 w-full max-w-[52ch] flex-1 text-balance text-pretty text-left text-sm leading-[1.65] tracking-[-0.01em] text-white/[0.96] md:text-[0.9375rem] md:leading-[1.65] lg:text-base lg:leading-[1.65]">
                        {item}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
              <div
                className="pointer-events-none absolute inset-y-1 right-0 z-[1] w-8 bg-gradient-to-l from-black/55 to-transparent max-md:block md:hidden"
                aria-hidden
              />
            </div>
            <HorizontalSwipeHint
              label={swipeHint}
              tone="impact"
              className="mt-2 px-2 pb-1 md:hidden"
            />
          </div>
        )}
      </div>
    </section>
  )
}
