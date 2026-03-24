import { Megaphone } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { useCtasConfig } from "@/contexts/CtasContext"

const FALLBACK_VOLUNTEER_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScmKyTfY3oCA069IjnZRS-mL_RfHfXpHA2HfKkIoLAF0lw4Tg/viewform"

export function FloatingCta({ lang }: { lang: Locale }) {
  const { ctas } = useCtasConfig()
  const href = ctas.joinUrl?.trim() || FALLBACK_VOLUNTEER_URL
  // Label is always from admin-editable Join label so admin can change button text only
  const label = ctas.joinLabel[lang] || content[lang].cta.join
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-cta-emergency fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2.5 rounded-full px-6 py-3 font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      style={{
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      }}
      aria-label={label}
    >
      <Megaphone className="h-7 w-7 shrink-0" strokeWidth={2.25} aria-hidden />
      {label}
    </a>
  )
}
