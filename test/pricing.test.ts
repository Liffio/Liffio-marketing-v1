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
// ⚠️ WEAK BY CONSTRUCTION. These rows are static in pricing-v4.config.ts:
// `/marketing/plans` serves no matrix data, so the drift check cannot see them.
// The expectations below are the owner's live plan table (docs/decisions/0006),
// transcribed by the same hand that wrote the rows, so this cannot prove them
// right. What it does is turn silent drift into a visible expectation: changing
// a cell now requires changing this table too.

const MATRIX_EXPECTATIONS: Array<{
  row: string;
  cells: Record<Lowercase<(typeof comparisonPlanNames)[number]>, boolean | string>;
}> = [
  { row: "Automated DMs", cells: { free: "Unlimited", starter: "Unlimited", growth: "Unlimited", business: "Unlimited", agency: "Unlimited" } },
  { row: "Automation workflows", cells: { free: "3", starter: "25", growth: "100", business: "250", agency: "250" } },
  { row: "DM follow-ups per automation", cells: { free: "0", starter: "2", growth: "5", business: "10", agency: "10" } },
  { row: "Team members", cells: { free: "1", starter: "3", growth: "5", business: "15", agency: "15" } },
  { row: "Workspaces", cells: { free: "1", starter: "1", growth: "1", business: "1", agency: "20" } },
  { row: "AI tokens per month", cells: { free: "1,000", starter: "10,000", growth: "30,000", business: "75,000", agency: "75,000" } },
  { row: "API requests per day", cells: { free: "0", starter: "200", growth: "500", business: "1,000", agency: "1,000" } },
  { row: "API keys", cells: { free: "0", starter: "5", growth: "10", business: "15", agency: "15" } },
  // Chatbot ladder
  { row: "Build and publish a chatbot", cells: { free: true, starter: true, growth: true, business: true, agency: true } },
  { row: "Chat analytics", cells: { free: true, starter: true, growth: true, business: true, agency: true } },
  { row: "Questions", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "Follow gate before the bot replies", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "Turn off Liffio chatbot branding", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "Ice breakers", cells: { free: false, starter: false, growth: true, business: true, agency: true } },
  { row: "Start a chatbot from a comment", cells: { free: false, starter: false, growth: true, business: true, agency: true } },
  { row: "Lead capture into the leads list", cells: { free: false, starter: false, growth: false, business: true, agency: true } },
  { row: "Webhook step", cells: { free: false, starter: false, growth: false, business: true, agency: true } },
  { row: "Notify step", cells: { free: false, starter: false, growth: false, business: true, agency: true } },
  // Chatbot limits
  { row: "Live chatbots", cells: { free: "2", starter: "5", growth: "15", business: "Unlimited", agency: "Unlimited" } },
  { row: "Steps per bot", cells: { free: "15", starter: "40", growth: "100", business: "Unlimited", agency: "Unlimited" } },
  { row: "Keywords per bot", cells: { free: "5", starter: "15", growth: "40", business: "Unlimited", agency: "Unlimited" } },
  { row: "Condition rules", cells: { free: "0", starter: "5", growth: "15", business: "Unlimited", agency: "Unlimited" } },
  { row: "Follow-ups per step", cells: { free: "0", starter: "1", growth: "2", business: "3", agency: "3" } },
  { row: "Chatbot conversations a month", cells: { free: "500", starter: "Unlimited", growth: "Unlimited", business: "Unlimited", agency: "Unlimited" } },
  { row: "Buttons per step, Instagram's own cap", cells: { free: "13", starter: "13", growth: "13", business: "13", agency: "13" } },
];

const matrixRow = (name: string) => {
  const rows = featureCategories.flatMap(
    (c) => c.features as ReadonlyArray<{ name: string }>,
  );
  const row = rows.find((f) => f.name === name);
  assert.ok(row, `expected a matrix row named "${name}"`);
  return row as Record<string, boolean | string>;
};

test("matrix cells match the live plan table", () => {
  for (const { row, cells } of MATRIX_EXPECTATIONS) {
    const actual = matrixRow(row);
    for (const [plan, expected] of Object.entries(cells)) {
      assert.equal(actual[plan], expected, `${row} / ${plan}`);
    }
  }
});

test("chatbots are a group of their own, not mixed into automations", () => {
  const chatbots = featureCategories.find((c) => c.name === "Chatbots");
  assert.ok(chatbots, "expected a Chatbots group in the matrix");
  const automation = featureCategories.find((c) => c.name === "Comment to DM automation");
  assert.ok(automation, "expected the automation group");
  for (const row of automation.features) {
    assert.equal(/chatbot|\bbot\b/i.test(row.name), false, `"${row.name}" is a chatbot row inside automations`);
  }
  for (const name of ["Live chatbots", "Webhook step", "Ice breakers", "Questions"]) {
    assert.ok(chatbots.features.some((r) => r.name === name), `"${name}" missing from the Chatbots group`);
  }
});

test("API limits sit in their own group, labelled as API", () => {
  const api = featureCategories.find((c) => c.name === "API limits");
  assert.ok(api, "expected an API limits group");
  for (const category of featureCategories) {
    if (category === api) continue;
    for (const row of category.features) {
      assert.equal(/\bAPI\b/.test(row.name), false, `API row "${row.name}" outside the API group`);
    }
  }
});

