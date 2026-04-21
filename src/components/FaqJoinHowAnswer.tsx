import type { Locale } from "@/data/content"
import { content } from "@/data/content"

const linkClassName =
  "font-semibold text-[var(--color-accent)] underline decoration-[var(--color-accent)]/40 underline-offset-2 transition-colors hover:text-[var(--color-accent-hover)] hover:decoration-[var(--color-accent-hover)]/60 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"

/** Rich FAQ copy for “How can I join PPF?” — volunteer registration link only */
export function FaqJoinHowAnswer({ lang }: { lang: Locale }) {
  const formUrl = content[lang].contact.volunteer.formUrl

  if (lang === "ur") {
    return (
      <>
        شامل ہونا آسان ہے۔ رضاکاری کے لیے ہمارا رجسٹریشن فارم بھرنے کے لیے{" "}
        <a href={formUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          یہاں
        </a>{" "}
        کلک کریں۔
      </>
    )
  }

  return (
    <>
      Getting involved is easy. Fill out our registration form for volunteering by clicking{" "}
      <a href={formUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        here
      </a>
    </>
  )
}
