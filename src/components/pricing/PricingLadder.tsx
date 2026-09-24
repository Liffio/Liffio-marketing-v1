"use client";

import SectionHead from "@/components/pricing/SectionHead";
import { useSharedBillingInterval } from "@/components/pricing/BillingInterval";
import {
  currencySymbolOf,
  formatMoney,
  isZeroPrice,
  parseDisplayAmount,
  planWorkspacesIncluded,
  type PricingPlan,
} from "@/config/pricing.config";
import { INR_TAX_NOTE, USD_TAX_NOTE } from "@/config/tax-copy";

/**
 * The ladder: what each step up actually costs, and what it buys.
 *
 * 🔴 Every ratio is COMPUTED from the prices the cards render. The V4 design
 * hardcoded its headline - "The old jump was 5.4x. This one is roughly double,
 * twice" - against a $15 standard Starter. Starter ships at $9, which makes the
 * first step 3.2x, not "roughly double", and the sentence false on the page it
 * was drawn for. So the ratios are derived and the headline says nothing
 * numeric that the foot line does not compute.
 *
 * One line per tier on what the step buys, checked against the catalogue:
 *   Starter   scheduler, short links, lead capture  - all in the Starter bullets
 *   Growth    post analytics, templates, 5 follow-ups - all in the Growth bullets
 *   Business  seats, permissions, approval, attribution - teamMembers 15, RBAC,
 *             the Approval workflow module, per-automation attribution
 *   Agency    workspace count derived from planWorkspacesIncluded
 *
 * 🚩 No API row. D4 withheld the external API from V4 launch (maxApiCredentials
 * 0, apiRequestsPerDay 0, no API module), so the design's "Seats, permissions,
 * approval, attribution, API" would reinstate the exact claim PR #5 removed.
 */

const STEP_NOTES: Record<string, string> = {
  Free: "One real automation, end to end, on your own account",
  Starter: "Unlimited DMs, scheduler, short links, lead capture",
  Growth: "Post analytics, content templates, five follow-ups",
  Business: "Seats, permissions, an approval step, attribution",
};

function agencyNote(): string {
  return `${planWorkspacesIncluded.Agency} Business workspaces on one bill`;
}

/** The figure this tier is billed on the interval currently selected. */
function billedAmount(plan: PricingPlan, annual: boolean): number | null {
  if (isZeroPrice(plan.monthly)) return 0;
  return parseDisplayAmount(annual ? plan.annualTotal : plan.monthly);
}

export default function PricingLadder({ plans }: { plans: PricingPlan[] }) {
  const shared = useSharedBillingInterval();
  const annual = shared?.annual ?? false;

  const steps = plans
    .map((plan) => ({
      name: plan.name,
      amount: billedAmount(plan, annual),
      display: annual && plan.annualTotal ? plan.annualTotal : plan.monthly,
      note: plan.name === "Agency" ? agencyNote() : STEP_NOTES[plan.name],
      highlight: plan.highlight,
      symbol: currencySymbolOf(plan.monthly),
    }))
    .filter((step): step is typeof step & { amount: number; note: string } =>
      step.amount !== null && Boolean(step.note),
    );

  if (steps.length < 2) return null;

  // Log scale, or Agency flattens every other riser to a stub.
  const max = Math.max(...steps.map((s) => s.amount));
  const riserHeight = (amount: number) =>
    amount === 0 ? 8 : Math.round(18 + 152 * (Math.log10(amount + 1) / Math.log10(max + 1)));

  const amountOf = (name: string) => steps.find((s) => s.name === name)?.amount ?? null;
  const ratio = (a: number | null, b: number | null) =>
    a && b && b > 0 ? `${(a / b).toFixed(1)}x` : null;

  const starter = amountOf("Starter");
  const growth = amountOf("Growth");
  const business = amountOf("Business");
  const firstStep = ratio(growth, starter);
  const secondStep = ratio(business, growth);
  const withoutGrowth = ratio(business, starter);

  const suffix = annual ? "/yr" : "/mo";

  return (
    <>
      <SectionHead
        eyebrow="The ladder"
        title="Two crossable steps, where there used to be one cliff."
      >
        Growth exists because a solo creator who outgrows Starter does not need team seats - they
        need to know how their posts are performing. Each step is now worth crossing on its own
        merits.
      </SectionHead>

      <div className="rounded-2xl border border-[#EAE4DC] bg-white px-5 pb-6 pt-7 sm:px-7 sm:pt-8">
        <div className="grid gap-0 sm:min-h-[230px] sm:grid-cols-5 sm:items-end sm:gap-2.5">
          {steps.map((step, index) => {
            const previous = steps[index - 1];
            const stepRatio = previous ? ratio(step.amount, previous.amount) : null;

            return (
              <div
                key={step.name}
                className="relative flex flex-col justify-end border-b border-[#F1ECE5] py-2.5 last:border-b-0 sm:h-full sm:border-b-0 sm:py-0"
              >
                {stepRatio ? (
                  <span
                    className="absolute -top-3.5 left-0 z-[2] hidden -translate-x-1/2 whitespace-nowrap rounded-[5px] bg-[#17131A] px-[7px] py-[3px] text-[10px] font-bold text-white sm:block"
                    style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                  >
                    {stepRatio}
                  </span>
                ) : null}

                <div
                  className={`hidden rounded-t-[10px] border border-b-0 transition-[height] duration-500 sm:block ${
                    step.highlight ? "border-transparent" : "border-[#EAE4DC] bg-[#F0EAE2]"
                  }`}
                  style={{
                    height: `${riserHeight(step.amount)}px`,
                    ...(step.highlight
                      ? { background: "linear-gradient(100deg,#FF7C49 0%,#F5184C 52%,#B20D8F 100%)" }
                      : {}),
                  }}
                  aria-hidden
                />

                <div
                  className="pb-0.5 pt-2 text-[14.5px] font-bold tracking-[-0.01em] text-[#17131A] sm:border-t-2 sm:border-[#17131A]"
                  style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                >
                  {step.name}
                </div>
                <div
                  className="text-[12.5px] text-[#4A4350]"
                  style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                >
                  {step.amount === 0
                    ? step.display
                    : `${formatMoney(step.amount, step.symbol)}${suffix}`}
                </div>
                <div className="mt-1.5 text-[11px] leading-[1.35] text-[#8B8391] sm:min-h-[30px]">
                  {step.note}
                </div>
              </div>
            );
          })}
        </div>

        {firstStep && secondStep ? (
          <p className="mt-5 border-t border-[#F1ECE5] pt-4 text-[13.5px] leading-relaxed text-[#4A4350]">
            Starter to Growth is <b className="text-[#17131A]">{firstStep}</b>, Growth to Business{" "}
            <b className="text-[#17131A]">{secondStep}</b>.
            {withoutGrowth ? (
              <>
                {" "}
                Without Growth in between, the one step from Starter to Business would be{" "}
                <b className="text-[#17131A]">{withoutGrowth}</b>.
              </>
            ) : null}{" "}
            Business is gated on an event - someone else joining the account - not on a number a
            solo creator drifts past.
          </p>
        ) : null}

        {/* Terms 7.3, keyed off the symbol the rungs are already rendering. */}
        <p
          className="mt-3 text-[11px] text-[#8B8391]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {steps[0].symbol === "₹" ? `Every figure above is ${INR_TAX_NOTE}.` : USD_TAX_NOTE}
        </p>
      </div>
    </>
  );
}
