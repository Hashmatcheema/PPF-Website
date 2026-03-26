import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCtasConfig } from "@/contexts/CtasContext"
import { ADMIN_AUTH_KEY } from "./AdminLogin"
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"
import type { CtasConfig, LocaleLabel } from "@/data/ctasSchema"

function LocaleFields({
  label,
  value,
  onChange,
}: {
  label: string
  value: LocaleLabel
  onChange: (v: LocaleLabel) => void
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          placeholder="English"
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        <input
          type="text"
          placeholder="Urdu"
          value={value.ur}
          onChange={(e) => onChange({ ...value, ur: e.target.value })}
          className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>
    </div>
  )
}

function validate(config: CtasConfig): string | null {
  const labels: { key: string; v: LocaleLabel }[] = [
    { key: "joinLabel", v: config.joinLabel },
    { key: "contactLabel", v: config.contactLabel },
    { key: "heroCtaHeading", v: config.heroCtaHeading },
    { key: "heroCtaSubtext", v: config.heroCtaSubtext },
    { key: "volunteerLabel", v: config.volunteerLabel },
    { key: "donateLabel", v: config.donateLabel },
  ]
  for (const { key, v } of labels) {
    if (typeof v.en !== "string" || typeof v.ur !== "string") {
      return `${key}: en and ur must be strings`
    }
    if (!v.en.trim() || !v.ur.trim()) {
      return `${key}: both en and ur are required`
    }
  }
  return null
}

export function AdminCtas() {
  const navigate = useNavigate()
  const { ctas, saveCtas } = useCtasConfig()

  const handleLogout = async () => {
    if (!DISABLE_REMOTE_API) {
      try {
        await fetch(apiUrl("/api/admin/logout"), {
          method: "POST",
          credentials: "include",
        })
      } catch {
        /* network/cookie clear best-effort */
      }
    } else {
      try {
        sessionStorage.removeItem(ADMIN_AUTH_KEY)
      } catch {
        /* storage unavailable */
      }
    }
    navigate("/admin/login", { replace: true })
  }
  const [form, setForm] = useState<CtasConfig>(ctas)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(ctas)
  }, [ctas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate(form)
    if (err) {
      setMessage({ type: "error", text: err })
      return
    }
    setSaving(true)
    setMessage(null)
    const result = await saveCtas(form)
    setSaving(false)
    if (result.ok) {
      setMessage({ type: "success", text: "CTAs saved successfully." })
    } else {
      setMessage({ type: "error", text: result.error ?? "Failed to save" })
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="font-display text-lg font-semibold text-[var(--color-text)]">
            PPF Admin – CTAs
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              Log out
            </button>
            <Link
              to="/"
              className="text-sm font-medium text-[var(--color-accent)] transition hover:underline"
            >
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
              Join URL
            </label>
            <input
              type="url"
              value={form.joinUrl}
              onChange={(e) => setForm((f) => ({ ...f, joinUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <LocaleFields
            label="Join label"
            value={form.joinLabel}
            onChange={(joinLabel) => setForm((f) => ({ ...f, joinLabel }))}
          />
          <LocaleFields
            label="Contact label"
            value={form.contactLabel}
            onChange={(contactLabel) => setForm((f) => ({ ...f, contactLabel }))}
          />
          <LocaleFields
            label="Hero CTA heading"
            value={form.heroCtaHeading}
            onChange={(heroCtaHeading) => setForm((f) => ({ ...f, heroCtaHeading }))}
          />
          <LocaleFields
            label="Hero CTA subtext"
            value={form.heroCtaSubtext}
            onChange={(heroCtaSubtext) => setForm((f) => ({ ...f, heroCtaSubtext }))}
          />
          <LocaleFields
            label="Volunteer label"
            value={form.volunteerLabel}
            onChange={(volunteerLabel) => setForm((f) => ({ ...f, volunteerLabel }))}
          />
          <LocaleFields
            label="Donate label"
            value={form.donateLabel}
            onChange={(donateLabel) => setForm((f) => ({ ...f, donateLabel }))}
          />

          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-sm text-emerald-400"
                  : "text-sm text-red-400"
              }
            >
              {message.text}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
