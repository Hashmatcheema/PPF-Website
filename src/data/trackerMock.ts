/**
 * Demo data for `/tracker` — replace with API + DB (positions, updates, timeline).
 * Coordinates: example urban march path (Lahore inner area, illustrative only).
 */

export type TrackerEntity = {
  id: string
  name: string
  active: boolean
}

export type TrackerUpdate = {
  id: string
  tag: "update" | "action"
  at: string
  headline: string
  body: string
  lat?: number
  lng?: number
}

/** One continuous path for the main column (playback scrubs along this). */
export const TRACKER_MAIN_PATH: [number, number][] = [
  [31.482, 74.3],
  [31.49, 74.32],
  [31.502, 74.34],
  [31.515, 74.355],
  [31.522, 74.36],
  [31.528, 74.368],
]

export const TRACKER_ENTITIES: TrackerEntity[] = [
  { id: "front", name: "Front line", active: true },
  { id: "medical", name: "Medical", active: true },
  { id: "media", name: "Media & legal", active: true },
  { id: "stage-a", name: "Stage A — speeches", active: false },
]

export const TRACKER_UPDATES: TrackerUpdate[] = [
  {
    id: "u1",
    tag: "update",
    at: "2026-04-24T11:00:00Z",
    headline: "Assembly point open",
    body: "Volunteers on site; marshals in high-vis at both entrances.",
    lat: 31.482,
    lng: 74.3,
  },
  {
    id: "u2",
    tag: "action",
    at: "2026-04-24T11:40:00Z",
    headline: "Step-off",
    body: "Main body moving on agreed route; roads not closed — stay on footpath where marked.",
    lat: 31.502,
    lng: 74.34,
  },
  {
    id: "u3",
    tag: "update",
    at: "2026-04-24T12:15:00Z",
    headline: "Mid-route pause",
    body: "Five-minute water break; medical tent at rear of column.",
    lat: 31.515,
    lng: 74.355,
  },
]

/** Timeline window (UTC) for the scrub bar — extend when you wire real data. */
export const TRACKER_RANGE = {
  start: new Date("2026-04-24T10:30:00Z").getTime(),
  end: new Date("2026-04-24T13:00:00Z").getTime(),
}
