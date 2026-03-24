import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { SocialIcons } from "@/components/SocialIcons"

export function Footer({ lang }: { lang: Locale }) {
  const t = content[lang]
  return (
    <footer className="bg-[#0a0e0c] border-t border-white/10 py-12">
      <div className="wrap flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-4">
          <img src="/images/PPF-logo.png" alt="PPF Logo" className="h-12 w-auto rounded-md object-contain" />
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-display text-xl font-bold text-white">PPF</span>
            <span className="text-sm text-white/70">{t.siteName}</span>
          </div>
        </div>
        <p className="text-sm text-white/70">{t.footer.tagline}</p>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 md:justify-end">
          <a href="#mission" className="transition-colors hover:text-white">{t.nav.mission}</a>
          <a href="#presence" className="transition-colors hover:text-white">{t.nav.where}</a>
          <a href="#impact" className="transition-colors hover:text-white">{t.nav.impact}</a>
          <a href="#act" className="transition-colors hover:text-white">{t.nav.act}</a>
          <a href="#faq" className="transition-colors hover:text-white">{t.nav.faq}</a>
          <a href="#team" className="transition-colors hover:text-white">{t.nav.team}</a>
          <div className="flex items-center gap-2 pl-0 md:pl-2 md:border-l md:border-white/20">
            <SocialIcons lang={lang} variant="footer" />
          </div>
        </nav>
      </div>
      <div className="wrap mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Pak-Palestine Forum
      </div>
    </footer>
  )
}
