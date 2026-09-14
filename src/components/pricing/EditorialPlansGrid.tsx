"use client";

import { useState } from "react";
import AppLink from "@/components/AppLink";
import EditorialPlanCard from "@/components/pricing/EditorialPlanCard";
import { CountryFlag } from "@/components/pricing/CountryFlag";
import { useSharedBillingInterval } from "@/components/pricing/BillingInterval";
import { pricingPerks, type PricingPlan } from "@/config/pricing.config";
import { getPricingLocationLabel, type PricingRegion } from "@/lib/pricing-region";

/**
 * The V4 plan row: the billing control, five flat cards, the billing note.
 *
 * The design's launch/standard price control is deliberately absent. It
 * advertised a post-window price ($15 / ₹799) that no checkout implements, and
 * it was dropped on instruction: one price per tier, whatever the catalogue
 * charges today, so a repricing is a catalogue change and nothing else.
 *
 * The design's currency control is absent for a different reason: region is detected
 * server-side by `getPricingContext()` and only that region's prices are
 * fetched, so a client-side USD/INR switch would have to render the other
 * currency from the static sheet - the one path that can drift without the
 * price check seeing it.
 *
 * Mobile keeps the snap-scroller rather than the design's single column. Five
 * tiers stacked vertically is a very long scroll before the reader reaches the
 * argument the rest of the page makes.
 */

function Segment({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-[#EAE4DC] bg-[#F2EDE6] p-[3px]"
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`whitespace-nowrap rounded-full px-[13px] py-1.5 text-[12.5px] font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5184C] ${
            value === option.value
              ? "bg-white text-[#17131A] shadow-[0_1px_3px_rgba(23,19,26,0.1)]"
              : "text-[#8B8391] hover:text-[#4A4350]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function EditorialPlansGrid({
  plans,
  region,
  countryCode = null,
  showFooter = true,
}: {
  plans: PricingPlan[];
  region: PricingRegion;
  countryCode?: string | null;
  /** The perks row and Creators link. Off on the homepage, which has its own CTA. */
  showFooter?: boolean;
}) {
  /*
    Both hooks run unconditionally. On /pricing a BillingIntervalProvider is
    present and the toggle is shared with the break-even calculator; on the
    homepage there is none, and this falls back to its own state.

    🚩 The fallback used to be `?? (() => {})` — a no-op setter, which left the
    homepage with a Monthly/Yearly control that could not be switched.
  */
  const shared = useSharedBillingInterval();
  const [localAnnual, setLocalAnnual] = useState(false);
  const annual = shared ? shared.annual : localAnnual;
  const setAnnual = shared ? shared.setAnnual : setLocalAnnual;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#EAE4DC] bg-white px-3 py-1 text-[12px] font-medium text-[#4A4350]">
          <CountryFlag countryCode={countryCode} size={16} />
          <span className="truncate">{getPricingLocationLabel(region, countryCode)}</span>
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Segment
          label="Billing period"
          value={annual ? "y" : "m"}
          onChange={(value) => setAnnual(value === "y")}
          options={[
            { label: "Monthly", value: "m" },
            { label: "Yearly", value: "y" },
          ]}
        />
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-[#F5184C]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          Save 17%
        </span>
      </div>

      {/*
        Mobile: snap scroller, NO edge fade.

        🚩 There used to be a gradient overlay pinned to the right of this
        wrapper. It washed the next card out to near-paper for the last ~56px,
        which reads as a pale vertical band down the side of the screen - the
        reported UI bug. It also could not be made to line up: the wrapper sits
        inside the page's `px-4` container while the scroller below breaks out
        with `-mx-4`, so the overlay stopped 16px short of where the cards
        actually stop and left a hard unfaded strip at the very edge.

        The cards now simply clip at the viewport edge, which is what a snap
        carousel should do. The "Swipe to compare plans" hint below already
        says the row scrolls, so the fade was carrying no information.
      */}
      <div className="sm:hidden">
        <p className="mb-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#8B8391]">
          <span>Swipe to compare plans</span>
          <svg
            className="h-3.5 w-3.5 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </p>
        <div
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-2 pt-3 touch-pan-x [scroll-padding-inline:1rem]"
          role="region"
          aria-label="Pricing plans"
        >
          {plans.map((plan) => (
            <div key={plan.name} className="w-[min(calc(100vw-3rem),300px)] shrink-0 snap-center">
              <EditorialPlanCard plan={plan} annual={annual} />
            </div>
          ))}
        </div>
      </div>

      {/* From sm up: the V4 grid, five abreast on wide screens. */}
      <div className="hidden grid-cols-2 items-stretch gap-[11px] pt-3 sm:grid lg:grid-cols-3 xl:grid-cols-5">
        {plans.map((plan) => (
          <EditorialPlanCard key={plan.name} plan={plan} annual={annual} />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-[18px] gap-y-2 pt-5 text-[12.5px] text-[#8B8391]">
        <span>
          {region === "india"
            ? "India prices are exclusive of GST, billed via Razorpay."
            : "Global prices are billed via Razorpay."}
        </span>
        <span>
          Annual billing is a flat 17% saving on every tier — roughly two months free.
        </span>
      </div>

      {showFooter ? (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#F1ECE5] pt-5 text-[12px] text-[#8B8391]">
            {pricingPerks.map((perk) => (
              <span key={perk.label}>{perk.label}</span>
            ))}
          </div>

          <p className="mt-4 text-[12.5px] text-[#8B8391]">
            Content creator with 5K+ followers?{" "}
            <AppLink href="/creators-program" className="font-semibold text-[#F5184C] hover:underline">
              Apply to the Creators Program &rarr;
            </AppLink>
          </p>
        </>
      ) : null}
    </>
  );
}
