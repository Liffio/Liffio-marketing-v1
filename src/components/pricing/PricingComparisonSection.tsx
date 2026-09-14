"use client";

import {
  comparisonHighlightPlan,
  comparisonPlanNames,
  comparisonPlanWorkspaces,
  featureCategories,
  getPlanColumnValue,
} from "@/config/pricing.config";
import { SwipeHint } from "@/components/pricing/PricingPlanCard";

/**
 * One continuous table with group bands, replacing three separate tables.
 *
 * The point of a comparison is the BOUNDARY — where Starter stops and Growth
 * starts. Three tables each with their own header made you re-orient at every
 * section and lost the tier names as soon as you scrolled. A single table with
 * a sticky header and inline group bands keeps the columns anchored while you
 * scan down, which is the only way the boundary is visible.
 */

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span
        className="text-[12px] font-medium text-[#17131A]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {value}
      </span>
    );
  }
  return value ? (
    <span className="block text-center text-[15px] font-bold text-[#F5184C]" aria-label="Included">
      ✓
    </span>
  ) : (
    <span className="block text-center text-[15px] text-[#D3CCD8]" aria-label="Not included">
      —
    </span>
  );
}

export default function PricingComparisonSection() {
  return (
    <div>
      <SwipeHint label="Swipe to compare all plans" />

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 rounded-r-2xl bg-gradient-to-l from-white via-white/90 to-transparent lg:hidden"
          aria-hidden
        />

        <div className="overflow-x-auto rounded-2xl border border-[#EAE4DC] bg-white scrollbar-hide">
          <table className="w-full min-w-[840px] border-collapse text-left lg:min-w-0">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-30 min-w-[270px] bg-white px-5 py-4 text-left text-[13.5px] font-bold tracking-[-0.01em] text-[#17131A]"
                  style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                >
                  Capability
                </th>
                {comparisonPlanNames.map((plan) => (
                  <th
                    key={plan}
                    scope="col"
                    className={`sticky top-0 z-20 min-w-[5.5rem] bg-white px-3 py-4 text-center text-[13.5px] font-bold tracking-[-0.01em] sm:px-4 ${
                      plan === comparisonHighlightPlan ? "text-[#F5184C]" : "text-[#17131A]"
                    }`}
                    style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    {plan}
                    <span
                      className="mt-0.5 block text-[10px] font-medium tracking-normal text-[#8B8391]"
                      style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                    >
                      {comparisonPlanWorkspaces[plan]}
                    </span>
                  </th>
                ))}
              </tr>
              <tr aria-hidden>
                <th colSpan={comparisonPlanNames.length + 1} className="h-px bg-[#EAE4DC] p-0" />
              </tr>
            </thead>

            <tbody>
              {featureCategories.map((category) => (
                <CategoryRows key={category.name} category={category} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-[#8B8391] lg:hidden">
        {comparisonPlanNames.join(" · ")} - scroll horizontally to compare
      </p>
    </div>
  );
}

function CategoryRows({
  category,
}: {
  category: (typeof featureCategories)[number];
}) {
  return (
    <>
      {/* The group band. Its subtitle is why the section exists, one line. */}
      <tr>
        <th
          scope="colgroup"
          colSpan={comparisonPlanNames.length + 1}
          className="border-y border-[#EAE4DC] bg-[#F7F3ED] px-5 py-2.5 text-left"
        >
          <span
            className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#6F6776]"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            {category.name}
            {"beta" in category && category.beta ? (
              <span className="ml-1.5 inline-flex items-center rounded-[4px] border border-[#F5184C]/35 bg-[#F5184C]/[0.07] px-[5px] py-[1px] align-middle text-[9px] tracking-[0.08em] text-[#F5184C]">
                Beta
              </span>
            ) : null}
          </span>
          {category.description ? (
            <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal text-[#8B8391]">
              {category.description}
            </span>
          ) : null}
        </th>
      </tr>

      {(category.features as ReadonlyArray<{ name: string }>).map((row) => (
        <tr key={row.name} className="group border-b border-[#F1ECE5] last:border-b-0">
          <th
            scope="row"
            className="sticky left-0 z-10 bg-white px-5 py-3 text-left text-[13px] font-medium text-[#17131A] shadow-[4px_0_8px_-4px_rgba(0,0,0,0.06)] group-hover:bg-[#FDFBF8]"
          >
            {row.name}
          </th>
          {comparisonPlanNames.map((plan) => (
            <td
              key={plan}
              className={`min-w-[5.5rem] px-3 py-3 text-center align-middle text-[13px] text-[#4A4350] sm:px-4 group-hover:bg-[#FDFBF8] ${
                plan === comparisonHighlightPlan ? "bg-[rgba(245,24,76,0.04)]" : ""
              }`}
            >
              <CellValue value={getPlanColumnValue(row as never, plan)} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
