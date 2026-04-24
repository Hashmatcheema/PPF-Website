/**
 * Gaza & Palestine cause imagery — humanitarian, solidarity, dignity.
 * Replace with your own assets; these are high-quality placeholders.
 * Sources: Unsplash (humanitarian, solidarity, peace, community, aid).
 */

/** Primary hero / slide still (WebP). */
const HERO_PRIMARY_WEBP = "/images/354b2959-8e7f-4f19-b8d4-eee82ab400b6.webp" as const

/**
 * Default march modal graphic (`public/images/WhatsApp Image 2026-04-09 at 21.09.21.jpeg`).
 * Spaces encoded for stable `src` URLs. Override in Admin → CTAs; keep in sync with `server/lib/ctas.ts` defaultCtas.
 */
export const DEFAULT_MARCH_POSTER_URL =
  "/images/WhatsApp%20Image%202026-04-09%20at%2021.09.21.jpeg" as const

/** Hero slider images — order matches `content.*.heroSlides` (0 = first tagline, 1 = second, …). */
const heroSlidesList = [
  "/images/hero-slide-2.webp",
  HERO_PRIMARY_WEBP,
  "/images/hero-3.webp",
] as const

export const images = {
  hero: HERO_PRIMARY_WEBP,
  heroMobile: HERO_PRIMARY_WEBP,
  heroSlides: heroSlidesList,
  /** Solidarity / community / together */
  solidarity1: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  solidarity2: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80",
  solidarity3: "https://images.unsplash.com/photo-1511632765486-a01980e01a85?w=1200&q=80",
  /** Olive / peace / land */
  olive: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80",
  land: "https://images.unsplash.com/photo-1500387467463-e7b3d79a3d4c?w=1200&q=80",
  /** Mission / Vision section */
  missionVision: "/images/mission.webp",
  /** Humanitarian / aid / hope / relief (Impact section) */
  humanitarian: "/images/impact.webp",
  hope: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80",
  community: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80",
  aid: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
  support: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80",
  /** Map / region */
  map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80",
  /** Gallery (use across sections) */
  gallery: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  ],
  /** Team — PPF headshots from Images for PPF website/Team */
  team1: "/images/team1.webp",
  team2: "/images/team2.webp",
  team3: "/images/team3.webp",
  team4: "/images/team4.webp",
  team5: "/images/team5.webp",
  team6: "/images/team6.webp",
  team7: "/images/team7.webp",
  team8: "/images/team8.webp",
  team9: "/images/team9.webp",
} as const
