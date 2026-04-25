import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCtasConfig } from "@/contexts/CtasContext"
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"
import { ppfCtaPrimaryCompactClassName } from "@/lib/ppfCtaButton"
import type { CtasConfig, LocaleLabel } from "@/data/ctasSchema"
import { posterSrcForDisplay } from "@/lib/posterImageSrc"
import {
  formatPosterSizeLimit,
  MARCH_POSTER_MAX_BLOB_CLIENT_BYTES,
  MARCH_POSTER_MAX_EMBED_BYTES,
} from "../../shared/marchPosterLimits"

const localeFieldClassName =
  "w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"

/** Poster supporting text only: plain CSS hides scrollbars reliably (see `index.css`). */
const localePosterSupportingTextareaClassName = `${localeFieldClassName} admin-poster-supporting-field leading-normal`

function LocaleFields({
  label,
  hint,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  hint?: string
  value: LocaleLabel
  onChange: (v: LocaleLabel) => void
  multiline?: boolean
}) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        {hint ? (
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">{hint}</p>
        ) : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            English
          </span>
          {multiline ? (
            <textarea
              placeholder="English text"
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              className={localePosterSupportingTextareaClassName}
            />
          ) : (
            <input
              type="text"
              placeholder="English text"
              value={value.en}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              className={localeFieldClassName}
            />
          )}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Urdu
          </span>
          {multiline ? (
            <textarea
              placeholder="Urdu text"
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              className={localePosterSupportingTextareaClassName}
            />
          ) : (
            <input
              type="text"
              placeholder="Urdu text"
              value={value.ur}
              onChange={(e) => onChange({ ...value, ur: e.target.value })}
              className={localeFieldClassName}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function validateMarchPoster(url: string): string | null {
  const u = url.trim()
  if (!u) return null
  if (u.startsWith("data:image/")) {
    const maxEncoded = DISABLE_REMOTE_API ? 600_000 : 980_000
    if (u.length > maxEncoded) {
      return "That image is too large. Try a smaller photo, or ask your web team for help."
    }
    return null
  }
  if (u.startsWith("https://")) {
    try {
      new URL(u)
      return null
    } catch {
      return "That address does not look valid. Check with your web team."
    }
  }
  if (u.startsWith("/")) {
    if (u.includes("..") || u.length > 2048) return "That address is not allowed."
    return null
  }
  return "The saved poster image address is not valid. Choose a new photo from your device to replace it, or ask your web team."
}

function validate(config: CtasConfig): string | null {
  const labels: { key: string; v: LocaleLabel }[] = [
    { key: "joinLabel", v: config.joinLabel },
    { key: "contactLabel", v: config.contactLabel },
    { key: "heroCtaHeading", v: config.heroCtaHeading },
    { key: "heroCtaSubtext", v: config.heroCtaSubtext },
    { key: "volunteerLabel", v: config.volunteerLabel },
    { key: "donateLabel", v: config.donateLabel },
    { key: "marchEventTitle", v: config.marchEventTitle },
    { key: "marchEventBody", v: config.marchEventBody },
  ]
  const labelHint: Record<string, string> = {
    joinLabel: "Join Us wording",
    contactLabel: "Contact wording",
    heroCtaHeading: "Hero heading",
    heroCtaSubtext: "Hero subtext",
    volunteerLabel: "Volunteer wording",
    donateLabel: "Donate wording",
    marchEventTitle: "Poster popup title",
    marchEventBody: "Poster supporting text",
  }
  for (const { key, v } of labels) {
    if (typeof v.en !== "string" || typeof v.ur !== "string") {
      return `Something went wrong with “${labelHint[key] ?? key}”. Refresh the page and try again.`
    }
    if (!v.en.trim() || !v.ur.trim()) {
      return `Please fill in both English and Urdu for: ${labelHint[key] ?? key}.`
    }
  }
  return validateMarchPoster(config.marchPosterUrl ?? "")
}

function fileToBase64Payload(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const comma = dataUrl.indexOf(",")
      const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
      resolve({ base64, mimeType: file.type })
    }
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"))
    reader.readAsDataURL(file)
  })
}

