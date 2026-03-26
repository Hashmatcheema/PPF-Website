import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AdminCtas } from "@/pages/AdminCtas"
import { ADMIN_AUTH_KEY } from "@/pages/AdminLogin"
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"

export function ProtectedAdmin() {
  const location = useLocation()
  const [authStatus, setAuthStatus] = useState<"loading" | "ok" | "unauthorized">(
    !DISABLE_REMOTE_API
      ? "loading"
      : typeof sessionStorage !== "undefined" && sessionStorage.getItem(ADMIN_AUTH_KEY)
        ? "ok"
        : "unauthorized"
  )

  useEffect(() => {
    if (DISABLE_REMOTE_API) return
    const url = apiUrl("/api/admin/me")
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
