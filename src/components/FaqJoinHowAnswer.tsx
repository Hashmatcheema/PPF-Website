import type { Locale } from "@/data/content"
import { content } from "@/data/content"

const linkClassName =
  "font-semibold text-[var(--color-accent)] underline decoration-[var(--color-accent)]/40 underline-offset-2 transition-colors hover:text-[var(--color-accent-hover)] hover:decoration-[var(--color-accent-hover)]/60 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"

/** Rich FAQ copy for “How can I join PPF?” — volunteer form + donation phone */
export function FaqJoinHowAnswer({ lang }: { lang: Locale }) {
  const { volunteer, donate } = content[lang].contact
  const formUrl = volunteer.formUrl
  const phone = donate.contactPhone ?? ""
  const telHref = `tel:${phone.replace(/\s/g, "")}`

  if (lang === "ur") {
    return (
      <>
        شامل ہونا آسان ہے۔ رضاکاری کے لیے ہمارے رجسٹریشن فارم پر{" "}
        <a href={formUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          یہاں
        </a>{" "}
        سائن اپ کریں، یا{" "}
        <a href={telHref} className={linkClassName}>
          ہمارے فراہم کردہ نمبر
        </a>{" "}
        پر عطیہ بھیجیں۔ ہر کوشش شمار ہوتی ہے۔
      </>
    )
  }

  return (
    <>
      Getting involved is easy. Sign up through our registration form for volunteering{" "}
      <a href={formUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        here
      </a>
      , or send donations to{" "}
      <a href={telHref} className={linkClassName}>
        our provided number
      </a>
      . Every effort counts.
    </>
  )
}
