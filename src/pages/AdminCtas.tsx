import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCtasConfig } from "@/contexts/CtasContext"
import { ADMIN_AUTH_KEY } from "./AdminLogin"
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"
import { ppfCtaPrimaryCompactClassName } from "@/lib/ppfCtaButton"
import type { CtasConfig, LocaleLabel } from "@/data/ctasSchema"
import { DEFAULT_MARCH_POSTER_URL } from "@/data/images"

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
    if (!DISABLE_REMOTE_API) {
      return "With the live API, use an https:// image URL or upload (no data URLs in Redis)."
    }
    const maxEncoded = 600_000
    if (u.length > maxEncoded) {
      return "Poster file is too large for local save; use a smaller image or an https:// URL."
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
  return "Poster must be empty, /images/… on this site, an https:// image URL, or an uploaded image."
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

  const handleMarchPosterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !file.type.startsWith("image/")) {
      if (file) setMessage({ type: "error", text: "Choose an image file (JPEG, PNG, WebP, or GIF)." })
      return
    }
    const maxPick = 1.5 * 1024 * 1024
    if (file.size > maxPick) {
      setMessage({ type: "error", text: "Image must be about 1.5 MB or smaller." })
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
          setMessage({ type: "success", text: "Poster saved. Refresh the site to see it in the march dialog." })
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
        const blobMissing =
          apiErr.includes("BLOB") || apiErr.toLowerCase().includes("not configured")
        setMessage({
          type: "error",
          text: blobMissing
            ? `${apiErr || "Upload is not configured."} Add the image under public/images in the repo, use /images/… in Poster URL, then Save — or add BLOB_READ_WRITE_TOKEN in Vercel for drag-and-drop upload.`
            : apiErr || "Upload failed",
        })
        return
      }
      if (typeof data.url === "string" && data.url.startsWith("https://")) {
        const url = data.url
        const next = { ...form, marchPosterUrl: url }
        setForm(next)
        const saved = await saveCtas(next)
        if (saved.ok) {
          setMessage({
            type: "success",
            text: "Poster uploaded and saved. Open the march dialog on the site to confirm.",
          })
        } else {
          setMessage({
            type: "error",
            text:
              saved.error ??
              "Upload succeeded but save failed — click Save, or configure Redis for CTAs.",
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
            <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
              Join URL
            </label>
            <p className="mb-2 text-xs text-[var(--color-text-muted)]">
              This is the web link where users will be redirected when they click the "Join Us" buttons across the website (for example, a WhatsApp Group, Telegram, or Google Form link).
            </p>
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

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-[var(--color-text)]">
              March modal poster
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Shown inside the &quot;Pakistanis March For Gaza&quot; dialog (WebP recommended). Stored with your other
              CTAs in Redis (no separate database). Production uploads use{" "}
              <a
                href="https://vercel.com/docs/vercel-blob"
                className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Blob
              </a>{" "}
              when <code className="rounded bg-white/10 px-1 py-0.5 text-[11px]">BLOB_READ_WRITE_TOKEN</code> is set;
              otherwise paste a same-site path like{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-[11px]">{DEFAULT_MARCH_POSTER_URL}</code> or an{" "}
              <strong className="text-[var(--color-text)]">https://</strong> image URL.
            </p>
            <p className="mt-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text)]">Upload</strong> only works if this project has{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-[11px]">BLOB_READ_WRITE_TOKEN</code> in Vercel
              env. <strong className="text-[var(--color-text)]">Without Blob,</strong> add images under{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-[11px]">public/images/</code> in Git, deploy, then
              set Poster URL to <code className="rounded bg-white/10 px-1 py-0.5 text-[11px]">/images/your-file.jpg</code>{" "}
              and click <strong className="text-[var(--color-text)]">Save</strong> — no upload button needed.
            </p>
            <label className="mb-1 mt-4 block text-sm font-medium text-[var(--color-text)]">
              Poster image URL
            </label>
            <input
              type="text"
              value={form.marchPosterUrl.startsWith("data:") ? "" : form.marchPosterUrl}
              onChange={(e) => setForm((f) => ({ ...f, marchPosterUrl: e.target.value }))}
              placeholder={`${DEFAULT_MARCH_POSTER_URL} or https://…`}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            {form.marchPosterUrl.startsWith("data:") && (
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                A file is embedded for local preview (URL field hidden). Clear with &quot;Remove poster&quot; or replace
                by uploading again.
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-white/10">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={posterUploading}
                  onChange={handleMarchPosterFile}
                />
                {posterUploading ? "Uploading…" : "Upload image (WebP, PNG, …)"}
              </label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, marchPosterUrl: DEFAULT_MARCH_POSTER_URL }))}
                className="rounded-md border border-white/20 px-3 py-2 text-sm text-[var(--color-text)] transition hover:bg-white/5"
              >
                Use site default poster
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, marchPosterUrl: "" }))}
                className="rounded-md border border-white/20 px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
              >
                Hide poster
              </button>
            </div>
            {form.marchPosterUrl.trim() ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2">
                <img
                  src={form.marchPosterUrl}
                  alt="Poster preview"
                  className="mx-auto max-h-64 w-full max-w-md object-contain"
                />
              </div>
            ) : null}
          </div>

          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-sm text-[var(--color-accent-hover)]"
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
