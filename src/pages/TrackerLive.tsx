import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Polyline, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  TRACKER_ENTITIES,
  TRACKER_MAIN_PATH,
  TRACKER_RANGE,
  TRACKER_UPDATES,
} from "@/data/trackerMock"

function positionOnPath(ts: number): [number, number] {
  const { start, end } = TRACKER_RANGE
  const span = end - start || 1
  const u = Math.min(1, Math.max(0, (ts - start) / span))
  const n = TRACKER_MAIN_PATH.length - 1
  if (n <= 0) return TRACKER_MAIN_PATH[0] ?? [31.5, 74.35]
  const f = u * n
  const i = Math.floor(f)
  const frac = f - i
  const a = TRACKER_MAIN_PATH[i]!
  const b = TRACKER_MAIN_PATH[Math.min(i + 1, n)]!
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export function TrackerLive() {
  const [playhead, setPlayhead] = useState(TRACKER_RANGE.start + (TRACKER_RANGE.end - TRACKER_RANGE.start) * 0.55)

  const markerPos = useMemo(() => positionOnPath(playhead), [playhead])

  const center = useMemo((): [number, number] => {
    const lat = TRACKER_MAIN_PATH.reduce((s, p) => s + p[0], 0) / TRACKER_MAIN_PATH.length
    const lng = TRACKER_MAIN_PATH.reduce((s, p) => s + p[1], 0) / TRACKER_MAIN_PATH.length
    return [lat, lng]
  }, [])

  const sortedUpdates = useMemo(
    () => [...TRACKER_UPDATES].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [],
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-label-red)]">
              Live tracker
            </p>
            <h1 className="font-display text-lg font-semibold sm:text-xl">March route &amp; updates</h1>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-[var(--color-accent)] transition hover:underline"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
          <strong className="text-amber-200">Demo data.</strong> Times and positions are illustrative only. Replace
          with your API when you run a real event.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)]">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Route map
            </p>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <MapContainer
                center={center}
                zoom={13}
                className="h-[min(420px,55vh)] w-full z-0"
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline
                  positions={TRACKER_MAIN_PATH}
                  pathOptions={{ color: "#ff474a", weight: 4, opacity: 0.85 }}
                />
                <CircleMarker
                  center={markerPos}
                  radius={10}
                  pathOptions={{
                    color: "#ff1f22",
                    fillColor: "#ff474a",
                    fillOpacity: 0.95,
                    weight: 2,
                  }}
                />
              </MapContainer>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <label className="mb-2 block text-sm font-medium text-[var(--color-text)]" htmlFor="tracker-scrub">
                Playback time (scrub along the day)
              </label>
              <input
                id="tracker-scrub"
                type="range"
                min={TRACKER_RANGE.start}
                max={TRACKER_RANGE.end}
                step={60_000}
                value={playhead}
                onChange={(e) => setPlayhead(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {new Date(playhead).toLocaleString()}
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                Columns / teams
              </p>
              <ul className="flex flex-wrap gap-2">
                {TRACKER_ENTITIES.map((e) => (
                  <li
                    key={e.id}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      e.active
                        ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-text)]"
                        : "border-white/10 text-[var(--color-text-muted)]"
                    }`}
                  >
                    {e.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                Official updates
              </p>
              <ul className="max-h-[min(520px,50vh)] space-y-3 overflow-y-auto pr-1">
                {sortedUpdates.map((u) => (
                  <li
                    key={u.id}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          u.tag === "action"
                            ? "bg-[var(--color-cta)]/25 text-[var(--color-cta-hover)]"
                            : "bg-white/10 text-[var(--color-text-muted)]"
                        }`}
                      >
                        {u.tag}
                      </span>
                      <time className="text-[11px] text-[var(--color-text-muted)]">{formatTime(u.at)}</time>
                    </div>
                    <p className="mt-1.5 font-semibold text-[var(--color-text)]">{u.headline}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{u.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
