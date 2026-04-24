import { useState } from "react"
import { ArrowRight, Heart, UserPlus, X } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { ppfCtaPrimaryClassName } from "@/lib/ppfCtaButton"
import { cn } from "@/lib/utils"

export function Act({ lang }: { lang: Locale }) {
  const t = content[lang].contact
  const [showDonate, setShowDonate] = useState(false)
  const volunteerUrl = "formUrl" in t.volunteer && t.volunteer.formUrl ? t.volunteer.formUrl : "https://docs.google.com/forms/d/e/1FAIpQLScmKyTfY3oCA069IjnZRS-mL_RfHfXpHA2HfKkIoLAF0lw4Tg/viewform"

  return (
    <section id="act" className="py-24 md:py-32">
      <div className="wrap">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]">
          Get involved
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
          {t.intro}
        </h2>
        <p className="mt-4 max-w-xl text-[var(--color-text-muted)]">
          {lang === "en" ? "Choose how you want to contribute — your time or your support." : "اپنا وقت یا اپنی حمایت — منتخب کریں کہ آپ کیسے شامل ہونا چاہتے ہیں۔"}
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Volunteer card — modern block */}
          <div
            id="volunteer"
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)] p-0 transition hover:border-[var(--color-accent)]/40 hover:shadow-xl"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-hover)]" aria-hidden />
            <div className="p-8 pl-10">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-[var(--color-text)] md:text-2xl">
                    {t.volunteer.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                    {t.volunteer.body}
                  </p>
                </div>
              </div>
              {"roles" in t.volunteer && Array.isArray(t.volunteer.roles) && t.volunteer.roles.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {lang === "en" ? "Pick a role" : "کردار منتخب کریں"}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {t.volunteer.roles.map((role, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 text-xs font-medium text-[var(--color-text)] transition group-hover:border-[var(--color-accent)]/30"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <a
                href={volunteerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(ppfCtaPrimaryClassName(), "mt-6 w-full pl-5 pr-4")}
              >
                {t.volunteer.cta}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
              <p className="mt-2 text-center text-[11px] text-[var(--color-text-muted)]">
                {lang === "en" ? "Opens volunteer form in a new tab" : "نیا ٹیب میں فارم کھلے گا"}
              </p>
            </div>
          </div>

          {/* Donate card */}
          <div
            id="donate"
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition hover:border-[var(--color-accent)]/30 hover:shadow-lg"
          >
            <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition group-hover:bg-[var(--color-accent)]/20">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-display pr-14 text-xl font-bold text-[var(--color-text)] md:text-2xl">
              {t.donate.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
              {t.donate.body}
            </p>
            {"contactName" in t.donate && t.donate.contactName && (
              <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {lang === "en" ? "Contact" : "رابطہ"}
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text)]">{t.donate.contactName}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{t.donate.contactRole}</p>
                <a
                  href={`tel:${t.donate.contactPhone?.replace(/\s/g, "")}`}
                  className="mt-2 inline-flex items-center text-[var(--color-accent)] font-medium hover:underline"
                >
                  {t.donate.contactPhone}
                </a>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowDonate(true)}
              className={cn(ppfCtaPrimaryClassName(), "mt-6 w-full")}
            >
              {t.donate.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Donate modal */}
      {showDonate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowDonate(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowDonate(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--color-text-muted)] transition hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
              aria-label={lang === "en" ? "Close" : "بند کریں"}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display pr-10 text-xl font-bold text-[var(--color-text)]">
              {lang === "en" ? "Donate — Contact" : "عطیہ — رابطہ"}
            </h3>
            <div className="mt-4 space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4 text-sm">
              {"contactName" in t.donate && t.donate.contactName ? (
                <>
                  <p className="font-semibold text-[var(--color-text)]">{t.donate.contactName}</p>
                  <p className="text-[var(--color-text-muted)]">{t.donate.contactRole}</p>
                  <a
                    href={`tel:${t.donate.contactPhone?.replace(/\s/g, "")}`}
                    className="inline-flex font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {t.donate.contactPhone}
                  </a>
                </>
              ) : (
                <>
                  <p><span className="text-[var(--color-text-muted)]">Bank Name:</span> <span className="font-semibold text-[var(--color-text)]">Dummy Bank Ltd.</span></p>
                  <p><span className="text-[var(--color-text-muted)]">Account Title:</span> <span className="font-semibold text-[var(--color-text)]">Pak-Palestine Forum</span></p>
                  <p><span className="text-[var(--color-text-muted)]">Account No:</span> <span className="font-semibold text-[var(--color-text)]">1234 5678 9012 3456</span></p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowDonate(false)}
              className={cn(ppfCtaPrimaryClassName(), "mt-6 w-full")}
            >
              {lang === "en" ? "Close" : "بند کریں"}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
