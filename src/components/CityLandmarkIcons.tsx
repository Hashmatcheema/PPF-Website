/**
 * City landmark SVGs — copied from Talha-1010/pakpalforum (pages/index.js CityLandmarkIcon).
 * Index 0–3: Islamabad, Lahore, Karachi, Faisalabad (named landmarks).
 * Index 4: Sargodha — generic dome + base (no Talha landmark asset); matches `CHAPTERS_DATA` “Regional Chapter”.
 * Index 5: Multan — Shrine of Rukn-e-Alam.
 */
function cityLandmarkSvgIcons(iconCls: string) {
  return [
    // 0: Islamabad – Faisal Mosque
    <svg key="isb" viewBox="0 0 48 48" className={iconCls} aria-hidden>
      <rect x="3" y="10" width="4" height="34" />
      <polygon points="5,6 3,10 7,10" />
      <rect x="41" y="10" width="4" height="34" />
      <polygon points="43,6 41,10 45,10" />
      <rect x="10" y="16" width="3" height="28" />
      <polygon points="11.5,13 10,16 13,16" />
      <rect x="35" y="16" width="3" height="28" />
      <polygon points="36.5,13 35,16 38,16" />
      <polygon points="24,8 11,38 37,38" />
      <rect x="8" y="38" width="32" height="4" />
      <rect x="5" y="42" width="38" height="4" />
    </svg>,
    // 1: Lahore – Badshahi Mosque
    <svg key="lhr" viewBox="0 0 48 48" className={iconCls} aria-hidden>
      <rect x="1" y="10" width="5" height="36" />
      <polygon points="3.5,6 1,10 6,10" />
      <rect x="42" y="10" width="5" height="36" />
      <polygon points="44.5,6 42,10 47,10" />
      <rect x="10" y="16" width="4" height="30" />
      <polygon points="12,13 10,16 14,16" />
      <rect x="34" y="16" width="4" height="30" />
      <polygon points="36,13 34,16 38,16" />
      <path d="M17,28 Q17,14 24,14 Q31,14 31,28 Z" />
      <rect x="14" y="26" width="20" height="4" />
      <rect x="12" y="30" width="24" height="16" />
      <path
        d="M20,46 L20,36 Q24,30 28,36 L28,46"
        fill="#000000"
        fillOpacity="0.22"
      />
      <rect x="5" y="46" width="38" height="2" />
    </svg>,
    // 2: Karachi – Mazar-e-Quaid
    <svg key="khi" viewBox="0 0 48 48" className={iconCls} aria-hidden>
      <line x1="24" y1="2" x2="24" y2="8" stroke="#000000" strokeWidth="2" />
      <path d="M10,26 Q10,8 24,8 Q38,8 38,26 Z" />
      <rect x="8" y="24" width="32" height="4" />
      <rect x="7" y="28" width="34" height="16" />
      <path d="M10,44 L10,35 Q14.5,29 19,35 L19,44" fill="#000000" fillOpacity="0.22" />
      <path d="M21.5,44 L21.5,36 Q24,32 26.5,36 L26.5,44" fill="#000000" fillOpacity="0.22" />
      <path d="M29,44 L29,35 Q33.5,29 38,35 L38,44" fill="#000000" fillOpacity="0.22" />
      <rect x="4" y="44" width="40" height="2" />
      <rect x="1" y="46" width="46" height="2" />
    </svg>,
    // 3: Faisalabad – Ghanta Ghar (dome + finial minaret on apex ~24,3.5)
    <svg key="fsd" viewBox="0 0 48 48" className={iconCls} overflow="visible" aria-hidden>
      <path d="M18,13 Q18,3.5 24,3.5 Q30,3.5 30,13 Z" />
      {/* Foot on dome — small arch */}
      <path d="M22.2,3.5 Q24,2.35 25.8,3.5 Z" />
      {/* Stem */}
      <rect x="23.2" y="2.05" width="1.6" height="1.45" rx="0.2" />
      {/* Bulb */}
      <circle cx="24" cy="1.15" r="1.05" />
      {/* Spike */}
      <line
        x1="24"
        y1="0.12"
        x2="24"
        y2="-1.15"
        stroke="#000000"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <rect x="16" y="13" width="16" height="6" />
      <rect x="16" y="19" width="16" height="10" />
      <circle cx="24" cy="24" r="4" fill="#000000" fillOpacity="0.22" />
      <rect x="17" y="29" width="14" height="13" />
      <path d="M19,42 L19,36 Q24,31 29,36 L29,42" fill="#000000" fillOpacity="0.22" />
      <rect x="13" y="42" width="22" height="4" />
      <rect x="10" y="46" width="28" height="2" />
    </svg>,
    // 4: Sargodha — chapter marker (Talha has no sixth city; dome + base)
    <svg key="srg" viewBox="0 0 48 48" className={iconCls} aria-hidden>
      <circle cx="24" cy="14" r="8" />
      <path d="M10,38 Q10,24 24,24 Q38,24 38,38 Z" />
      <rect x="0" y="38" width="48" height="8" />
    </svg>,
    // 5: Multan – Shrine of Rukn-e-Alam
    <svg key="mtn" viewBox="0 0 48 48" className={iconCls} aria-hidden>
      <path d="M19,16 Q19,8 24,8 Q29,8 29,16 Z" />
      <rect x="21" y="14" width="6" height="4" />
      <polygon points="15,18 13,34 35,34 33,18" />
      <rect x="13" y="27" width="22" height="2" fill="#000000" fillOpacity="0.28" />
      <polygon points="12,34 9,46 39,46 36,34" />
      <rect x="10" y="40" width="28" height="2" fill="#000000" fillOpacity="0.28" />
      <rect x="7" y="46" width="34" height="2" />
    </svg>,
  ]
}

export function CityLandmarkIcon({
  index,
  className,
}: {
  index: number
  /** Defaults to h-14 w-14 + accent fill (stroke optional via className) */
  className?: string
}) {
  const iconCls = className ?? "h-14 w-14 fill-[var(--color-accent)]"
  const icons = cityLandmarkSvgIcons(iconCls)
  return icons[index] ?? icons[0]
}
