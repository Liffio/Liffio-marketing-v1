import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  comparisonPlanNames,
  featureCategories,
  getPlanColumnValue,
  parseDisplayAmount,
  planWorkspacesIncluded,
  comparisonPlanWorkspaces,
  getPricingFaqs,
  getPricingPlans,
  isZeroPrice,
  type PricingPlan,
} from "@/config/pricing.config";
import { V4_PLAN_CONTENT } from "@/config/pricing-v4.config";

const REGIONS = ["global", "india"] as const;

/**
 * The catalogue sheet. These are the prices the backend actually charges:
 * `plan_catalog` / `packages`, both currencies, and this repo's static
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
// hides the Free card, silently, and only for the one tier whose whole job is
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

test("a truthy check on the price AMOUNT would hide Free, so nothing may use one", () => {
  for (const region of REGIONS) {
    const free = planNamed(getPricingPlans(region), "Free");

    // The hazard is real: the numeric amount behind "$0" is falsy. Wiring
    // /billing/packages would hand us `monthlyPriceUsdCents: 0` directly.
    const amount = Number(free.monthly.replace(/[^0-9.]/g, ""));
    assert.equal(amount, 0);
    assert.equal(Boolean(amount), false, "0 is falsy, this is the trap");

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
          `"${row.name}" has no value for ${plan}, a tier column was added without filling this row`,
        );
      }
    }
  }
});

/*
  D17 retired the "₹49 first month" offer because the page advertised a price
  no checkout could charge. It is back, deliberately, so the blanket assertion
  that NOTHING carries an intro price is gone, but the shape is still pinned,
  because the failure mode never was "an intro price exists", it was "an intro
  price the buyer cannot actually get".
*/
test("only India's Starter advertises an intro price, and it is a real discount", () => {
  for (const region of REGIONS) {
    for (const plan of getPricingPlans(region)) {
      const isIntroTier = region === "india" && plan.name === "Starter";

      if (!isIntroTier) {
        assert.equal(
          plan.introPrice ?? null,
          null,
          `${region}/${plan.name} advertises an intro price, only India's Starter may`,
        );
        continue;
      }

      assert.ok(plan.introPrice, "India Starter should carry the intro price");
      assert.ok(
        plan.introPriceLabel,
        "an intro price with no label renders a bare number with no unit beside it",
      );

      // An "offer" at or above the ongoing price is not an offer. This catches
      // the repricing that moves `monthly` and forgets this line.
      const intro = parseDisplayAmount(plan.introPrice!);
      const ongoing = parseDisplayAmount(plan.monthly);
      assert.ok(intro !== null && ongoing !== null, "both prices must parse");
      assert.ok(
        intro! < ongoing!,
        `intro ${plan.introPrice} is not below the ongoing ${plan.monthly}`,
      );
    }
  }
});

// ── The authored annual total ────────────────────────────────────────────────
//
// `annual` is derived, a twelfth of the real price, shown for comparability.
// `annualTotal` is the price itself. The distinction is the whole point of the
// change: the API served a figure nobody authored ($7 = monthly * 0.8, floored)
// and the page presented it as if someone had.

const EXPECTED_ANNUAL_TOTAL = {
  global: { Free: null, Starter: "$90", Growth: "$290", Business: "$590", Agency: "$5,490" },
  india: { Free: null, Starter: "₹4,999", Growth: "₹14,999", Business: "₹24,999", Agency: "₹2,29,999" },
} as const;

test("every tier carries the authored annual total, and Free carries none", () => {
  for (const region of REGIONS) {
    const expected = EXPECTED_ANNUAL_TOTAL[region];
    for (const [name, total] of Object.entries(expected)) {
      const plan = planNamed(getPricingPlans(region), name);
      assert.equal(plan.annualTotal, total, `${name} (${region}) annual total`);
    }
  }
});

test("the per-month annual figure is the total's twelfth, rounded UP, never down", () => {
  for (const region of REGIONS) {
    for (const plan of getPricingPlans(region)) {
      if (!plan.annualTotal) continue;
      const total = Number(plan.annualTotal.replace(/[^0-9.]/g, ""));
      const perMonth = Number(plan.annual.replace(/[^0-9.]/g, ""));

      // Never under-quote: twelve advertised months must cover the real bill.
      assert.ok(perMonth * 12 >= total, `${plan.name} (${region}) under-quotes: ${plan.annual} x12 < ${plan.annualTotal}`);

      // And it is genuinely the ceiling, not some other rounding.
      const step = region === "india" ? 1 : 0.01;
      const expected = Math.ceil((total / 12) / step) * step;
      assert.ok(
        Math.abs(perMonth - expected) < 1e-9,
        `${plan.name} (${region}): expected ${expected}, got ${perMonth}`,
      );
    }
  }
});

