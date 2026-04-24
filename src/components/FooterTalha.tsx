import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { SocialIcons } from "@/components/SocialIcons"

export function FooterTalha({ lang }: { lang: Locale }) {
  const t = content[lang]
  const chapters = t.where.chapters
  const nav = t.nav
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#111111] pb-[max(5.5rem,calc(4.5rem+env(safe-area-inset-bottom,0px)))] sm:pb-28 md:pb-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom center, rgba(255,71,74,0.09) 0%, transparent 60%)",
        }}
      />

      <div className="relative wrap py-4 sm:py-8 md:py-10 lg:py-12">
        {/* Brand — tighter on mobile */}
        <div className="flex flex-col items-start text-left">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3" aria-label="Pak-Palestine Forum">
            <img
              src="/images/PPF-logo.webp"
              alt="PPF"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 rounded-lg object-contain sm:h-12 sm:w-12"
              loading="lazy"
            />
            <div>
              <span className="font-display text-base font-bold text-white sm:text-lg">
                Pak-Palestine Forum
              </span>
              <span className="block text-[11px] leading-tight text-white/50 sm:text-xs">
                {t.footer.tagline}
              </span>
            </div>
          </a>
        </div>

        <div className="my-3 h-px w-full bg-white/10 sm:my-5 md:my-6" />

        {/*
          Mobile: nav links | Chapters side by side.
          sm+: 3 columns with empty middle for spacing (matches header order in footer links).
        */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-left sm:grid-cols-3 sm:gap-x-8 sm:gap-y-5">
          <div className="col-start-1 row-start-1 min-w-0">
            <ul className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
              {[
                { href: "#faq", label: nav.faq },
                { href: "#mission", label: nav.mission },
                { href: "#impact", label: nav.impact },
                { href: "#presence", label: nav.where },
                { href: "#act", label: nav.act },
                { href: "#team", label: nav.team },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] leading-snug text-white/60 transition-colors hover:text-[var(--color-accent)] sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden sm:block sm:col-start-2 sm:row-start-1" aria-hidden />

          <div className="col-start-2 row-start-1 min-w-0 sm:col-start-3">
            <h4 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40 sm:mb-2 md:mb-3">
              {lang === "en" ? "Our Chapters" : "ہمارے چیپٹر"}
            </h4>
            <ul className="grid grid-cols-1 gap-x-2 gap-y-1 sm:gap-x-4 sm:gap-y-2 max-sm:grid-cols-2">
              {chapters.map((city) => (
                <li key={city}>
                  <a
                    href="#presence"
                    className="text-[13px] leading-snug text-white/60 transition-colors hover:text-[var(--color-accent)] sm:text-sm"
                  >
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-3 h-px w-full bg-white/10 sm:my-5 md:my-6" />

        {/* Bottom: compact row on mobile; reserve right space for floating CTA */}
        <div className="max-sm:pr-[7.5rem] flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-3 sm:pr-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <SocialIcons lang={lang} variant="footer" />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5 text-left sm:items-end sm:text-right">
            <p className="text-[11px] leading-snug text-white/40 sm:text-xs">
              © {year} Pak-Palestine Forum.{" "}
              {lang === "en" ? "All rights reserved." : "جملہ حقوق محفوظ ہیں۔"}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              <a href="#" className="text-[11px] text-white/40 transition-colors hover:text-white/70 sm:text-xs">
                {lang === "en" ? "Privacy Policy" : "رازداری کی پالیسی"}
              </a>
              <a href="#" className="text-[11px] text-white/40 transition-colors hover:text-white/70 sm:text-xs">
                {lang === "en" ? "Terms" : "شرائط"}
              </a>
              <a href="#" className="text-[11px] text-white/40 transition-colors hover:text-white/70 sm:text-xs">
                {lang === "en" ? "Cookies" : "کوکیز"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
