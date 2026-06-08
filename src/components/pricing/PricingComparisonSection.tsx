"use client";

import {
  comparisonPlanNames,
  featureCategories,
  getPlanColumnValue,
} from "@/config/pricing.config";
import { SwipeHint } from "@/components/pricing/PricingPlanCard";

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-semibold text-gray-700">{value}</span>;
  }
  return value ? (
    <span className="block text-center text-base font-bold text-green-500" aria-label="Included">✓</span>
  ) : (
    <span className="block text-center text-base text-zinc-400" aria-label="Not included">-</span>
  );
}

export default function PricingComparisonSection() {
  return (
    <div className="space-y-12">
      <SwipeHint label="Swipe to compare all plans" />

      {featureCategories.map((category) => (
        <div key={category.name}>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#0a0a0a]">{category.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 rounded-r-2xl bg-gradient-to-l from-white via-white/90 to-transparent lg:hidden"
              aria-hidden
            />
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm scrollbar-hide">
              <table className="w-full min-w-[640px] text-left lg:min-w-0">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="sticky left-0 z-[1] w-[38%] bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-5">
                      Feature
                    </th>
                    {comparisonPlanNames.map((plan) => (
                      <th
                        key={plan}
                        className="min-w-[4.75rem] px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 sm:min-w-[5.5rem] sm:px-4"
                      >
                        {plan}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {category.features.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="sticky left-0 z-[1] bg-inherit px-4 py-3.5 text-sm text-gray-700 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] sm:px-5">
                        {row.name}
                      </td>
                      {comparisonPlanNames.map((plan) => (
                        <td key={plan} className="min-w-[4.75rem] px-3 py-3.5 text-center sm:min-w-[5.5rem] sm:px-4">
                          <CellValue value={getPlanColumnValue(row, plan)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      <p className="text-center text-[11px] text-gray-400 lg:hidden">
        Free · Starter · Business · Agency - scroll horizontally to compare
      </p>
    </div>
  );
}
