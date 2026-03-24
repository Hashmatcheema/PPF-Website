import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AdminCtas } from "@/pages/AdminCtas"
import { ADMIN_AUTH_KEY } from "@/pages/AdminLogin"
<<<<<<< HEAD

const API_URL = import.meta.env.VITE_CTAS_API_URL ?? ""
=======
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"
>>>>>>> modifics

export function ProtectedAdmin() {
  const location = useLocation()
  const [authStatus, setAuthStatus] = useState<"loading" | "ok" | "unauthorized">(
<<<<<<< HEAD
    API_URL ? "loading" : typeof sessionStorage !== "undefined" && sessionStorage.getItem(ADMIN_AUTH_KEY) ? "ok" : "unauthorized"
  )

  useEffect(() => {
    if (!API_URL) return
    const url = API_URL.replace(/\/$/, "") + "/api/admin/me"
=======
    !DISABLE_REMOTE_API
      ? "loading"
      : typeof sessionStorage !== "undefined" && sessionStorage.getItem(ADMIN_AUTH_KEY)
        ? "ok"
        : "unauthorized"
  )

  useEffect(() => {
    if (DISABLE_REMOTE_API) return
    const url = apiUrl("/api/admin/me")
>>>>>>> modifics
    fetch(url, { credentials: "include" })
      .then((res) => {
        setAuthStatus(res.ok ? "ok" : "unauthorized")
      })
      .catch(() => setAuthStatus("unauthorized"))
  }, [])

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <p className="text-[var(--color-text-muted)]">Checking auth…</p>
      </div>
    )
  }
  if (authStatus === "unauthorized") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <AdminCtas />
}
