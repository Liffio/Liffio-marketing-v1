import { metaCopy } from "@/config/meta-copy";
import { v4FeatureList } from "@/config/pricing-v4.config";
import type { PricingRegion } from "@/lib/pricing-region";
import { INR_TAX_NOTE_LONG, USD_TAX_NOTE } from "@/config/tax-copy";
import { siteConfig } from "./site.config";

export type PlanFeature = { text: string; included: boolean };

export type PricingPlan = {
  name: string;
  monthly: string;
  /**
   * Per-month EQUIVALENT of the annual plan. Derived, and labelled as derived
   * in the UI: nobody authored this number. Always rounded UP (see below).
   */
  annual: string;
  /**
   * The AUTHORED annual price, what the customer is actually billed, straight
   * from `packages.yearly_price_usd_cents` / `yearly_price_inr_paise`.
   * `null` for tiers with no annual plan (Free).
   *
   * This is the anchor. `annual` is its twelfth, shown for comparability with
   * the monthly card; this is the commitment.
   */
  annualTotal: string | null;
  /**
   * Shown, but not yet sellable.
   *
   * Growth is in the packages catalogue at $29/₹1,499 but `/marketing/plans`
   * withholds it (`show_on_marketing_site = false`, D2 part 2, blocked on live
   * Razorpay keys). The card is merged in from this sheet so the comparison
   * matrix stops describing a tier with no card above it.
   *
   * 🚩 Its CTA must NOT lead to checkout. `PAID_PLANS` in confirm-email omits
   * GROWTH, so `?plan=GROWTH` is silently dropped after signup and the visitor
   * lands in onboarding with no subscription and no explanation. A buy button
   * that does not buy is worse than no card at all.
   */
  provisional?: boolean;
  /**
   * Introductory price, shown INSTEAD of `monthly` on monthly billing.
   *
   * India's Starter carries one: ₹49 for the first month, then ₹499. Nothing
   * else does, and the guard in `applyIntroOffer` enforces that rather than
   * trusting whatever the payload says.
   *
   * 🚩 This is an advertised PRICE, so it is only ever correct while the
   * checkout actually charges it. It was withdrawn once for exactly that
   * reason - see the note on the India Starter entry below before touching it.
   *
   * `introPriceLabel` is the unit the headline number is in ("first month"),
   * not a marketing slogan: it is what stops ₹49 reading as the ongoing price
   * beside Growth's ₹1,499.
   */
  introPrice?: string | null;
  introPriceLabel?: string | null;
  description: string;
  badge: string | null;
  highlight: boolean;
  popular: boolean;
  features: PlanFeature[];
  cta: string;
  href: string;
};

const signup = siteConfig.urls.appSignup;

/**
 * Annual billing charges TEN months, not "20% off", two months free, 16.67%.
 * The old `* 0.8` multiplier under-quoted every paid tier ($84/yr advertised
 * against $90/yr actually charged on Starter).
 *
 * 🚩 Do NOT derive the annual figure from the monthly one. USD yearly really is
 * exactly `monthly * 10`, but every INR yearly in the `packages` table is
 * charm-priced ₹9 ABOVE that: ₹499/mo bills at ₹4,999/yr, not ₹4,990. A
 * previous revision of this file derived it and under-quoted INR by ₹1 on
 * Starter, Business and Agency, small, but wrong in the direction that
 * matters, and invisible without a comparison against the catalogue.
 *
 * So the numbers passed below are ANNUAL TOTALS transcribed from
 * `packages.yearly_price_usd_cents` / `packages.yearly_price_inr_paise`, and
 * `npm run check:prices` fails when they stop matching the live catalogue.
 *
 * "2 months free" is the exact, non-rounded way to state the saving, so prefer
 * that phrasing in copy over any percentage.
 */

function usdMonthly(amount: number): string {
  return `$${amount}`;
}

