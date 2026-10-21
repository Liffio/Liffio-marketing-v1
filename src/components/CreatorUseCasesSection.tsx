import { TechBadge } from "@/components/TechBadge";

/**
 * How real accounts use Liffio.
 *
 * 🔴 THIS IS NOT A TESTIMONIAL SECTION, AND IT MUST NOT BECOME ONE.
 *
 * Every line here describes what an account DOES with the product. Nothing is
 * in quotation marks and nothing is attributed to anyone's speech, because none
 * of these people have given us words - they have given permission to show
 * their handle and picture. Putting invented sentences next to a real face and
 * a real handle is a specific, checkable false claim about an identifiable
 * person, which is strictly worse than the anonymous initials this replaced
 * (see the commented-out TestimonialsSection in src/app/page.tsx).
 *
 * If you later get a real quote, in their own words, with their agreement to be
 * quoted: add it. Until then, describe behaviour, not speech.
 *
 * 🚩 Both entries are verified use cases supplied by the owner on 2026-10-21:
 *   - @_creative_editors: music-content reels. Keyword trigger returns the track
 *     with Spotify, Apple Music and YouTube Music buttons.
 *   - @mixbunch.in: clothing store. Keyword returns pricing and a direct product
 *     link.
 *   - @_a_bit_of_pics_: personal photography feed. Uses comment-to-DM, but with
 *     no fixed content - the trigger and reply change per post, and the copy
 *     says only that. Do not add an account here without a true description of
 *     what it actually does.
 *
 * Follower counts are a point-in-time fact and will drift. They are small
 * numbers honestly stated; do not round them up, and re-check before quoting
 * them anywhere else.
 */

type CreatorUseCase = {
  handle: string;
  vertical: string;
  followers: string;
  /** What the automation actually does on this account. Behaviour, never speech. */
  useCase: string;
  /** Self-hosted avatar under /public. Instagram CDN URLs rotate and 404 - never hotlink them. */
  avatar?: string;
};

const CREATORS: CreatorUseCase[] = [
  {
    handle: "@_creative_editors",
    vertical: "Music content",
    followers: "13K followers",
    useCase:
      "Someone comments asking for the track. The keyword trigger sends it straight to their DMs with Spotify, Apple Music and YouTube Music as buttons, so they open it wherever they already listen.",
    avatar: "/logo/creators/creative-editors.webp",
  },
  {
    handle: "@mixbunch.in",
    vertical: "Clothing store",
    followers: "2,259 followers",
    useCase:
      "Comment a product keyword and the DM comes back with the price and a direct link to that item, instead of the question sitting unanswered under the post.",
    avatar: "/logo/creators/mixbunch.webp",
  },
  {
    handle: "@_a_bit_of_pics_",
    vertical: "Photography",
    followers: "937 followers",
    // Owner-confirmed 2026-10-21: this account uses comment-to-DM, but with no
    // fixed content - the keyword and the reply change per post. The copy says
    // exactly that and no more. Do NOT invent a specific trigger here; if a
    // consistent one emerges, replace this line with the real one.
    useCase:
      "A personal photo feed running comment-to-DM post by post, with the keyword and the reply set to whatever that shot's comments are actually asking for.",
    avatar: "/logo/creators/a-bit-of-pics.webp",
  },
];

export default function CreatorUseCasesSection() {
  return (
    <section
      aria-labelledby="creator-use-cases-heading"
      className="relative bg-white py-16 sm:py-20"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(245, 24, 76,0.12),transparent)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <TechBadge label="In the wild" variant="section" className="mb-4" />
          <h2
            id="creator-use-cases-heading"
            className="text-2xl font-extrabold tracking-tight text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            How creators actually use Liffio
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Three accounts, three different jobs, the same comment-to-DM trigger.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CREATORS.map((c) => (
            <li key={c.handle} className="card-base flex flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3">
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f7f7f9] text-sm font-bold text-[#0a0a0a]"
                    aria-hidden
                  >
                    {c.handle.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  {/*
                    Deliberately NOT a link, and this is the owner's call
                    (2026-10-21). The handle is enough for anyone who wants
                    to look the account up, and a live link here sends a
                    reader to Instagram from the middle of the page instead
                    of on to signup. Do not "improve" this by linking it.
                  */}
                  <p className="truncate text-sm font-bold text-[#0a0a0a]">
                    {c.handle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.vertical} · {c.followers}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">{c.useCase}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
