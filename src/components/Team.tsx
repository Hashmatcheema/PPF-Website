import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { images } from "@/data/images"

type TeamMember = (typeof content.en.team.members)[number]

function TeamMemberTile({ member, compact }: { member: TeamMember; compact: boolean }) {
  const imgPos =
    "imagePosition" in member && member.imagePosition === "top" ? ({ objectPosition: "center top" } as const) : undefined

  if (compact) {
    return (
      <article className="flex h-full flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-2 pb-3 pt-2.5">
        <div className="relative aspect-square w-[5.5rem] shrink-0 overflow-hidden rounded-full border-2 border-white/10 shadow-card">
          <img src={images[member.imageKey]} alt="" className="h-full w-full object-cover" style={imgPos} />
        </div>
        <h3 className="font-display mt-2 w-full text-balance text-center text-[0.8125rem] font-bold leading-snug text-[var(--color-text)]">
          {member.name}
        </h3>
        <p className="mt-1 w-full text-balance text-center text-[0.6875rem] font-semibold leading-snug text-[var(--color-text)]">
          {member.tag}
        </p>
        <p className="mt-1.5 line-clamp-3 w-full text-balance text-center text-[0.625rem] leading-snug text-[var(--color-text-muted)]">
          {member.bio}
        </p>
      </article>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-center px-1 text-center sm:px-0">
      <div className="relative mx-auto aspect-square w-full max-w-[min(16rem,calc(100vw-2.5rem))] overflow-hidden rounded-full border-4 border-white/10 shadow-card sm:max-w-[18rem] md:aspect-auto md:h-72 md:w-72 md:max-w-none">
        <img src={images[member.imageKey]} alt="" className="h-full w-full object-cover" style={imgPos} />
      </div>
      <h3 className="font-display mt-5 max-w-full text-balance break-words text-xl font-bold text-[var(--color-text)] sm:mt-6 sm:text-2xl">
        {member.name}
      </h3>
      <p className="mt-2 max-w-md text-pretty break-words text-base font-semibold text-[var(--color-text)]">{member.tag}</p>
      <p className="mt-2 max-w-md whitespace-pre-line text-pretty break-words text-base text-[var(--color-text-muted)]">{member.bio}</p>
    </div>
  )
}

type TeamSeg = { kind: "member"; member: TeamMember } | { kind: "chapter-divider" }

export function Team({ lang }: { lang: Locale }) {
  const t = content[lang].team
  const members = "members" in t ? t.members : []
  const chapterLabel = "chapterHeadsLabel" in t ? t.chapterHeadsLabel : undefined

  const segments: TeamSeg[] = []
  members.forEach((member, i) => {
    if (i === 3 && chapterLabel) segments.push({ kind: "chapter-divider" })
    segments.push({ kind: "member", member })
  })

  return (
    <section id="team" className="border-t border-[var(--color-border-soft)] bg-[var(--color-bg)] py-20 md:py-32">
      <div className="wrap">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]">
            Team
          </p>
          <div className="h-px w-8 bg-[var(--color-accent)]" />
        </div>
        <h2 className="font-display mt-4 text-center text-3xl font-semibold text-[var(--color-text)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl px-1 text-center text-pretty break-words text-[var(--color-text-muted)] sm:px-0">
          {t.intro}
        </p>

        {/* Mobile: compact horizontal row */}
        <ul
          className="team-mobile-scroll mt-10 flex list-none flex-row gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory scroll-smooth max-md:-mx-5 max-md:scroll-pl-4 max-md:scroll-pr-4 sm:mt-12 md:hidden"
          role="list"
          aria-label={t.title}
        >
          {segments.map((seg, idx) =>
            seg.kind === "chapter-divider" ? (
              <li
                key={`divider-${idx}`}
                className="flex w-9 shrink-0 snap-start flex-col items-center justify-center border-x border-white/10 py-3"
                aria-hidden
              >
                <p className="font-display max-h-[6rem] text-center text-[0.45rem] font-semibold uppercase leading-tight tracking-[0.2em] text-[var(--color-label-red)] [writing-mode:vertical-rl] rotate-180">
                  {chapterLabel}
                </p>
              </li>
            ) : (
              <li key={seg.member.name} className="w-[9.5rem] min-w-0 shrink-0 snap-start sm:w-[10rem]">
                <TeamMemberTile member={seg.member} compact />
              </li>
            ),
          )}
        </ul>

        {/* Tablet/desktop: grid (unchanged layout from md up) */}
        <div className="mt-12 hidden grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-12 md:grid md:gap-14 lg:grid-cols-3">
          {segments.map((seg, idx) =>
            seg.kind === "chapter-divider" ? (
              <div
                key={`d-${idx}`}
                className="col-span-full flex justify-center pt-2 sm:col-span-2 sm:pt-4 lg:col-span-3"
              >
                <div className="flex w-full max-w-lg items-center justify-center gap-3 px-1 sm:px-0">
                  <div className="h-px w-8 shrink-0 bg-[var(--color-accent)]/40" aria-hidden />
                  <p className="shrink-0 font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-label-red)]">
                    {chapterLabel}
                  </p>
                  <div className="h-px w-8 shrink-0 bg-[var(--color-accent)]/40" aria-hidden />
                </div>
              </div>
            ) : (
              <div key={seg.member.name} className="min-w-0">
                <TeamMemberTile member={seg.member} compact={false} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
