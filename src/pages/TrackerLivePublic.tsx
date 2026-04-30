import { useEffect, useState, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L, { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { apiUrl } from "@/lib/apiUrl"
import { ChevronDown } from "lucide-react"

export type TrackerLocation = {
  lat: number
  lng: number
  timestamp: string
  message: string
}

export type TrackerState = {
  isActive: boolean
  currentLocation: TrackerLocation | null
  history: TrackerLocation[]
}

// Custom marker icon for current location
const currentLocationIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMkM5LjM3MyAyIDQgNy4zNzMgNCAxNGMwIDkuNSAxMiAyNCAxMiAyNHMxMi0xNC41IDEyLTI0QzI4IDcuMzczIDIyLjYyNyAyIDE2IDJaIiBmaWxsPSIjZmY0NzRhIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNCIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
})

// Custom marker icon for history points
const historyLocationIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiBmaWxsPSIjZmY0NzRhIiBvcGFjaXR5PSIwLjUiIHN0cm9rZT0iI2ZmNDc0YSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

function formatTime(iso: string): string {
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

function toFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number.parseFloat(v)
    if (Number.isFinite(n)) return n
  }
  return null
}

/** Coerce API / Redis values so Leaflet always receives finite numbers. */
function normalizeLocation(loc: unknown): TrackerLocation | null {
  if (!loc || typeof loc !== "object") return null
  const o = loc as Record<string, unknown>
  const lat = toFiniteNumber(o.lat)
  const lng = toFiniteNumber(o.lng)
  const timestamp = typeof o.timestamp === "string" ? o.timestamp : ""
  const message = typeof o.message === "string" ? o.message : ""
  if (lat == null || lng == null) return null
  return { lat, lng, timestamp, message }
}

function normalizeHistoryArray(raw: unknown): TrackerLocation[] {
  if (raw == null) return []
  if (Array.isArray(raw)) {
    return raw.map(normalizeLocation).filter((x): x is TrackerLocation => x !== null)
  }
  if (typeof raw === "object") {
    return Object.keys(raw as object)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => normalizeLocation((raw as Record<string, unknown>)[k]))
      .filter((x): x is TrackerLocation => x !== null)
  }
  return []
}

function normalizeTrackerState(raw: unknown): TrackerState {
  if (!raw || typeof raw !== "object") {
    return { isActive: false, currentLocation: null, history: [] }
  }
  const o = raw as Record<string, unknown>
  const current = o.currentLocation ? normalizeLocation(o.currentLocation) : null
  return {
    isActive: Boolean(o.isActive),
    currentLocation: current,
    history: normalizeHistoryArray(o.history),
  }
}

/** All trail coordinates for bounds + layout (history order, then current). */
function trailPointsFromState(state: TrackerState): [number, number][] {
  const pts: [number, number][] = state.history.map((loc) => [loc.lat, loc.lng])
  if (state.currentLocation) {
    pts.push([state.currentLocation.lat, state.currentLocation.lng])
  }
  return pts
}

/**
 * Leaflet inside CSS grid often needs `invalidateSize` after layout; fit bounds so
 * markers are in view (initial `center` alone is easy to miss after async fetch).
 */
function TrackerMapLayoutSync({ points }: { points: [number, number][] }) {
  const map = useMap()
  const pointsKey = useMemo(
    () => points.map((p) => `${p[0].toFixed(5)},${p[1].toFixed(5)}`).join("|"),
    [points]
  )

  useEffect(() => {
    if (points.length === 0) return

    const run = () => {
      map.invalidateSize({ animate: false })
      try {
        if (points.length === 1) {
          const [lat, lng] = points[0]!
          map.setView([lat, lng], 14, { animate: false })
          return
        }
        const b = L.latLngBounds(points as L.LatLngExpression[])
        if (b.isValid()) {
          map.fitBounds(b, { padding: [40, 40], maxZoom: 15, animate: false })
        }
      } catch {
        /* ignore bounds edge cases */
      }
    }

    const id = requestAnimationFrame(run)
    return () => cancelAnimationFrame(id)
    // `pointsKey` encodes coordinates; omitting `points` avoids re-running on every poll
    // when the parent passes a new array reference with the same coords.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- points matches the render for pointsKey
  }, [map, pointsKey])

  return null
}

