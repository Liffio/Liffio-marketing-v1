import test from "node:test";
import assert from "node:assert/strict";

import {
  comparisonPlanNames,
  featureCategories,
  getPlanColumnValue,
  getPricingFaqs,
  getPricingPlans,
  isZeroPrice,
  type PricingPlan,
} from "@/config/pricing.config";

const REGIONS = ["global", "india"] as const;

/**
 * The catalogue sheet. These are the prices the backend actually charges —
 * `plan_catalog` / `packages`, both currencies — and this repo's static
 * fallback must agree with them. If a tier's price moves, this table is what
 * fails first.
 */
const EXPECTED_MONTHLY = {
  global: { Free: "$0", Starter: "$9", Growth: "$29", Business: "$59", Agency: "$549" },
  india: { Free: "₹0", Starter: "₹499", Growth: "₹1,499", Business: "₹2,499", Agency: "₹22,999" },
} as const;

/**
 * Annual per-month = the catalogue ANNUAL TOTAL / 12, rounded up.
 * NOT monthly * 10 / 12: USD yearly is exactly monthly * 10, but every INR
 * yearly is charm-priced Rs 9 above it (Rs 499/mo bills at Rs 4,999/yr), so
 * deriving under-quotes INR. `npm run check:prices` enforces this live.
 */
const EXPECTED_ANNUAL = {
  global: { Free: "$0", Starter: "$7.50", Growth: "$24.17", Business: "$49.17", Agency: "$457.50" },
  india: { Free: "₹0", Starter: "₹417", Growth: "₹1,250", Business: "₹2,084", Agency: "₹19,167" },
} as const;

const planNamed = (plans: PricingPlan[], name: string): PricingPlan => {
  const plan = plans.find((p) => p.name === name);
  assert.ok(plan, `expected a "${name}" plan in the sheet`);
  return plan;
};

// ── The $0 falsiness guard ───────────────────────────────────────────────────
//
// This is the regression this file exists for. Free's headline price is "$0" /
// "₹0". Any code that decides "is there a price to show?" with a truthy check
// hides the Free card — silently, and only for the one tier whose whole job is
// to be visible.

test("Free renders a zero price in every region", () => {
  for (const region of REGIONS) {
    const free = planNamed(getPricingPlans(region), "Free");

    assert.equal(free.monthly, EXPECTED_MONTHLY[region].Free);
    assert.equal(free.annual, EXPECTED_ANNUAL[region].Free);
    assert.ok(free.monthly.length > 0, "Free must have something to render");
    assert.equal(isZeroPrice(free.monthly), true);
  }
});

test("a truthy check on the price AMOUNT would hide Free — so nothing may use one", () => {
  for (const region of REGIONS) {
    const free = planNamed(getPricingPlans(region), "Free");

    // The hazard is real: the numeric amount behind "$0" is falsy. Wiring
    // /billing/packages would hand us `monthlyPriceUsdCents: 0` directly.
    const amount = Number(free.monthly.replace(/[^0-9.]/g, ""));
    assert.equal(amount, 0);
    assert.equal(Boolean(amount), false, "0 is falsy — this is the trap");

    // The formatted string is NOT falsy, which is why the render path keys off
    // the string and compares against the zero value explicitly.
    assert.equal(Boolean(free.monthly), true);
    assert.equal(isZeroPrice("$0"), true);
    assert.equal(isZeroPrice("₹0"), true);
    assert.equal(isZeroPrice("$9"), false);
    assert.equal(isZeroPrice("₹499"), false);
  }
});

test("every plan in every region survives a render-path filter", () => {
  for (const region of REGIONS) {
    const plans = getPricingPlans(region);
    const renderable = plans.filter((p) => typeof p.monthly === "string" && p.monthly.length > 0);
    assert.equal(renderable.length, plans.length, "no plan may be dropped before render");
  }
});

// ── Catalogue parity ─────────────────────────────────────────────────────────

test("static prices match the catalogue sheet, in both currencies", () => {
  for (const region of REGIONS) {
    const plans = getPricingPlans(region);
    for (const [name, monthly] of Object.entries(EXPECTED_MONTHLY[region])) {
      assert.equal(planNamed(plans, name).monthly, monthly, `${region} ${name} monthly`);
    }
    for (const [name, annual] of Object.entries(EXPECTED_ANNUAL[region])) {
      assert.equal(planNamed(plans, name).annual, annual, `${region} ${name} annual`);
    }
  }
});

test("annual is ten months charged, never a 20% discount", () => {
  for (const region of REGIONS) {
    for (const plan of getPricingPlans(region)) {
      if (isZeroPrice(plan.monthly)) continue;
      const monthly = Number(plan.monthly.replace(/[^0-9.]/g, ""));
      const annual = Number(plan.annual.replace(/[^0-9.]/g, ""));

      // Never under-quote: 12 advertised months must cover the real yearly bill.
      assert.ok(annual * 12 >= monthly * 10, `${plan.name} annual under-quotes the yearly charge`);
      // And it must be the 10-month model, not 0.8x.
      assert.notEqual(annual, Math.round(monthly * 0.8), `${plan.name} still uses the 20% multiplier`);
    }
  }
});

test("no surviving 20%-off claim in the pricing FAQs", () => {
  for (const region of REGIONS) {
    const text = getPricingFaqs(region)
      .map((f) => `${f.q} ${f.a}`)
      .join(" ");
    assert.equal(/saves? 20%|20% off|-20%/i.test(text), false, `20% claim survives in ${region} FAQs`);
  }
});

// ── Tier set ─────────────────────────────────────────────────────────────────

test("Growth is present and Pro is gone", () => {
  for (const region of REGIONS) {
    const names = getPricingPlans(region).map((p) => p.name);
    assert.ok(names.includes("Growth"), `Growth missing from ${region}`);
    assert.equal(names.includes("Pro"), false, `retired Pro present in ${region}`);
  }
  assert.ok(comparisonPlanNames.includes("Growth"));
  assert.equal(comparisonPlanNames.includes("Pro" as never), false);
});

test("the comparison matrix has a column for every tier, and no holes", () => {
  for (const region of REGIONS) {
    assert.deepEqual(
      getPricingPlans(region).map((p) => p.name),
      [...comparisonPlanNames],
      `${region} card order must match the comparison columns`,
    );
  }

  for (const category of featureCategories) {
    for (const row of category.features) {
      for (const plan of comparisonPlanNames) {
        const value = getPlanColumnValue(row, plan);
        assert.notEqual(
          value,
          undefined,
          `"${row.name}" has no value for ${plan} — a tier column was added without filling this row`,
        );
      }
    }
  }
});

test("no retired intro price is advertised", () => {
  for (const region of REGIONS) {
    for (const plan of getPricingPlans(region)) {
      assert.equal(plan.introPrice ?? null, null, `${plan.name} still advertises an intro price`);
    }
  }
});
