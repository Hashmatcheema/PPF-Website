import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
<<<<<<< HEAD

const ADMIN_AUTH_KEY = "ppf-admin-auth"
const API_URL = import.meta.env.VITE_CTAS_API_URL ?? ""
=======
import { apiUrl, DISABLE_REMOTE_API } from "@/lib/apiUrl"

const ADMIN_AUTH_KEY = "ppf-admin-auth"
>>>>>>> modifics

function checkCredentialsClient(username: string, password: string): boolean {
  const envUser = import.meta.env.VITE_ADMIN_USERNAME ?? ""
  const envPass = import.meta.env.VITE_ADMIN_PASSWORD ?? ""
  if (!envUser || !envPass) return false
  return username === envUser && password === envPass
}

export function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username.trim() || !password) {
      setError("Please enter username and password.")
      return
    }
    setLoading(true)
<<<<<<< HEAD
    if (API_URL) {
      const url = API_URL.replace(/\/$/, "") + "/api/admin/login"
=======
    if (!DISABLE_REMOTE_API) {
      const url = apiUrl("/api/admin/login")
>>>>>>> modifics
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
          credentials: "include",
        })
        if (res.ok) {
          navigate("/admin", { replace: true })
          return
        }
        const data = await res.json().catch(() => ({}))
        setError(data?.error === "Invalid credentials" ? "Invalid username or password." : "Login failed.")
      } catch {
        setError("Unable to reach server.")
      } finally {
        setLoading(false)
      }
      return
    }
    const ok = checkCredentialsClient(username.trim(), password)
    setLoading(false)
    if (ok) {
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, "1")
<<<<<<< HEAD
      } catch {}
=======
      } catch {
        /* storage unavailable */
      }
>>>>>>> modifics
      navigate("/admin", { replace: true })
    } else {
      setError("Invalid username or password.")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
            PPF Admin
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Sign in to manage CTAs
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              placeholder="Username"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-[var(--color-text)] placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              placeholder="Password"
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            Back to site
          </Link>
        </p>
      </div>
    </div>
  )
}

export { ADMIN_AUTH_KEY }
