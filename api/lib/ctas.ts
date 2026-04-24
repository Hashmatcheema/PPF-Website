import { getRedis, CTAS_KEY } from "./redis.js"

export type LocaleLabel = { en: string; ur: string }

export interface CtasConfig {
  joinUrl: string
  joinLabel: LocaleLabel
  contactLabel: LocaleLabel
  heroCtaHeading: LocaleLabel
  heroCtaSubtext: LocaleLabel
  volunteerLabel: LocaleLabel
  donateLabel: LocaleLabel
  marchPosterUrl: string
}

export function defaultCtas(): CtasConfig {
  return {
    joinUrl: "",
    joinLabel: { en: "Join Us", ur: "شامل ہوں" },
    contactLabel: { en: "Contact Us", ur: "رابطہ کریں" },
    heroCtaHeading: {
      en: "A United Stand for Palestine",
      ur: "فلسطین کے لیے متحدہ موقف",
    },
    heroCtaSubtext: {
      en: "Answer the call to stand for Al-Aqsa and Palestine.",
      ur: "الاقصیٰ اور فلسطین کے لیے کھڑے ہونے کی دعوت کا جواب دیں۔",
    },
    volunteerLabel: { en: "Volunteer", ur: "رضاکار" },
    donateLabel: { en: "Donate", ur: "عطیہ" },
    /** Same-origin march poster JPEG; keep in sync with src/data/images.ts `DEFAULT_MARCH_POSTER_URL` */
    marchPosterUrl:
      "/images/WhatsApp%20Image%202026-04-09%20at%2021.09.21.jpeg",
  }
}

function isLocaleLabel(x: unknown): x is LocaleLabel {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as LocaleLabel).en === "string" &&
    typeof (x as LocaleLabel).ur === "string"
  )
}

export function parseCtasBody(raw: unknown): CtasConfig | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  if (
    !isLocaleLabel(o.joinLabel) ||
    !isLocaleLabel(o.contactLabel) ||
    !isLocaleLabel(o.heroCtaHeading) ||
    !isLocaleLabel(o.heroCtaSubtext) ||
    !isLocaleLabel(o.volunteerLabel) ||
    !isLocaleLabel(o.donateLabel)
  ) {
    return null
  }
  const marchPosterUrl =
    typeof o.marchPosterUrl === "string" ? o.marchPosterUrl : ""
  const resolvedPoster =
    "marchPosterUrl" in o ? marchPosterUrl : defaultCtas().marchPosterUrl

  return {
    joinUrl: typeof o.joinUrl === "string" ? o.joinUrl : "",
    joinLabel: o.joinLabel,
    contactLabel: o.contactLabel,
    heroCtaHeading: o.heroCtaHeading,
    heroCtaSubtext: o.heroCtaSubtext,
    volunteerLabel: o.volunteerLabel,
    donateLabel: o.donateLabel,
    marchPosterUrl: resolvedPoster,
  }
}

export async function readCtas(): Promise<CtasConfig> {
  const redis = getRedis()
  if (!redis) {
    return defaultCtas()
  }
  const raw = await redis.get<string>(CTAS_KEY)
  if (raw == null || raw === "") {
    return defaultCtas()
  }
  try {
    const parsed =
      typeof raw === "string" ? (JSON.parse(raw) as unknown) : (raw as unknown)
    const c = parseCtasBody(parsed)
    return c ?? defaultCtas()
  } catch {
    return defaultCtas()
  }
}

export async function writeCtas(config: CtasConfig): Promise<void> {
  const redis = getRedis()
  if (!redis) {
    throw new Error("REDIS_NOT_CONFIGURED")
  }
  await redis.set(CTAS_KEY, JSON.stringify(config))
}

export async function mergeCtasPatch(body: Record<string, unknown>): Promise<CtasConfig> {
  const current = await readCtas()
  const merged = { ...current, ...body } as CtasConfig & Record<string, unknown>
  const required = [
    "joinLabel",
    "contactLabel",
    "heroCtaHeading",
    "heroCtaSubtext",
    "volunteerLabel",
    "donateLabel",
  ] as const
  for (const key of required) {
    const v = merged[key]
    if (
      !v ||
      typeof v !== "object" ||
      typeof (v as LocaleLabel).en !== "string" ||
      typeof (v as LocaleLabel).ur !== "string"
    ) {
      merged[key] = current[key]
    }
  }
  if (typeof merged.marchPosterUrl !== "string") {
    merged.marchPosterUrl = current.marchPosterUrl
  }
  return merged as CtasConfig
}