/**
 * Per-month equivalent of the catalogue's ANNUAL TOTAL.
 *
 * 🚩 CEIL, not round, and never floor. Rounding to nearest under-quotes: Business
 * INR is ₹24,999/12 = ₹2,083.25, and ₹2,083 understates the real bill by ₹36 a
 * year. Flooring is how the API produces $7 against a real $7.50. Up is the only
 * direction that cannot promise less than we charge.
 *
 * USD shows two decimals; INR shows whole rupees, because ₹416.58 reads badly
 * and paise are not used in Indian price display.
 */
function usdAnnual(yearlyTotal: number): string {
  return `$${(Math.ceil((yearlyTotal / 12) * 100) / 100).toFixed(2)}`;
}

/** The authored annual price itself, the number the customer is billed. */
function usdAnnualTotal(yearlyTotal: number): string {
  return `$${yearlyTotal.toLocaleString("en-US")}`;
}

function inrMonthly(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** See usdAnnual. Whole rupees, rounded UP. */
function inrAnnual(yearlyTotal: number): string {
  return `₹${Math.ceil(yearlyTotal / 12).toLocaleString("en-IN")}`;
}

/** The authored annual price itself. en-IN grouping: ₹2,29,999, matching ₹22,999. */
function inrAnnualTotal(yearlyTotal: number): string {
  return `₹${yearlyTotal.toLocaleString("en-IN")}`;
}

/**
 * A zero price must still RENDER: the Free tier's headline is "$0"/"₹0".
 *
 * 🚩 Never gate a price on truthiness. `0` is falsy and `"$0"` is not, so any
 * refactor that moves from the formatted string to a numeric amount (which is
 * what wiring `/billing/packages` would do: it serves
 * `monthlyPriceUsdCents: 0`) turns `if (price)` into "hide the Free card".
 * Compare against the zero VALUE explicitly, as here, and keep it that way.
 */
export function isZeroPrice(price: string): boolean {
  return price === "$0" || price === "₹0";
}

/**
 * The fallback bullets ARE the plan sheet's bullets.
 *
 * 🚩 This sheet renders during an API outage AND ships in the client bundle, so
 * it used to carry its own hand-written bullet lists, and they drifted: story
 * automations, "priority support", a dedicated account manager, none of which
 * any plan includes. Reading them from pricing-v4.config means there is one
 * place plan copy is written, and the fallback cannot say something the live
 * cards do not.
 */
function sheetFeatures(plan: string): PlanFeature[] {
  const features = v4FeatureList(plan);
  if (!features) throw new Error(`pricing-v4.config has no bullets for ${plan}`);
  return features;
}

const freeFeatures = sheetFeatures("Free");
const starterFeatures = sheetFeatures("Starter");
const growthFeatures = sheetFeatures("Growth");
const businessFeatures = sheetFeatures("Business");
const agencyFeatures = sheetFeatures("Agency");

const planSignupUrl = (plan: string) => `${signup}?plan=${plan}&source=liffio`;

const globalPricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthly: usdMonthly(0),
    annual: usdMonthly(0),
    annualTotal: null,
    description: "Get started with comment-to-DM automation. Unlimited DMs, no credit card required.",
    badge: null,
    highlight: false,
    popular: false,
    features: freeFeatures,
    cta: "Start for Free",
    href: planSignupUrl("STARTER"),
  },
  {
    name: "Starter",
    monthly: usdMonthly(9),
    annual: usdAnnual(90),
    annualTotal: usdAnnualTotal(90),
    description: "Everything creators need to convert comments into sales on autopilot.",
    badge: "Most Popular",
    highlight: true,
    popular: true,
    features: starterFeatures,
    cta: "Get Starter",
    href: planSignupUrl("STARTER"),
  },
  {
    name: "Growth",
    monthly: usdMonthly(29),
    annual: usdAnnual(290),
    annualTotal: usdAnnualTotal(290),
    description: "Scale content and analytics across a growing account.",
    badge: null,
    highlight: false,
    popular: false,
    features: growthFeatures,
    cta: "Get Growth",
    href: planSignupUrl("GROWTH"),
  },
  {
    name: "Business",
    monthly: usdMonthly(59),
    annual: usdAnnual(590),
    annualTotal: usdAnnualTotal(590),
    description: "Full growth toolkit for power users, brands, and high-volume creators.",
    badge: null,
    highlight: false,
    popular: false,
    features: businessFeatures,
    cta: "Get Business",
    href: planSignupUrl("BUSINESS"),
  },
  {
    name: "Agency",
    monthly: usdMonthly(549),
    annual: usdAnnual(5490),
    annualTotal: usdAnnualTotal(5490),
    description: "Twenty workspaces on one subscription for agencies managing multiple client brands.",
    badge: null,
    highlight: false,
    popular: false,
    features: agencyFeatures,
    cta: "Get Agency",
    href: planSignupUrl("AGENCY"),
  },
];

const indiaPricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthly: inrMonthly(0),
    annual: inrMonthly(0),
    annualTotal: null,
    description: "Get started with comment-to-DM automation. Unlimited DMs, no credit card required.",
    badge: null,
    highlight: false,
    popular: false,
    features: freeFeatures,
    cta: "Start for Free",
    href: planSignupUrl("STARTER"),
  },
  {
    name: "Starter",
    monthly: inrMonthly(499),
    annual: inrAnnual(4999),
    annualTotal: inrAnnualTotal(4999),
    /*
      ₹49 for the first month, then ₹499. India only.

      🚩 READ THIS BEFORE CHANGING IT. This offer was here once, was RETIRED
      under D17 because no checkout path implemented it, and is now back on an
      explicit product decision that billing charges it. `/marketing/plans`
      still serves `introPrice: null` for every tier, so this sheet is the only
      source and `applyIntroOffer` puts it back over the payload - which means
      the page can advertise ₹49 whether or not anything can charge ₹49. That
      is precisely the failure D17 recorded.

      If the first Starter invoice in India is not ₹49, flip
      `INTRO_OFFER_LIVE` to false in marketing-plans.server.ts. That is one
      boolean and it removes the claim from the card, the plans FAQ answer and
      the AI-facing price sentence at once, because all three derive from it.
    */
    introPrice: inrMonthly(49),
    introPriceLabel: "first month",
    description: "Everything creators need to convert comments into sales on autopilot.",
    badge: "Most Popular",
    highlight: true,
    popular: true,
    features: starterFeatures,
    cta: "Get Starter",
    href: planSignupUrl("STARTER"),
  },
  {
    name: "Growth",
    monthly: inrMonthly(1499),
    annual: inrAnnual(14999),
    annualTotal: inrAnnualTotal(14999),
    description: "Scale content and analytics across a growing account.",
    badge: null,
    highlight: false,
    popular: false,
    features: growthFeatures,
    cta: "Get Growth",
    href: planSignupUrl("GROWTH"),
  },
  {
    name: "Business",
    monthly: inrMonthly(2499),
    annual: inrAnnual(24999),
    annualTotal: inrAnnualTotal(24999),
    description: "Full growth toolkit for power users, brands, and high-volume creators.",
    badge: null,
    highlight: false,
    popular: false,
    features: businessFeatures,
    cta: "Get Business",
    href: planSignupUrl("BUSINESS"),
  },
  {
    name: "Agency",
    monthly: inrMonthly(22999),
    annual: inrAnnual(229999),
    annualTotal: inrAnnualTotal(229999),
    description: "Twenty workspaces on one subscription for agencies managing multiple client brands.",
    badge: null,
    highlight: false,
    popular: false,
    features: agencyFeatures,
    cta: "Get Agency",
    href: planSignupUrl("AGENCY"),
  },
];

/** @deprecated Use getPricingPlans(region) for region-aware pricing. */
export const pricingPlans = globalPricingPlans;

export function getPricingPlans(region: PricingRegion): PricingPlan[] {
  return region === "india" ? indiaPricingPlans : globalPricingPlans;
}

