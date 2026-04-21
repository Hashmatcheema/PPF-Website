import type { Locale } from "@/data/content"
import { content } from "@/data/content"
import { images } from "@/data/images"

export function Team({ lang }: { lang: Locale }) {
  const t = content[lang].team
  const members = "members" in t ? t.members : []
  return (
    <section id="team" className="border-t border-white/10 bg-black py-24 md:py-32">
      <div className="wrap">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--color-accent)]" />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
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
        <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-12 md:gap-14 lg:grid-cols-3">
          {members.flatMap((member, i) => {
            const chapterLabel = "chapterHeadsLabel" in t ? t.chapterHeadsLabel : undefined
            const showChapterHeads = i === 3 && chapterLabel

            const card = (
              <div
                key={member.name}
                className="flex w-full min-w-0 flex-col items-center px-1 text-center sm:px-0"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[min(16rem,calc(100vw-2.5rem))] overflow-hidden rounded-full border-4 border-white/10 shadow-card sm:max-w-[18rem] md:aspect-auto md:h-72 md:w-72 md:max-w-none">
                  <img
                    src={images[member.imageKey]}
                    alt=""
                    className="h-full w-full object-cover"
                    style={"imagePosition" in member && member.imagePosition === "top" ? { objectPosition: "center top" } : undefined}
                  />
                </div>
                <h3 className="font-display mt-5 max-w-full text-balance break-words text-xl font-bold text-[var(--color-text)] sm:mt-6 sm:text-2xl">
                  {member.name}
                </h3>
                <p className="mt-2 max-w-md text-pretty break-words text-base font-semibold text-[var(--color-text)]">
                  {member.tag}
                </p>
                <p className="mt-2 max-w-md whitespace-pre-line text-pretty break-words text-base text-[var(--color-text-muted)]">
                  {member.bio}
                </p>
              </div>
            )

            if (showChapterHeads) {
              return [
                <div
                  key="chapter-heads"
                  className="col-span-full flex justify-center pt-2 sm:col-span-2 sm:pt-4 lg:col-span-3"
                >
                  <div className="flex w-full max-w-lg items-center gap-3 px-1 sm:px-0">
                    <div className="h-px flex-1 bg-[var(--color-accent)]/40" />
                    <p className="shrink-0 font-display text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                      {chapterLabel}
                    </p>
                    <div className="h-px flex-1 bg-[var(--color-accent)]/40" />
                  </div>
                </div>,
                card,
              ]
            }
            return [card]
          })}
        </div>
      </div>
    </section>
  )
}
