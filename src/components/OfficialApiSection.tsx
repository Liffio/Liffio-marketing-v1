import { MetaVerifiedOnly } from "@/components/MetaVerifiedOnly";
import { TechBadge } from "@/components/TechBadge";
import { metaCopy } from "@/config/meta-copy";

/**
 * The trust panel — how Liffio connects, who verified it, and what it costs.
 *
 * Layout follows the approved design: ONE bordered panel containing both
 * credential cards plus a stats rail, rather than loose cards. The stats rail
 * absorbed the old standalone <StatsSection>, which is why that component is no
 * longer rendered on the homepage — the two were stating overlapping things one
 * after the other. "Official / Instagram API" was dropped from the rail on the
 * way in, because the card directly above it already says exactly that.
 *
 * 🔴 BRAND RULES — read before editing. Every one of these shaped the markup.
 *
 * The Instagram glyph may be used on the web WITHOUT a permission request:
 * Instagram only requires a request for broadcast, radio, out-of-home, or print
 * larger than A4. But the usage rules still bind, and four constrain this file:
 *
 *   1. "Implies partnership, sponsorship or endorsement" — forbidden. The copy
 *      says what Meta actually did (approved the business and access
 *      verifications) and never that Meta endorses Liffio. Do not upgrade it.
 *   2. "Makes the Instagram brand the most distinctive or prominent feature" —
 *      forbidden. The glyph is 20px in a tile, on ONE of two equal cards.
 *   3. "Keep the letter 'I' in Instagram capitalized and in the same font size
 *      and style as the content surrounding it" — no styling on the word.
 *   4. "Don't combine any part of the Instagram brand with a company name,
 *      other trademarks, or generic terms" — no "Liffio x Instagram" lockup,
 *      and the glyph is never paired with the Liffio wordmark.
 *
 * 🚩 THE GLYPH IS AN IMAGE, NOT A DRAWN PATH, AND IT IS NOT TINTED. The design
 * this was built from drew the mark as stroke paths and painted it #F5184C.
 * Both are prohibited: Instagram requires the supplied asset, unmodified and
 * unrecoloured. The TILE behind it stays neutral for the same reason: tinting it
 * would fight the glyph's own colours, and recolouring the glyph to resolve that
 * is exactly what you may not do.
 *
 * The shipped file is the pack's GRADIENT glyph resampled to 60px — it renders
 * at 20px, so that covers 3x DPR. Resampling is not modification, and it is not
 * optional here: the pack's only gradient files are a 2.6 MB 5000px PNG and a
 * 10.9 MB "SVG" that is really a base64 PNG in a wrapper. Neither is shippable.
 * Instagram_Glyph_Black.svg and Instagram_Glyph_White.svg sit alongside it,
 * byte-identical to the pack originals, for light and dark grounds if the
 * gradient ever stops suiting the design.
 *
 * 🚩 The Meta mark is absent on purpose, and this is the one people try to
 * "fix". Meta's corporate brand routes certification badges through Brand Review
 * with a Meta counterpart — unlike Instagram's, it is not self-serve. Until that
 * approval exists, "Verified Meta Tech Provider" is TEXT.
 *
 * 🚩 Both cards state a credential Liffio actually holds, evidenced in the App
 * Dashboard as of 2026-09-10: business verification Verified, access
 * verification Verified as a Tech Provider, and an approved App Review
 * submission. Do NOT add press logos, award badges or "featured in" marks that
 * are not real — that is the defect class ADR 0002 exists to prevent. Gated
 * behind MetaVerifiedOnly so the panel disappears rather than degrading if the
 * flag is turned off.
 */

const BORDER = "border-[#e7e2dc]";

