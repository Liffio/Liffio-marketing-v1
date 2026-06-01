"use client";

import { useState } from "react";
import AppLink from "@/components/AppLink";
import { pricingPlans, pricingPerks } from "@/config/pricing.config";
import { siteConfig } from "@/config/site.config";

function CheckIcon({ highlight }: { highlight?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none">
      <circle cx="8" cy="8" r="8" fill={highlight ? "rgba(255,255,255,0.2)" : "rgba(124,90,243,0.1)"} />
      <path d="M4.5 8.5l2 2 4.5-5" stroke={highlight ? "white" : "#7c5af3"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(0,0,0,0.04)" />
      <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="#d4d4d8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type PricingPlansGridProps = {
  compact?: boolean;
};

export default function PricingPlansGrid({ compact = false }: PricingPlansGridProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-semibold transition-colors ${!annual ? "text-[#0a0a0a]" : "text-gray-400"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
          style={{ background: annual ? "linear-gradient(135deg,#7c5af3,#4259f0)" : "#e4e4e7" }}
          aria-label="Toggle billing period"
        >
          <span
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
            style={{ left: annual ? "28px" : "4px" }}
          />
        </button>
        <span className={`text-sm font-semibold transition-colors ${annual ? "text-[#0a0a0a]" : "text-gray-400"}`}>
          Annual{" "}
          <span className="ml-1 text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </span>
      </div>

      {/* Cards */}
      <div className={`grid grid-cols-1 gap-6 mx-auto md:grid-cols-2 xl:grid-cols-4 max-w-7xl ${compact ? "" : ""}`}>
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl p-5 transition-all duration-300 sm:rounded-3xl sm:p-7 md:p-8 ${plan.highlight && compact ? "md:scale-[1.02] md:z-[1]" : ""}`}
            style={plan.highlight ? {
              background: "linear-gradient(155deg,#7c5af3,#5648ea,#4259f0)",
              boxShadow: "0 28px 64px rgba(66,89,240,0.38), 0 0 0 1px rgba(124,90,243,0.4)",
            } : {
              background: "white",
              border: "1px solid rgba(124,90,243,0.12)",
              boxShadow: "0 2px 20px rgba(124,90,243,0.06)",
            }}
          >
            {plan.badge && (
              <span
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
              >
                {plan.badge}
              </span>
            )}

            <div className="mb-6">
              <h3 className={`text-lg font-bold mb-0.5 ${plan.highlight ? "text-white" : "text-[#0a0a0a]"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 min-h-[2.5rem] ${plan.highlight ? "text-white/65" : "text-gray-400"}`}>
                {plan.description}
              </p>
              <div className="flex items-end gap-1">
                <span
                  className={`font-extrabold tracking-tight leading-none ${plan.highlight ? "text-white" : "text-[#0a0a0a]"}`}
                  style={{
                    fontSize: plan.monthly === "Custom" ? "2rem" : "3rem",
                    fontFamily: "var(--font-outfit,sans-serif)",
                  }}
                >
                  {annual ? plan.annual : plan.monthly}
                </span>
                {plan.monthly !== "Custom" && (
                  <span className={`text-sm pb-1.5 ${plan.highlight ? "text-white/60" : "text-gray-400"}`}>
                    /mo
                    {annual && plan.monthly !== "$0" && (
                      <span className={`block text-[10px] font-bold ${plan.highlight ? "text-white/50" : "text-gray-300"}`}>
                        billed annually
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            <ul className="space-y-2.5 flex-1 mb-8">
              {plan.features.map((feat) => (
                <li key={feat.text} className="flex items-start gap-2.5">
                  {feat.included ? <CheckIcon highlight={plan.highlight} /> : <XIcon />}
                  <span
                    className={`text-sm leading-snug ${
                      plan.highlight
                        ? feat.included ? "text-white/85" : "text-white/30"
                        : feat.included ? "text-gray-700" : "text-gray-300"
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
              style={plan.highlight ? {
                background: "white",
                color: "#4259f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
              } : {
                background: "linear-gradient(135deg,#7c5af3,#4259f0)",
                color: "white",
                boxShadow: "0 4px 16px rgba(66,89,240,0.24)",
              }}
            >
              {plan.cta}
            </a>
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
        <p className="text-center mt-5 text-sm text-gray-400">
          Content creator with 5K+ followers?{" "}
          <AppLink href="/creators-program" className="text-[#7c5af3] font-medium hover:underline">
            Apply to the Creators Program →
          </AppLink>
        </p>
      )}

      {compact && (
        <p className="text-center mt-5 text-sm text-gray-400">
          Need volume pricing?{" "}
          <AppLink href="/help" className="text-[#7c5af3] font-medium hover:underline">
            Talk to us →
          </AppLink>
        </p>
      )}
    </>
  );
}

export function PricingBottomCta() {
  return (
    <div className="flex justify-center gap-4 flex-wrap">
      <a
        href={siteConfig.urls.appSignup}
        id="pricing-bottom-cta"
        className="rounded-xl px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
      >
        Get Started Free
      </a>
      <a
        href="mailto:support@liffio.com"
        className="rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Contact Sales
      </a>
    </div>
  );
}
