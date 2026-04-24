import { DEFAULT_MARCH_POSTER_URL } from "./images"

/**
 * CTA config schema — matches server API (GET/PUT /api/ctas).
 * Client can change labels and joinUrl without code deploy.
 */
export type LocaleLabel = { en: string; ur: string }

export interface CtasConfig {
  joinUrl: string
  joinLabel: LocaleLabel
  contactLabel: LocaleLabel
  heroCtaHeading: LocaleLabel
  heroCtaSubtext: LocaleLabel
  volunteerLabel: LocaleLabel
  donateLabel: LocaleLabel
  /** Same-site path (/images/…), https URL (e.g. Vercel Blob), or data URL in local-only; shown in the march modal */
  marchPosterUrl: string
}

/** Bundled default used when API is unavailable or returns invalid data */
export const defaultCtas: CtasConfig = {
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
  marchPosterUrl: DEFAULT_MARCH_POSTER_URL,
}

function isLocaleLabel(x: unknown): x is LocaleLabel {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as LocaleLabel).en === "string" &&
    typeof (x as LocaleLabel).ur === "string"
  )
}

export function parseCtas(raw: unknown): CtasConfig | null {
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
  /** Older Redis/local saves had no key — treat as “unset” and use default march poster asset */
  const resolvedPoster =
    "marchPosterUrl" in o ? marchPosterUrl : DEFAULT_MARCH_POSTER_URL

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
