"use client";

import { useState } from "react";

const PLANS = [
  { name: "Starter", price: 9 },
  { name: "Business", price: 79 },
  { name: "Agency", price: 299 },
] as const;

type PlanName = (typeof PLANS)[number]["name"];

function formatUsd(amount: number) {
  return `$${amount.toFixed(2).replace(/\.00$/, "")}`;
}

export default function AffiliateCalculator() {
  const [referrals, setReferrals] = useState(5);
  const [plan, setPlan] = useState<PlanName>("Business");

  const selectedPlan = PLANS.find((p) => p.name === plan)!;
  const price = selectedPlan.price;

  const month1 = referrals * price * 0.25;
  const month2 = referrals * price * 0.1;
  const month3 = referrals * price * 0.1;
  const total = month1 + month2 + month3;

  return (
    <section className="section-py bg-white px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-brand-100 p-6 sm:p-8 shadow-sm">
          <h2
            className="text-xl font-extrabold text-[#0a0a0a] mb-1"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Earnings calculator
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Estimate your monthly commission based on referrals and average plan.
          </p>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referrals per month: <span className="text-[#f5184c]">{referrals}</span>
              </label>
              <input
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
              <p className="text-sm font-semibold text-gray-700 mb-2">Average plan</p>
              <div className="flex flex-wrap gap-2">
                {PLANS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setPlan(p.name)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      plan === p.name
                        ? "border-[#f5184c] bg-[#f5184c] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#f5184c]/50"
                    }`}
                  >
                    {p.name} (${p.price}/mo)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Month 1 (25%)", value: month1, highlight: true },
              { label: "Month 2 (10%)", value: month2 },
              { label: "Month 3 (10%)", value: month3 },
              { label: "3-month total", value: total, highlight: true },
            ].map((row) => (
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
                  {formatUsd(row.value)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-[11px] text-gray-500">
            Based on {referrals} referral{referrals !== 1 ? "s" : ""} × {selectedPlan.name} ${price}/mo.
            Commission rates: 25% month 1, 10% months 2 & 3. Per workspace, within 90-day window.
          </p>
        </div>
      </div>
    </section>
  );
}
