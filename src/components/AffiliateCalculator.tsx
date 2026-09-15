"use client";

import { useState } from "react";
import {
  currencySymbolOf,
  formatMoneyPrecise,
  isZeroPrice,
  parseDisplayAmount,
  type PricingPlan,
} from "@/config/pricing.config";
import {
  COMMISSION_RATE,
  NET_REVENUE_BASIS_NOTE,
  PROJECTION_DISCLAIMER,
  REFERRED_USER_FIRST_PAYMENT_DISCOUNT,
} from "@/config/affiliate.config";

/**
 * What one referred workspace is worth, for as long as it stays subscribed.
 *
 * 🔴 The arithmetic is the policy's, not a marketing shape. Section 2.1 pays
 * 50% of Net Revenue on EVERY payment a referred workspace makes, for the life
 * of an unbroken subscription. The previous version of this component paid 25%
 * in month one and 10% in months two and three and then stopped, which appears
 * nowhere in the policy and understated a Business referral's second year by
 * its entire value.
 *
 * 🚩 Prices are passed in, never written down here. They used to be three
 * literals with a note to "bump these by hand when the ladder moves", which had
 * already gone stale: Growth was excluded as "not purchasable" long after it
 * went on sale. They now come from the same catalogue the pricing cards render,
 * so `npm run check:prices` covers this page too.
 *
 * 🚩 Every output is labelled as 50% of the PLAN PRICE and carries the Net
 * Revenue note. Section 2.2 deducts tax, processing fees and discounts before
 * commission is calculated, and Liffio publishes neither the GST rate nor the
 * processor's fee, so an exact figure cannot be computed here. Showing an upper
 * bound and saying so is honest; inventing a fee percentage would not be.
 */
export default function AffiliateCalculator({ plans }: { plans: PricingPlan[] }) {
  // Section 2.6: paid plans only. Free earns nothing because nothing is paid.
  const paidPlans = plans.filter((plan) => !isZeroPrice(plan.monthly));
  const [referrals, setReferrals] = useState(5);
  const [planName, setPlanName] = useState<string | null>(null);

  if (paidPlans.length === 0) return null;

  const selected =
    paidPlans.find((plan) => plan.name === planName) ??
    paidPlans.find((plan) => plan.name === "Business") ??
    paidPlans[0];

  const symbol = currencySymbolOf(selected.monthly);
  const price = parseDisplayAmount(selected.monthly) ?? 0;
  const money = (amount: number) => formatMoneyPrecise(amount, symbol);

  // Section 2.3: the referred user's first payment is 10% off, and commission
  // is calculated on the discounted amount, so month one is smaller than every
  // month after it. That is a policy rule, not a rounding artefact.
  const perReferralOngoing = price * COMMISSION_RATE;
  const perReferralFirst = price * (1 - REFERRED_USER_FIRST_PAYMENT_DISCOUNT) * COMMISSION_RATE;

  const firstPayments = referrals * perReferralFirst;
  const ongoingMonthly = referrals * perReferralOngoing;
  // Their first payment, then eleven at the ongoing rate. Nothing here assumes
  // a second cohort arrives, because nothing in the policy predicts one.
  const firstYear = firstPayments + ongoingMonthly * 11;

  const figures = [
    { label: "Their first payment", value: firstPayments, highlight: false },
    { label: "Every month after", value: ongoingMonthly, highlight: true },
    { label: "Per referral, per month", value: perReferralOngoing, highlight: false },
    { label: "Across 12 months", value: firstYear, highlight: true },
  ];

  return (
    <section className="section-py bg-white px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-brand-100 p-6 sm:p-8 shadow-sm">
          <h2
            className="text-xl font-extrabold text-[#0a0a0a] mb-1"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Recurring commission calculator
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            50% of every payment a referred workspace makes, for as long as its subscription stays
            active. Pick how many workspaces you refer and which plan they buy.
          </p>

          <div className="space-y-5 mb-8">
            <div>
              <label
                htmlFor="affiliate-referrals"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Referred workspaces on an active subscription:{" "}
                <span className="text-[#f5184c]">{referrals}</span>
              </label>
              <input
                id="affiliate-referrals"
                type="range"
                min={1}
                max={50}
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="w-full accent-[#f5184c]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Plan they subscribe to</p>
              <div className="flex flex-wrap gap-2">
                {paidPlans.map((plan) => (
                  <button
                    key={plan.name}
                    type="button"
                    aria-pressed={selected.name === plan.name}
                    onClick={() => setPlanName(plan.name)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      selected.name === plan.name
                        ? "border-[#f5184c] bg-[#f5184c] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#f5184c]/50"
                    }`}
                  >
                    {plan.name} ({plan.monthly}/mo)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {figures.map((row) => (
              <div
                key={row.label}
                className={`rounded-xl p-4 text-center ${
                  row.highlight
                    ? "border border-[#ffe4e6] bg-[#fff7f7]"
                    : "border border-gray-100 bg-gray-50"
                }`}
              >
                <p className="text-xs text-gray-500 mb-1 leading-tight">{row.label}</p>
                <p
                  className="text-xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-outfit,sans-serif)",
                    color: row.highlight ? "#f5184c" : "#374151",
                  }}
                >
                  {money(row.value)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs font-bold text-[#f5184c]">
            {PROJECTION_DISCLAIMER}
          </p>

          <p className="mt-2 text-center text-[11px] leading-relaxed text-gray-500">
            Based on {referrals} referred workspace{referrals !== 1 ? "s" : ""} on{" "}
            {selected.name} at {selected.monthly}/month, each earning{" "}
            {Math.round(COMMISSION_RATE * 100)}% of every payment. Their first payment is{" "}
            {Math.round(REFERRED_USER_FIRST_PAYMENT_DISCOUNT * 100)}% off, so your first month is
            lower than the months after it. {NET_REVENUE_BASIS_NOTE} Commission on a workspace
            stops if its subscription lapses past the grace period.
          </p>
        </div>
      </div>
    </section>
  );
}
