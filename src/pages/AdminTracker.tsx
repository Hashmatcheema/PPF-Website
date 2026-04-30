import { useEffect, useState, useCallback, useMemo } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { apiUrl } from "@/lib/apiUrl"
import { adminAuthFetchInit } from "@/lib/adminSession"
import { ppfCtaPrimaryCompactClassName } from "@/lib/ppfCtaButton"
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

type AdminTrailRow =
  | { kind: "history"; loc: TrackerLocation; historyIndex: number }
  | { kind: "current"; loc: TrackerLocation }

const markerIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMkM5LjM3MyAyIDQgNy4zNzMgNCAxNGMwIDkuNSAxMiAyNCAxMiAyNHMxMi0xNC41IDEyLTI0QzI4IDcuMzczIDIyLjYyNyAyIDE2IDJaIiBmaWxsPSIjZmY0NzRhIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNCIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
})

/** Pending GPS / map tap — distinct from saved server location (red pin). */
const selectionIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 2C8.5 2 4 6.5 4 12c0 7 10 22 10 22s10-15 10-22c0-5.5-4.5-10-10-10Z" fill="#2563eb"/><circle cx="14" cy="12" r="4" fill="white"/></svg>'
    ),
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
})

interface MapClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function FlyToSelectionOrSaved({
  selectedLat,
  selectedLng,
  saved,
}: {
  selectedLat: number | null
  selectedLng: number | null
  saved: TrackerLocation | null | undefined
}) {
  const map = useMap()
  useEffect(() => {
    if (selectedLat != null && selectedLng != null) {
      map.setView([selectedLat, selectedLng], Math.max(map.getZoom(), 14), { animate: true })
    } else if (saved) {
      map.setView([saved.lat, saved.lng], Math.max(map.getZoom(), 13), { animate: true })
    }
  }, [selectedLat, selectedLng, saved?.lat, saved?.lng, map])
  return null
}

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