test("Business INR rounds up to 2084, because 2083 would under-quote by Rs 36 a year", () => {
  const business = planNamed(getPricingPlans("india"), "Business");
  assert.equal(business.annualTotal, "₹24,999");
  assert.equal(business.annual, "₹2,084");
  assert.equal(Math.round(24999 / 12), 2083, "nearest-rounding is the trap");
  assert.ok(2083 * 12 < 24999, "and it under-quotes");
});

test("USD annual always shows two decimals, so $7.50 never renders as $7.5", () => {
  for (const plan of getPricingPlans("global")) {
    if (!plan.annualTotal) continue;
    assert.match(plan.annual, /^\$\d+\.\d{2}$/, `${plan.name}: ${plan.annual}`);
  }
});

// ── The comparison matrix ────────────────────────────────────────────────────
//
// ⚠️ WEAK BY CONSTRUCTION, and shipped anyway.
//
// These rows are static in pricing.config.ts. `/marketing/plans` serves no
// matrix data and `/billing/packages` serves no limits and no capabilities, so
// the drift check cannot see them, the same shape as the $299 that sat wrong
// for weeks. Six cells were wrong here, one of them contradicting the Business
// CARD on the same page after PR #5 corrected it.
//
// The expectations below were transcribed by the same hand that wrote the rows,
// so this cannot prove them right. What it does is turn silent drift into a
// visible expectation: changing a cell now requires changing this table too,
// with the query below to check against.
//
// Verified 2026-08-24 against production:
//
//   SELECT p.key, l.key, l.value FROM package_limits l
//     JOIN packages p ON p.id = l.package_id
//    WHERE p.deleted_at IS NULL AND p.is_active;
//
//   SELECT pm.name, cm.name, string_agg(p.key, ',' ORDER BY p.sort_order)
//     FROM package_features pf
//     JOIN packages p ON p.id = pf.package_id
//     JOIN parent_modules pm ON pm.id = pf.parent_module_id
//     JOIN child_modules cm ON cm.id = pf.child_module_id
//    WHERE p.deleted_at IS NULL AND p.is_active GROUP BY 1, 2;
//
// Replace this with a real comparison the day M3 exposes those two tables
// publicly (docs/decisions/0003).

const MATRIX_EXPECTATIONS: Array<{
  row: string;
  cells: Partial<Record<Lowercase<(typeof comparisonPlanNames)[number]>, boolean | string>>;
  source: string;
}> = [
  {
    row: "Team seats",
    cells: { free: "1", starter: "3", growth: "5", business: "15", agency: "15" },
    source: "package_limits.teamMembers = 1/3/5/15/15",
  },
  {
    row: "DM follow-up sequences",
    cells: { free: false, starter: "2", growth: "5", business: "5", agency: "5" },
    source: "package_limits.dmFollowUps = 0/2/5/5/5",
  },
  {
    row: "Automations",
    cells: { free: "3", starter: "25", growth: "75", business: "150", agency: "150" },
    source: "package_limits.workflows = 3/25/75/150/150",
  },
  {
    row: "Workspaces per subscription",
    cells: { free: "1", starter: "1", growth: "1", business: "1", agency: "20" },
    source: "package_limits.workspacesIncluded = 1/1/1/1/20",
  },
  {
    row: "Scheduled posts per day",
    cells: { free: "3", starter: "30", growth: "100", business: "200", agency: "200" },
    source: "package_limits.schedulerPostsPerDay = 3/30/100/200/200",
  },
  {
    row: "ABAC policies",
    cells: { free: false, starter: false, growth: false, business: true, agency: true },
    source: "Team > Assign roles + Custom permissions = business,agency",
  },
  {
    row: "Per-automation attribution",
    cells: { free: false, starter: false, growth: false, business: true, agency: true },
    source: "Analytics > Automation attribution = business,agency",
  },
  {
    row: "Analytics export",
    cells: { free: false, starter: false, growth: false, business: true, agency: true },
    source: "Analytics > Export analytics = business,agency",
  },
  {
    row: "Post metrics: reach, views, saves, shares, ER",
    cells: { free: false, starter: false, growth: true, business: true, agency: true },
    source: "Analytics > Post metrics = growth,business,agency",
  },
  {
    row: "Affiliate programme: 50% recurring",
    cells: { free: true, starter: true, growth: true, business: true, agency: true },
    source: "all ten Affiliate children = free,starter,growth,business,agency",
  },
];

