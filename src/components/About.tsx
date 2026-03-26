import { useEffect } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"

export function About({ lang }: { lang: Locale }) {
  const t = content[lang].vision

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-24', '-translate-x-24', 'translate-x-24', '-translate-y-24')
          entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="mission" className="relative pb-24 md:pb-32 min-h-[100vh]">
      {/* Sticky Background Image Container with Padding */}
      <div className="sticky top-0 left-0 w-full h-[100vh] p-4 md:p-8 flex items-center justify-center z-0">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)]">
          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-[2px]"></div>
        </div>
      </div>

      {/* Scrolling Content overlapping the static background */}
      <div className="wrap relative z-10 -mt-[40vh] md:-mt-[50vh] min-h-[50vh] flex flex-col justify-end overflow-hidden pb-12">
        <div className="animate-on-scroll opacity-0 -translate-x-24 -translate-y-24 transition-all duration-1000 ease-out inline-block self-start rounded-2xl bg-[var(--color-surface)]/85 p-6 backdrop-blur-xl shadow-card border border-[var(--color-border)]">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            {content[lang].nav.mission}
          </p>
          <p className="font-display mt-4 max-w-2xl text-3xl font-bold leading-snug text-[var(--color-text)] md:text-4xl">
            {t.intro}
          </p>
          {"objectives" in t && t.objectives && (
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[var(--color-text-muted)]">
              {t.objectives}
            </p>
          )}
        </div>

        <div className="mt-16 grid gap-8 pt-8 md:grid-cols-3 md:gap-12">
          {t.cards.map((card, i) => {
            const getAnimationStart = () => {
              if (i === 0) return "-translate-x-24 translate-y-24"
              if (i === 1) return "translate-y-24 delay-150"
              return "translate-x-24 translate-y-24 delay-300"
            }
            return (
              <div key={i} className={`animate-on-scroll opacity-0 ${getAnimationStart()} transition-all duration-1000 ease-out rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 p-8 backdrop-blur-xl hover:bg-[var(--color-surface)] shadow-card`}>
                <span className="font-display text-3xl font-black text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-[var(--color-text)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-[var(--color-text-muted)]">
                  {card.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