export function TrackerLivePublic() {
  const [state, setState] = useState<TrackerState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [historyExpanded, setHistoryExpanded] = useState(false)

  const fetchTrackerState = useCallback(async () => {
    try {
      const response = await fetch(apiUrl("/api/tracker"))
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`API error: ${response.status} - ${text.substring(0, 100)}`)
      }
      
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        throw new Error(`Invalid response type: ${contentType}. API endpoint may not be configured.`)
      }
      
      const data = normalizeTrackerState(await response.json())
      setState(data)
      setError(null)
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setError(msg)
      // Set empty state so page still renders
      setState({ isActive: false, currentLocation: null, history: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchTrackerState()
  }, [fetchTrackerState])

  // Poll for updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchTrackerState, 15000)
    return () => clearInterval(interval)
  }, [fetchTrackerState])

  const mapCenter = useMemo((): [number, number] => {
    if (state?.currentLocation) {
      return [state.currentLocation.lat, state.currentLocation.lng]
    }
    const h = state?.history
    if (h && h.length > 0) {
      const last = h[h.length - 1]
      return [last.lat, last.lng]
    }
    // Default to Islamabad, Pakistan
    return [33.6844, 73.0479]
  }, [state?.currentLocation, state?.history])

  /**
   * March timeline: oldest → … → newest in `history`, then live `currentLocation`.
   * Consecutive vertices only — the current pin shares one segment with its immediate
   * predecessor (`history[history.length - 1]`), not with older points.
   */
  const pathCoordinates = useMemo((): [number, number][] => {
    if (!state) return []
    const coords: [number, number][] = state.history.map((loc) => [
      loc.lat,
      loc.lng,
    ])
    if (state.currentLocation) {
      coords.push([
        state.currentLocation.lat,
        state.currentLocation.lng,
      ])
    }
    return coords
  }, [state])

  const trailPoints = useMemo(
    () => (state ? trailPointsFromState(state) : []),
    [state]
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-label-red)]">
              📍 Track
            </p>
            <h1 className="font-display text-lg font-semibold sm:text-xl">
              March location
            </h1>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-[var(--color-accent)] transition hover:underline"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <strong>⚠️ Connection Issue:</strong> {error}
            <p className="mt-2 text-xs text-red-300">
              The tracker API may not be deployed yet. Please ensure the API files are in your project and deployed to Vercel.
            </p>
          </div>
        )}

        {/* Status banner */}
        {state && !error && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              state.isActive
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <strong className={state.isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}>
                  {state.isActive ? "🟢 March is active" : "⚪ Tracker inactive"}
                </strong>
                {lastUpdate && (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Last updated: {lastUpdate}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
            <div className="space-y-3">
              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
              <div className="h-[min(500px,60vh)] w-full animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
            </div>
            <aside className="space-y-4">
              <div>
                <div className="mb-3 h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div>
                    <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                    <div className="mt-2 h-10 w-24 animate-pulse rounded bg-white/10" />
                  </div>
                  <div className="h-px w-full bg-white/10" />
                  <div>
                    <div className="h-3 w-14 animate-pulse rounded bg-white/10" />
                    <div className="mt-2 h-5 w-28 animate-pulse rounded bg-white/10" />
                  </div>
                  <div className="h-px w-full bg-white/10" />
                  <div>
                    <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                    <div className="mt-2 h-12 w-full animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-3 h-3 w-36 animate-pulse rounded bg-white/10" />
                <div className="space-y-2">
                  <div className="h-16 w-full animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
                  <div className="h-16 w-full animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
                  <div className="h-16 w-full animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
                </div>
              </div>
            </aside>
          </div>
        ) : state &&
          (state.currentLocation || (state.history && state.history.length > 0)) ? (
          <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
            {/* Map section — min-w-0 so grid does not clip Leaflet to zero width */}
            <div className="min-w-0 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                {state.currentLocation ? "Current location" : "March trail"}
              </p>
              <div className="min-h-[min(500px,60vh)] min-w-0 overflow-hidden rounded-xl border border-white/10">
                <MapContainer
                  center={mapCenter}
                  zoom={14}
                  className="h-[min(500px,60vh)] w-full min-w-0"
                  scrollWheelZoom
                >
                  <TrackerMapLayoutSync points={trailPoints} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {pathCoordinates.length > 1 && (
                    <Polyline
                      positions={pathCoordinates}
                      pathOptions={{
                        color: "#ff474a",
                        weight: 3,
                        opacity: 0.6,
                        dashArray: "5, 5",
                      }}
                    />
                  )}
                  {/* History markers */}
                  {state.history.map((loc, idx) => (
                    <Marker
                      key={`history-${loc.timestamp}-${idx}`}
                      position={[loc.lat, loc.lng]}
                      icon={historyLocationIcon}
                    >
                      <Popup>
                        <div className="space-y-1 text-xs">
                          <p className="font-semibold text-[var(--color-text)]">
                            Previous location
                          </p>
                          <p className="text-[var(--color-text-muted)]">
                            {formatTime(loc.timestamp)}
                          </p>
                          {loc.message && (
                            <p className="text-[var(--color-text)]">{loc.message}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {/* Current location marker */}
                  {state.currentLocation ? (
                    <Marker
                      position={[
                        state.currentLocation.lat,
                        state.currentLocation.lng,
                      ]}
                      icon={currentLocationIcon}
                    >
                      <Popup>
                        <div className="space-y-1 text-xs">
                          <p className="font-semibold text-[var(--color-text)]">
                            Current location
                          </p>
                          <p className="text-[var(--color-text-muted)]">
                            {formatTime(state.currentLocation.timestamp)}
                          </p>
                          {state.currentLocation.message && (
                            <p className="text-[var(--color-text)]">
                              {state.currentLocation.message}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ) : null}
                </MapContainer>
              </div>
            </div>

            {/* Sidebar with updates */}
            <aside className="min-w-0 space-y-4">
              {state.currentLocation ? (
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                    Current status
                  </p>
                  <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Coordinates
                      </p>
                      <p className="mt-1 font-mono text-sm text-[var(--color-accent)]">
                        {state.currentLocation.lat.toFixed(4)},
                        <br />
                        {state.currentLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Updated
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text)]">
                        {formatTime(state.currentLocation.timestamp)}
                      </p>
                    </div>
                    {state.currentLocation.message && (
                      <div className="border-t border-white/10 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                          Message
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text)]">
                          {state.currentLocation.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-[var(--color-text-muted)]">
                  No live pin is set. The map shows past points on the trail only.
                </div>
              )}

              {/* History — collapsible with inner scroll (matches admin tracker UX) */}
              {state.history.length > 0 && (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                  <button
                    type="button"
                    id="public-tracker-history-toggle"
                    aria-expanded={historyExpanded}
                    aria-controls="public-tracker-history-list"
                    onClick={() => setHistoryExpanded((v) => !v)}
                    className="flex w-full min-w-0 items-center gap-2 rounded-md border-0 bg-transparent px-1 py-2 text-left transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                  >
                    <ChevronDown
                      className={`size-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
                        historyExpanded ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Previous locations
                      </span>
                      <span className="mt-0.5 block text-sm text-[var(--color-text)]">
                        {state.history.length} location{state.history.length !== 1 ? "s" : ""}
                      </span>
                    </span>
                  </button>
                  {historyExpanded ? (
                    <ul
                      id="public-tracker-history-list"
                      role="list"
                      aria-labelledby="public-tracker-history-toggle"
                      className="mt-3 max-h-[min(42vh,13rem)] space-y-2 overflow-y-auto overscroll-y-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-h-[min(38vh,15rem)] md:max-h-60 [&::-webkit-scrollbar]:hidden"
                    >
                      {state.history.map((loc, idx) => (
                        <li
                          key={`history-item-${idx}`}
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-mono text-[10px] text-[var(--color-accent)]">
                                {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                              </p>
                              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                                {formatTime(loc.timestamp)}
                              </p>
                            </div>
                          </div>
                          {loc.message && (
                            <p className="mt-1.5 text-[var(--color-text)]">
                              {loc.message}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-center">
              <p className="text-[var(--color-text-muted)]">
                No active march location yet.
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Check back soon for live updates.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
