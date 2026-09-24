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
import { loadPolicy } from "@/lib/legal/load-policy";

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
// These rows are static in pricing-v4.config.ts. `/marketing/plans` serves no
// matrix data and `/billing/packages` serves no limits and no capabilities, so
// the drift check cannot see them.
//
// The expectations below are the plan table the owner confirmed live on
// production on 2026-09-25 (docs/decisions/0005). They were transcribed by the
// same hand that wrote the rows, so this cannot prove them right. What it does
// is turn silent drift into a visible expectation: changing a cell now requires
// changing this table too.
//
// Replace this with a real comparison the day M3 exposes package limits
// publicly (docs/decisions/0003).

type Column = Lowercase<(typeof comparisonPlanNames)[number]>;

const MATRIX_EXPECTATIONS: Array<{ row: string; cells: Record<Column, boolean | string> }> = [
  { row: "Automated DMs", cells: { free: "Unlimited", starter: "Unlimited", growth: "Unlimited", business: "Unlimited", agency: "Unlimited" } },
  { row: "Automation workflows", cells: { free: "3", starter: "25", growth: "100", business: "250", agency: "250" } },
  { row: "DM follow-ups", cells: { free: "0", starter: "2", growth: "5", business: "10", agency: "10" } },
  { row: "Team members", cells: { free: "1", starter: "3", growth: "5", business: "15", agency: "15" } },
  { row: "Workspaces", cells: { free: "1", starter: "1", growth: "1", business: "1", agency: "20" } },
  { row: "AI tokens per month", cells: { free: "1,000", starter: "10,000", growth: "30,000", business: "75,000", agency: "75,000" } },
  { row: "AI token rollover", cells: { free: false, starter: false, growth: false, business: "Up to 25,000", agency: "Up to 25,000" } },
  { row: "API access", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "API requests per day", cells: { free: "0", starter: "200", growth: "500", business: "1,000", agency: "1,000" } },
  { row: "API keys", cells: { free: "0", starter: "5", growth: "10", business: "15", agency: "15" } },
  { row: "Automations per day via API", cells: { free: "0", starter: "50", growth: "150", business: "400", agency: "400" } },
  { row: "Scheduled posts per day via API", cells: { free: "0", starter: "50", growth: "150", business: "400", agency: "400" } },
  { row: "Feed posts, reels, stories, carousels", cells: { free: true, starter: true, growth: true, business: true, agency: true } },
  { row: "Team invites and roles", cells: { free: true, starter: true, growth: true, business: true, agency: true } },
  { row: "Reply variants", cells: { free: true, starter: true, growth: true, business: true, agency: true } },
  { row: "Trigger blocks: the multi-keyword builder", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "Turn off Liffio branding", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "Lead export", cells: { free: false, starter: true, growth: true, business: true, agency: true } },
  { row: "Bulk upload", cells: { free: false, starter: false, growth: true, business: true, agency: true } },
  { row: "Post metrics", cells: { free: false, starter: false, growth: true, business: true, agency: true } },
  { row: "AI insights", cells: { free: false, starter: false, growth: true, business: true, agency: true } },
  { row: "Custom permissions", cells: { free: false, starter: false, growth: false, business: true, agency: true } },
  { row: "Automation attribution", cells: { free: false, starter: false, growth: false, business: true, agency: true } },
  { row: "Analytics export", cells: { free: false, starter: false, growth: false, business: true, agency: true } },
  { row: "Agency branding and hide Liffio branding", cells: { free: false, starter: false, growth: false, business: false, agency: true } },
];

const allMatrixRows = () =>
  featureCategories.flatMap((c) => c.features as ReadonlyArray<Record<string, boolean | string>>);

const matrixRow = (name: string) => {
  const row = allMatrixRows().find((f) => f.name === name);
  assert.ok(row, `expected a matrix row named "${name}"`);
  return row;
};

test("matrix cells match the live plan table", () => {
  for (const { row, cells } of MATRIX_EXPECTATIONS) {
    const actual = matrixRow(row);
    for (const [plan, expected] of Object.entries(cells)) {
      assert.equal(actual[plan], expected, `${row} / ${plan}`);
    }
  }
});

test("DMs are unlimited on every plan, on the cards and in the matrix", () => {
  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    const dms = content.limits.find((l) => l.label === "DMs")?.value;
    assert.equal(dms, "Unlimited", `${plan} card shows DMs as "${dms}"`);
  }
  // The only "Unlimited" cell in the matrix is the DM row. Anything else saying
  // it is a new claim, and needs a line in the plan table before it ships.
  for (const row of allMatrixRows()) {
    if (row.name === "Automated DMs") continue;
    for (const plan of comparisonPlanNames) {
      const value = getPlanColumnValue(row as never, plan);
      assert.notEqual(
        typeof value === "string" && /unlimited/i.test(value),
        true,
        `${String(row.name)} / ${plan} says "${String(value)}"`,
      );
    }
  }
});

test("no DM cap is stated anywhere in the pricing FAQs", () => {
  for (const region of REGIONS) {
    const text = getPricingFaqs(region).map((f) => `${f.q} ${f.a}`).join(" ");
    assert.equal(/\b500\b|DMs? (a|per) month|paid plans? includes? unlimited/i.test(text), false, region);
  }
});

