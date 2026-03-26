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

  return (
    <section id="hero" className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
        <div
          className="hero-overlay absolute inset-0"
          aria-hidden
        />
      </div>
      <div className="hero-content wrap relative z-10 pb-[20vh] pt-32">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
          {t.siteName}
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl lg:text-7xl transition-opacity duration-500">
          {tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[var(--color-text-muted)] transition-opacity duration-500">
          {subtext}
        </p>
      </div>
    </section>
  )
}
