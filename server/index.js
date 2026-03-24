import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { readFile, writeFile, mkdir } from "fs/promises"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, ".env") })
const DATA_DIR = process.env.PPF_DATA_DIR || join(__dirname, "data")
const CTAS_PATH = join(DATA_DIR, "ctas.json")
const SUBMISSIONS_PATH = join(DATA_DIR, "submissions.json")
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || process.env.PPF_JWT_SECRET || "change-me-in-production"
function cleanEnv(s) {
  return String(s ?? "").replace(/\r/g, "").trim()
}
const ADMIN_USERNAME = cleanEnv(process.env.ADMIN_USERNAME || process.env.PPF_ADMIN_USERNAME)
const ADMIN_PASSWORD = cleanEnv(process.env.ADMIN_PASSWORD || process.env.PPF_ADMIN_PASSWORD)
const COOKIE_NAME = "ppf-admin-token"
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
}

const app = express()
const allowedOrigin = process.env.CORS_ORIGIN || true
app.use(cors({ origin: allowedOrigin, credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: "10kb" }))

async function readCtas() {
  try {
    const raw = await readFile(CTAS_PATH, "utf-8")
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === "ENOENT") {
      const defaultCtas = {
        joinUrl: "",
        joinLabel: { en: "Join Us", ur: "شامل ہوں" },
        contactLabel: { en: "Contact Us", ur: "رابطہ کریں" },
        heroCtaHeading: { en: "A United Stand for Palestine", ur: "فلسطین کے لیے متحدہ موقف" },
        heroCtaSubtext: {
          en: "Answer the call to stand for Al-Aqsa and Palestine.",
          ur: "الاقصیٰ اور فلسطین کے لیے کھڑے ہونے کی دعوت کا جواب دیں۔",
        },
        volunteerLabel: { en: "Volunteer", ur: "رضاکار" },
        donateLabel: { en: "Donate", ur: "عطیہ" },
      }
      await mkdir(DATA_DIR, { recursive: true })
      await writeFile(CTAS_PATH, JSON.stringify(defaultCtas, null, 2))
      return defaultCtas
    }
    throw err
  }
}

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload?.sub) {
      req.adminUser = payload.sub
      return next()
    }
  } catch {
    // invalid or expired
  }
  res.status(401).json({ error: "Unauthorized" })
}

/** GET /api/ctas — returns current CTA config (public) */
app.get("/api/ctas", async (req, res) => {
  try {
    const ctas = await readCtas()
    res.json(ctas)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to read CTA config" })
  }
})

/** POST /api/admin/login — username/password, sets HttpOnly cookie */
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {}
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(503).json({ error: "Admin login not configured" })
  }
  const u = cleanEnv(username)
  const p = cleanEnv(password)
  if (process.env.NODE_ENV !== "production") {
    console.log("[login] body keys:", req.body ? Object.keys(req.body) : "no body")
    console.log("[login] received username length:", u.length, "password length:", p.length)
    console.log("[login] expected username length:", ADMIN_USERNAME.length, "password length:", ADMIN_PASSWORD.length)
    console.log("[login] username match:", u === ADMIN_USERNAME, "password match:", p === ADMIN_PASSWORD)
  }
  if (u !== ADMIN_USERNAME || p !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  const token = jwt.sign(
    { sub: ADMIN_USERNAME },
    JWT_SECRET,
    { expiresIn: "24h" }
  )
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS)
  res.status(200).json({ ok: true })
})

/** GET /api/admin/me — check auth (for frontend protected route) */
app.get("/api/admin/me", requireAuth, (req, res) => {
  res.status(200).json({ ok: true, user: req.adminUser })
})

/** POST /api/admin/logout — clear cookie */
app.post("/api/admin/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" })
  res.status(200).json({ ok: true })
})

/** PUT /api/ctas — update CTA config (requires admin auth) */
app.put("/api/ctas", requireAuth, async (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "JSON body required" })
    }
    const current = await readCtas()
    const merged = { ...current, ...body }
    // Ensure required locale labels exist
    const required = ["joinLabel", "contactLabel", "heroCtaHeading", "heroCtaSubtext", "volunteerLabel", "donateLabel"]
    for (const key of required) {
      if (!merged[key] || typeof merged[key].en !== "string" || typeof merged[key].ur !== "string") {
        if (current[key]) merged[key] = current[key]
      }
    }
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(CTAS_PATH, JSON.stringify(merged, null, 2))
    res.json(merged)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to write CTA config" })
  }
})

/** POST /api/contact — contact form submission (honeypot: reject if "website" field is set) */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message, website } = req.body || {}
    if (website && String(website).trim()) {
      return res.status(400).json({ error: "Invalid submission" })
    }
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" })
    }
    const entry = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 254),
      message: String(message).slice(0, 5000),
      at: new Date().toISOString(),
    }
    let list = []
    try {
      const raw = await readFile(SUBMISSIONS_PATH, "utf-8")
      list = JSON.parse(raw)
    } catch {
      // file missing or invalid
    }
    list.push(entry)
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(SUBMISSIONS_PATH, JSON.stringify(list, null, 2))
    res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to save submission" })
  }
})

app.listen(PORT, () => {
  console.log(`PPF CTA API listening on port ${PORT}`)
  console.log(`  Admin login: ${ADMIN_USERNAME && ADMIN_PASSWORD ? "configured" : "NOT configured (set ADMIN_USERNAME & ADMIN_PASSWORD in .env)"}`)
  console.log(`  GET  /api/ctas`)
  console.log(`  PUT  /api/ctas (auth)`)
  console.log(`  POST /api/admin/login`)
  console.log(`  GET  /api/admin/me`)
  console.log(`  POST /api/admin/logout`)
})
