import { getRedis } from "./redis.js"

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

const TRACKER_KEY = "ppf:tracker"

/** Distinct from missing Redis or empty key — thrown when Upstash read throws. */
export const TRACKER_READ_FAILED = "TRACKER_READ_FAILED"

const DEFAULT_STATE: TrackerState = {
  isActive: false,
  currentLocation: null,
  history: [],
}

export async function readTrackerState(): Promise<TrackerState> {
  const redis = getRedis()
  if (!redis) return DEFAULT_STATE
  try {
    const data = await redis.get<TrackerState>(TRACKER_KEY)
    return data || DEFAULT_STATE
  } catch {
    throw new Error(TRACKER_READ_FAILED)
  }
}

export async function writeTrackerState(state: TrackerState): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error("REDIS_NOT_CONFIGURED")
  await redis.set(TRACKER_KEY, state)
}

export async function addTrackerLocation(
  lat: number,
  lng: number,
  message: string
): Promise<TrackerState> {
  const state = await readTrackerState()
  
  const newLocation: TrackerLocation = {
    lat,
    lng,
    timestamp: new Date().toISOString(),
    message,
  }

  // Move current to history if exists
  if (state.currentLocation) {
    state.history.push(state.currentLocation)
  }

  state.currentLocation = newLocation
  state.isActive = true

  await writeTrackerState(state)
  return state
}

export async function clearTrackerHistory(): Promise<TrackerState> {
  const state = await readTrackerState()
  state.history = []
  state.currentLocation = null
  state.isActive = false
  await writeTrackerState(state)
  return state
}

export async function deleteTrackerHistoryEntry(index: number): Promise<TrackerState> {
  const state = await readTrackerState()
  if (!Number.isInteger(index) || index < 0 || index >= state.history.length) {
    throw new Error("INVALID_HISTORY_INDEX")
  }
  state.history.splice(index, 1)
  await writeTrackerState(state)
  return state
}

/**
 * Removes the live `currentLocation`. If `history` has entries, the most recent prior
 * point (last in array) becomes current; otherwise the tracker is cleared to inactive.
 */
export async function removeCurrentTrackerLocation(): Promise<TrackerState> {
  const state = await readTrackerState()
  if (!state.currentLocation) {
    throw new Error("NO_CURRENT_LOCATION")
  }
  const prev = state.history.pop()
  if (prev) {
    state.currentLocation = prev
    state.isActive = true
  } else {
    state.currentLocation = null
    state.isActive = false
  }
  await writeTrackerState(state)
  return state
}
