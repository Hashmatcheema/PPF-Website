import { useEffect, useState, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { apiUrl } from "@/lib/apiUrl"

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

export function TrackerLivePublic() {
  const [state, setState] = useState<TrackerState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

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
      
      const data = (await response.json()) as TrackerState
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
    // Default to Islamabad, Pakistan
    return [33.6844, 73.0479]
  }, [state?.currentLocation])

  const pathCoordinates = useMemo((): [number, number][] => {
    if (!state) return []
    const coords: [number, number][] = []
    if (state.currentLocation) {
      coords.push([state.currentLocation.lat, state.currentLocation.lng])
    }
    state.history.forEach((loc) => {
      coords.push([loc.lat, loc.lng])
    })
    return coords.reverse()
  }, [state])

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
        ) : state?.currentLocation ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
            {/* Map section */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                Current location
              </p>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <MapContainer
                  center={mapCenter}
                  zoom={14}
                  className="h-[min(500px,60vh)] w-full"
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* Route path */}
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
                      key={`history-${idx}`}
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
                </MapContainer>
              </div>
            </div>

            {/* Sidebar with updates */}
            <aside className="space-y-4">
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

              {/* History */}
              {state.history.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                    Previous locations ({state.history.length})
                  </p>
                  <ul className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
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
