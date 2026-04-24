import { parse, serialize } from "cookie"
import jwt, { type JwtPayload } from "jsonwebtoken"
import type { VercelRequest, VercelResponse } from "@vercel/node"

export const COOKIE_NAME = "ppf-admin-token"

function cleanEnv(s: string | undefined): string {
  return String(s ?? "").replace(/\r/g, "").trim()
}

export function jwtSecret(): string {
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

export function adminCredentials(): { user: string; pass: string } | null {
  const user =
    cleanEnv(process.env.ADMIN_USERNAME) || cleanEnv(process.env.PPF_ADMIN_USERNAME)
  const pass =
    cleanEnv(process.env.ADMIN_PASSWORD) || cleanEnv(process.env.PPF_ADMIN_PASSWORD)
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
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyAdminToken(token)
}

export function setAuthCookie(res: VercelResponse, username: string): void {
  const token = jwt.sign({ sub: username }, jwtSecret(), { expiresIn: "24h" })
  res.setHeader(
    "Set-Cookie",
    serialize(COOKIE_NAME, token, cookieSerializeOpts())
  )
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
