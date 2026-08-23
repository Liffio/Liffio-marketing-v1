/**
 * Price-drift check: the marketing site vs the live billing catalogue.
 *
 * WHY THIS EXISTS
 * ---------------
 * For months the site quoted $299 for a tier that sells at $549, and $79 for
 * one that sells at $59. No PR introduced those numbers — the catalogue moved
 * underneath files nobody edited. Unit tests could not catch it, because the
 * numbers they assert against were transcribed by the same hand that got them
 * wrong. The only cure is to compare against production and fail on any
 * disagreement.
 *
 * WHAT IT COMPARES
 * ----------------
 *   CATALOGUE  GET /api/v1/billing/packages    <- source of truth
 *   SHEET      src/config/pricing.config.ts    <- this repo's price map
 *   RENDERED   GET /api/v1/marketing/plans     <- what the pricing CARDS show
 *
 * Both SHEET and RENDERED are checked, and that is deliberate. The cards are
 * served from /marketing/plans (plan_catalog); the sheet is only the fallback
 * used when that call fails. Checking the sheet alone would report "all clear"
 * while the live page showed a different set of tiers at different prices —
 * which is exactly the state this repo is in today.
 *
 * Per tier, per currency (USD + INR), per interval (monthly + annual), plus
 * the tier SET itself: a package in the catalogue with no card, or a card for
 * a package that no longer exists, fails the same way a wrong price does.
 *
 * Run: npm run check:prices
 */

import { getPricingPlans, type PricingPlan } from "@/config/pricing.config";

// ── Config ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.LIFFIO_API_URL?.replace(/\/+$/, "") ?? "https://api.liffio.com";

/** "pr" blocks a pull request; "scheduled" runs against production on a timer. */
const MODE = process.env.DRIFT_MODE === "scheduled" ? "scheduled" : "pr";

const ATTEMPTS = 3;
const TIMEOUT_MS = 15_000;

/**
 * Divergences we have SEEN, ACCEPTED and OWNED — never a way to silence a
 * finding indefinitely. Every entry needs an owner and an expiry; past its
 * expiry it fails like anything else, so a forgotten waiver becomes loud
 * rather than permanent.
 */
type Waiver = { id: string; until: string; owner: string; why: string };

const WAIVERS: Waiver[] = [
  {
    id: "rendered:tier-missing:Growth",
    until: "2026-09-06",
    owner: "backend",
    why:
      "plan_catalog.GROWTH.show_on_marketing_site = false, so /marketing/plans serves four tiers and the page has no Growth card. The fix is to flip it in Backend/src/config/marketing.config.ts; ensureSeeded() re-upserts on every boot, so editing the row directly will not hold.",
  },
  {
    id: "rendered:annual:*",
    until: "2026-09-06",
    owner: "backend",
    why:
      "marketingPlansService.ANNUAL_DISCOUNT = 0.8 generates the annual figures the cards show, under-quoting the real ten-month rate by about 4% ($7 against $7.50 on Starter). The fix is to drop the multiplier and serve packages.yearly_price_* directly.",
  },
];

// ── Types ────────────────────────────────────────────────────────────────────

type CataloguePackage = {
  key: string;
  name: string;
  monthlyPriceUsdCents: number | null;
  yearlyPriceUsdCents: number | null;
  monthlyPriceInrPaise: number | null;
  yearlyPriceInrPaise: number | null;
};

type RenderedPlan = { plan: string; name: string; monthly: string; annual: string };

type Region = "global" | "india";
type Currency = "usd" | "inr";

const REGIONS: Region[] = ["global", "india"];
const REGION_CURRENCY: Record<Region, Currency> = { global: "usd", india: "inr" };
const SYMBOL: Record<Currency, string> = { usd: "$", inr: "₹" };
/** Minor units per major unit — cents, paise. */
const MINOR: Record<Currency, number> = { usd: 100, inr: 100 };
/**
 * Smallest amount the site can actually DISPLAY, in minor units. USD prices
 * are shown to the cent; INR prices are shown as whole rupees. Rounding a
 * per-month figure up to the next displayable step is correct behaviour, so
 * the annual tolerance has to be expressed in these, not in raw minor units —
 * otherwise a legitimate ₹1 round-up reads as a pricing error.
 */
const DISPLAY_STEP: Record<Currency, number> = { usd: 1, inr: 100 };

// ── Fetching, and the unreachable question ───────────────────────────────────

class Unreachable extends Error {}