/**
 * "Unlimited" is allowed only where the live table says it. DMs are unlimited
 * everywhere; the chatbot limits lift to unlimited on Business and Agency, and
 * conversations on every paid tier. Anything else saying "Unlimited" is a new
 * claim nobody checked.
 */
const UNLIMITED_ROWS = new Set([
  "Automated DMs",
  "Live chatbots",
  "Steps per bot",
  "Keywords per bot",
  "Condition rules",
  "Chatbot conversations a month",
]);

test("no Unlimited cell outside the rows the live table makes unlimited", () => {
  for (const category of featureCategories) {
    for (const row of category.features) {
      if (UNLIMITED_ROWS.has(row.name)) continue;
      for (const plan of comparisonPlanNames) {
        const value = getPlanColumnValue(row as never, plan);
        assert.notEqual(
          typeof value === "string" && /unlimited/i.test(value),
          true,
          `${row.name} / ${plan} says "${String(value)}"`,
        );
      }
    }
  }
});

test("buttons per step is the same on every plan, never a tier difference", () => {
  const row = matrixRow("Buttons per step, Instagram's own cap");
  const values = comparisonPlanNames.map((p) => row[p.toLowerCase()]);
  assert.equal(new Set(values).size, 1);
  for (const content of Object.values(V4_PLAN_CONTENT)) {
    assert.equal(
      [...content.features, ...content.limits.map((l) => l.label)].some((t) => /button/i.test(t) && /13/.test(t)),
      false,
      "buttons per step must not be sold on a card",
    );
  }
});

// ── The plan cards ───────────────────────────────────────────────────────────

test("every card carries at least six bullets of its own", () => {
  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    assert.ok(content.features.length >= 6, `${plan} has ${content.features.length} bullets`);
  }
});

test("DMs are unlimited on every card, with no cap anywhere", () => {
  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    assert.equal(content.limits.find((l) => l.label === "DMs")?.value, "Unlimited", `${plan} DMs`);
  }
  const everything = JSON.stringify({ V4_PLAN_CONTENT, featureCategories });
  assert.equal(/\d[\d,]*\s*(DMs?|messages)\s*(\/|a|per)\s*month/i.test(everything), false, "a DM cap appears");
});

test("every card's limits panel carries the four chatbot limits", () => {
  const expected: Record<string, Record<string, string>> = {
    Free: { "Live chatbots": "2", "Steps per bot": "15", "Keywords per bot": "5", "Follow-ups per step": "0" },
    Starter: { "Live chatbots": "5", "Steps per bot": "40", "Keywords per bot": "15", "Follow-ups per step": "1" },
    Growth: { "Live chatbots": "15", "Steps per bot": "100", "Keywords per bot": "40", "Follow-ups per step": "2" },
    Business: { "Live chatbots": "Unlimited", "Steps per bot": "Unlimited", "Keywords per bot": "Unlimited", "Follow-ups per step": "3" },
    Agency: { "Live chatbots": "Unlimited", "Steps per bot": "Unlimited", "Keywords per bot": "Unlimited", "Follow-ups per step": "3" },
  };
  for (const [plan, limits] of Object.entries(expected)) {
    const content = V4_PLAN_CONTENT[plan];
    assert.ok(content, `no card content for ${plan}`);
    for (const [label, value] of Object.entries(limits)) {
      assert.equal(content.limits.find((l) => l.label === label)?.value, value, `${plan} ${label}`);
    }
    // API figures live in their own group, never in the main limits panel.
    assert.equal(content.limits.some((l) => /API/.test(l.label)), false, `${plan} mixes API into limits`);
    assert.ok(content.apiLimits.length > 0 && /API/.test(content.apiLimitsLabel), `${plan} API group`);
  }
});

test("the cards and the matrix agree on every shared limit", () => {
  const shared: Array<[string, string]> = [
    ["Automations", "Automation workflows"],
    ["DM follow-ups", "DM follow-ups per automation"],
    ["Team members", "Team members"],
    ["AI tokens / month", "AI tokens per month"],
    ["Live chatbots", "Live chatbots"],
    ["Steps per bot", "Steps per bot"],
    ["Keywords per bot", "Keywords per bot"],
    ["Follow-ups per step", "Follow-ups per step"],
  ];
  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    const column = plan.toLowerCase();
    for (const [cardLabel, rowName] of shared) {
      const card = content.limits.find((l) => l.label === cardLabel)?.value;
      assert.equal(card, matrixRow(rowName)[column], `${plan}: card "${cardLabel}" vs matrix "${rowName}"`);
    }
  }
});

test("wording rules: no seats, no white label, no Creator tier, no dashes", () => {
  const text = JSON.stringify({ V4_PLAN_CONTENT, featureCategories, faqs: [getPricingFaqs("global"), getPricingFaqs("india")] });
  assert.equal(/\bseats?\b/i.test(text), false, "say team members, never seats");
  assert.equal(/white[\s-]?label/i.test(text), false, "no white label claim");
  assert.equal(Object.keys(V4_PLAN_CONTENT).includes("Creator"), false, "Creator is not a purchasable plan");
  assert.equal((comparisonPlanNames as readonly string[]).includes("Creator"), false);
  const dashes = [0x2013, 0x2014].map((code) => String.fromCharCode(code));
  assert.equal(dashes.some((dash) => text.includes(dash)), false, "no em or en dashes");
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
