import type { ReactNode } from "react";
import { PlanPriceBlock } from "@/components/pricing/PlanPriceBlock";
import type { PricingPlan } from "@/config/pricing.config";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="rgba(245, 24, 76,0.1)" />
      <path
        d="M4.5 8.5l2 2 4.5-5"
        stroke="#f5184c"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="rgba(0,0,0,0.04)" />
      <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="#d4d4d8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type PricingPlanCardProps = {
  plan: PricingPlan;
  annual: boolean;
  compact?: boolean;
  className?: string;
};

export function PricingPlanCard({ plan, annual, compact = false, className = "" }: PricingPlanCardProps) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl bg-white p-6 sm:p-7 ${compact ? "md:p-7" : "md:p-8"} ${className}`}
      style={
        /*
          V4 marks the featured tier with a coral ring and a gradient top edge,
          on the SAME white card as every other tier — not a filled dark card.
          The ladder reads as five comparable steps with one emphasised, rather
          than one object of a different kind. It also removes every
          light-on-dark branch this component used to carry.
        */
        plan.highlight
          ? {
              boxShadow: "0 0 0 2px #F5184C, 0 18px 40px -22px rgba(245,24,76,0.5)",
            }
          : {
              border: "1px solid #EAE4DC",
              boxShadow: "none",
            }
      }
    >
      {plan.highlight ? (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
          style={{ background: "linear-gradient(100deg,#FF7C49 0%,#F5184C 52%,#B20D8F 100%)" }}
        />
      ) : null}
      {plan.badge ? (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.09em] text-white shadow-sm"
          style={{ background: "linear-gradient(100deg,#FF7C49 0%,#F5184C 52%,#B20D8F 100%)", fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {plan.badge}
        </span>
      ) : null}

      <div className="mb-6">
        <h3
          className="mb-1 text-[19px] font-bold tracking-[-0.02em] text-[#17131A]"
          style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
        >
          {plan.name}
        </h3>
        <p className="mb-4 min-h-[3.25rem] text-[12.5px] leading-[1.42] text-[#8B8391]">
          {plan.description}
        </p>
        <PlanPriceBlock plan={plan} annual={annual} compact={compact} />
      </div>

      <ul className="mb-8 flex-1 space-y-2.5">
        {plan.features.map((feat) => (
          <li key={feat.text} className="flex items-start gap-2.5">
            {feat.included ? <CheckIcon /> : <XIcon />}
            <span
              className={`text-[13px] leading-snug ${feat.included ? "text-[#4A4350]" : "text-[#B9B2C0]"}`}
            >
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      {/*
        A provisional tier is NOT a link. `PAID_PLANS` in confirm-email omits
        GROWTH, so `?plan=GROWTH` is dropped after signup and the visitor lands
        in onboarding with no subscription and no explanation. Rendering a real
        CTA here would be worse than showing no card at all, so it renders as
        inert text until D2 part 2 makes the tier buyable.
      */}
      {plan.provisional ? (
        <span
          id={`pricing-${plan.name.toLowerCase()}`}
          aria-disabled="true"
          className="block w-full cursor-default rounded-xl border border-dashed border-[#D9D2CA] py-3.5 text-center text-sm font-semibold text-[#8B8391]"
        >
          {plan.cta}
        </span>
      ) : (
        <a
          href={plan.href}
          id={`pricing-${plan.name.toLowerCase()}`}
          data-cta={plan.name === "Free" ? "pricing_start_free" : "pricing_upgrade"}
          data-signup-cta="true"
          className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={
            plan.highlight
              ? {
                  background: "linear-gradient(100deg,#FF7C49 0%,#F5184C 52%,#B20D8F 100%)",
                  color: "white",
                  boxShadow: "0 8px 20px -10px rgba(245,24,76,0.6)",
                }
              : {
                  background: "rgba(245, 24, 76,0.08)",
                  color: "#e00e40",
                  boxShadow: "none",
                }
          }
        >
          {plan.cta}
        </a>
      )}
    </div>
  );
}

export function SwipeHint({ label = "Swipe to compare plans" }: { label?: string }) {
  return (
    <p className="mb-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400 lg:hidden">
      <span>{label}</span>
      <svg className="h-3.5 w-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </p>
  );
}

export function HorizontalScrollFade({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  return (
    <div className="relative lg:static">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/80 to-transparent lg:hidden"
        aria-hidden
      />
      <div
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-2 touch-pan-x [scroll-padding-inline:1rem] lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0"
        role="region"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}
