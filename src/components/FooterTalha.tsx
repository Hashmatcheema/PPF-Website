import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { SocialIcons } from "@/components/SocialIcons"

export function FooterTalha({ lang }: { lang: Locale }) {
  const t = content[lang]
  const chapters = t.where.chapters
  const nav = t.nav
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#111111]">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom center, rgba(201,162,39,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative wrap py-10 lg:py-12">
        {/* ── Top row: Logo + tagline ── */}
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
          {/* Brand block */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <a href="#" className="flex items-center gap-3" aria-label="Pak-Palestine Forum">
              <img
                src="/images/PPF-logo.png"
                alt="PPF"
                width={48}
                height={48}
                className="rounded-lg object-contain"
                loading="lazy"
              />
              <div>
                <span className="font-display text-lg font-bold text-white">
                  Pak-Palestine Forum
                </span>
                <span className="block text-xs text-white/50">{t.footer.tagline}</span>
              </div>
            </a>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="my-8 h-px w-full bg-white/10" />

        {/* ── Middle: 3-column grid ── */}
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:text-left">
          {/* Nav links */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {lang === "en" ? "Navigate" : "نیویگیٹ"}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "#mission", label: nav.mission },
                { href: "#presence", label: nav.where },
                { href: "#impact", label: nav.impact },
                { href: "#act", label: nav.act },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {lang === "en" ? "More" : "مزید"}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "#faq", label: nav.faq },
                { href: "#team", label: nav.team },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Chapters */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {lang === "en" ? "Our Chapters" : "ہمارے چیپٹر"}
            </h4>
            <ul className="space-y-2.5">
              {chapters.map((city) => (
                <li key={city}>
                  <a
                    href="#presence"
                    className="text-sm text-white/60 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="my-8 h-px w-full bg-white/10" />

        {/* ── Bottom bar: copyright + social + legal ── */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/40">
            © {year} Pak-Palestine Forum. {lang === "en" ? "All rights reserved." : "جملہ حقوق محفوظ ہیں۔"}
          </p>
          <SocialIcons lang={lang} variant="footer" />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white/70">
              {lang === "en" ? "Privacy Policy" : "رازداری کی پالیسی"}
            </a>
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white/70">
              {lang === "en" ? "Terms" : "شرائط"}
            </a>
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white/70">
              {lang === "en" ? "Cookies" : "کوکیز"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
