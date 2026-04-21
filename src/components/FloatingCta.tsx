import { useEffect, useId, useState } from "react"
import { Mail, Megaphone, MessageCircle, X } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"

const barClassName =
  "pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-40 flex flex-row flex-nowrap items-end justify-end gap-3 sm:bottom-6 sm:left-6 sm:right-6 sm:gap-4"

const pillClassName =
  "pointer-events-auto flex h-12 max-w-[min(22rem,calc(100vw-1.5rem))] shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-xl transition-all duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:h-14 sm:max-w-none sm:gap-2.5 sm:px-6 sm:py-3 sm:text-base"

const popoverBaseClassName =
  "pointer-events-auto absolute bottom-full z-[60] mb-2 w-[min(20rem,calc(100vw-2rem))] max-h-[min(28rem,calc(100vh-7rem))] overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-[var(--color-bg)]/95 p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/40 backdrop-blur-md sm:p-5"

const popoverContactClassName = `${popoverBaseClassName} right-0 origin-bottom-right`

const popoverEventClassName = `${popoverBaseClassName} right-0 origin-bottom-right`

function PopoverHeader({
  titleId,
  title,
  onClose,
  closeLabel,
}: {
  titleId: string
  title: string
  onClose: () => void
  closeLabel: string
}) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
      <h2 id={titleId} className="font-display text-base font-semibold leading-tight text-[var(--color-text)] sm:text-lg">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        aria-label={closeLabel}
      >
        <X className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

export function FloatingCta({ lang }: { lang: Locale }) {
  const t = content[lang].floatingBar
  const [contactOpen, setContactOpen] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)
  const eventTitleId = useId()
  const contactPanelId = useId()
  const eventPanelId = useId()
  const waHref = `https://wa.me/${t.phoneWaDigits}`
  const mailHref = `mailto:${t.email}`
  const anyOpen = contactOpen || eventOpen

  useEffect(() => {
    if (!anyOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContactOpen(false)
        setEventOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [anyOpen])

  return (
    <>
      {anyOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[35] bg-black/35 backdrop-blur-[1px] transition-opacity"
          aria-label={t.dismissOverlay}
          onClick={() => {
            setContactOpen(false)
            setEventOpen(false)
          }}
        />
      )}

      <div className={barClassName}>
        {/* Event (march) left of contact icon; both grouped on the right via justify-end */}
        <div className="pointer-events-auto relative inline-flex w-max max-w-full flex-col items-end">
          {eventOpen && (
            <div
              id={eventPanelId}
              role="dialog"
              aria-modal="false"
              aria-labelledby={eventTitleId}
              className={popoverEventClassName}
            >
              <PopoverHeader
                titleId={eventTitleId}
                title={t.eventTitle}
                onClose={() => setEventOpen(false)}
                closeLabel={t.close}
              />
              <p className="mt-3 text-pretty text-sm leading-relaxed text-[var(--color-text-muted)]">{t.eventBody}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setContactOpen(false)
              setEventOpen((v) => !v)
            }}
            className={`${pillClassName} h-auto min-h-12 max-w-[min(20rem,calc(100vw-1.5rem))] flex-wrap justify-center gap-x-2 gap-y-1 py-2.5 text-center text-xs leading-snug sm:min-h-14 sm:max-w-[min(22rem,calc(100vw-1.5rem))] sm:text-sm sm:leading-tight text-white`}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            }}
            aria-haspopup="dialog"
            aria-expanded={eventOpen}
            aria-controls={eventOpen ? eventPanelId : undefined}
          >
            <Megaphone className="h-5 w-5 shrink-0 sm:h-7 sm:w-7" strokeWidth={2.25} aria-hidden />
            <span className="max-w-[min(14rem,calc(100vw-6rem))] sm:max-w-none">{t.eventBtn}</span>
          </button>
        </div>

        <div className="pointer-events-auto relative inline-flex w-max max-w-full flex-col items-end">
          {contactOpen && (
            <div
              id={contactPanelId}
              role="dialog"
              aria-modal="false"
              aria-label={t.contactTitle}
              className={popoverContactClassName}
            >
              <div className="flex items-start justify-between gap-2 pt-0.5">
                <p className="min-w-0 flex-1 text-pretty text-sm leading-snug text-[var(--color-text-muted)]">
                  {t.contactHint}
                </p>
                <button
                  type="button"
                  onClick={() => setContactOpen(false)}
                  className="shrink-0 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  aria-label={t.close}
                >
                  <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 text-left transition-colors hover:border-[var(--color-accent)]/40 hover:bg-white/[0.09]"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                      {t.whatsappLabel}
                    </span>
                    <span className="font-medium text-[var(--color-text)]">{t.phoneDisplay}</span>
                  </span>
                </a>
                <a
                  href={mailHref}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 text-left transition-colors hover:border-[var(--color-accent)]/40 hover:bg-white/[0.09]"
                >
                  <Mail className="h-5 w-5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                      {t.emailLabel}
                    </span>
                    <span className="break-all text-sm font-medium text-[var(--color-text)]">{t.email}</span>
                  </span>
                </a>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setEventOpen(false)
              setContactOpen((v) => !v)
            }}
            className={`${pillClassName} aspect-square max-w-none border border-[var(--color-accent)]/60 bg-black/75 px-0 text-[var(--color-accent)] backdrop-blur-md`}
            aria-label={t.contactBtn}
            aria-haspopup="dialog"
            aria-expanded={contactOpen}
            aria-controls={contactOpen ? contactPanelId : undefined}
          >
            <MessageCircle className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </div>
    </>
  )
}