const STATS = [
  { value: "OAuth", label: "No password shared" },
  { value: "10–60s", label: "Custom DM delay" },
  { value: "Free", label: "No credit card required" },
];

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function OfficialApiSection() {
  return (
    <MetaVerifiedOnly>
      <section
        aria-labelledby="trust-heading"
        className="hero-mesh-continue relative px-5 py-14 sm:px-7 sm:py-[72px] lg:px-8 lg:py-[88px]"
      >
        {/*
          The section ground is deliberately seamless against the hero (see
          .hero-mesh-continue), which means the join carries no signal of its
          own. This hairline is what tells a reader a new section began, and it
          is the site's existing device, not a new one: the same rule that
          FeaturesSection and PricingSection put at their own top
          edge.

          The blue TechBadge above the h2 is the second signal, and it doubles
          as the credential itself. Do not reach for a background tint or a grid
          wash instead — a tint
          reintroduces the visible step this ground exists to remove.
        */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(245, 24, 76,0.12),transparent)" }}
          aria-hidden
        />

        <div className="mx-auto max-w-[960px]">
          <header className="mx-auto mb-8 max-w-[640px] text-center sm:mb-11">
            {/*
              variant="meta" is the blue #0064e0 treatment, not the pink "//"
              section slug. Label comes from metaCopy so the credential string
              is stated in ONE place and cannot drift from the rest of the site.
            */}
            <TechBadge
              label={metaCopy.heroBadge!}
              variant="meta"
              format="label"
              className="mb-4"
            />
            <h2
              id="trust-heading"
              className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0a0a0a] sm:text-[34px] lg:text-[40px]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Connected the official way
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed text-[#625551] sm:text-[17px]">
              No password sharing, no unofficial workarounds, and no browser
              extension driving your account in the background.
            </p>
          </header>

          <div
            className={`overflow-hidden rounded-[20px] border bg-white ${BORDER}`}
            style={{ boxShadow: "0 1px 2px rgba(22,10,8,.04), 0 10px 30px -18px rgba(22,10,8,.14)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <article className="flex flex-col p-6 sm:p-8">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl border bg-[#f7f7f9] ${BORDER}`}
                  aria-hidden
                >
                  {/* Official asset, unmodified and untinted. See the brand note above. */}
                  <img
                    src="/logo/instagram/instagram-glyph-gradient-60.png"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </div>
                <h3
                  className="mt-5 text-lg font-semibold leading-[1.25] tracking-[-0.01em] text-[#0a0a0a] sm:text-xl"
                  style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                >
                  Official Instagram API
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#625551]">
                  You authorise Liffio on Instagram&apos;s own consent screen.
                  Liffio never asks for, sees or stores your password.
                </p>
                <div className={`mt-6 flex items-center gap-2 border-t pt-4 text-sm font-medium text-[#3a302e] ${BORDER}`}>
                  <CheckIcon className="h-3.5 w-3.5 flex-none text-[#f5184c]" />
                  Revoke access anytime
                </div>
              </article>

              <article className={`flex flex-col border-t p-6 sm:p-8 md:border-l md:border-t-0 ${BORDER}`}>
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl border bg-[#f7f7f9] ${BORDER}`}
                  aria-hidden
                >
                  <svg
                    className="h-5 w-5 text-[#f5184c]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3
                  className="mt-5 text-lg font-semibold leading-[1.25] tracking-[-0.01em] text-[#0a0a0a] sm:text-xl"
                  style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                >
                  Verified Meta Tech Provider
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#625551]">
                  Meta has approved Liffio&apos;s business verification and access
                  verification. Both are required before a platform can handle
                  other businesses&apos; data.
                </p>
                <div className={`mt-6 flex items-center gap-2 border-t pt-4 text-sm font-medium text-[#3a302e] ${BORDER}`}>
                  <CheckIcon className="h-3.5 w-3.5 flex-none text-[#f5184c]" />
                  Business verified
                </div>
              </article>
            </div>

            <dl className={`m-0 grid grid-cols-1 border-t bg-[#fbf8f5] sm:grid-cols-3 ${BORDER}`}>
              {STATS.map((s, i) => (
                <div
                  key={s.value}
                  className={`flex items-baseline justify-between gap-4 px-6 py-3.5 sm:block sm:px-6 sm:py-5 lg:px-8 ${
                    i > 0 ? `border-t sm:border-l sm:border-t-0 ${BORDER}` : ""
                  }`}
                >
                  <dt
                    className="text-base font-semibold leading-[1.3] tracking-[-0.01em] text-[#0a0a0a] sm:text-[18px]"
                    style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                  >
                    {s.value}
                  </dt>
                  <dd className="m-0 text-right text-[13.5px] leading-normal text-[#625551] sm:mt-0.5 sm:text-left">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </MetaVerifiedOnly>
  );
}
