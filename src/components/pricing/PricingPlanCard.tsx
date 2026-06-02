import type { ReactNode } from "react";
import { PlanPriceBlock } from "@/components/pricing/PlanPriceBlock";
import type { PricingPlan } from "@/config/pricing.config";

function CheckIcon({ highlight }: { highlight?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill={highlight ? "rgba(255,255,255,0.2)" : "rgba(124,90,243,0.1)"} />
      <path
        d="M4.5 8.5l2 2 4.5-5"
        stroke={highlight ? "white" : "#7c5af3"}
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
      className={`relative flex h-full flex-col rounded-2xl p-5 sm:rounded-3xl sm:p-7 ${compact ? "md:p-7" : "md:p-8"} ${className}`}
      style={
        plan.highlight
          ? {
              background: "linear-gradient(155deg,#7c5af3,#5648ea,#4259f0)",
              boxShadow: "0 28px 64px rgba(66,89,240,0.38), 0 0 0 1px rgba(124,90,243,0.4)",
            }
          : {
              background: "white",
              border: "1px solid rgba(124,90,243,0.12)",
              boxShadow: "0 2px 20px rgba(124,90,243,0.06)",
            }
      }
    >
      {plan.badge ? (
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-bold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
        >
          {plan.badge}
        </span>
      ) : null}

      <div className="mb-6">
        <h3 className={`mb-0.5 text-lg font-bold ${plan.highlight ? "text-white" : "text-[#0a0a0a]"}`}>
          {plan.name}
        </h3>
        <p className={`mb-6 min-h-[2.5rem] text-sm ${plan.highlight ? "text-white/65" : "text-gray-400"}`}>
          {plan.description}
        </p>
        <PlanPriceBlock plan={plan} annual={annual} highlight={plan.highlight} compact={compact} />
      </div>

      <ul className="mb-8 flex-1 space-y-2.5">
        {plan.features.map((feat) => (
          <li key={feat.text} className="flex items-start gap-2.5">
            {feat.included ? <CheckIcon highlight={plan.highlight} /> : <XIcon />}
            <span
              className={`text-sm leading-snug ${
                plan.highlight
                  ? feat.included
                    ? "text-white/85"
                    : "text-white/30"
                  : feat.included
                    ? "text-gray-700"
                    : "text-gray-300"
              }`}
            >
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={plan.href}
        id={`pricing-${plan.name.toLowerCase()}`}
        className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={
          plan.highlight
            ? {
                background: "white",
                color: "#4259f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
              }
            : {
                background: "linear-gradient(135deg,#7c5af3,#4259f0)",
                color: "white",
                boxShadow: "0 4px 16px rgba(66,89,240,0.24)",
              }
        }
      >
        {plan.cta}
      </a>
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
