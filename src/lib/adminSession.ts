/** Same JWT as httpOnly cookie; used as `Authorization` when cookie is not sent (e.g. some cross-origin setups). */
export const PPF_ADMIN_JWT_KEY = "ppf-admin-jwt"

export function getStoredAdminJwt(): string | null {
  try {
    return sessionStorage.getItem(PPF_ADMIN_JWT_KEY)
  } catch {
    return null
  }
}

export function setStoredAdminJwt(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(PPF_ADMIN_JWT_KEY, token)
    else sessionStorage.removeItem(PPF_ADMIN_JWT_KEY)
  } catch {
    /* storage unavailable */
  }
}

/** Merge into `init` so admin APIs receive cookies and optional Bearer token. */
export function adminAuthFetchInit(init?: RequestInit): RequestInit {
  const jwt = getStoredAdminJwt()
  const headers = new Headers(init?.headers ?? undefined)
  if (jwt) headers.set("Authorization", `Bearer ${jwt}`)
  return {
    ...init,
    credentials: "include",
    headers,
  }
}
