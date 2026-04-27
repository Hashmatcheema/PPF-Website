import {
  Camera,
  Clapperboard,
  HandHelping,
  Network,
  Palette,
  PenLine,
  PlusCircle,
  Share2,
  Video,
} from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { HorizontalSwipeHint } from "@/components/HorizontalSwipeHint"
import { JoinUsButton } from "@/components/JoinUsButton"
import { useCtasConfig } from "@/contexts/CtasContext"

const skillCardIcons = [
  HandHelping,
  Network,
  Camera,
  Video,
  Clapperboard,
  Palette,
  Share2,
  PenLine,
  PlusCircle,
] as const

/** Static info panels — glass treatment aligned with Impact achievement cards (not tappable tiles). */
const trackCardClassName =
  "relative w-[min(16rem,calc(100vw-2.25rem))] shrink-0 snap-center cursor-default overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.11] to-black/45 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-xl sm:w-auto sm:min-w-0 sm:max-w-none sm:snap-normal sm:p-5"

/** Join PPF — roles & skills + primary Join Us from admin CTAs (`joinUrl` / `joinLabel`) */
export function JoinPPFTalha({ lang }: { lang: Locale }) {
  const { ctas } = useCtasConfig()
  const t = content[lang].join
  const swipeHint = content[lang].swipeHint
  return (
    <section id="act" aria-labelledby="join-heading" className="relative overflow-hidden bg-[var(--color-bg)]">
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] h-[min(32rem,70vw)] w-[min(56rem,130%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.055),transparent)] blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent" aria-hidden />
      <div className="relative wrap pb-14 pt-20">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-label-red)]" aria-hidden />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]">
            {t.badge}
          </p>
          <div className="h-px w-8 bg-[var(--color-label-red)]" aria-hidden />
        </div>
        <h2
          id="join-heading"
          className="font-display mt-4 text-center text-balance break-words text-3xl font-semibold text-[var(--color-text)] md:text-4xl"
        >
          {t.h2}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl px-1 text-center text-pretty break-words text-base text-[var(--color-text-muted)] sm:px-0 sm:text-lg">
          {t.p}
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-5xl justify-center px-1 sm:mt-14 sm:px-0">
          <div className="flex w-full max-w-lg items-center justify-center gap-3 px-1 sm:px-0">
            <div className="h-px w-8 shrink-0 bg-[var(--color-accent)]/40" aria-hidden />
            <h3
              id="join-skills-heading"
              className="shrink-0 text-balance text-center font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]"
            >
              {t.skillsHeading}
            </h3>
            <div className="h-px w-8 shrink-0 bg-[var(--color-accent)]/40" aria-hidden />
          </div>
        </div>
        <div className="-mx-5 mt-8 sm:mx-0 sm:mt-10">
          <div
            role="region"
            aria-labelledby="join-skills-heading"
            className="overflow-x-auto overflow-y-visible overscroll-x-contain px-5 pb-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-ps-5 scroll-pe-5 snap-x snap-mandatory scroll-smooth sm:scroll-p-0 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none"
          >
            <ul
              className="m-0 flex w-max list-none flex-nowrap gap-4 py-0.5 ps-0 pe-0 sm:grid sm:w-auto sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:py-0 lg:grid-cols-3"
              aria-labelledby="join-skills-heading"
            >
              {t.skillCards.map((card, i) => {
                const Icon = skillCardIcons[i] ?? PlusCircle
                return (
                  <li key={i} className={trackCardClassName}>
                    <div className="relative z-[1] grid w-full grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto,auto] gap-x-2.5 gap-y-0.5 sm:gap-x-3 sm:gap-y-1">
                      <div className="col-start-1 row-span-2 flex w-10 shrink-0 items-start justify-center self-start sm:w-11">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-inset ring-white/10 sm:h-10 sm:w-10">
                          <Icon
                            className="h-[1.35rem] w-[1.35rem] shrink-0 text-[var(--color-text-muted)] sm:h-6 sm:w-6"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </div>
                      </div>
                      <h4 className="col-start-2 row-start-1 min-w-0 text-left text-xs font-semibold leading-snug text-[var(--color-text)] sm:text-sm">
                        {card.title}
                      </h4>
                      {card.detail ? (
                        <p className="col-start-2 row-start-2 min-w-0 text-left text-[11px] leading-snug text-[var(--color-text-muted)] sm:text-xs">
                          {card.detail}
                        </p>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <HorizontalSwipeHint label={swipeHint} className="mt-3 px-4 pb-1 sm:hidden" />
        </div>

        <div className="mt-12 flex justify-center px-1 sm:mt-14 sm:px-0">
          <JoinUsButton
            lang={lang}
            ctas={ctas}
            className="w-full max-w-xs sm:w-auto sm:max-w-none sm:min-w-[12rem]"
          />
        </div>
      </div>
    </section>
  )
}
