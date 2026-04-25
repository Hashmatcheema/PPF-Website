import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { apiUrl } from "@/lib/apiUrl"
import { ppfCtaPrimaryCompactClassName } from "@/lib/ppfCtaButton"

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

const markerIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMkM5LjM3MyAyIDQgNy4zNzMgNCAxNGMwIDkuNSAxMiAyNCAxMiAyNHMxMi0xNC41IDEyLTI0QzI4IDcuMzczIDIyLjYyNyAyIDE2IDJaIiBmaWxsPSIjZmY0NzRhIi8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNCIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
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

  // Fetch current state
  const fetchState = useCallback(async () => {
    try {
      const token = localStorage.getItem("ppf-admin-token")
      const response = await fetch(apiUrl("/api/admin/tracker"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
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
      }
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
      const token = localStorage.getItem("ppf-admin-token")
      const response = await fetch(apiUrl("/api/admin/tracker"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat: selectedLat,
          lng: selectedLng,
          message: message.trim(),
        }),
      })

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
      const token = localStorage.getItem("ppf-admin-token")
      const response = await fetch(apiUrl("/api/admin/tracker"), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {state?.currentLocation && (
                  <Marker
                    position={[state.currentLocation.lat, state.currentLocation.lng]}
                    icon={markerIcon}
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
                    : ppfCtaPrimaryCompactClassName
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
              </div>
            )}

            {/* History info */}
            {state?.history && state.history.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                      History
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      {state.history.length} previous location{state.history.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    disabled={saving}
                    className="text-xs font-medium text-red-400 transition hover:text-red-300 disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