const matrixRow = (name: string) => {
  const rows = featureCategories.flatMap(
    (c) => c.features as ReadonlyArray<{ name: string }>,
  );
  const row = rows.find((f) => f.name === name);
  assert.ok(row, `expected a matrix row named "${name}"`);
  return row as Record<string, boolean | string>;
};

test("matrix cells match what production actually grants", () => {
  for (const { row, cells, source } of MATRIX_EXPECTATIONS) {
    const actual = matrixRow(row);
    for (const [plan, expected] of Object.entries(cells)) {
      assert.equal(actual[plan], expected, `${row} / ${plan}, ${source}`);
    }
  }
});

/**
 * Cells the catalogue CONTRADICTS, pinned so they cannot move quietly.
 *
 * 🔴 The old test here asserted no cell may say "Unlimited", the PR #5
 * false-claim class. Shipping the V4 design verbatim was an explicit decision
 * that reintroduces that class, so deleting the guard outright would leave the
 * page's most load-bearing false claims with no test at all.
 *
 * This is the inverse guard: it asserts the divergences are EXACTLY these and
 * no others. Adding a new unverified claim fails the count check below; fixing
 * one at source fails its row. Either way somebody has to come back here and
 * read docs/decisions/0004 before the page changes.
 */
const KNOWN_DIVERGENT_CELLS: Array<{ row: string; plans: string[]; why: string }> = [
  { row: "Automated DM sending", plans: ["free", "starter", "growth", "business", "agency"], why: "no DM metering exists (blocker 25.3)" },
  { row: "DMs per month", plans: ["free", "starter", "growth", "business", "agency"], why: "same: no DM key in package_limits" },
  { row: "API key create / view / revoke", plans: ["business", "agency"], why: "D4: maxApiCredentials 0" },
  { row: "API docs access, usage stats, key expiry", plans: ["business", "agency"], why: "D4: no API module" },
  { row: "API keys", plans: ["business", "agency"], why: "D4: maxApiCredentials 0" },
  { row: "API requests per day", plans: ["business", "agency"], why: "D4: apiRequestsPerDay 0" },
  { row: "Monthly tokens per workspace", plans: ["free", "starter", "growth", "business", "agency"], why: "never verified against ai_token_plan_configs" },
  { row: "AI token rollover", plans: ["business", "agency"], why: "same" },
  { row: "Lead storage", plans: ["free", "starter", "growth", "business", "agency"], why: "no lead-storage key in package_limits" },
];

test("the matrix's unverified claims are exactly the recorded ones", () => {
  const recorded = new Set(KNOWN_DIVERGENT_CELLS.map((c) => c.row));

  // Every recorded row still exists and still carries the claim.
  for (const { row, plans, why } of KNOWN_DIVERGENT_CELLS) {
    const actual = matrixRow(row);
    for (const plan of plans) {
      assert.notEqual(actual[plan], false, `"${row}" / ${plan} no longer claims anything, ${why}`);
    }
  }

  // And no NEW "Unlimited" has appeared outside them.
  for (const category of featureCategories) {
    for (const row of category.features) {
      if (recorded.has(row.name)) continue;
      for (const plan of comparisonPlanNames) {
        const value = getPlanColumnValue(row as never, plan);
        assert.notEqual(
          typeof value === "string" && /unlimited/i.test(value),
          true,
          `${row.name} / ${plan} says "${String(value)}" and is not in KNOWN_DIVERGENT_CELLS`,
        );
      }
    }
  }
});

test("the matrix does not contradict the cards on seats or limits", () => {
  // PR #5 corrected the card to 15 while this row still said 5, on one page.
  // The pricing page now draws its limits from the V4 sheet, so both must agree.
  assert.equal(matrixRow("Team seats").business, "15");

  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    const column = plan.toLowerCase();
    const seats = content.limits.find((l) => l.label === "Seats")?.value;
    const automations = content.limits.find((l) => l.label === "Automations")?.value;

    // Agency states its limits as "15 × 20", per workspace, times the slots.
    const expectedSeats = matrixRow("Team seats")[column];
    const expectedAutomations = matrixRow("Automations")[column];

    if (seats && !seats.includes("×")) {
      assert.equal(seats, expectedSeats, `${plan} card seats disagree with the matrix`);
    }
    if (automations && !automations.includes("×")) {
      assert.equal(automations, expectedAutomations, `${plan} card automations disagree with the matrix`);
    }
  }
});

