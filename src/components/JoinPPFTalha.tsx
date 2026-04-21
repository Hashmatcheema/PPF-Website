import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"

function JoinRoleIcon({ index }: { index: number }) {
  const cls = "h-10 w-10 text-[var(--color-accent)]"
  const icons = [
    <svg key="volunteer" viewBox="0 0 40 40" className={cls} fill="currentColor" aria-hidden>
      <rect x="2" y="5" width="4" height="14" rx="2" />
      <rect x="8" y="3" width="4" height="16" rx="2" />
      <rect x="14" y="5" width="4" height="14" rx="2" />
      <path d="M1,18 Q1,32 10,32 Q19,32 19,18 Z" />
      <rect x="22" y="5" width="4" height="14" rx="2" />
      <rect x="28" y="3" width="4" height="16" rx="2" />
      <rect x="34" y="5" width="4" height="14" rx="2" />
      <path d="M21,18 Q21,32 30,32 Q39,32 39,18 Z" />
    </svg>,
    <svg key="awareness" viewBox="0 0 40 40" className={cls} fill="currentColor" aria-hidden>
      <rect x="2" y="14" width="10" height="12" rx="1" />
      <polygon points="12,11 38,2 38,38 12,29" />
      <rect x="3" y="26" width="6" height="9" rx="2" />
    </svg>,
    <svg key="advocacy" viewBox="0 0 40 40" className={cls} fill="currentColor" aria-hidden>
      <rect x="8" y="4" width="7" height="15" rx="3.5" />
      <rect x="17" y="2" width="7" height="17" rx="3.5" />
      <rect x="26" y="5" width="7" height="14" rx="3.5" />
      <rect x="7" y="17" width="26" height="16" rx="3" />
      <rect x="1" y="19" width="8" height="10" rx="4" />
      <rect x="11" y="31" width="18" height="7" rx="2" />
    </svg>,
    <svg key="professional" viewBox="0 0 40 40" className={cls} fill="currentColor" aria-hidden>
      <rect x="2" y="14" width="36" height="24" rx="2" />
      <path d="M13,14 L13,10 Q13,5 20,5 Q27,5 27,10 L27,14" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="2" y="25" width="36" height="3" />
      <rect x="17" y="21" width="6" height="7" rx="1" />
    </svg>,
    <svg key="partner" viewBox="0 0 40 40" className={cls} fill="currentColor" aria-hidden>
      <circle cx="13" cy="20" r="11" opacity="0.75" />
      <circle cx="27" cy="20" r="11" opacity="0.75" />
    </svg>,
  ]
  return icons[index] ?? icons[0]
}

/** Join PPF — ways to take part (static list) + primary Join Us link to volunteer form */
export function JoinPPFTalha({ lang }: { lang: Locale }) {
  const t = content[lang].join
  const volunteerFormUrl = content[lang].contact.volunteer.formUrl
  return (
    <section id="act" aria-labelledby="join-heading" className="bg-black">
      <div className="wrap pb-10 pt-20">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.badge}
          </p>
          <div className="h-px w-8 bg-[var(--color-accent)]" />
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
      </div>
      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="-mx-4 sm:mx-0">
          <p className="mb-2 flex items-center justify-center gap-1.5 px-4 text-center text-[9px] font-medium leading-none text-[var(--color-text-muted)] sm:hidden">
            <ChevronLeft className="size-3 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
            <span>
              {lang === "en"
                ? "Swipe sideways to see all ways to help"
                : "بائیں یا دائیں سوائپ کریں — تمام طریقے دیکھیں"}
            </span>
            <ChevronRight className="size-3 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
          </p>
          <div
            role="region"
            aria-label={lang === "en" ? "Ways to get involved, scroll horizontally" : "شامل ہونے کے طریقے، افقی سکرول"}
            className="overflow-x-auto overflow-y-visible overscroll-x-contain px-5 pb-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] scroll-ps-5 scroll-pe-5 snap-x snap-mandatory scroll-smooth sm:scroll-p-0 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none"
          >
            <ul
              className="m-0 flex w-max list-none flex-nowrap gap-6 py-0.5 ps-0 pe-0 sm:grid sm:w-auto sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:py-0 lg:grid-cols-3"
              aria-label={lang === "en" ? "Ways to get involved" : "شامل ہونے کے طریقے"}
            >
              {t.ways.map((way, i) => (
                <li
                  key={i}
                  className="relative aspect-square w-[min(10.75rem,calc(100vw-3.25rem))] shrink-0 snap-center cursor-default rounded-lg border-y border-r border-white/[0.08] border-l-4 border-l-[var(--color-accent)] bg-white/[0.03] p-3 sm:snap-normal sm:aspect-auto sm:w-auto sm:min-w-0 sm:p-4 sm:p-5"
                >
                  <span
                    className="pointer-events-none absolute right-1.5 top-1.5 select-none font-display text-2xl font-bold leading-none text-white/[0.07] sm:right-3 sm:top-3 sm:text-4xl"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex h-full min-h-0 flex-col items-center justify-center gap-2 px-0.5 text-center sm:h-auto sm:flex-row sm:items-start sm:justify-start sm:gap-4 sm:px-0 sm:text-left">
                    <div className="shrink-0 scale-[0.88] sm:scale-100 sm:pt-0.5">
                      <JoinRoleIcon index={i} />
                    </div>
                    <div className="min-w-0 max-w-full sm:pr-6">
                      <h3 className="line-clamp-3 text-xs font-semibold leading-snug text-[var(--color-text)] sm:line-clamp-none sm:text-sm">
                        {way.title}
                      </h3>
                      <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[var(--color-text-muted)] sm:mt-1.5 sm:line-clamp-none sm:text-xs">
                        {way.short}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex justify-center px-1 sm:mt-12 sm:px-0">
          <a
            href={volunteerFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-md bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:w-auto sm:max-w-none sm:min-w-[11rem] sm:px-8"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
