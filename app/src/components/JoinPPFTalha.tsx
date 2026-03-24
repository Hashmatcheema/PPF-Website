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

/** Join PPF section — Talha layout (badge, heading, CTA, role cards grid) with app color scheme */
export function JoinPPFTalha({ lang }: { lang: Locale }) {
  const t = content[lang].join
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
          className="font-display mt-4 text-center text-3xl font-semibold text-[var(--color-text)] md:text-4xl"
        >
          {t.h2}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base text-[var(--color-text-muted)] sm:text-lg">
          {t.p}
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.ways.map((way, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <span
                className="pointer-events-none absolute right-3 top-1 select-none text-8xl font-black leading-none text-white/[0.06]"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pb-2">
                <JoinRoleIcon index={i} />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-snug text-[var(--color-text)]">
                  {way.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {way.short}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="px-6 pb-16 pt-8 text-center text-sm text-[var(--color-text-muted)]">
        {t.footer}
      </p>
    </section>
  )
}
