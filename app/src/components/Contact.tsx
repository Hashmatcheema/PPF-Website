import { useState } from "react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
<<<<<<< HEAD

const API_BASE = import.meta.env.VITE_CTAS_API_URL ?? ""
=======
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"
>>>>>>> modifics

export function Contact({ lang }: { lang: Locale }) {
  const t = content[lang].contact
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const website = data.get("website")
    if (website && String(website).trim()) {
      setError(lang === "ur" ? "نامناسب جمع کرنے کی کوشش۔" : "Invalid submission.")
      return
    }
<<<<<<< HEAD
    if (!API_BASE) {
=======
    if (DISABLE_REMOTE_API) {
>>>>>>> modifics
      setSent(true)
      setTimeout(() => setSent(false), 2000)
      return
    }
    setSubmitting(true)
    try {
<<<<<<< HEAD
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/api/contact`, {
=======
      const res = await fetch(apiUrl("/api/contact"), {
>>>>>>> modifics
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website") || "",
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to send")
      }
      setSent(true)
      form.reset()
      setTimeout(() => setSent(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="wrap">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          Contact
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold text-[var(--color-text)] md:text-4xl">
          {t.form.title}
        </h2>
        <form
          className="mt-12 max-w-md space-y-5"
          onSubmit={handleSubmit}
        >
          {/* Honeypot: hidden from users; bots that fill it are rejected */}
          <div className="absolute -left-[9999px] top-0" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-muted)]">
              {t.form.name}
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text)] shadow-md outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)]">
              {t.form.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text)] shadow-md outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-muted)]">
              {t.form.message}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="mt-1.5 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text)] shadow-md outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={sent || submitting}
            className="h-11 rounded-md bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-accent-hover)] disabled:opacity-70"
          >
            {submitting
              ? (lang === "ur" ? "بھیج رہے ہیں..." : "Sending...")
              : sent
                ? (lang === "ur" ? "بھیجا گیا!" : "Sent!")
                : t.form.send}
          </button>
        </form>
      </div>
    </section>
  )
}
