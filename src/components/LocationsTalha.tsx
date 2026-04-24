import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { CityLandmarkIcon } from "@/components/CityLandmarkIcons"
import { HorizontalSwipeHint } from "@/components/HorizontalSwipeHint"

/** Chapter Instagram links — order matches `content.*.where.chapters` (Islamabad → Multan) */
const CHAPTERS_DATA = [
  { instagram: "https://www.instagram.com/pakpalforum_isb/" },
  { instagram: "https://www.instagram.com/pakpalforum_lahore/" },
  { instagram: "https://www.instagram.com/pakpalforum_khi/" },
  { instagram: "https://www.instagram.com/pakpalforum_fsd/" },
  { instagram: "https://www.instagram.com/pakpalforum_sgd/" },
  { instagram: "https://www.instagram.com/pakpalforum_multan/" },
]

/** Instagram icon — same as Talha's location section SocialIcon (platform === 'instagram') */
function InstagramIcon({ className }: { className?: string }) {
  const cls = `${className ?? "h-4 w-4"} fill-current`.trim()
  return (
    <svg className={cls} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

/** Locations (Presence) — chapter chips in one horizontally scrollable, centered row. */
export function LocationsTalha({ lang }: { lang: Locale }) {
  const t = content[lang].where
  const swipeHint = content[lang].swipeHint
  const chapters = t.chapters
  const data = CHAPTERS_DATA

  return (
    <section
      id="presence"
      aria-labelledby="presence-heading"
      className="relative z-0 bg-[var(--color-bg)] pb-28 pt-16 md:z-auto md:py-24"
    >
      <div className="relative px-6 text-center sm:px-10">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]">
            {lang === "en" ? "Our Chapters" : "ہمارے چیپٹر"}
          </p>
          <div className="h-px w-8 bg-[var(--color-accent)]" />
        </div>
        <h2
          id="presence-heading"
          className="font-display mt-4 text-center text-balance break-words text-2xl font-semibold text-[var(--color-text)] sm:text-3xl md:text-4xl"
        >
          {t.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl px-1 text-pretty break-words text-base text-[var(--color-text-muted)] sm:px-0 sm:text-lg">
          {t.intro}
        </p>
      </div>

      <div className="relative z-[1] mt-8 flex w-full flex-col items-center px-4 sm:px-6">
        <div
          role="region"
          aria-label={lang === "en" ? "Chapters, scroll horizontally" : "چیپٹر، افقی سکرول"}
          className="w-full min-h-[8.5rem] max-w-full overflow-x-auto overflow-y-visible overscroll-x-contain py-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-smooth"
        >
          <div className="mx-auto w-max">
            <div className="flex flex-nowrap gap-3 px-1 sm:gap-3.5">
              {chapters.map((cityName, i) => {
                const info = data[i] ?? data[0]
                return (
                  <div
                    key={i}
                    className="relative grid size-[7.5rem] shrink-0 snap-start grid-rows-[auto_minmax(0,1fr)_auto] place-items-center overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.11] to-black/45 p-2.5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-xl transition-[border-color,box-shadow] hover:border-white/[0.14] sm:size-36 sm:snap-center sm:p-3"
                  >
                    <CityLandmarkIcon
                      index={i}
                      className="h-10 w-10 shrink-0 fill-[var(--color-accent)] stroke-black stroke-[1.1px] [paint-order:fill_stroke] sm:h-11 sm:w-11"
                    />
                    <p className="line-clamp-2 flex min-h-0 w-full items-center justify-center self-stretch px-0.5 text-center text-xs font-bold leading-tight tracking-wide text-white sm:text-[13px] md:text-[var(--color-text)]">
                      {cityName}
                    </p>
                    <a
                      href={info.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-label-red)]"
                      aria-label={`${cityName} on Instagram`}
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <HorizontalSwipeHint label={swipeHint} className="mt-3 px-1 pb-1 sm:hidden" />
      </div>

      <p className="relative mx-auto mt-10 max-w-3xl px-6 text-center text-sm leading-relaxed text-white/40 sm:text-base">
        <span className="font-semibold text-white/60">
          {lang === "en" ? "Smaller units:" : "چھوٹی اکائیاں:"}
        </span>{" "}
        {t.smallerUnits}
      </p>
    </section>
  )
}
