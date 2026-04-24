import { useEffect, useId, useState } from "react"
import { Mail, Megaphone, MessageCircle, X } from "lucide-react"
import { Dialog } from "radix-ui"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { useCtasConfig } from "@/contexts/CtasContext"
import { ppfCtaFlex, ppfCtaSolid } from "@/lib/ppfCtaButton"
import { posterSrcForDisplay } from "@/lib/posterImageSrc"
import { cn } from "@/lib/utils"

const barClassName =
  "pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-[max(1rem,env(safe-area-inset-left,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-40 flex min-w-0 flex-row flex-nowrap items-end justify-end gap-2 sm:bottom-6 sm:left-6 sm:right-6 sm:gap-3 md:gap-4"

/** Primary pill (march CTA): fills space beside icon on small screens, caps width on large */
const eventPillClassName = cn(
  ppfCtaFlex,
  ppfCtaSolid,
  "pointer-events-auto h-12 w-auto min-w-0 max-w-[min(22rem,calc(100vw-5.5rem))] flex-nowrap px-3 py-2 text-[0.8125rem] font-semibold leading-tight sm:h-14 sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-sm md:max-w-md md:px-6 md:text-base lg:max-w-lg",
  /* Stronger than default CTAs: halo + ring so it reads over any page content */
  "relative z-[1] font-bold ring-2 ring-white/40",
  "shadow-[0_12px_40px_rgba(255,31,34,0.55),inset_0_1px_0_rgba(255,255,255,0.22),0_0_64px_-8px_rgba(255,31,34,0.48)]",
  "hover:shadow-[0_16px_52px_rgba(255,31,34,0.65),inset_0_1px_0_rgba(255,255,255,0.28),0_0_88px_-6px_rgba(255,31,34,0.52)] hover:ring-white/55",
)

/** Contact FAB: frosted outline circle (not solid red) so it complements the march pill */
const contactFabClassName = cn(
  ppfCtaFlex,
  "pointer-events-auto aspect-square h-12 w-12 max-w-none shrink-0 rounded-full border border-white/20 bg-gradient-to-br from-white/[0.12] to-black/55 px-0 text-white shadow-[0_8px_28px_rgba(0,0,0,0.38)] ring-1 ring-inset ring-white/[0.07] backdrop-blur-xl transition-[border-color,background-color,color,box-shadow] hover:border-[var(--color-accent)]/50 hover:from-white/[0.16] hover:to-black/60 hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50 sm:h-14 sm:w-14",
)

const popoverBaseClassName =
  "pointer-events-auto absolute bottom-full z-[60] mb-2 w-[min(20rem,calc(100vw-2rem))] max-h-[min(28rem,calc(100vh-7rem))] overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-[var(--color-bg)]/95 p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/40 backdrop-blur-md sm:p-5"

const popoverContactClassName = `${popoverBaseClassName} right-0 origin-bottom-right`

const eventModalOverlayClassName =
  "fixed inset-0 z-[55] bg-black/65 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"

/** March / event dialog: portrait-poster friendly width, lightbox-style shell */
const eventModalContentClassName =
  "fixed left-1/2 top-1/2 z-[60] max-h-[min(92dvh,calc(100dvh-1.25rem))] w-[min(23rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[var(--color-bg)]/97 p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_24px_80px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/10 backdrop-blur-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:p-5"

export function FloatingCta({ lang }: { lang: Locale }) {
  const { ctas } = useCtasConfig()
  const t = content[lang].floatingBar
  const marchTitle = (ctas.marchEventTitle?.[lang] ?? "").trim() || t.eventTitle
  const marchBody = (ctas.marchEventBody?.[lang] ?? "").trim() || t.eventBody
  const marchPoster = ctas.marchPosterUrl?.trim() ?? ""
  const marchPosterSrc = marchPoster ? posterSrcForDisplay(marchPoster) : ""
  const [contactOpen, setContactOpen] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)
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
      {contactOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[35] bg-black/35 backdrop-blur-[1px] transition-opacity"
          aria-label={t.dismissOverlay}
          onClick={() => setContactOpen(false)}
        />
      )}

      <div className={barClassName}>
        {/* Event (march) left of contact icon; both grouped on the right via justify-end */}
        <Dialog.Root
          open={eventOpen}
          onOpenChange={(open) => {
            setEventOpen(open)
            if (open) setContactOpen(false)
          }}
        >
          <div className="pointer-events-auto relative flex w-auto min-w-0 max-w-[calc(100vw-5.5rem)] flex-col items-end sm:max-w-[min(28rem,calc(100vw-5.5rem))]">
            <Dialog.Portal>
              <Dialog.Overlay className={eventModalOverlayClassName} />
              <Dialog.Content id={eventPanelId} className={eventModalContentClassName}>
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <Dialog.Title className="font-display pr-2 text-base font-semibold leading-tight text-[var(--color-text)] sm:text-lg">
                    {marchTitle}
                  </Dialog.Title>
                  <Dialog.Close
                    type="button"
                    className="shrink-0 rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    aria-label={t.close}
                  >
                    <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </Dialog.Close>
                </div>
                {marchPosterSrc ? (
                  <figure className="mt-5 flex w-full flex-col items-center">
                    <div
                      className={cn(
                        "w-fit max-w-full",
                        "rounded-[3px] shadow-[0_22px_48px_-10px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.14)]",
                        "ring-1 ring-inset ring-white/25",
                      )}
                    >
                      {/* Passepartout / mat — reads as a framed poster, not a video strip */}
                      <div
                        className={cn(
                          "rounded-[3px] bg-gradient-to-br from-[#f6f3ec] via-[#ebe6dc] to-[#d9d3c8]",
                          "p-2.5 sm:p-[14px]",
                          "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_6px_rgba(0,0,0,0.06)]",
                        )}
                      >
                        <div className="overflow-hidden rounded-[1px] bg-neutral-900 shadow-[inset_0_0_24px_rgba(0,0,0,0.35)] ring-1 ring-black/20">
                          <img
                            key={marchPosterSrc}
                            src={marchPosterSrc}
                            alt={marchTitle}
                            className="mx-auto block h-auto max-h-[min(58dvh,520px)] w-auto max-w-[min(18.5rem,calc(100vw-3.5rem))] object-contain object-center sm:max-h-[min(62dvh,560px)] sm:max-w-[min(19.25rem,calc(100vw-4rem))]"
                            sizes="(max-width: 24rem) calc(100vw - 3.5rem), 19rem"
                            decoding="async"
                            fetchPriority="low"
                          />
                        </div>
                      </div>
                    </div>
                  </figure>
                ) : null}
                <Dialog.Description className="mt-4 border-t border-white/10 pt-4 text-pretty text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {marchBody}
                </Dialog.Description>
              </Dialog.Content>
            </Dialog.Portal>
            <div className="ppf-floating-cta-breathe w-auto max-w-full">
              <button
                type="button"
                onClick={() => {
                  setContactOpen(false)
                  setEventOpen((v) => !v)
                }}
                className={eventPillClassName}
                aria-haspopup="dialog"
                aria-expanded={eventOpen}
                aria-controls={eventOpen ? eventPanelId : undefined}
              >
                <Megaphone className="h-4 w-4 shrink-0 sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={2.25} aria-hidden />
                <span className="min-w-0 flex-1 text-balance text-center sm:max-w-full sm:flex-none sm:text-pretty">
                  {marchTitle}
                </span>
              </button>
            </div>
          </div>
        </Dialog.Root>

        <div className="pointer-events-auto relative flex shrink-0 flex-col items-end">
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
            className={contactFabClassName}
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
