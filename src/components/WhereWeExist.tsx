import { useEffect, useLayoutEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapPin } from "lucide-react"
import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { MAP_PLACE_LABELS } from "@/data/mapPlaceLabels"


// Fix for default Leaflet marker icons in React (we use custom DivIcons)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
})

const locations = [
  { name: "Islamabad", coords: [33.6844, 73.0479] as [number, number], role: "Headquarters" },
  { name: "Karachi", coords: [24.8607, 67.0011] as [number, number], role: "Regional Hub" },
  { name: "Lahore", coords: [31.5204, 74.3587] as [number, number], role: "Coordination Center" },
  { name: "Peshawar", coords: [34.0151, 71.5249] as [number, number], role: "Volunteer Base" },
  { name: "Quetta", coords: [30.1798, 66.975] as [number, number], role: "Relief Logistics" },
  { name: "Multan", coords: [30.1575, 71.5249] as [number, number], role: "Community Outreach" },
  { name: "Faisalabad", coords: [31.4504, 73.135] as [number, number], role: "Fundraising Unit" },
]

function createPulsingIcon() {
  return L.divIcon({
    className: "custom-pin",
    html: `<div class="relative flex items-center justify-center w-6 h-6">
             <div class="absolute w-full h-full rounded-full animate-ping opacity-75" style="background-color: var(--color-accent)"></div>
             <div class="relative w-3 h-3 rounded-full shadow-lg border-2 border-white" style="background-color: var(--color-accent)"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const URDU_LABELS_PANE = "urduLabels"

function createUrduLabelIcon(urduText: string) {
  return L.divIcon({
    className: "urdu-map-label-wrap",
    html: `<span class="urdu-map-label" dir="rtl">${urduText}</span>`,
    iconSize: [120, 24],
    iconAnchor: [60, 12],
  })
}

function UrduMapLabels({ lang }: { lang: Locale }) {
  const map = useMap()
  const [paneReady, setPaneReady] = useState(false)
  useLayoutEffect(() => {
    if (lang !== "ur") {
      setPaneReady(false)
      return
    }
    if (!map.getPane(URDU_LABELS_PANE)) {
      const pane = map.createPane(URDU_LABELS_PANE)
      pane.style.zIndex = "450"
    }
    setPaneReady(true)
  }, [map, lang])
  if (lang !== "ur" || !paneReady) return null
  return (
    <>
      {MAP_PLACE_LABELS.map((pl, i) => (
        <Marker
          key={i}
          position={pl.coords}
          icon={createUrduLabelIcon(pl.ur)}
          pane={URDU_LABELS_PANE}
        />
      ))}
    </>
  )
}

function MapController() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
    const bounds = L.latLngBounds(locations.map((loc) => loc.coords))
    map.fitBounds(bounds, { padding: [30, 30] })
  }, [map])
  useEffect(() => {
    const handleFlyTo = (e: Event) => {
      const customEvent = e as CustomEvent;
      map.flyTo(customEvent.detail.coords, 8, { duration: 1.5 });
    };
    window.addEventListener('flyToLoc', handleFlyTo);
    return () => window.removeEventListener('flyToLoc', handleFlyTo);
  }, [map])

  return null
}

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY as string | undefined

function getTileUrl(lang: Locale): string {
  if (lang === "ur") {
    if (MAPTILER_KEY) {
      return `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}&language=ur`
    }
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  }
  if (lang === "en") {
    if (MAPTILER_KEY) {
      return `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}&language=en`
    }
    return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  }
  return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}

function getTileAttribution(lang: Locale): string {
  if (lang === "ur") {
    if (MAPTILER_KEY) {
      return '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
  if (lang === "en") {
    if (MAPTILER_KEY) {
      return '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
    return '&copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, © OpenStreetMap contributors'
  }
  return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

export function WhereWeExist({ lang }: { lang: Locale }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const t = content[lang].nation
  const where = content[lang].where
  const tileUrl = getTileUrl(lang)
  const tileAttribution = getTileAttribution(lang)

  return (
    <section
      id="presence"
      className="relative overflow-hidden bg-[var(--color-surface)]"
    >
      <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-0">
        {/* Left Content — project typography (font-display) and theme variables */}
        <div className="relative z-10 flex flex-col justify-center border-r border-[var(--color-border)] bg-[var(--color-bg)] p-8 lg:w-7/12 lg:p-16 xl:p-24">
          <div
            className="absolute left-0 top-0 h-1 w-full"
            style={{
              background: `linear-gradient(to right, var(--color-accent), var(--color-accent-hover))`,
            }}
          />
          <h2 className="font-display mb-6 text-3xl font-bold leading-tight text-[var(--color-text)] md:text-4xl lg:text-5xl">
            {t.headline1}
            <br />
            <span className="text-[var(--color-accent)]">{t.headline2}</span>
          </h2>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)] lg:mb-12">
            {t.description}
          </p>
          <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-8 lg:mb-12">
            {t.stats.map((stat, i) => (
              <div key={i}>
                <div className="font-display text-3xl font-bold text-[var(--color-text)] md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          {"chapters" in where && Array.isArray(where.chapters) && where.chapters.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                {lang === "en" ? "Chapters" : "چیپٹرز"}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
                {where.chapters.join(" · ")}
              </p>
              {"smallerUnits" in where && where.smallerUnits && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {lang === "en" ? "Smaller units" : "چھوٹی یونٹس"}: {where.smallerUnits}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Map & List Container */}
        <div
          className="relative flex flex-col p-4 lg:p-6 w-full lg:w-5/12 items-center justify-center bg-[#111]"
        >
          {/* Map Section */}
          {mounted && (
            <div
              className="relative z-0 h-[400px] lg:h-[500px] w-full max-w-lg lg:max-w-none overflow-hidden rounded-2xl shadow-xl border border-[var(--color-border)] map-dark"
            >
              <MapContainer
                center={[30.5, 70]}
                zoom={4.5}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={true}
                style={{ zIndex: 0 }}
              >
                <TileLayer attribution={tileAttribution} url={tileUrl} />
                <MapController />
                <UrduMapLabels lang={lang} />
                {locations.map((loc, i) => (
                  <Marker key={i} position={loc.coords} icon={createPulsingIcon()}>
                    <Popup className="custom-popup">
                      <div className="min-w-[150px] p-2">
                        <h3 className="font-bold text-[var(--color-accent)]">
                          {loc.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {loc.role}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
                          <div
                            className="h-2 w-2 animate-pulse rounded-full"
                            style={{ backgroundColor: "var(--color-accent)" }}
                          />
                          Active Now
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Floating Live Activity List (Overlay) */}
              <div className="absolute bottom-4 left-4 right-4 lg:left-auto sm:right-4 z-[400] sm:w-[280px] flex flex-col bg-[var(--color-bg)]/95 backdrop-blur-md rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 p-3 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--color-text)]">
                        {t.liveActivity.title}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {t.liveActivity.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable list */}
                <div className="overflow-y-auto p-3 flex flex-col gap-2 max-h-[140px]">
                  {locations.map((loc, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-2.5 hover:border-[var(--color-accent)]/30 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-[var(--color-text)]">{loc.name}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{loc.role}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[10px] font-medium">
                        <div className="flex items-center gap-1 text-[var(--color-accent)]">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "var(--color-accent)" }} />
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .map-grayscale .leaflet-tile-pane img {
          filter: grayscale(1) contrast(1.1) brightness(0.95);
          opacity: 0.85;
        }
        .map-dark .leaflet-tile-pane {
          background: #000;
        }
        .map-dark .leaflet-tile-pane img {
          border: none;
          outline: none;
          filter: invert(1) hue-rotate(180deg);
        }
        .leaflet-control-attribution {
          font-size: 10px;
          opacity: 0.6;
          background: transparent !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          overflow: hidden;
          padding: 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .urdu-map-label-wrap {
          background: transparent !important;
          border: none !important;
        }
        .urdu-map-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          color: #1a1a1a;
          text-shadow: 0 0 2px #fff, 0 0 3px #fff, 0 1px 2px #fff, 0 1px 1px rgba(0,0,0,0.3);
          font-family: inherit;
        }
        .map-dark .urdu-map-label {
          color: #e5e5e5;
          text-shadow: 0 0 2px #000, 0 0 3px #000, 0 1px 2px #000, 0 1px 1px rgba(0,0,0,0.8);
        }
      `}</style>
    </section>
  )
}
