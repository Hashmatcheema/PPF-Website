import { useRef, useEffect } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"

/** Chapter card data: landmark + social links (from Talha). Use accent for border. */
const CHAPTERS_DATA = [
  { landmark: "Faisal Mosque", instagram: "https://www.instagram.com/pakpalforumisb", facebook: "https://www.facebook.com/pakpalforumisb" },
  { landmark: "Badshahi Mosque", instagram: "https://www.instagram.com/pakpalforumlhr", facebook: "https://www.facebook.com/pakpalforumlhr" },
  { landmark: "Mazar-e-Quaid", instagram: "https://www.instagram.com/pakpalforumkhi", facebook: "https://www.facebook.com/pakpalforumkhi" },
  { landmark: "Ghanta Ghar", instagram: "https://www.instagram.com/pakpalforumfsd", facebook: "https://www.facebook.com/pakpalforumfsd" },
  { landmark: "Shrine of Rukn-e-Alam", instagram: "https://www.instagram.com/pakpalforummultan", facebook: "https://www.facebook.com/pakpalforummultan" },
  { landmark: "Chapter", instagram: "https://www.instagram.com/pakpalforum2", facebook: "https://www.facebook.com/share/18UtUumkQL/" },
]

function CityLandmarkIcon({ index }: { index: number }) {
  const cls = "h-14 w-14 text-[var(--color-accent)]"
  const icons = [
    <svg key="isb" viewBox="0 0 48 48" className={cls} fill="currentColor" aria-hidden>
      <rect x="3" y="10" width="4" height="34" />
      <polygon points="5,6 3,10 7,10" />
      <rect x="41" y="10" width="4" height="34" />
      <polygon points="43,6 41,10 45,10" />
      <rect x="10" y="16" width="3" height="28" />
      <polygon points="11.5,13 10,16 13,16" />
      <rect x="35" y="16" width="3" height="28" />
      <polygon points="36.5,13 35,16 38,16" />
      <polygon points="24,8 11,38 37,38" />
      <rect x="8" y="38" width="32" height="4" />
      <rect x="5" y="42" width="38" height="4" />
    </svg>,
    <svg key="lhr" viewBox="0 0 48 48" className={cls} fill="currentColor" aria-hidden>
      <rect x="1" y="10" width="5" height="36" />
      <polygon points="3.5,6 1,10 6,10" />
      <rect x="42" y="10" width="5" height="36" />
      <polygon points="44.5,6 42,10 47,10" />
      <rect x="10" y="16" width="4" height="30" />
      <polygon points="12,13 10,16 14,16" />
      <rect x="34" y="16" width="4" height="30" />
      <polygon points="36,13 34,16 38,16" />
      <path d="M17,28 Q17,14 24,14 Q31,14 31,28 Z" />
      <rect x="14" y="26" width="20" height="4" />
      <rect x="12" y="30" width="24" height="16" />
      <rect x="5" y="46" width="38" height="2" />
    </svg>,
    <svg key="khi" viewBox="0 0 48 48" className={cls} fill="currentColor" aria-hidden>
      <line x1="24" y1="2" x2="24" y2="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10,26 Q10,8 24,8 Q38,8 38,26 Z" />
      <rect x="8" y="24" width="32" height="4" />
      <rect x="7" y="28" width="34" height="16" />
      <rect x="4" y="44" width="40" height="2" />
    </svg>,
    <svg key="fsd" viewBox="0 0 48 48" className={cls} fill="currentColor" aria-hidden>
      <polygon points="24,1 22,8 26,8" />
      <rect x="19" y="8" width="10" height="5" />
      <rect x="21" y="13" width="6" height="6" />
      <rect x="16" y="19" width="16" height="10" />
      <circle cx="24" cy="24" r="4" fill="currentColor" fillOpacity="0.3" />
      <rect x="17" y="29" width="14" height="13" />
      <rect x="13" y="42" width="22" height="4" />
    </svg>,
    <svg key="mtn" viewBox="0 0 48 48" className={cls} fill="currentColor" aria-hidden>
      <path d="M19,16 Q19,8 24,8 Q29,8 29,16 Z" />
      <rect x="21" y="14" width="6" height="4" />
      <polygon points="15,18 13,34 35,34 33,18" />
      <polygon points="12,34 9,46 39,46 36,34" />
      <rect x="7" y="46" width="34" height="2" />
    </svg>,
    <svg key="srg" viewBox="0 0 48 48" className={cls} fill="currentColor" aria-hidden>
      <circle cx="24" cy="14" r="8" />
      <path d="M10,38 Q10,24 24,24 Q38,24 38,38 Z" />
      <rect x="0" y="38" width="48" height="8" />
    </svg>,
  ]
  return icons[index] ?? icons[0]
}