export function AdminTracker() {
  const [state, setState] = useState<TrackerState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [selectedLat, setSelectedLat] = useState<number | null>(null)
  const [selectedLng, setSelectedLng] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [useMyLocation, setUseMyLocation] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [historyExpanded, setHistoryExpanded] = useState(false)

  /** Past points + live current (server keeps latest only in `currentLocation`). */
  const adminTrailRows = useMemo((): AdminTrailRow[] => {
    if (!state) return []
    const rows: AdminTrailRow[] = state.history.map((loc, historyIndex) => ({
      kind: "history",
      loc,
      historyIndex,
    }))
    if (state.currentLocation) {
      rows.push({ kind: "current", loc: state.currentLocation })
    }
    return rows
  }, [state])

  // Fetch current state
  const fetchState = useCallback(async () => {
    try {
      const response = await fetch(apiUrl("/api/admin/tracker"), adminAuthFetchInit())
      
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setError(msg)
      // Set empty state so page still renders
      setState({ isActive: false, currentLocation: null, history: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchState()
  }, [fetchState])

  // Handle map click
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLat(lat)
    setSelectedLng(lng)
    setUseMyLocation(false)
  }

  // Get user's current location
  const handleGetMyLocation = () => {
    setGeoError(null)
    setUseMyLocation(true)
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser")
      setUseMyLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLat(position.coords.latitude)
        setSelectedLng(position.coords.longitude)
        setUseMyLocation(true)
      },
      (err) => {
        setGeoError(`Geolocation error: ${err.message}`)
        setUseMyLocation(false)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    )
  }

  // Submit location update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedLat === null || selectedLng === null) {
      setError("Please select a location on the map or use your current location")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(
        apiUrl("/api/admin/tracker"),
        adminAuthFetchInit({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: selectedLat,
            lng: selectedLng,
            message: message.trim(),
          }),
        })
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update tracker")
      }

      const updated = (await response.json()) as TrackerState
      setState(updated)
      setSelectedLat(null)
      setSelectedLng(null)
      setMessage("")
      setUseMyLocation(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  // Clear history
  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear all tracker history?")) return

    setSaving(true)
    try {
      const response = await fetch(
        apiUrl("/api/admin/tracker"),
        adminAuthFetchInit({ method: "DELETE" })
      )

      if (!response.ok) throw new Error("Failed to clear tracker")
      const updated = (await response.json()) as TrackerState
      setState(updated)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteHistoryEntry = async (historyIndex: number) => {
    setSaving(true)
    try {
      const url = `${apiUrl("/api/admin/tracker")}?${new URLSearchParams({
        historyIndex: String(historyIndex),
      })}`
      const response = await fetch(url, adminAuthFetchInit({ method: "DELETE" }))

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || "Failed to remove history entry")
      }
      const updated = (await response.json()) as TrackerState
      setState(updated)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCurrentLocation = async () => {
    if (
      !confirm(
        "Remove the current live location from the public tracker? If an older point exists in the trail, it becomes live again; otherwise the tracker becomes inactive."
      )
    ) {
      return
    }
    setSaving(true)
    try {
      const url = `${apiUrl("/api/admin/tracker")}?${new URLSearchParams({
        current: "1",
      })}`
      const response = await fetch(url, adminAuthFetchInit({ method: "DELETE" }))

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || "Failed to remove current location")
      }
      const updated = (await response.json()) as TrackerState
      setState(updated)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-label-red)]">
          📍 Live Tracker
        </p>
        <h2 className="font-display text-2xl font-semibold">Manage march location</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Update the current march location by clicking on the map or using your device's GPS.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <strong>⚠️ Error:</strong> {error}
          {error.includes("API endpoint") && (
            <p className="mt-2 text-xs text-red-300">
              The tracker API may not be deployed yet. Please ensure the API files are in your project and deployed to Vercel.
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,28rem)]">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="h-4 w-56 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-44 animate-pulse rounded bg-white/10" />
            </div>
            <div className="h-[400px] w-full animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
            <div className="h-11 w-full animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-20 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-14 animate-pulse rounded bg-white/10" />
              <div className="mt-4 h-11 w-full animate-pulse rounded bg-white/10" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-10 w-28 animate-pulse rounded bg-white/10" />
              <div className="h-px w-full bg-white/10" />
              <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-5 w-24 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,28rem)]">
          {/* Map section */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-[var(--color-text)]">
                Select location (click on map or use GPS)
              </label>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {selectedLat && selectedLng
                  ? `Selected: ${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`
                  : "Click on the map to select a location"}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10">
              <MapContainer
                center={[33.6844, 73.0479]}
                zoom={13}
                className="h-[400px] w-full"
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyToSelectionOrSaved
                  selectedLat={selectedLat}
                  selectedLng={selectedLng}
                  saved={state?.currentLocation}
                />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {state?.currentLocation && (
                  <Marker
                    position={[state.currentLocation.lat, state.currentLocation.lng]}
                    icon={markerIcon}
                  />
                )}
                {selectedLat != null && selectedLng != null && (
                  <Marker
                    position={[selectedLat, selectedLng]}
                    icon={selectionIcon}
                    zIndexOffset={1000}
                  />
                )}
              </MapContainer>
            </div>

            <button
              type="button"
              onClick={handleGetMyLocation}
              disabled={saving || useMyLocation}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition disabled:opacity-50 ${
                useMyLocation
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/30"
                  : "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 hover:bg-[var(--color-accent)]/25"
              }`}
            >
              {useMyLocation ? "📍 Current location selected" : "📍 Use my current location"}
            </button>

            {geoError && (
              <p className="text-xs text-red-400">{geoError}</p>
            )}
          </div>

          {/* Form section */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-text)]">
                  Status message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., 'Reached D-Chowk, proceeding to Constitution Avenue'"
                  maxLength={500}
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  rows={3}
                />
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {message.length}/500
                </p>
              </div>

              <button
                type="submit"
                disabled={saving || selectedLat === null || selectedLng === null}
                className={`w-full rounded-lg px-4 py-2.5 font-medium transition ${
                  saving || selectedLat === null || selectedLng === null
                    ? "opacity-50 cursor-not-allowed bg-[var(--color-accent)]/50"
                    : ppfCtaPrimaryCompactClassName()
                }`}
              >
                {saving ? "Updating…" : "Update location"}
              </button>
            </form>

            {/* Current status */}
            {state?.currentLocation && (
              <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Current location
                  </p>
                  <p className="mt-2 font-mono text-sm text-[var(--color-accent)]">
                    {state.currentLocation.lat.toFixed(4)},
                    <br />
                    {state.currentLocation.lng.toFixed(4)}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Last updated
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

                <div className="border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => void handleDeleteCurrentLocation()}
                    disabled={saving}
                    className="w-full rounded-md border border-red-500/25 px-3 py-2 text-center text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 sm:w-auto sm:px-4"
                  >
                    Delete current location
                  </button>
                </div>
              </div>
            )}

            {/* History / trail — includes live current; collapsible with inner scroll */}
            {adminTrailRows.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:justify-between sm:gap-3">
                  <button
                    type="button"
                    id="admin-tracker-history-toggle"
                    aria-expanded={historyExpanded}
                    aria-controls="admin-tracker-history-list"
                    onClick={() => setHistoryExpanded((v) => !v)}
                    className="flex w-full min-w-0 items-center gap-2 rounded-md border-0 bg-transparent px-1 py-2 text-left transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:flex-1"
                  >
                    <ChevronDown
                      className={`size-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
                        historyExpanded ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        History
                      </span>
                      <span className="mt-0.5 block text-sm text-[var(--color-text)]">
                        {adminTrailRows.length} location{adminTrailRows.length !== 1 ? "s" : ""} in trail
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    disabled={saving}
                    className="w-full shrink-0 rounded-md border border-red-500/30 px-3 py-2 text-center text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 sm:w-auto sm:self-center sm:border-0 sm:px-3 sm:py-2 sm:hover:bg-red-500/10"
                  >
                    Clear all
                  </button>
                </div>
                {historyExpanded ? (
                  <ul
                    id="admin-tracker-history-list"
                    role="list"
                    aria-labelledby="admin-tracker-history-toggle"
                    className="mt-3 max-h-[min(42vh,13rem)] space-y-2 overflow-y-auto overscroll-y-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-h-[min(38vh,15rem)] md:max-h-60 [&::-webkit-scrollbar]:hidden"
                  >
                    {adminTrailRows.map((row, rowIdx) => (
                      <li
                        key={
                          row.kind === "history"
                            ? `h-${row.loc.timestamp}-${row.historyIndex}`
                            : `c-${row.loc.timestamp}-${rowIdx}`
                        }
                        className="flex flex-col gap-2 rounded-md border border-white/10 bg-white/[0.04] p-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
                      >
                        <div className="min-w-0 flex-1 text-xs">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <p className="text-[10px] text-[var(--color-text-muted)]">
                              {formatTime(row.loc.timestamp)}
                            </p>
                            {row.kind === "current" ? (
                              <span className="rounded bg-[var(--color-accent)]/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                                Current
                              </span>
                            ) : null}
                          </div>
                          {row.loc.message ? (
                            <p className="mt-1 break-words text-[var(--color-text)]">{row.loc.message}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            void (row.kind === "history"
                              ? handleDeleteHistoryEntry(row.historyIndex)
                              : handleDeleteCurrentLocation())
                          }
                          disabled={saving}
                          className="w-full shrink-0 rounded-md border border-red-500/25 px-2.5 py-1.5 text-center text-[10px] font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 sm:w-auto sm:self-start sm:border-0 sm:px-2 sm:py-1 sm:hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
