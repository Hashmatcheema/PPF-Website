import { parse, serialize } from "cookie"
import jwt, { type JwtPayload } from "jsonwebtoken"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { loadLocalEnvOnce } from "./loadLocalEnv.js"

export const COOKIE_NAME = "ppf-admin-token"

function cleanEnv(s: string | undefined): string {
  return String(s ?? "").replace(/^\uFEFF/, "").replace(/\r/g, "").trim()
}

export function jwtSecret(): string {
  loadLocalEnvOnce()
  return (
    cleanEnv(process.env.JWT_SECRET) ||
    cleanEnv(process.env.PPF_JWT_SECRET) ||
    "change-me-in-production"
  )
}

/** Vercel deployments use HTTPS (production + preview); local `vercel dev` is http. */
export function isProductionCookie(): boolean {
  return process.env.VERCEL === "1" && process.env.VERCEL_ENV !== "development"
}

export function cookieSerializeOpts(): Parameters<typeof serialize>[2] {
  return {
    httpOnly: true,
    secure: isProductionCookie(),
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  }
}

/** `vercel dev` sets this; never use VITE_* admin creds on production/preview workers. */
function isVercelLocalDev(): boolean {
  return cleanEnv(process.env.VERCEL_ENV) === "development"
}

export function adminCredentials(): { user: string; pass: string } | null {
  loadLocalEnvOnce()
  let user =
    cleanEnv(process.env.ADMIN_USERNAME) || cleanEnv(process.env.PPF_ADMIN_USERNAME)
  let pass =
    cleanEnv(process.env.ADMIN_PASSWORD) || cleanEnv(process.env.PPF_ADMIN_PASSWORD)
  if ((!user || !pass) && isVercelLocalDev()) {
    user = user || cleanEnv(process.env.VITE_ADMIN_USERNAME)
    pass = pass || cleanEnv(process.env.VITE_ADMIN_PASSWORD)
  }
  if (!user || !pass) return null
  return { user, pass }
}

export function getTokenFromRequest(req: VercelRequest): string | null {
  const raw = req.headers.cookie
  if (!raw) return null
  const parsed = parse(raw)
  const t = parsed[COOKIE_NAME]
  return t && String(t).length > 0 ? String(t) : null
}

function getBearerToken(req: VercelRequest): string | null {
  const raw = req.headers.authorization
  const s = Array.isArray(raw) ? raw[0] : raw
  if (!s || typeof s !== "string") return null
  const m = /^Bearer\s+(\S+)/i.exec(s.trim())
  return m?.[1] ?? null
}

export function issueAdminToken(username: string): string {
  return jwt.sign({ sub: username }, jwtSecret(), { expiresIn: "24h" })
}

export function setAuthCookieWithToken(res: VercelResponse, token: string): void {
  res.setHeader("Set-Cookie", serialize(COOKIE_NAME, token, cookieSerializeOpts()))
}

export function verifyAdminToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, jwtSecret()) as JwtPayload
    if (payload?.sub && typeof payload.sub === "string") return payload.sub
  } catch {
    // invalid
  }
  return null
}

export function requireAdminUser(req: VercelRequest): string | null {
  const token = getTokenFromRequest(req) || getBearerToken(req)
  if (!token) return null
  return verifyAdminToken(token)
}

export function setAuthCookie(res: VercelResponse, username: string): void {
  setAuthCookieWithToken(res, issueAdminToken(username))
}

export function clearAuthCookie(res: VercelResponse): void {
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      path: "/",
      httpOnly: true,
      secure: isProductionCookie(),
      sameSite: "lax",
      maxAge: 0,
    })
  )
}