/** Instagram icon — same as Talha's location section SocialIcon (platform === 'instagram') */
function InstagramIcon({ className }: { className?: string }) {
  const cls = `h-4 w-4 fill-current ${className ?? ""}`.trim()
  return (
    <svg className={cls} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

/** Facebook icon — same as Talha's location section SocialIcon (platform === 'facebook') */
function FacebookIcon({ className }: { className?: string }) {
  const cls = `h-4 w-4 fill-current ${className ?? ""}`.trim()
  return (
    <svg className={cls} viewBox="0 0 24 24" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

/** Locations (Presence) section — Talha layout (horizontal scroll chapter cards) with app color scheme */
export function LocationsTalha({ lang }: { lang: Locale }) {
  const t = content[lang].where
  const presenceSectionRef = useRef<HTMLElement>(null)
  const presenceScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!presenceSectionRef.current || !presenceScrollRef.current) return
      const rect = presenceSectionRef.current.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      const el = presenceScrollRef.current
      el.scrollLeft = progress * (el.scrollWidth - el.clientWidth)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const chapters = t.chapters
  const data = CHAPTERS_DATA

  return (
    <section
      ref={presenceSectionRef}
      id="presence"
      aria-labelledby="presence-heading"
      style={{ height: "220vh" }}
      className="relative bg-black"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="relative px-6 text-center sm:px-10">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-[var(--color-accent)]" />
            <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
              {lang === "en" ? "Our Chapters" : "ہمارے چیپٹر"}
            </p>
            <div className="h-px w-8 bg-[var(--color-accent)]" />
          </div>
          <h2
            id="presence-heading"
            className="font-display mt-4 text-center text-3xl font-semibold text-[var(--color-text)] md:text-4xl"
          >
            {t.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg">
            {t.intro}
          </p>
        </div>
        <div
          ref={presenceScrollRef}
          className="relative mt-10 flex gap-5 overflow-x-hidden px-12 py-5"
          style={{ scrollBehavior: "auto" }}
        >
          {chapters.map((cityName, i) => {
            const info = data[i] ?? data[0]
            return (
              <div
                key={i}
                className="flex flex-none flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                style={{ minWidth: "230px" }}
              >
                <div className="flex items-center justify-center px-8 pt-7 pb-3 text-[var(--color-accent)]">
                  <CityLandmarkIcon index={i} />
                </div>
                <div className="flex-1 px-6 pb-4 text-center">
                  <p className="text-lg font-bold tracking-wide text-[var(--color-text)]">
                    {cityName}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {info.landmark}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-5 border-t border-white/10 px-6 py-3">
                  <a
                    href={info.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                    aria-label={`${cityName} on Instagram`}
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href={info.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                    aria-label={`${cityName} on Facebook`}
                  >
                    <FacebookIcon />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
        <p className="relative mt-6 text-center text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
          {lang === "en" ? "Scroll to explore →" : "دیکھنے کے لیے سکرول کریں"}
        </p>
        <p className="relative mx-auto mt-6 max-w-3xl px-6 text-center text-xs leading-relaxed text-white/40">
          <span className="font-semibold text-white/60">
            {lang === "en" ? "Smaller units:" : "چھوٹی اکائیاں:"}
          </span>{" "}
          {t.smallerUnits}
        </p>
      </div>
    </section>
  )
}