export const pricingPerks = [
  { label: "No contracts" },
  { label: "Cancel anytime" },
  { label: "No credit card required" },
  { label: "Instant setup" },
  { label: "Razorpay billing" },
];

export function getFreePlanFaqAnswer(region: PricingRegion): string {
  const price = region === "india" ? "₹0/month" : "$0/month";
  // DMs are unlimited on every plan, Free included (docs/decisions/0005), and it
  // is the strongest line on the page, so this answer leads with it.
  return `Yes. The Free plan is ${price}. No credit card required. You get unlimited DMs, three automation workflows, comment keyword triggers, public replies, the full post scheduler, a leads list, a bio link and short links, and one team member.`;
}

export function getPlansOfferedFaqAnswer(region: PricingRegion): string {
  if (region === "india") {
    return `Five tiers: Free (₹0, $0), Starter (₹499/mo; $9/mo in USD), Growth (₹1,499/mo; $29/mo in USD), Business (₹2,499/mo; $59/mo in USD), and Agency (₹22,999/mo; $549/mo in USD). ${INR_TAX_NOTE_LONG} Annual billing charges 10 months instead of 12, so two months are free. Every plan, Free included, sends unlimited automated DMs, and every plan connects one Instagram account per workspace.`;
  }
  return `Five tiers: Free ($0), Starter ($9/mo; ₹499/mo in India), Growth ($29/mo; ₹1,499/mo in India), Business ($59/mo; ₹2,499/mo in India), and Agency ($549/mo; ₹22,999/mo in India). ${USD_TAX_NOTE} Annual billing charges 10 months instead of 12, so two months are free. Every plan, Free included, sends unlimited automated DMs, and every plan connects one Instagram account per workspace.`;
}

export function getBusinessPlanValueLabel(region: PricingRegion): string {
  return region === "india" ? "₹2,499/mo ($59/mo)" : "$59/mo (₹2,499/mo in India)";
}

export function getCreatorsProgramFaqAnswer(region: PricingRegion): string {
  const value = getBusinessPlanValueLabel(region);
  return `Yes. Qualified Instagram creators (5K to 100K followers) can apply for our Creators Program and get everything in the Business plan (${value} value) at no cost, in exchange for active platform usage. The one exception is Liffio branding: it cannot be turned off, so Liffio adds a closing line in your automated DMs, written as your own recommendation, that reads \"I automate my DMs with @Liffio\" and ends with a link to Liffio, sends a separate branded DM a few minutes later, with a \"Get the tool now!\" button that links to Liffio, whenever an automation has no follow-up steps of its own, and keeps the \"Powered by @Liffio\" badge on your bio link page. No credit card required.`;
}

/**
 * The comparison matrix.
 *
 * Now the V4 design's own 87 rows, shipped verbatim - see pricing-v4.config.ts
 * for the list of rows that state entitlements production does not grant, and
 * why they are here anyway. Re-exported under the old name so the component and
 * the tests keep reading one source.
 */
export { V4_FEATURE_CATEGORIES as featureCategories } from "./pricing-v4.config";

export const comparisonPlanNames = ["Free", "Starter", "Growth", "Business", "Agency"] as const;

/**
 * Workspaces included per tier, shown as a sub-label under each column header.
 *
 * From `package_limits.workspacesIncluded`, 1 everywhere except Agency, which
 * has 20. It sits in the header because the Team members row reads "15 per
 * workspace" on Agency, and the reader needs the multiplier in view to make
 * sense of it.
 */
export const planWorkspacesIncluded: Record<(typeof comparisonPlanNames)[number], number> = {
  Free: 1,
  Starter: 1,
  Growth: 1,
  Business: 1,
  Agency: 20,
};

/** Display strings derive from the numbers above, so there is one source. */
export const comparisonPlanWorkspaces: Record<(typeof comparisonPlanNames)[number], string> =
  Object.fromEntries(
    comparisonPlanNames.map((plan) => [
      plan,
      `${planWorkspacesIncluded[plan]} ${planWorkspacesIncluded[plan] === 1 ? "workspace" : "workspaces"}`,
    ]),
  ) as Record<(typeof comparisonPlanNames)[number], string>;

