"use client";

import AppLink from "@/components/AppLink";
import EditorialPlansGrid from "@/components/pricing/EditorialPlansGrid";
import { TechBadge } from "@/components/TechBadge";
import type { PricingPlan } from "@/config/pricing.config";
import type { PricingRegion } from "@/lib/pricing-region";

/**
 * The homepage pricing block.
 *
 * Renders the SAME `EditorialPlansGrid` as /pricing, on the same paper ground.
 * It used to draw its own card - a gradient-filled variant showing only the
 * first four bullets - which meant the two pages described the same tier with
 * different type, different limits and a different amount of it. One component
 * now, so they cannot drift.
 */

type PricingSectionProps = {
  plans: PricingPlan[];
  region: PricingRegion;
  countryCode?: string | null;
};

export default function PricingSection({ plans, region, countryCode = null }: PricingSectionProps) {
  return (
    <section id="pricing" className="section-py relative overflow-hidden bg-[#FBF9F5]">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(245, 24, 76,0.12),transparent)" }}
      />

      <div className="mx-auto max-w-[1300px] px-4 sm:px-6">
        <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-4 text-center lg:mb-12">
          <div>
            <div className="mb-3 flex justify-center lg:mb-4">
              <TechBadge label="Pricing" variant="section" accent="#F5184C" />
            </div>
            <h2
              className="text-2xl font-extrabold leading-tight text-[#17131A] sm:text-3xl lg:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Honest pricing.{" "}
              <span className="gradient-text">No surprises.</span>
            </h2>
            <p className="mt-2 text-sm text-[#4A4350] sm:text-base lg:mt-3 lg:text-lg">
              Start free - upgrade when you&apos;re ready.
            </p>
          </div>
        </div>

        <EditorialPlansGrid
          plans={plans}
          region={region}
          countryCode={countryCode}
          showFooter={false}
        />

        <div className="mt-8 text-center">
          <AppLink
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#17131A] bg-white px-6 py-2.5 text-[13.5px] font-semibold text-[#17131A] transition-colors hover:bg-[#17131A] hover:text-white"
          >
            Compare every capability
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </AppLink>
        </div>
      </div>
    </section>
  );
}