test("the cards agree with the matrix on every shared limit", () => {
  const pairs: Array<[card: string, row: string]> = [
    ["Workflows", "Automation workflows"],
    ["DM follow-ups", "DM follow-ups"],
    ["Team members", "Team members"],
    ["AI tokens / month", "AI tokens per month"],
  ];
  const apiPairs: Array<[card: string, row: string]> = [
    ["Requests / day", "API requests per day"],
    ["API keys", "API keys"],
    ["Automations / day", "Automations per day via API"],
    ["Scheduled posts / day", "Scheduled posts per day via API"],
  ];
  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    const column = plan.toLowerCase();
    for (const [rows, list] of [[pairs, content.limits], [apiPairs, content.apiLimits]] as const) {
      for (const [label, rowName] of rows) {
        const card = list.find((l) => l.label === label)?.value;
        assert.equal(card, matrixRow(rowName)[column], `${plan} "${label}"`);
      }
    }
  }
});

test("API limits sit under an API limits heading, never among the app limits", () => {
  for (const [plan, content] of Object.entries(V4_PLAN_CONTENT)) {
    assert.match(content.apiLimitsLabel, /^API limits\b/, `${plan} API heading`);
    assert.equal(content.apiLimits.length, 4, `${plan} shows all four API limits`);
    for (const limit of content.limits) {
      assert.equal(/api|per day|\/ day/i.test(limit.label), false, `${plan}: "${limit.label}" is an API limit in the app limits`);
    }
  }
  const apiGroup = featureCategories.find((c) => c.name === "API limits");
  assert.ok(apiGroup?.description && /not limited/i.test(apiGroup.description), "matrix API group says it does not limit the app");
});

test('plan copy says "team members", never "seats", and never sells white label', () => {
  const copy = [
    ...Object.values(V4_PLAN_CONTENT).flatMap((c) => [
      c.audience,
      c.includedLabel,
      ...c.features,
      ...c.limits.map((l) => l.label),
    ]),
    ...allMatrixRows().map((r) => String(r.name)),
    ...featureCategories.map((c) => `${c.name} ${c.description ?? ""}`),
    ...REGIONS.flatMap((region) => getPricingFaqs(region).map((f) => `${f.q} ${f.a}`)),
  ].join("\n");
  assert.equal(/\bseats?\b/i.test(copy), false, '"seat" appears in plan copy');
  assert.equal(
    /white.?label|client workspace|custom domain|domain verification|theme colou?r/i.test(copy),
    false,
    "an agency capability that is not switched on is advertised",
  );
});

test("the Creator plan is not shown anywhere on the site", () => {
  for (const region of REGIONS) {
    assert.equal(getPricingPlans(region).some((p) => /creator/i.test(p.name)), false, region);
  }
  assert.deepEqual([...comparisonPlanNames], ["Free", "Starter", "Growth", "Business", "Agency"]);
  assert.deepEqual(Object.keys(V4_PLAN_CONTENT), ["Free", "Starter", "Growth", "Business", "Agency"]);
  assert.equal(allMatrixRows().some((r) => /creator/i.test(String(r.name))), false, "a matrix row names Creator");

  // No page may name it as a plan: "Creator plan", "Creator access", "Creator tier".
  const sources = ["../src/config/faq.config.ts", "../src/components/CreatorsProgramContent.tsx",
    "../src/app/signup/page.tsx", "../src/config/pricing.config.ts", "../src/lib/marketing-plans.server.ts",
    "../src/config/seo.config.ts", "../public/llms.txt"];
  for (const path of sources) {
    const text = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.equal(/\bCreator (plan|access|tier)\b/.test(text), false, `${path} names a Creator plan`);
  }
});

test("creator access states the branding trade and includes API access, everywhere it is described", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  const policy = read("../src/content/legal/creators-program-policy.md");
  const surfaces = {
    policy,
    faq: read("../src/config/faq.config.ts"),
    page: read("../src/components/CreatorsProgramContent.tsx"),
  };
  // The branding, as the Backend code sends it (docs/decisions/0005 has file:line):
  // the DM line from DM_BRANDING_SUGGESTION_LINE, the follow-up button label from
  // FREE_TIER_FOLLOW_UP_BUTTON_LABEL, and the bio link badge text.
  for (const [name, text] of Object.entries(surfaces)) {
    assert.match(text, /I automate my DMs with @Liffio/, `${name} does not quote the DM line the code adds`);
    assert.match(text, /Powered by @Liffio/, `${name} does not name the bio link badge`);
    assert.match(text, /API access/, `${name} does not include API access`);
    assert.equal(/Powered by @getliffio/.test(text), false, `${name} quotes a DM tag the code never sends`);
  }
  for (const [name, text] of Object.entries({ policy, faq: surfaces.faq })) {
    assert.match(text, /Get the tool now!/, `${name} does not name the follow-up button`);
  }
  assert.equal(/does not include[^.]*API/i.test(policy), false, "the policy still withholds API access");
  assert.match(policy, /Priority email support/, "priority email support is a program benefit and stays");
  assert.equal(/No Strings/i.test(surfaces.page), false, "the page says No Strings while describing a trade");
});

test("creator requirements match Creators Program Policy 6.1, which is binding", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  const policy = read("../src/content/legal/creators-program-policy.md");
  assert.match(policy, /There is no minimum number of DMs/, "the policy itself moved; re-check the pages");
  for (const path of ["../src/config/faq.config.ts", "../src/components/CreatorsProgramContent.tsx"]) {
    const text = read(path);
    assert.equal(/300 (automated )?DM|DM\/month minimum|active (automation )?campaigns/i.test(text), false, `${path} still asks for a DM minimum or campaigns`);
    assert.match(text, /2 posts or reels/, `${path} does not state the posts requirement`);
    assert.match(text, /one Liffio automation active/, `${path} does not state the automation requirement`);
  }
});

test("the rendered policy quotes the bio link badge verbatim", () => {
  const rendered = loadPolicy("creators-program-policy");
  assert.match(rendered, /"Powered by @Liffio" badge/);
  assert.equal(/Powered by @getliffio/.test(rendered), false, "the normalizer rewrote the product's own text");
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