/**
 * "$2,499" -> 2499. Null when the string is not a plain money amount.
 *
 * 🚩 The break-even calculator parses the SAME strings the cards render, rather
 * than reading a parallel numeric field. A second source could drift from the
 * displayed one, and then the calculator would argue from prices the page does
 * not show. Parsing what is rendered makes that impossible.
 */
export function parseDisplayAmount(display: string | null | undefined): number | null {
  if (!display) return null;
  const numeric = display.replace(/[^0-9.]/g, "");
  if (!/^\d+(\.\d+)?$/.test(numeric)) return null;
  return Number(numeric);
}

/** The leading currency symbol of a rendered price, for formatting derived figures. */
export function currencySymbolOf(display: string): string {
  return /^[^0-9]/.test(display) ? display[0] : "";
}

/** The column carrying emphasis, matching the highlighted card. */
export const comparisonHighlightPlan: (typeof comparisonPlanNames)[number] = "Growth";

type PlanColumn = (typeof comparisonPlanNames)[number];

export function getPricingFaqs(region: PricingRegion) {
  return [
    {
      q: "Is the Free plan really free?",
      a: getFreePlanFaqAnswer(region),
    },
    {
      q: "What plans does Liffio offer?",
      a: getPlansOfferedFaqAnswer(region),
    },
    {
      q: "Can I pay monthly, quarterly, or annually?",
      a: "Yes. Paid plans are available on monthly or annual billing. Annual billing charges 10 months instead of 12, so you get two months free - a saving of about 17% compared to paying monthly. Billing is handled securely via Razorpay.",
    },
    {
      q: "Is Liffio safe for my Instagram account?",
      a: metaCopy.pricingFaqSafe,
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Yes. You can change plans at any time from your workspace billing settings. Upgrades take effect immediately; downgrades apply at the end of your current billing period.",
    },
    {
      q: "What's included in the Agency plan?",
      a: "Agency includes everything in Business, plus 20 workspaces on one bill and one billing date, agency branding, and the option to hide Liffio branding. Every limit is per workspace, across all 20.",
    },
    {
      q: "Do you offer a Creators Program?",
      a: getCreatorsProgramFaqAnswer(region),
    },
  ];
}

/** @deprecated Use getPricingFaqs(region) for region-aware FAQs. */
export const pricingFaqs = getPricingFaqs("global");

export function getPlanColumnValue(
  row: Record<Lowercase<PlanColumn>, boolean | string>,
  plan: PlanColumn,
): boolean | string {
  const key = plan.toLowerCase() as Lowercase<PlanColumn>;
  return row[key];
}

/** en-IN groups as 2,29,999; everything else as 229,999. */
export function localeForSymbol(symbol: string): string {
  return symbol === "₹" ? "en-IN" : "en-US";
}

/** A whole-unit amount in the same currency the page is already rendering. */
export function formatMoney(amount: number, symbol: string): string {
  return `${symbol}${Math.round(amount).toLocaleString(localeForSymbol(symbol))}`;
}

/**
 * A DERIVED amount, a per-workspace rate, a per-account cost, where the
 * fraction is the point. Two decimals for USD, whole units for INR, because
 * ₹416.58 reads badly and paise are not used in Indian price display.
 */
export function formatMoneyPrecise(amount: number, symbol: string): string {
  return symbol === "₹"
    ? `${symbol}${Math.round(amount).toLocaleString("en-IN")}`
    : // Grouped, not `toFixed(2)`. Every caller used to pass a per-workspace or
      // per-account rate under four figures, where the two read identically;
      // the affiliate calculator's twelve-month total does not, and "$1755.25"
      // is a worse number to read than "$1,755.25".
      `${symbol}${amount.toLocaleString(localeForSymbol(symbol), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
}