export function AdminCtas() {
  const navigate = useNavigate()
  const { ctas, saveCtas } = useCtasConfig()
  const [form, setForm] = useState<CtasConfig>(ctas)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [posterUploading, setPosterUploading] = useState(false)
  /** `null` until /api/admin/me — assume strict embed limit until then */
  const [marchPosterBlobUpload, setMarchPosterBlobUpload] = useState<boolean | null>(null)

  useEffect(() => {
    setForm(ctas)
  }, [ctas])

  useEffect(() => {
    if (DISABLE_REMOTE_API) {
      setMarchPosterBlobUpload(false)
      return
    }
    let cancelled = false
    fetch(apiUrl("/api/admin/me"), { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) return null
        return (await r.json()) as { marchPosterBlobUpload?: boolean }
      })
      .then((data) => {
        if (cancelled || !data) return
        setMarchPosterBlobUpload(!!data.marchPosterBlobUpload)
      })
      .catch(() => {
        if (!cancelled) setMarchPosterBlobUpload(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
      setMessage({ type: "success", text: "Saved. Changes appear on the live site after a refresh." })
    } else {
      setMessage({ type: "error", text: result.error ?? "Failed to save" })
    }
  }

  const handleMarchPosterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !file.type.startsWith("image/")) {
      if (file) setMessage({ type: "error", text: "Please choose a photo (not another file type)." })
      return
    }

    const maxPick = DISABLE_REMOTE_API
      ? MARCH_POSTER_MAX_EMBED_BYTES
      : marchPosterBlobUpload === true
        ? MARCH_POSTER_MAX_BLOB_CLIENT_BYTES
        : MARCH_POSTER_MAX_EMBED_BYTES

    if (file.size > maxPick) {
      const cap = formatPosterSizeLimit(maxPick)
      const hint = marchPosterBlobUpload === false ? " Try a smaller photo." : ""
      setMessage({
        type: "error",
        text: `This image is too large (${formatPosterSizeLimit(file.size)}). Maximum upload size is ${cap}.${hint}`,
      })
      return
    }

    if (DISABLE_REMOTE_API) {
      try {
        const reader = new FileReader()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error ?? new Error("Read failed"))
          reader.readAsDataURL(file)
        })
        if (dataUrl.length > 600_000) {
          setMessage({ type: "error", text: "Image is too large for local storage; compress it or use a smaller file." })
          return
        }
        const next = { ...form, marchPosterUrl: dataUrl }
        setForm(next)
        const saved = await saveCtas(next)
        if (saved.ok) {
          setMessage({ type: "success", text: "Poster saved. Refresh the preview site to see it in the poster popup." })
        } else {
          setMessage({
            type: "error",
            text: saved.error ?? "Poster loaded but could not save — click Save.",
          })
        }
      } catch {
        setMessage({ type: "error", text: "Could not read the file." })
      }
      return
    }

    setPosterUploading(true)
    setMessage(null)
    try {
      const { base64, mimeType } = await fileToBase64Payload(file)
      const res = await fetch(apiUrl("/api/admin/march-poster"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ base64, mimeType, filename: file.name }),
      })
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok) {
        const apiErr = typeof data.error === "string" ? data.error : ""
        setMessage({ type: "error", text: apiErr || "Upload failed" })
        return
      }
      if (
        typeof data.url === "string" &&
        (data.url.startsWith("https://") || data.url.startsWith("data:image/"))
      ) {
        const url = data.url
        const next = { ...form, marchPosterUrl: url }
        setForm(next)
        const saved = await saveCtas(next)
        if (saved.ok) {
          setMessage({
            type: "success",
            text: "Poster uploaded and saved. Refresh the site and open the poster popup to confirm.",
          })
        } else {
          setMessage({
            type: "error",
            text:
              saved.error ??
              "Upload worked but saving failed. Click Save again, or contact support if it keeps happening.",
          })
        }
      } else {
        setMessage({ type: "error", text: "Upload returned an unexpected response." })
      }
    } catch {
      setMessage({ type: "error", text: "Upload request failed." })
    } finally {
      setPosterUploading(false)
    }
  }

  const posterMaxUploadBytes = DISABLE_REMOTE_API
    ? MARCH_POSTER_MAX_EMBED_BYTES
    : marchPosterBlobUpload === true
      ? MARCH_POSTER_MAX_BLOB_CLIENT_BYTES
      : MARCH_POSTER_MAX_EMBED_BYTES

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
          <p className="text-sm text-[var(--color-text-muted)]">
            Use <strong className="text-[var(--color-text)]">Save</strong> at the bottom when you finish a section.
          </p>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">
              Join Us — all pages
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Controls every <strong className="text-[var(--color-text)]">Join Us</strong> button across the website:
              where it sends people, and the label in each language.
            </p>
            <label className="mb-1 mt-5 block text-sm font-medium text-[var(--color-text)]">
              Where visitors go when they tap Join Us
            </label>
            <input
              type="url"
              value={form.joinUrl}
              onChange={(e) => setForm((f) => ({ ...f, joinUrl: e.target.value }))}
              placeholder="WhatsApp group link or other sign-up link"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            <div className="mt-5">
              <LocaleFields
                label="Words on the Join Us button"
                hint="Shown on the button in the header and other sections."
                value={form.joinLabel}
                onChange={(joinLabel) => setForm((f) => ({ ...f, joinLabel }))}
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">
              Poster — red button &amp; popup words
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              The floating red control at the bottom of the screen and the poster window it opens. The CTA can be any
              campaign or message you choose.
            </p>
            <div className="mt-5 space-y-6">
              <LocaleFields
                label="Main title"
                hint="Shown on the red button and at the top of the poster popup."
                value={form.marchEventTitle}
                onChange={(marchEventTitle) => setForm((f) => ({ ...f, marchEventTitle }))}
              />
              <LocaleFields
                label="Supporting text"
                hint="Short paragraph under the image in the poster popup."
                value={form.marchEventBody}
                onChange={(marchEventBody) => setForm((f) => ({ ...f, marchEventBody }))}
                multiline
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">Poster only</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              The image shown in the poster popup. Choose a photo from your device to replace it, then save.
            </p>

            <div className="mt-5">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:bg-[var(--color-accent)]/25">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={posterUploading}
                  title={`Maximum ${formatPosterSizeLimit(posterMaxUploadBytes)} per photo`}
                  onChange={handleMarchPosterFile}
                />
                {posterUploading ? "Working…" : "Choose photo"}
              </label>
            </div>

            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              Maximum photo size: {formatPosterSizeLimit(posterMaxUploadBytes)}
              {!DISABLE_REMOTE_API && marchPosterBlobUpload === null ? " (checking…)" : null}.
            </p>

            {form.marchPosterUrl.trim() ? (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Preview
                </p>
                <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2">
                  <img
                    key={posterSrcForDisplay(form.marchPosterUrl)}
                    src={posterSrcForDisplay(form.marchPosterUrl)}
                    alt=""
                    className="mx-auto max-h-72 w-full max-w-md object-contain"
                  />
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[var(--color-text-muted)]">
                No poster image yet — the popup will open without a picture until you choose one.
              </p>
            )}
          </div>

          {message && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p
                className={
                  message.type === "success"
                    ? "min-w-0 flex-1 text-sm text-[var(--color-accent-hover)]"
                    : "min-w-0 flex-1 text-sm text-red-400"
                }
              >
                {message.text}
              </p>
              {message.type === "error" ? (
                <button
                  type="button"
                  onClick={() => setMessage(null)}
                  className="shrink-0 self-start rounded-md border border-white/20 px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]"
                >
                  Dismiss
                </button>
              ) : null}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={ppfCtaPrimaryCompactClassName()}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
  )
}