/**
 * A transport failure is NOT drift. DNS, timeouts and 5xx say the network or
 * the API is unwell; they say nothing about whether our prices are right, and
 * failing a PR for them teaches people that a red check means "retry", which
 * is how a real finding gets clicked past.
 *
 * A 4xx, or a 200 carrying a body we cannot parse, IS a finding: the endpoint
 * moved, started demanding auth, or changed shape. That breaks the site's own
 * data path, so it fails.
 */
async function getJson(url: string): Promise<unknown> {
  let last: Error | undefined;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { accept: "application/json", "user-agent": "liffio-price-drift-check" },
      });

      if (res.status >= 500) throw new Unreachable(`${url} -> HTTP ${res.status}`);
      if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}. The endpoint moved or now requires auth.`);

      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`${url} -> HTTP 200 with a body that is not JSON (${text.slice(0, 120)})`);
      }
    } catch (error) {
      last = error as Error;
      const cause = (error as { cause?: { code?: string } }).cause?.code ?? "";
      const transport =
        error instanceof Unreachable ||
        /timeout|abort|ENOTFOUND|ECONNREFUSED|ECONNRESET|EAI_AGAIN|fetch failed|network/i.test(
          `${last.name} ${last.message} ${cause}`,
        );

      if (!transport) throw error;
      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)));
        continue;
      }
    }
  }

  throw new Unreachable(`${url} unreachable after ${ATTEMPTS} attempts: ${last?.message ?? "unknown"}`);
}

// ── Parsing ──────────────────────────────────────────────────────────────────

/** "₹19,167" -> 1916700 paise. Null when the symbol is wrong for the currency. */
function toMinorUnits(display: string, currency: Currency): number | null {
  const symbol = SYMBOL[currency];
  if (!display.startsWith(symbol)) return null;
  const numeric = display.slice(symbol.length).replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(numeric)) return null;
  return Math.round(Number(numeric) * MINOR[currency]);
}

function fmt(minor: number, currency: Currency): string {
  const major = minor / MINOR[currency];
  return currency === "usd"
    ? `$${Number.isInteger(major) ? major : major.toFixed(2)}`
    : `₹${major.toLocaleString("en-IN")}`;
}

// ── Findings ─────────────────────────────────────────────────────────────────

type Finding = { id: string; source: string; detail: string };

const findings: Finding[] = [];
const waived: Array<Finding & { waiver: Waiver }> = [];

function matchWaiver(id: string): Waiver | undefined {
  return WAIVERS.find((w) => (w.id.endsWith(":*") ? id.startsWith(w.id.slice(0, -1)) : w.id === id));
}

function report(id: string, source: string, detail: string): void {
  // The tier-set comparison runs once per region, so a missing tier surfaces
  // twice for the same underlying fact. Report each id once.
  if (findings.some((f) => f.id === id) || waived.some((w) => w.id === id)) return;

  const waiver = matchWaiver(id);

  if (waiver) {
    const expired = new Date(`${waiver.until}T23:59:59Z`).getTime() < Date.now();
    if (!expired) {
      waived.push({ id, source, detail, waiver });
      return;
    }
    findings.push({
      id,
      source,
      detail: `${detail}\n      Waiver for this expired on ${waiver.until} (owner: ${waiver.owner}).`,
    });
    return;
  }

  findings.push({ id, source, detail });
}

// ── The comparisons ──────────────────────────────────────────────────────────

function compareTierSet(source: string, catalogue: string[], actual: string[]): void {
  for (const name of catalogue) {
    if (!actual.includes(name)) {
      report(
        `${source}:tier-missing:${name}`,
        source,
        `"${name}" is a live package in the catalogue but has no entry in ${source}.`,
      );
    }
  }
  for (const name of actual) {
    if (!catalogue.includes(name)) {
      report(
        `${source}:tier-unknown:${name}`,
        source,
        `${source} advertises "${name}", which is not a live package — retired, renamed, or never sold.`,
      );
    }
  }
}

function compareMonthly(
  source: string,
  name: string,
  currency: Currency,
  expectedMinor: number | null,
  display: string,
): void {
  if (expectedMinor === null) return;
  const actual = toMinorUnits(display, currency);

  if (actual === null) {
    report(
      `${source}:monthly:${name}:${currency}`,
      source,
      `${name} monthly (${currency.toUpperCase()}): "${display}" is not a well-formed ${SYMBOL[currency]} amount.`,
    );
    return;
  }

  if (actual !== expectedMinor) {
    report(
      `${source}:monthly:${name}:${currency}`,
      source,
      `${name} monthly (${currency.toUpperCase()}): ${source} says ${display}, catalogue says ${fmt(expectedMinor, currency)}.`,
    );
  }
}

/**
 * The site advertises a per-MONTH equivalent of the annual plan, so it is
 * judged by what twelve of them add up to against the real yearly charge.
 *
 * Two-sided on purpose. Under the yearly total is a promise broken at
 * checkout. A whole minor unit per month over it means the figure was not
 * rounded from this catalogue at all.
 */
/**
 * The AUTHORED annual price — compared by EXACT EQUALITY, no tolerance.
 *
 * `compareAnnual` below has to allow rounding slack, because the per-month
 * figure it checks is a twelfth of this one and must round somewhere. This
 * number is not derived from anything: it is what the catalogue charges, shown
 * verbatim. If it differs from `packages.yearly_price_*` by a single minor unit,
 * the site is quoting a commitment we do not bill.
 */
function compareAnnualTotal(
  source: string,
  name: string,
  currency: Currency,
  yearlyMinor: number | null,
  display: string | null | undefined,
): void {
  // No annual plan in the catalogue (Free) — the site must show no total either.
  if (yearlyMinor === null) {
    if (display) {
      report(
        `${source}:annual-total:${name}:${currency}`,
        source,
        `${name} has no yearly price in the catalogue, but ${source} advertises an annual total of ${display}.`,
      );
    }
    return;
  }

  if (!display) {
    report(
      `${source}:annual-total:${name}:${currency}`,
      source,
      `${name} is billed ${fmt(yearlyMinor, currency)}/yr by the catalogue, but ${source} carries no annual total to show.`,
    );
    return;
  }

  const actual = toMinorUnits(display, currency);
  if (actual === null) {
    report(
      `${source}:annual-total:${name}:${currency}`,
      source,
      `${name} annual total (${currency.toUpperCase()}): "${display}" is not a well-formed ${SYMBOL[currency]} amount.`,
    );
    return;
  }

  if (actual !== yearlyMinor) {
    report(
      `${source}:annual-total:${name}:${currency}`,
      source,
      `${name} annual total (${currency.toUpperCase()}): ${source} advertises ${display}/yr, catalogue charges ${fmt(yearlyMinor, currency)}/yr.`,
    );
  }
}

function compareAnnual(
  source: string,
  name: string,
  currency: Currency,
  yearlyMinor: number | null,
  monthlyMinor: number | null,
  display: string,
): void {
  const actual = toMinorUnits(display, currency);

  if (actual === null) {
    report(
      `${source}:annual:${name}:${currency}`,
      source,
      `${name} annual (${currency.toUpperCase()}): "${display}" is not a well-formed ${SYMBOL[currency]} amount.`,
    );
    return;
  }

  // No yearly price in the catalogue (Free): the annual figure must equal monthly.
  if (yearlyMinor === null) {
    if (monthlyMinor !== null && actual !== monthlyMinor) {
      report(
        `${source}:annual:${name}:${currency}`,
        source,
        `${name} has no yearly price in the catalogue, so its annual figure should equal its monthly one, but ${source} shows ${display} against ${fmt(monthlyMinor, currency)}.`,
      );
    }
    return;
  }

  const twelve = actual * 12;

  if (twelve < yearlyMinor) {
    report(
      `${source}:annual:${name}:${currency}`,
      source,
      `${name} annual (${currency.toUpperCase()}) UNDER-QUOTES: ${source} advertises ${display}/mo = ${fmt(twelve, currency)}/yr, but the catalogue charges ${fmt(yearlyMinor, currency)}/yr.`,
    );
    return;
  }

  // Twelve months of rounding up, each by at most one displayable step.
  const roundingCeiling = 12 * DISPLAY_STEP[currency];
  if (twelve - yearlyMinor >= roundingCeiling) {
    report(
      `${source}:annual:${name}:${currency}`,
      source,
      `${name} annual (${currency.toUpperCase()}) OVER-QUOTES: ${source} advertises ${display}/mo = ${fmt(twelve, currency)}/yr against a real ${fmt(yearlyMinor, currency)}/yr. That exceeds what rounding to the nearest ${fmt(DISPLAY_STEP[currency], currency)} can explain.`,
    );
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<number> {
  console.log(`Price drift check  ·  ${API_BASE}  ·  mode=${MODE}\n`);

  let packages: CataloguePackage[];
  const rendered = {} as Record<Region, RenderedPlan[]>;

  try {
    const catalogue = (await getJson(`${API_BASE}/api/v1/billing/packages`)) as { packages?: CataloguePackage[] };
    if (!Array.isArray(catalogue?.packages) || catalogue.packages.length === 0) {
      throw new Error("/billing/packages returned no packages. An empty catalogue is never correct.");
    }
    packages = catalogue.packages;

    for (const region of REGIONS) {
      const body = (await getJson(`${API_BASE}/api/v1/marketing/plans?region=${region}`)) as {
        plans?: RenderedPlan[];
      };
      if (!Array.isArray(body?.plans)) throw new Error(`/marketing/plans?region=${region} has no plans array.`);
      rendered[region] = body.plans;
    }
  } catch (error) {
    if (error instanceof Unreachable) {
      // See getJson: a blip must not fail a PR, but silence on a timer is how
      // an outage becomes invisible, so the scheduled run does fail.
      const message = `API unreachable: ${error.message}`;
      if (MODE === "pr") {
        console.warn(`::warning title=Price drift check skipped::${message}`);
        console.warn(`\n  SKIPPED — ${message}`);
        console.warn("  A network failure is not evidence about our prices, so it does not block this PR.");
        console.warn("  The scheduled run treats a sustained outage as a failure.\n");
        return 0;
      }
      console.error(`\n  FAILED — ${message}`);
      console.error("  Scheduled runs fail on unreachability: nobody is watching a skipped timer.\n");
      return 2;
    }
    console.error(`\n  FAILED — ${(error as Error).message}\n`);
    return 1;
  }

  const catalogueNames = packages.map((p) => p.name);
  console.log(`Catalogue: ${catalogueNames.join(", ")}\n`);

  for (const region of REGIONS) {
    const currency = REGION_CURRENCY[region];
    const sheet = getPricingPlans(region);

    compareTierSet(
      "sheet",
      catalogueNames,
      sheet.map((p: PricingPlan) => p.name),
    );
    compareTierSet(
      "rendered",
      catalogueNames,
      rendered[region].map((p) => p.name),
    );

    for (const pkg of packages) {
      const monthlyMinor = currency === "usd" ? pkg.monthlyPriceUsdCents : pkg.monthlyPriceInrPaise;
      const yearlyMinor = currency === "usd" ? pkg.yearlyPriceUsdCents : pkg.yearlyPriceInrPaise;

      type Comparable = { monthly: string; annual: string; annualTotal?: string | null };
      const sources: Array<readonly [string, Comparable | undefined]> = [
        ["sheet", sheet.find((p: PricingPlan) => p.name === pkg.name)],
        ["rendered", rendered[region].find((p) => p.name === pkg.name)],
      ];

      for (const [source, plan] of sources) {
        if (!plan) continue; // absence is already reported by compareTierSet
        compareMonthly(source, pkg.name, currency, monthlyMinor, plan.monthly);
        compareAnnual(source, pkg.name, currency, yearlyMinor, monthlyMinor, plan.annual);
        // Sheet only: /marketing/plans serves no annual total, so there is
        // nothing to compare on the rendered side. The per-month figure it does
        // serve is checked above, and is currently waived (see WAIVERS).
        if (source === "sheet") {
          compareAnnualTotal(source, pkg.name, currency, yearlyMinor, plan.annualTotal);
        }
      }
    }
  }

  // ── Output ─────────────────────────────────────────────────────────────────

  for (const w of waived) {
    console.log(`  WAIVED  ${w.id}`);
    console.log(`          ${w.detail}`);
    console.log(`          until ${w.waiver.until}, owner: ${w.waiver.owner}\n`);
  }

  if (findings.length === 0) {
    const suffix = waived.length ? ` (${waived.length} waived)` : "";
    console.log(`  PASS — the site and the catalogue agree on every tier, currency and interval${suffix}.\n`);
    return 0;
  }

  console.error(`\n  ${findings.length} disagreement${findings.length === 1 ? "" : "s"} with the live catalogue:\n`);
  for (const f of findings) {
    console.error(`    [${f.source}] ${f.detail}`);
    console.error(`      id: ${f.id}\n`);
  }
  console.error("  'sheet'    = src/config/pricing.config.ts — fix it in this repo.");
  console.error("  'rendered' = /api/v1/marketing/plans — fix it in the Backend; plan_catalog drives it.\n");
  return 1;
}

process.exitCode = await main();
