import { images } from "@/data/images"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { AnimatedStatValue } from "@/components/AnimatedStatValue"

function impactImageSources(jpgPath: string) {
  const webp = jpgPath.replace(/\.(jpe?g|png)$/i, ".webp")
  return { jpg: jpgPath, webp }
}

export function Impact({ lang }: { lang: Locale }) {
  const t = content[lang].impact
  const bg = impactImageSources(images.humanitarian)
  return (
    <section id="impact" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 z-0">
        <picture>
          <source type="image/webp" srcSet={bg.webp} />
          <img
            src={bg.jpg}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
      </div>

      <div className="wrap relative z-10">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            Impact
          </p>
          <div className="h-px w-8 bg-[var(--color-accent)]" />
        </div>
        <h2 className="font-display mt-4 text-center text-3xl font-semibold text-white md:text-4xl">
          {t.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/80">{t.intro}</p>
        <div className="mt-16 flex flex-col gap-6 border-y border-white/20 py-8 sm:gap-8 md:flex-row md:items-start md:justify-between md:gap-12 md:py-12 lg:gap-16">
          {t.stats.map((stat, i) => (
            <div key={i} className="text-left md:flex-1 md:text-center">
              <AnimatedStatValue
                value={stat.value}
                className="font-display text-4xl font-bold text-[var(--color-accent)] md:text-5xl"
              />
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        {"achievements" in t && Array.isArray(t.achievements) && t.achievements.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.achievements.map((item, i) => (
              <div
                key={i}
                className="group flex gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span
                  className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 text-sm font-bold text-[var(--color-accent)]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-white/90">
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
