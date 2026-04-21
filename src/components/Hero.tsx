import { useState, useEffect } from "react"
import { images } from "@/data/images"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"

const SLIDE_DURATION_MS = 5000

export function Hero({ lang }: { lang: Locale }) {
  const t = content[lang]
  const slides = images.heroSlides
  const copy = "heroSlides" in t && Array.isArray(t.heroSlides) ? t.heroSlides : []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(id)
  }, [slides.length])

  const slideCopy = copy[index] ?? copy[0]
  const tagline = slideCopy?.tagline ?? t.tagline
  const subtext = slideCopy?.subtext ?? t.heroSubtitle

  const webpFor = (jpg: string) => jpg.replace(/\.(jpe?g|png)$/i, ".webp")

  return (
    <section id="hero" className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <picture
            key={src}
            className="absolute inset-0 block h-full w-full [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-center"
          >
            <source type="image/webp" srcSet={webpFor(src)} />
            <img
              src={src}
              alt=""
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === index ? 1 : 0 }}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
            />
          </picture>
        ))}
        <div className="hero-overlay hero-overlay--strong absolute inset-0" aria-hidden />
      </div>
      <div className="hero-content wrap relative z-10 min-w-0 pb-[min(20vh,8rem)] pt-24 sm:pb-[20vh] sm:pt-32">
        <p className="hero-text-shadow font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)] sm:text-sm sm:tracking-[0.35em]">
          {t.siteName}
        </p>
        {"heroSubtitle" in t && t.heroSubtitle ? (
          <p className="hero-text-shadow mt-3 max-w-full text-pretty break-words text-base leading-relaxed text-white/90 sm:mt-4 sm:max-w-3xl sm:text-lg">
            {t.heroSubtitle}
          </p>
        ) : null}
        <h1 className="hero-text-shadow font-display mt-4 max-w-full text-balance break-words text-3xl font-bold leading-[1.12] tracking-tight text-white sm:mt-5 sm:max-w-3xl sm:text-5xl md:text-6xl lg:text-7xl transition-opacity duration-500">
          {tagline}
        </h1>
        <p className="hero-text-shadow mt-4 max-w-full text-pretty break-words text-base text-white/90 sm:mt-6 sm:max-w-xl sm:text-lg transition-opacity duration-500">
          {subtext}
        </p>
      </div>
    </section>
  )
}
