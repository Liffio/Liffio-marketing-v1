"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import HeroInteractiveDemo from "@/components/hero/HeroInteractiveDemo";
import { TechBadge } from "@/components/TechBadge";
import { MetaVerifiedOnly } from "@/components/MetaVerifiedOnly";
import { metaCopy } from "@/config/meta-copy";
import { CREATOR_AVATAR_PHOTOS } from "@/components/hero/hero-demo-data";

const MetaLogo = () => (
  <svg viewBox="0 0 512 512" className="h-4 w-4 shrink-0" aria-hidden>
    <defs>
      <linearGradient id="mlg" x1="0%" x2="100%">
        <stop offset="0%" stopColor="#0064e0" />
        <stop offset="100%" stopColor="#0080f9" />
      </linearGradient>
    </defs>
    <path
      fill="url(#mlg)"
      d="m149.4 89.4c-81.6 0-144.1 106.2-144.1 218.5 0 70.3 34 114.7 91 114.7 41 0 70.5-19.3 123-111l36.9-65.2 31.2-52.8c26.5-40.9 48.4-61.3 74.4-61.3 54 0 97.2 79.5 97.2 177.2 0 37.2-12.2 58.8-37.5 58.8-24.2 0-35.8-16-81.8-90l-42.3 36.9c47.9 80.2 74.6 107.4 123 107.4 55.5 0 86.4-45.1 86.4-116.9 0-117.7-63.9-216.5-141.6-216.5-41.1 0-73.3 31-102.4 70.3l-32.3 47.4c-31.9 49-51.3 79.7-51.3 79.7-42.5 66.7-57.2 81.6-80.9 81.6-24.4 0-38.8-21.4-38.8-59.5 0-81.6 40.7-165 89.2-165z"
    />
  </svg>
);

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
            <MetaVerifiedOnly>
              <TechBadge
                className="hero-stagger hero-stagger-1 mb-6"
                label={metaCopy.heroBadge!}
                variant="meta"
                format="label"
                icon={<MetaLogo />}
              />
            </MetaVerifiedOnly>

            <h1
              className="hero-stagger hero-stagger-2 font-extrabold leading-[1.05] tracking-tight text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)", fontSize: "clamp(2.75rem,5.5vw,4.75rem)" }}
            >
              The Best{" "}
              <span className="gradient-text">Auto DM Tool</span>
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
              <div className="flex -space-x-2.5">
                {CREATOR_AVATAR_PHOTOS.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-black/5"
                    style={{ zIndex: 5 - i }}
                  >
                    <Image src={src} alt="Instagram creator - Liffio beta tester" fill sizes="36px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-0.5 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20" aria-hidden>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong className="font-semibold text-gray-900">2,000+</strong> creators on autopilot
                </p>
              </div>
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
