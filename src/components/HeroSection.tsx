"use client";

import { siteConfig } from "@/config/site.config";
import HeroInteractiveDemo from "@/components/hero/HeroInteractiveDemo";
import { TechBadge } from "@/components/TechBadge";
// Restore alongside the commented-out hero badge below:
// import { MetaVerifiedOnly } from "@/components/MetaVerifiedOnly";
import { metaCopy } from "@/config/meta-copy";


const VALUE_PROPS = [
  {
    icon: (
      <svg className="h-4 w-4 text-[#f5184c]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    text: "Auto DM in 10-60s",
  },
  {
    icon: (
      <svg className="h-4 w-4 text-[#0064e0]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    text: metaCopy.heroComplianceChip,
  },
  {
    icon: (
      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    text: "Comment-to-DM flows",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0 hero-mesh-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full opacity-70 blur-3xl hero-orb-a"
        style={{ background: "radial-gradient(circle, rgba(245, 24, 76,0.06) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl hero-orb-b"
        style={{ background: "radial-gradient(circle, rgba(20, 20, 30,0.04) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(rgba(20, 20, 30,0.05) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-12 xl:gap-16">
          {/* Copy */}
          <div className="max-w-xl">
            {/*
              COMMENTED OUT, not deleted - restore by uncommenting this block AND
              the MetaVerifiedOnly import at the top of the file.

              This badge and the one heading <OfficialApiSection> were the same
              string, the same blue and the same prompt, 851px apart on one page.
              The section badge was kept because it heads a block that evidences
              the claim (two cards plus the stats rail); this one asserted it and
              moved straight into the H1.

              The hero keeps its trust signal either way: `secure instagram oauth`
              in the chip row below, and "Built on Instagram's official API" under
              the CTAs. If you restore this, remove the section one instead -
              having both is what we were fixing.

            <MetaVerifiedOnly>
              <TechBadge
                className="hero-stagger hero-stagger-1 mb-6"
                label={metaCopy.heroBadge!}
                variant="meta"
                format="label"
              />
            </MetaVerifiedOnly>
            */}

            {/* No entrance animation on the H1: it is the LCP element and the opacity
                gate added ~1s of render delay on mobile. */}
            <h1
              className="font-extrabold leading-[1.05] tracking-tight text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)", fontSize: "clamp(2.75rem,5.5vw,4.75rem)" }}
            >
              The Best{" "}
              <span className="gradient-text">Auto DM Tool</span>{" "}
              <br />
              for Instagram
            </h1>

            <p className="hero-stagger hero-stagger-3 mt-6 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
              <span className="font-semibold text-gray-800">Auto DMs</span> from comments, stories & messages.
              Liffio is the <span className="font-semibold text-gray-800">Instagram auto DM</span> software with{" "}
              <span className="font-semibold text-gray-800">auto comment reply</span>, keyword triggers, and{" "}
              <span className="font-semibold text-gray-800">DM automation</span> - running{" "}
              <span className="font-semibold text-gray-800">24/7</span> on autopilot.
            </p>

            <ul className="hero-stagger hero-stagger-4 mt-6 flex flex-wrap gap-2">
              {VALUE_PROPS.map((item) => (
                <li key={item.text}>
                  <TechBadge label={item.text} variant="chip" icon={item.icon} format="label" />
                </li>
              ))}
            </ul>

            <div className="hero-stagger hero-stagger-5 mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href={siteConfig.urls.appSignup}
                data-cta="hero_start_free"
                data-signup-cta="true"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] sm:w-auto"
                style={{
                  background: "linear-gradient(135deg,#f5184c,#b20d8f)",
                  boxShadow: "0 8px 28px rgba(178, 13, 143,0.4)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Get Started Free
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#ffe4e6] bg-white/80 px-7 py-3.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-[#fecdd3] hover:text-[#f5184c] hover:shadow-md sm:w-auto"
              >
                <svg className="h-4 w-4 text-[#f5184c]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                See How It Works
              </a>
            </div>

            <div className="hero-stagger hero-stagger-6 mt-8 flex items-center gap-4">
              <p className="text-sm text-gray-600">
                <strong className="font-semibold text-gray-900">Free plan included</strong> — no credit card required.
                Built on Instagram&apos;s official API.
              </p>
            </div>
          </div>

          <div className="hero-stagger hero-stagger-4 lg:justify-self-end">
            <HeroInteractiveDemo />
          </div>
        </div>
      </div>

      <div
        className="mx-auto h-px max-w-5xl"
        style={{ background: "linear-gradient(90deg,transparent,rgba(20, 20, 30,0.12),transparent)" }}
      />
    </section>
  );
}
