/**
 * Optional: generate .webp siblings next to hero + impact JPGs for <picture> sources.
 * Run: node scripts/generate-webp.mjs
 */
import { readdir } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const imagesDir = join(root, "public", "images")

let sharp
try {
  sharp = (await import("sharp")).default
} catch {
  console.warn("Install sharp to generate WebP: npm i -D sharp")
  process.exit(0)
}

const targets = ["hero-1.jpg", "hero-2.jpg", "hero-3.jpg", "impact.jpg"]

async function main() {
  for (const name of targets) {
    const input = join(imagesDir, name)
    const out = input.replace(/\.jpe?g$/i, ".webp")
    try {
      await sharp(input).webp({ quality: 82 }).toFile(out)
      console.log("Wrote", out)
    } catch (e) {
      console.warn("Skip", name, e.message)
    }
  }
  const rest = await readdir(imagesDir).catch(() => [])
  for (const f of rest) {
    if (!/^hero-\d+\.jpg$/i.test(f)) continue
    if (targets.includes(f)) continue
    const input = join(imagesDir, f)
    const out = input.replace(/\.jpe?g$/i, ".webp")
    try {
      await sharp(input).webp({ quality: 82 }).toFile(out)
      console.log("Wrote", out)
    } catch {
      /* ignore */
    }
  }
}

main()
