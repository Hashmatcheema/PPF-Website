import { useEffect, useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { AdminCtas } from "@/pages/AdminCtas"
import { AdminTracker } from "@/pages/AdminTracker"
import { ADMIN_AUTH_KEY } from "@/pages/AdminLogin"
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"

export function ProtectedAdmin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authStatus, setAuthStatus] = useState<"loading" | "ok" | "unauthorized">(
    !DISABLE_REMOTE_API
      ? "loading"
      : typeof sessionStorage !== "undefined" && sessionStorage.getItem(ADMIN_AUTH_KEY)
        ? "ok"
        : "unauthorized"
  )
  const [activeTab, setActiveTab] = useState<"ctas" | "tracker">("ctas")

  useEffect(() => {
    if (DISABLE_REMOTE_API) return
    const url = apiUrl("/api/admin/me")
    fetch(url, { credentials: "include" })
      .then((res) => {
        setAuthStatus(res.ok ? "ok" : "unauthorized")
      })
      .catch(() => setAuthStatus("unauthorized"))
  }, [])

  const handleLogout = async () => {
    if (!DISABLE_REMOTE_API) {
      try {
        await fetch(apiUrl("/api/admin/logout"), {
          method: "POST",
          credentials: "include",
        })
      } catch {
        /* best effort */
      }
    } else {
      try {
        sessionStorage.removeItem(ADMIN_AUTH_KEY)
      } catch {
        /* storage unavailable */
      }
    }
    navigate("/admin/login", { replace: true })
  }

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

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab("ctas")}
              className={`font-display text-lg font-semibold transition ${
                activeTab === "ctas"
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Edit website content
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`text-sm font-medium transition ${
                activeTab === "tracker"
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              Live Tracker
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              Log out
            </button>
            <Link
              to="/"
              className="text-sm font-medium text-[var(--color-accent)] transition hover:underline"
            >
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main
        className={`mx-auto px-4 py-8 sm:px-6 ${
          activeTab === "ctas" ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        {activeTab === "ctas" && <AdminCtas />}
        {activeTab === "tracker" && <AdminTracker />}
      </main>
    </div>
  )
}
