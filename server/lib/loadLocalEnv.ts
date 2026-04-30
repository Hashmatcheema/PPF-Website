import fs from "node:fs"
import path from "node:path"

let loaded = false

function cleanEnv(s: string | undefined): string {
  return String(s ?? "").replace(/^\uFEFF/, "").replace(/\r/g, "").trim()
}

/** Never read disk secrets on Vercel production/preview workers. */
function mayLoadDotEnvFromDisk(): boolean {
  const env = cleanEnv(process.env.VERCEL_ENV)
  if (env === "production" || env === "preview") return false
  return true
}

function parseDotEnvLine(line: string): { key: string; val: string } | null {
  const t = line.replace(/\r$/, "").trim()
  if (!t || t.startsWith("#")) return null
  const eq = t.indexOf("=")
  if (eq <= 0) return null
  const key = t.slice(0, eq).trim()
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return null
  let val = t.slice(eq + 1).trim()
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
  else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
  return { key, val }
}

function mergeEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, "utf8")
  for (const line of text.split("\n")) {
    const parsed = parseDotEnvLine(line)
    if (!parsed) continue
    const cur = process.env[parsed.key]
    if (cur === undefined || cur === "") {
      process.env[parsed.key] = parsed.val
    }
  }
}

/**
 * `vercel dev` sometimes does not inject `.env.local` into serverless `process.env`.
 * Merge `.env` then `.env.local` from the project tree (walk up from cwd) when not on prod/preview.
 */
export function loadLocalEnvOnce(): void {
  if (loaded) return
  try {
    if (!mayLoadDotEnvFromDisk()) return

    let dir = process.cwd()
    let rootWithEnv: string | null = null
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, ".env.local")) || fs.existsSync(path.join(dir, ".env"))) {
        rootWithEnv = dir
        break
      }
      const parent = path.dirname(dir)
      if (parent === dir) break
      dir = parent
    }
    if (!rootWithEnv) return

    mergeEnvFile(path.join(rootWithEnv, ".env"))
    mergeEnvFile(path.join(rootWithEnv, ".env.local"))
  } catch {
    /* ignore missing or unreadable env files */
  } finally {
    loaded = true
  }
}
