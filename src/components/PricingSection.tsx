"use client";

import { useState } from "react";
import AppLink from "@/components/AppLink";
import PricingPlansGrid from "@/components/PricingPlansGrid";
import { PlanPriceBlock } from "@/components/pricing/PlanPriceBlock";
import { TechBadge } from "@/components/TechBadge";
import type { PricingPlan } from "@/config/pricing.config";
import type { PricingRegion } from "@/lib/pricing-region";

function CheckIcon({ light }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill={light ? "rgba(255,255,255,0.2)" : "rgba(124,90,243,0.12)"} />
      <path
        d="M4.5 8.5l2 2 4.5-5"
        stroke={light ? "white" : "#7c5af3"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobilePlanCard({ plan, annual }: { plan: PricingPlan; annual: boolean }) {
  const topFeatures = plan.features.filter((f) => f.included).slice(0, 4);
  const light = plan.highlight;

  return (
    <article
      className={`flex h-full min-h-[300px] w-[min(calc(100vw-2rem),300px)] shrink-0 snap-center flex-col rounded-2xl p-4 sm:w-[300px] ${
        light ? "shadow-[0_16px_48px_rgba(66,89,240,0.28)]" : "border border-brand-100/90 bg-white shadow-sm"
      }`}
      style={
        light
          ? { background: "linear-gradient(155deg,#7c5af3,#5648ea,#4259f0)" }
          : undefined
      }
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          {plan.badge ? (
            <span
              className="mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
            >
              {plan.badge}
            </span>
          ) : null}
          <h3 className={`text-lg font-bold ${light ? "text-white" : "text-[#0a0a0a]"}`}>{plan.name}</h3>
        </div>
        <div className="text-right">
          <PlanPriceBlock plan={plan} annual={annual} highlight={light} compact align="right" />
        </div>
      </div>

      <p className={`mb-3 text-xs leading-snug ${light ? "text-white/70" : "text-gray-500"}`}>{plan.description}</p>

      <ul className="mb-4 flex-1 space-y-2">
        {topFeatures.map((feat) => (
          <li key={feat.text} className="flex items-start gap-2">
            <CheckIcon light={light} />
            <span className={`text-xs leading-snug ${light ? "text-white/90" : "text-gray-700"}`}>{feat.text}</span>
          </li>
        ))}
      </ul>

      <a
        href={plan.href}
        className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all active:scale-[0.98]"
        style={
          light
            ? { background: "white", color: "#4259f0" }
            : { background: "linear-gradient(135deg,#7c5af3,#4259f0)", color: "white" }
        }
      >
        {plan.cta}
      </a>
    </article>
  );
}

function PricingMobilePreview({ plans }: { plans: PricingPlan[] }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="mb-4 flex items-center justify-center gap-2.5">
        <span className={`text-xs font-semibold ${!annual ? "text-[#0a0a0a]" : "text-gray-400"}`}>Monthly</span>
        <button
          type="button"
          onClick={() => setAnnual(!annual)}
          className="relative h-6 w-11 rounded-full transition-colors duration-300"
          style={{ background: annual ? "linear-gradient(135deg,#7c5af3,#4259f0)" : "#e4e4e7" }}
          aria-label="Toggle annual billing"
        >
          <span
            className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300"
            style={{ left: annual ? "24px" : "4px" }}
          />
        </button>
        <span className={`text-xs font-semibold ${annual ? "text-[#0a0a0a]" : "text-gray-400"}`}>
          Annual <span className="font-bold text-green-600">-20%</span>
        </span>
      </div>

      <p className="mb-3 text-center text-[11px] text-gray-400">Swipe to compare plans</p>

      <div
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-1 touch-pan-x [scroll-padding-inline:1rem]"
        role="region"
        aria-label="Pricing plans preview"
      >
        {plans.map((plan) => (
          <MobilePlanCard key={plan.name} plan={plan} annual={annual} />
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-brand-100/80 bg-brand-50/40 px-4 py-3 text-center">
        <p className="text-xs leading-relaxed text-gray-600">
          Compare all features, annual billing, and the full plan matrix on the pricing page.
        </p>
        <AppLink
          href="/pricing"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white py-3 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
        >
          View full pricing & features
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </AppLink>
      </div>
    </div>
  );
}

type PricingSectionProps = {
  plans: PricingPlan[];
  region: PricingRegion;
  countryCode?: string | null;
};

export default function PricingSection({ plans, region, countryCode = null }: PricingSectionProps) {
  return (
    <section id="pricing" className="section-py relative overflow-hidden bg-white">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:mb-12 lg:mx-auto lg:max-w-2xl lg:text-center">
          <div>
            <TechBadge label="Pricing" variant="section" className="mb-3 lg:mb-4" />
            <h2
              className="text-2xl font-extrabold leading-tight text-[#0a0a0a] sm:text-3xl lg:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Honest pricing.{" "}
              <span className="gradient-text">No surprises.</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 sm:text-base lg:mt-3 lg:text-lg">
              Start free - upgrade when you&apos;re ready.
            </p>
          </div>
        </div>

        <PricingMobilePreview plans={plans} />

        <div className="hidden lg:block">
          <PricingPlansGrid compact plans={plans} region={region} countryCode={countryCode} />
        </div>
      </div>
    </section>
  );
}