// ── The Agency break-even calculator ─────────────────────────────────────────
//
// The crossover is DERIVED (agencyPrice / businessMonthly), so these assert the
// arithmetic the component performs rather than a number it stores. If either
// price moves, the expected crossover here moves with it, which is the point.

const breakEven = (region: (typeof REGIONS)[number]) => {
  const plans = getPricingPlans(region);
  const business = parseDisplayAmount(planNamed(plans, "Business").monthly)!;
  const agency = parseDisplayAmount(planNamed(plans, "Agency").monthly)!;
  return { business, agency, parity: agency / business, first: Math.floor(agency / business) + 1 };
};

test("Agency wins from 10 accounts in both currencies, and 9 is line ball", () => {
  for (const region of REGIONS) {
    const { business, agency, parity, first } = breakEven(region);

    assert.equal(first, 10, `${region}: expected crossover at 10, parity ${parity}`);
    // At 9 Business is still cheaper, the design's "line ball at 9" was wrong
    // in direction, and the copy says so plainly instead.
    assert.ok(business * 9 < agency, `${region}: 9 accounts should still favour Business`);
    assert.ok(business * 10 > agency, `${region}: 10 accounts should favour Agency`);
  }
});

test("a full Agency workspace costs less than one Growth subscription", () => {
  // The single line that silently breaks if either price moves.
  for (const region of REGIONS) {
    const plans = getPricingPlans(region);
    const agency = parseDisplayAmount(planNamed(plans, "Agency").monthly)!;
    const growth = parseDisplayAmount(planNamed(plans, "Growth").monthly)!;
    const perWorkspace = agency / planWorkspacesIncluded.Agency;
    assert.ok(
      perWorkspace < growth,
      `${region}: ${perWorkspace} per workspace is not below Growth at ${growth}`,
    );
  }
});

test("the calculator hardcodes no tier price and no crossover", () => {
  const source = readFileSync(
    new URL("../src/components/pricing/AgencyBreakEven.tsx", import.meta.url),
    "utf8",
  );
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
  // 🚩 `\b` inside a template literal is U+0008, not a word boundary, this
  // loop asserted that the source contained no backspace-delimited digits,
  // which is true of every file ever written. Escaped, it tests what it says.
  for (const literal of ["59", "549", "2499", "22999", "29", "1499", "9.3", "9.2"]) {
    assert.equal(
      new RegExp(`\\b${literal.replace(".", "\\.")}\\b`).test(code),
      false,
      `AgencyBreakEven contains the literal ${literal} outside a comment`,
    );
  }

  // Absence of price literals is not enough: `firstWinningCount = 10` contains
  // no forbidden number and would pass the loop above while being exactly the
  // hardcode this test exists to prevent. Assert the derivation is present.
  assert.match(code, /parity\s*=\s*agencyPrice\s*\/\s*businessUnit/, "parity must be derived from the two prices");
  assert.match(code, /firstWinningCount\s*=\s*Math\.floor\(parity\)\s*\+\s*1/, "crossover must be derived from parity");
  assert.match(code, /perWorkspace\s*=\s*agencyPrice\s*\/\s*MAX_ACCOUNTS/, "per-workspace must be derived");
});

test("workspace display strings derive from the numbers", () => {
  assert.equal(comparisonPlanWorkspaces.Agency, "20 workspaces");
  assert.equal(comparisonPlanWorkspaces.Free, "1 workspace");
  assert.equal(planWorkspacesIncluded.Agency, 20);
});

test("the ladder hardcodes no price and no step ratio", () => {
  const source = readFileSync(
    new URL("../src/components/pricing/PricingLadder.tsx", import.meta.url),
    "utf8",
  );
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");

  // "5.4" is the V4 design's own headline figure, computed against a $15
  // standard Starter that never shipped. Starter is $9, which makes the first
  // step 3.2x, so the design's sentence is false on the page it was drawn for.
  // That is precisely why none of these may appear as a literal.
  for (const literal of ["5.4", "3.2", "2.0", "6.6", "9", "29", "59", "549", "1499", "2499", "22999"]) {
    assert.equal(
      new RegExp(`\\b${literal.replace(".", "\\.")}\\b`).test(code),
      false,
      `PricingLadder contains the literal ${literal} outside a comment`,
    );
  }

  // Absence of literals is not enough: assert the derivations are present.
  assert.match(code, /a \/ b/, "step ratios must be computed from the two amounts");
  assert.match(
    code,
    /ratio\(business, starter\)/,
    "the without-Growth span must be derived, not written",
  );
  assert.match(
    code,
    /planWorkspacesIncluded\.Agency/,
    "the Agency workspace count must come from the catalogue sheet",
  );
});
