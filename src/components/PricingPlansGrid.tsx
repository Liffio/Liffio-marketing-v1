"use client";

import { useState } from "react";
import AppLink from "@/components/AppLink";
import {
  HorizontalScrollFade,
  PricingPlanCard,
  SwipeHint,
} from "@/components/pricing/PricingPlanCard";
import { CountryFlag } from "@/components/pricing/CountryFlag";
import { pricingPerks, type PricingPlan } from "@/config/pricing.config";
import { getPricingLocationLabel, type PricingRegion } from "@/lib/pricing-region";
import { siteConfig } from "@/config/site.config";

type PricingPlansGridProps = {
  compact?: boolean;
  plans: PricingPlan[];
  region: PricingRegion;
  countryCode?: string | null;
};

function BillingToggle({ annual, onToggle }: { annual: boolean; onToggle: () => void }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2 sm:mb-10 sm:gap-3">
      <span className={`text-sm font-semibold transition-colors ${!annual ? "text-[#0a0a0a]" : "text-gray-400"}`}>
        Monthly
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="relative h-6 w-12 shrink-0 rounded-full transition-all duration-300 focus:outline-none"
        style={{ background: annual ? "linear-gradient(135deg,#f5184c,#b20d8f)" : "#e4e4e7" }}
        aria-label="Toggle billing period"
      >
        <span
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300"
          style={{ left: annual ? "28px" : "4px" }}
        />
      </button>
      <span className={`text-sm font-semibold transition-colors ${annual ? "text-[#0a0a0a]" : "text-gray-400"}`}>
        Annual{" "}
        <span className="ml-1 whitespace-nowrap rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-600">
          Save 20%
        </span>
      </span>
    </div>
  );
}

export default function PricingPlansGrid({
  compact = false,
  plans,
  region,
  countryCode = null,
}: PricingPlansGridProps) {
  const [annual, setAnnual] = useState(false);
  const locationLabel = getPricingLocationLabel(region, countryCode);

  return (
    <>
      <p className="mb-6 text-center text-sm text-gray-500">
        <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-medium text-gray-600">
          <CountryFlag countryCode={countryCode} size={18} />
          <span className="truncate">{locationLabel}</span>
        </span>
      </p>

      <BillingToggle annual={annual} onToggle={() => setAnnual(!annual)} />

      {/* Mobile: full-detail horizontal slider */}
      <div className="lg:hidden">
        <SwipeHint />
        <HorizontalScrollFade ariaLabel="Pricing plans">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`w-[min(calc(100vw-2rem),320px)] shrink-0 snap-center ${plan.highlight && compact ? "scale-[1.01]" : ""}`}
            >
              <PricingPlanCard plan={plan} annual={annual} compact={compact} />
            </div>
          ))}
        </HorizontalScrollFade>
      </div>

      {/* Desktop: grid */}
      <div className="mx-auto hidden max-w-7xl grid-cols-2 gap-6 lg:grid xl:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={plan.highlight && compact ? "md:scale-[1.02] md:z-[1]" : ""}
          >
            <PricingPlanCard plan={plan} annual={annual} compact={compact} />
          </div>
        ))}
      </div>

      {/* Perks row */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {pricingPerks.map((p) => (
          <div key={p.label} className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      {!compact && (
        <p className="mt-5 text-center text-sm text-gray-400">
          Content creator with 5K+ followers?{" "}
          <AppLink href="/creators-program" className="font-medium text-[#f5184c] hover:underline">
            Apply to the Creators Program →
          </AppLink>
        </p>
      )}

      {compact && (
        <p className="mt-5 text-center text-sm text-gray-400">
          Need volume pricing?{" "}
          <AppLink href="/help" className="font-medium text-[#f5184c] hover:underline">
            Talk to us →
          </AppLink>
        </p>
      )}
    </>
  );
}

export function PricingBottomCta() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <a
        href={siteConfig.urls.appSignup}
        id="pricing-bottom-cta"
        className="rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
      >
        Get Started Free
      </a>
      <a
        href="mailto:support@liffio.com"
        className="rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        Contact Sales
      </a>
    </div>
  );
}
