import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCtasConfig } from "@/contexts/CtasContext"
import { ADMIN_AUTH_KEY } from "./AdminLogin"
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"
import { ppfCtaPrimaryCompactClassName } from "@/lib/ppfCtaButton"
import type { CtasConfig, LocaleLabel } from "@/data/ctasSchema"
import { DEFAULT_MARCH_POSTER_URL } from "@/data/images"
import { posterSrcForDisplay } from "@/lib/posterImageSrc"
import {
  formatPosterSizeLimit,
  MARCH_POSTER_MAX_BLOB_CLIENT_BYTES,
  MARCH_POSTER_MAX_EMBED_BYTES,
} from "../../shared/marchPosterLimits"

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

function validateMarchPoster(url: string): string | null {
  const u = url.trim()
  if (!u) return null
  if (u.startsWith("data:image/")) {
    const maxEncoded = DISABLE_REMOTE_API ? 600_000 : 980_000
    if (u.length > maxEncoded) {
      return "That image is too large to store this way. Use a smaller file, a site image path (/images/…), a direct https:// link, or ask your web team to enable large uploads."
    }
    return null
  }
  if (u.startsWith("https://")) {
    try {
      new URL(u)
      return null
    } catch {
      return "Invalid poster URL"
    }
  }
  if (u.startsWith("/")) {
    if (u.includes("..") || u.length > 2048) return "Invalid poster path"
    return null
  }
  return "Use a site image path (/images/…), an https:// image link, upload a small file, or clear the field."
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
  for (const { key, v } of labels) {
    if (typeof v.en !== "string" || typeof v.ur !== "string") {
      return `${key}: en and ur must be strings`
    }
    if (!v.en.trim() || !v.ur.trim()) {
      return `${key}: both en and ur are required`
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
      if (file) setMessage({ type: "error", text: "Choose an image file (JPEG, PNG, WebP, or GIF)." })
      return
    }

    const maxPick = DISABLE_REMOTE_API
      ? MARCH_POSTER_MAX_EMBED_BYTES
      : marchPosterBlobUpload === true
        ? MARCH_POSTER_MAX_BLOB_CLIENT_BYTES
        : MARCH_POSTER_MAX_EMBED_BYTES

    if (file.size > maxPick) {
      const cap = formatPosterSizeLimit(maxPick)
      const hint =
        marchPosterBlobUpload === false
          ? " For larger files, use an /images/… or https:// link, or ask your web team to turn on cloud uploads."
          : ""
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
          setMessage({ type: "success", text: "Poster saved. Refresh the preview site to see it in the march popup." })
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
          const hint =
            typeof (data as { embedded?: boolean }).embedded === "boolean" &&
            (data as { embedded?: boolean }).embedded
              ? " (Saved inside settings — use a link for bigger images.)"
              : ""
          setMessage({
            type: "success",
            text: `Poster uploaded and saved.${hint} Refresh the site and open the march popup to confirm.`,
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="font-display text-lg font-semibold text-[var(--color-text)]">
            Site buttons &amp; march popup
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
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">
              Join Us (sitewide)
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Every <strong className="text-[var(--color-text)]">Join Us</strong> button on the public site uses this link
              and these labels (English and Urdu).
            </p>
            <label className="mb-1 mt-4 block text-sm font-medium text-[var(--color-text)]">
              Where Join Us goes
            </label>
            <input
              type="url"
              value={form.joinUrl}
              onChange={(e) => setForm((f) => ({ ...f, joinUrl: e.target.value }))}
              placeholder="https://chat.whatsapp.com/… or form link"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            <div className="mt-4">
              <LocaleFields
                label="Button wording"
                value={form.joinLabel}
                onChange={(joinLabel) => setForm((f) => ({ ...f, joinLabel }))}
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">
              March floating bar &amp; dialog copy
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              The red march pill, the popup title, and the text under the poster — English and Urdu. Click{" "}
              <strong className="text-[var(--color-text)]">Save</strong> at the bottom when you are done.
            </p>
            <div className="mt-4 space-y-4">
              <LocaleFields
                label="Pill &amp; dialog title"
                value={form.marchEventTitle}
                onChange={(marchEventTitle) => setForm((f) => ({ ...f, marchEventTitle }))}
              />
              <LocaleFields
                label="Dialog text (below poster)"
                value={form.marchEventBody}
                onChange={(marchEventBody) => setForm((f) => ({ ...f, marchEventBody }))}
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">
              March modal poster
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Picture shown in the march popup. Paste a link to an image on this site (starts with{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-[11px]">/images/</code>) or any{" "}
              <strong className="text-[var(--color-text)]">https://</strong> image address. You can also use{" "}
              <strong className="text-[var(--color-text)]">Upload</strong> for smaller files (up to{" "}
              {formatPosterSizeLimit(MARCH_POSTER_MAX_EMBED_BYTES)} unless your team enabled larger cloud uploads).
            </p>
            <label className="mb-1 mt-4 block text-sm font-medium text-[var(--color-text)]">
              Poster image URL
            </label>
            <input
              type="text"
              value={form.marchPosterUrl.startsWith("data:") ? "" : form.marchPosterUrl}
              onChange={(e) => {
                setMessage(null)
                setForm((f) => ({ ...f, marchPosterUrl: e.target.value }))
              }}
              placeholder={`${DEFAULT_MARCH_POSTER_URL} or https://…`}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            {form.marchPosterUrl.startsWith("data:") && (
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                A small image is saved inside your settings (the address box is hidden for this type). Use{" "}
                <strong className="text-[var(--color-text)]">Hide poster</strong> to remove it, or upload again to
                replace.
              </p>
            )}
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-text)]">Upload size limit:</span>{" "}
              {formatPosterSizeLimit(posterMaxUploadBytes)} per file.
              {!DISABLE_REMOTE_API && marchPosterBlobUpload === false
                ? " For bigger files, use an /images/… or https:// link instead."
                : null}
              {!DISABLE_REMOTE_API && marchPosterBlobUpload === true
                ? " Larger files are allowed when cloud uploads are enabled."
                : null}
              {!DISABLE_REMOTE_API && marchPosterBlobUpload === null ? " Checking limits…" : null}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-white/10">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={posterUploading}
                  title={`Max ${formatPosterSizeLimit(posterMaxUploadBytes)}`}
                  onChange={handleMarchPosterFile}
                />
                {posterUploading ? "Uploading…" : "Upload image (WebP, PNG, …)"}
              </label>
              <button
                type="button"
                onClick={() => {
                  setMessage(null)
                  setForm((f) => ({ ...f, marchPosterUrl: DEFAULT_MARCH_POSTER_URL }))
                }}
                className="rounded-md border border-white/20 px-3 py-2 text-sm text-[var(--color-text)] transition hover:bg-white/5"
              >
                Use site default poster
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessage(null)
                  setForm((f) => ({ ...f, marchPosterUrl: "" }))
                }}
                className="rounded-md border border-white/20 px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
              >
                Hide poster
              </button>
            </div>
            {form.marchPosterUrl.trim() ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2">
                <img
                  key={posterSrcForDisplay(form.marchPosterUrl)}
                  src={posterSrcForDisplay(form.marchPosterUrl)}
                  alt="Poster preview"
                  className="mx-auto max-h-64 w-full max-w-md object-contain"
                />
              </div>
            ) : null}
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
      </main>
    </div>
  )
}
