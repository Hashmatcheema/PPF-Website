/**
 * One-shot: write .webp siblings for local marketing rasters under public/images.
 * Run: node scripts/convert-marketing-images-to-webp.mjs
 */
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const imagesDir = join(root, "public", "images")

const sharp = (await import("sharp")).default

/** Paths relative to public/images — add here when new local bitmaps ship */
const relativePaths = [
  "mission.jpg",
  "impact.jpg",
  "team1.jpg",
  "team2.jpg",
  "team3.jpg",
  "team4.jpg",
  "team5.jpg",
  "team6.jpg",
  "team7.jpg",
  "team8.jpg",
  "team9.jpg",
  "PPF-logo.png",
  "ppf logo transparent.png",
]

async function main() {
  for (const rel of relativePaths) {
    const input = join(imagesDir, rel)
    const out = input.replace(/\.(jpe?g|png)$/i, ".webp")
    try {
      await sharp(input).webp({ quality: 85, effort: 4 }).toFile(out)
      console.log("OK", rel, "→", out.replace(root + "/", ""))
    } catch (e) {
      console.warn("Skip", rel, e.message)
    }
  }
}

main()
