import { useRef, useEffect } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { CityLandmarkIcon } from "@/components/CityLandmarkIcons"
import {
  PPF_NAV_SCROLL_END,
  PPF_NAV_SCROLL_START,
  type PpfNavScrollDetail,
} from "@/lib/ppfNavScroll"

/** Landmarks + socials aligned with content order: Islamabad → Multan */
const CHAPTERS_DATA = [
  { landmark: "Faisal Mosque", instagram: "https://www.instagram.com/pakpalforumisb", facebook: "https://www.facebook.com/pakpalforumisb" },
  { landmark: "Badshahi Mosque", instagram: "https://www.instagram.com/pakpalforumlhr", facebook: "https://www.facebook.com/pakpalforumlhr" },
  { landmark: "Mazar-e-Quaid", instagram: "https://www.instagram.com/pakpalforumkhi", facebook: "https://www.facebook.com/pakpalforumkhi" },
  { landmark: "Ghanta Ghar", instagram: "https://www.instagram.com/pakpalforumfsd", facebook: "https://www.facebook.com/pakpalforumfsd" },
  { landmark: "Regional Chapter", instagram: "https://www.instagram.com/pakpalforum2", facebook: "https://www.facebook.com/share/18UtUumkQL/" },
  { landmark: "Shrine of Rukn-e-Alam", instagram: "https://www.instagram.com/pakpalforummultan", facebook: "https://www.facebook.com/pakpalforummultan" },
]

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
  /** True while main nav is running a programmatic scroll (smooth/instant). */
  const navProgrammaticScroll = useRef(false)
  /**
   * After landing on #presence via navbar: keep chapter strip at start until the user scrolls
   * the page normally (wheel / keys). Does not affect vertical scroll mapping once unlocked.
   */
  const presenceHorizontalLockUntilUserScroll = useRef(false)

  useEffect(() => {
    let presenceUnlockTimer: ReturnType<typeof setTimeout> | null = null
    let activeKeyHandler: ((ke: KeyboardEvent) => void) | null = null

    const clearActiveKeyHandler = () => {
      if (activeKeyHandler) {
        window.removeEventListener("keydown", activeKeyHandler, true)
        activeKeyHandler = null
      }
    }

    const onNavStart = () => {
      navProgrammaticScroll.current = true
    }

    const onNavEnd = (e: Event) => {
      navProgrammaticScroll.current = false
      const detail = (e as CustomEvent<PpfNavScrollDetail>).detail
      if (detail?.targetId !== "presence" || !presenceScrollRef.current) return

      if (presenceUnlockTimer !== null) {
        window.clearTimeout(presenceUnlockTimer)
        presenceUnlockTimer = null
      }
      clearActiveKeyHandler()

      presenceScrollRef.current.scrollLeft = 0
      presenceHorizontalLockUntilUserScroll.current = true

      const cleanup = () => {
        presenceHorizontalLockUntilUserScroll.current = false
        if (presenceUnlockTimer !== null) {
          window.clearTimeout(presenceUnlockTimer)
          presenceUnlockTimer = null
        }
        clearActiveKeyHandler()
      }

      const onWheel = () => {
        cleanup()
      }

      const onKey = (ke: KeyboardEvent) => {
        if (
          ke.key === " " ||
          ke.key === "PageDown" ||
          ke.key === "PageUp" ||
          ke.key === "ArrowDown" ||
          ke.key === "ArrowUp" ||
          ke.key === "Home" ||
          ke.key === "End"
        ) {
          cleanup()
        }
      }

      activeKeyHandler = onKey
      window.addEventListener("wheel", onWheel, { passive: true, once: true })
      window.addEventListener("keydown", onKey, true)
      presenceUnlockTimer = window.setTimeout(cleanup, 8000)
    }

    const handleWindowScroll = () => {
      if (navProgrammaticScroll.current) return
      if (presenceHorizontalLockUntilUserScroll.current) return
      if (!presenceSectionRef.current || !presenceScrollRef.current) return
      const rect = presenceSectionRef.current.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      const el = presenceScrollRef.current
      el.scrollLeft = progress * (el.scrollWidth - el.clientWidth)
    }

    window.addEventListener(PPF_NAV_SCROLL_START, onNavStart)
    window.addEventListener(PPF_NAV_SCROLL_END, onNavEnd)
    window.addEventListener("scroll", handleWindowScroll, { passive: true })
    return () => {
      window.removeEventListener(PPF_NAV_SCROLL_START, onNavStart)
      window.removeEventListener(PPF_NAV_SCROLL_END, onNavEnd)
      window.removeEventListener("scroll", handleWindowScroll)
      if (presenceUnlockTimer !== null) window.clearTimeout(presenceUnlockTimer)
      clearActiveKeyHandler()
    }
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
