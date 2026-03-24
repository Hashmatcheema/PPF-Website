import { useState, useEffect, useCallback } from "react"
import { defaultCtas, parseCtas, type CtasConfig } from "@/data/ctasSchema"
<<<<<<< HEAD

const API_URL = import.meta.env.VITE_CTAS_API_URL ?? ""
=======
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"

>>>>>>> modifics
const STORAGE_KEY = "ppf-ctas"

function loadFromStorage(): CtasConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    return parseCtas(data)
  } catch {
    return null
  }
}

export function useCtas(): {
  ctas: CtasConfig
  loading: boolean
  saveCtas: (config: CtasConfig) => Promise<{ ok: boolean; error?: string }>
} {
  const [ctas, setCtas] = useState<CtasConfig>(() => {
<<<<<<< HEAD
    if (API_URL) return defaultCtas
    return loadFromStorage() ?? defaultCtas
  })
  const [loading, setLoading] = useState(!!API_URL)

  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      return
    }
    const url = API_URL.replace(/\/$/, "") + "/api/ctas"
=======
    if (!DISABLE_REMOTE_API) return defaultCtas
    return loadFromStorage() ?? defaultCtas
  })
  const [loading, setLoading] = useState(!DISABLE_REMOTE_API)

  useEffect(() => {
    if (DISABLE_REMOTE_API) return
    const url = apiUrl("/api/ctas")
>>>>>>> modifics
    fetch(url, { method: "GET", credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to fetch"))))
      .then((data) => {
        const parsed = parseCtas(data)
        if (parsed) setCtas(parsed)
      })
      .catch(() => {
        const stored = loadFromStorage()
        if (stored) setCtas(stored)
      })
      .finally(() => setLoading(false))
  }, [])

  const saveCtas = useCallback(
    async (config: CtasConfig): Promise<{ ok: boolean; error?: string }> => {
<<<<<<< HEAD
      if (API_URL) {
        const url = API_URL.replace(/\/$/, "") + "/api/ctas"
=======
      if (!DISABLE_REMOTE_API) {
        const url = apiUrl("/api/ctas")
>>>>>>> modifics
        try {
          const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
            credentials: "include",
          })
          if (!res.ok) {
<<<<<<< HEAD
            const err = await res.text()
            return { ok: false, error: err || "Failed to save" }
=======
            const text = await res.text()
            try {
              const j = JSON.parse(text) as { error?: string }
              return { ok: false, error: j?.error ?? (text || "Failed to save") }
            } catch {
              return { ok: false, error: text || "Failed to save" }
            }
>>>>>>> modifics
          }
          const data = (await res.json()) as unknown
          const parsed = parseCtas(data)
          if (parsed) setCtas(parsed)
          return { ok: true }
        } catch (e) {
          return { ok: false, error: e instanceof Error ? e.message : "Request failed" }
        }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
        setCtas(config)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Failed to save" }
      }
    },
    []
  )

  return { ctas, loading, saveCtas }
}
