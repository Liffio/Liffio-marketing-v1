"use client";

import { useEffect, useRef, useState } from "react";
import { FEATURE_CATEGORIES, FEATURES, PLATFORM_EXTRAS } from "@/config/features.config";
import { FeatureIcon } from "@/components/features/FeatureIcons";
import { FEATURE_PHONE_MAP } from "@/components/features/feature-phones";
import { SimulationMobileStage } from "@/components/simulation/SimulationMobileStage";
import { SimulationShell } from "@/components/simulation/SimulationShell";
import { TechBadge } from "@/components/TechBadge";
import { siteConfig } from "@/config/site.config";

const HIGHLIGHTS = [
  { value: "8", label: "Automation types" },
  { value: "10–60s", label: "Custom DM delay" },
  { value: "24/7", label: "Autopilot mode" },
  { value: "1", label: "Dashboard for all" },
];

function Check({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill={`${color}18`} />
      <path d="M4.5 8.5l2 2 4.5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureDemo({ featureId, title }: { featureId: (typeof FEATURES)[number]["id"]; title: string }) {
  const Phone = FEATURE_PHONE_MAP[featureId];
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnimKey((k) => k + 1), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <SimulationMobileStage className="mx-auto w-full max-w-[320px]">
      <SimulationShell label={`${title} · Live`}>
        <Phone animKey={animKey} />
      </SimulationShell>
    </SimulationMobileStage>
  );
}

export default function FeaturesPageContent() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.15, 0.35, 0.55] },
    );

    FEATURES.forEach((f) => {
      const el = sectionRefs.current[f.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section
        className="relative overflow-hidden px-4 py-16 sm:py-24"
        style={{ background: "linear-gradient(155deg,#f8f5ff 0%,#f0ebff 45%,#faf5ff 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(rgba(124,90,243,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <TechBadge label="Features" variant="section" className="mb-5" />
          <h1
            className="font-extrabold leading-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-outfit,sans-serif)", fontSize: "clamp(2.25rem,5vw,3.75rem)" }}
          >
            8 Powerful Automations.{" "}
            <span className="gradient-text">One Dashboard.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            From comment-to-DM to welcome messages — every Instagram touchpoint automated with human-like delays,
            full analytics, and Meta-compliant APIs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={siteConfig.urls.appSignup} className="btn-primary inline-flex items-center gap-2">
              Get Started Free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="/pricing"
              className="inline-flex rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50/50"
            >
              View pricing
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-100/80 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, i) => (
            <div
              key={item.label}
              className={`px-6 py-8 text-center ${i < HIGHLIGHTS.length - 1 ? "border-b border-brand-100/80 lg:border-b-0 lg:border-r" : ""}`}
            >
              <p
                className="text-3xl font-extrabold tabular-nums text-[#0a0a0a] sm:text-4xl"
                style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
              >
                {item.value}
              </p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[7.5rem] z-40 hidden border-b border-brand-100/80 bg-white/95 backdrop-blur-md lg:block">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2.5 sm:px-6">
          {FEATURES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => scrollTo(f.id)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                background: activeId === f.id ? f.bg : "transparent",
                color: activeId === f.id ? f.color : "#6b7280",
                border: activeId === f.id ? `1px solid ${f.border}` : "1px solid transparent",
              }}
            >
              {f.gridLabel}
            </button>
          ))}
        </div>
      </div>

      {FEATURE_CATEGORIES.map((category) => (
        <section key={category.id} className="section-py border-b border-brand-50 bg-white last:border-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <TechBadge label={category.label} variant="chip" accent="#7c5af3" />
                <h2
                  className="mt-3 text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
                  style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                >
                  {category.label}
                </h2>
              </div>
            </div>

            <div className="space-y-16 sm:space-y-24">
              {category.featureIds.map((featureId, index) => {
                const feat = FEATURES.find((f) => f.id === featureId)!;
                const reversed = index % 2 === 1;

                return (
                  <article
                    key={feat.id}
                    id={feat.id}
                    ref={(el) => {
                      sectionRefs.current[feat.id] = el;
                    }}
                    className="grid scroll-mt-40 items-center gap-10 lg:grid-cols-2 lg:gap-16"
                  >
                    <div className={reversed ? "lg:order-2" : ""}>
                      <div
                        className="card-base p-6 sm:p-8"
                        style={{
                          border: `1px solid ${feat.border}`,
                          boxShadow: `0 12px 40px ${feat.bg}`,
                        }}
                      >
                        <div className="mb-4 flex items-start gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-white"
                            style={{ background: feat.color }}
                          >
                            <span className="text-[9px] font-black tracking-wider">{feat.num}</span>
                            <FeatureIcon id={feat.id} />
                          </div>
                          <div>
                            <TechBadge label={feat.tag} variant="inline" format="label" accent={feat.color} />
                            <h3
                              className="mt-2 text-xl font-bold text-[#0a0a0a] sm:text-2xl"
                              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                            >
                              {feat.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-brand-700/90">{feat.highlight}</p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{feat.description}</p>

                        <ul className="mt-5 space-y-2.5">
                          {feat.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                              <Check color={feat.color} />
                              {b}
                            </li>
                          ))}
                        </ul>

                        <a
                          href={siteConfig.urls.appSignup}
                          className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{
                            background: `linear-gradient(135deg,${feat.color},#4259f0)`,
                            boxShadow: `0 4px 16px ${feat.color}35`,
                          }}
                        >
                          Try {feat.gridLabel}
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className={reversed ? "lg:order-1" : ""}>
                      <FeatureDemo featureId={feat.id} title={feat.title} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section
        className="section-py px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg,#faf9ff 0%,#ffffff 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <TechBadge label="Platform" variant="chip" accent="#4259f0" className="mb-4" />
            <h2
              className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Plus everything else in one workspace
            </h2>
            <p className="mt-2 text-gray-500">DM automation is the core — the rest helps you measure and scale.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_EXTRAS.map((item) => (
              <div key={item.title} className="card-base p-5 text-center sm:p-6">
                <p className="font-bold text-[#0a0a0a]">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2
            className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Ready to automate every touchpoint?
          </h2>
          <p className="mt-3 text-gray-600">Connect Instagram and go live in minutes. No credit card on Starter.</p>
          <a href={siteConfig.urls.appSignup} className="btn-primary mt-6 inline-flex items-center gap-2">
            Get Started Free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
