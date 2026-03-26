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
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--color-text-muted)]">
          {t.intro}
        </p>
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 md:gap-14 px-4 md:px-0">
          {members.map((member, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="relative h-64 w-64 md:h-72 md:w-72 overflow-hidden rounded-full border-4 border-white/10 shadow-card">
                <img
                  src={images[member.imageKey]}
                  alt=""
                  className="h-full w-full object-cover"
                  style={"imagePosition" in member && member.imagePosition === "top" ? { objectPosition: "center top" } : undefined}
                />
              </div>
              <h3 className="font-display mt-6 text-2xl font-bold text-[var(--color-text)]">
                {member.name}
              </h3>
              <p className="mt-2 text-base text-[var(--color-text-muted)]">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
