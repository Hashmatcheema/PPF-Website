import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { SocialIcons } from "@/components/SocialIcons"

const links = [
  { id: "mission", key: "mission" as const },
  { id: "presence", key: "where" as const },
  { id: "impact", key: "impact" as const },
  { id: "act", key: "act" as const },
  { id: "faq", key: "faq" as const },
  { id: "team", key: "team" as const },
]

export function Header({
  lang,
  setLang,
}: {
  lang: Locale
  setLang: (l: Locale) => void
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [activeId, setActiveId] = useState("hero")

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      setVisible(true)
      clearTimeout(timeoutId)

      if (window.scrollY > 50) {
        timeoutId = setTimeout(() => {
          setVisible(false)
        }, 2500)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setVisible(true)
        clearTimeout(timeoutId)
        if (window.scrollY > 50) {
          timeoutId = setTimeout(() => {
            if (e.clientY >= 100) setVisible(false)
          }, 2500)
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-30% 0px -70% 0px" }
    )

    const sections = document.querySelectorAll("section[id], div[id='hero']")
    sections.forEach((s) => observer.observe(s))

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMouseMove)
      sections.forEach((s) => observer.unobserve(s))
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [])

  const solid = scrolled

  return (
    <header
      onMouseEnter={() => setVisible(true)}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${solid ? "bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-border)]" : "bg-black/20 backdrop-blur-md"
        } ${!visible && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="wrap flex h-16 items-center justify-between md:h-18">
        <a
          href="#hero"
          className="flex items-center gap-0"
          aria-label="Pak Palestine Forum – Home"
        >
          <img
            src="/images/PPF-logo-icon.png"
            alt="Pak Palestine Forum"
            className="h-10 w-auto shrink-0 object-contain"
          />
        </a>

        <nav className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
          {links.map(({ id, key }) => {
            const isActive = activeId === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`text-sm transition ${isActive
                  ? "text-[var(--color-accent)] font-bold relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[var(--color-accent)]"
                  : solid
                    ? "font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    : "font-medium text-white/80 hover:text-white"
                  }`}
              >
                {content[lang].nav[key]}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 md:flex">
            <SocialIcons lang={lang} variant="header" solid={solid} />
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className={`relative flex h-8 w-[72px] shrink-0 items-center rounded-full p-1 shadow-inner transition-colors ${solid ? "bg-[var(--color-bg-elevated)] border border-[var(--color-border)]" : "bg-black/40 border border-white/10"}`}
            aria-label="Switch language"
          >
            <div className={`absolute flex h-6 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-md transition-transform duration-300 ${lang === "ur" ? "translate-x-[34px]" : "translate-x-0"}`}>
              <span className="text-[10px] font-bold text-white leading-none">{lang === "en" ? "EN" : "اردو"}</span>
            </div>
            <div className={`flex w-full justify-between px-2 text-[10px] font-bold leading-none ${solid ? "text-[var(--color-text-muted)]" : "text-white/60"}`}>
              <span className={`transition-opacity duration-300 ${lang === "en" ? "opacity-0" : "opacity-100"}`}>EN</span>
              <span className={`transition-opacity duration-300 ${lang === "ur" ? "opacity-0" : "opacity-100"}`}>اردو</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded md:hidden ${solid ? "text-[var(--color-text)]" : "text-white"
              }`}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-6 shadow-xl md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map(({ id, key }) => {
                const isActive = activeId === id
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2.5 text-sm transition ${isActive
                      ? "font-bold text-[var(--color-accent)] bg-[var(--color-surface)]"
                      : "font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                      }`}
                  >
                    {content[lang].nav[key]}
                  </a>
                )
              })}
            </nav>
            <div className="mt-4 flex justify-center border-t border-[var(--color-border)] pt-4">
              <SocialIcons lang={lang} variant="footer" />
            </div>
          </div>
        </>
      )}
    </header>
  )
}
