import { metaCopy } from "@/config/meta-copy";
import { FEATURE_BRANCHING_LOGIC, FEATURE_CRM_INTEGRATION, FEATURE_SALE_TRACKING, FEATURE_STORY_REACTIONS, FEATURE_WELCOME_DM } from "@/config/feature-flags";
import type { PricingRegion } from "@/lib/pricing-region";
import { siteConfig } from "./site.config";

export type PlanFeature = { text: string; included: boolean };

export type PricingPlan = {
  name: string;
  monthly: string;
  annual: string;
  /**
   * Introductory price shown prominently on monthly billing.
   * Currently unused — no tier has one, and no checkout path implements one.
   * Kept because the catalogue payload still carries the field.
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
 * Annual billing charges TEN months, not "20% off".
 *
 * Every tier in the `packages` table has `yearly_price = monthly_price * 10`
 * exactly, in both currencies (e.g. 900 -> 9000 cents, 2299900 -> 22999900
 * paise). That is two months free = 16.67% off, NOT the 20% this file used to
 * claim. The old `* 0.8` multiplier under-quoted the real annual rate on every
 * paid tier ($84/yr advertised against $90/yr charged on Starter).
 *
 * "2 months free" is the exact, non-rounded way to state it, so prefer that
 * phrasing in copy over any percentage.
 */
const YEARLY_MONTHS_CHARGED = 10;

/** Monthly-equivalent of the annual rate. Rounded UP so we never under-quote. */
function annualPerMonth(monthlyAmount: number): number {
  return (monthlyAmount * YEARLY_MONTHS_CHARGED) / 12;
}

function usdMonthly(amount: number): string {
  return `$${amount}`;
}

function usdAnnual(monthlyAmount: number): string {
  const perMonth = Math.ceil(annualPerMonth(monthlyAmount) * 100) / 100;
  return `$${Number.isInteger(perMonth) ? perMonth : perMonth.toFixed(2)}`;
}

function inrMonthly(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function inrAnnual(monthlyAmount: number): string {
  return `₹${Math.ceil(annualPerMonth(monthlyAmount)).toLocaleString("en-IN")}`;
}

/**
 * A zero price must still RENDER — the Free tier's headline is "$0"/"₹0".
 *
 * 🚩 Never gate a price on truthiness. `0` is falsy and `"$0"` is not, so any
 * refactor that moves from the formatted string to a numeric amount (which is
 * what wiring `/billing/packages` would do — it serves
 * `monthlyPriceUsdCents: 0`) turns `if (price)` into "hide the Free card".
 * Compare against the zero VALUE explicitly, as here, and keep it that way.
 */
export function isZeroPrice(price: string): boolean {
  return price === "$0" || price === "₹0";
}

const unlimitedCore: PlanFeature[] = [
  { text: "Unlimited Instagram accounts", included: true },
  { text: "Unlimited automated DMs", included: true },
];

const freeFeatures: PlanFeature[] = [
  ...unlimitedCore,
  { text: "Comment keyword triggers", included: true },
  { text: "Public comment auto-replies", included: true },
  { text: "3 DM message templates", included: true },
  { text: "Bio link page (bio.liffio.com)", included: true },
  { text: "Basic analytics", included: true },
  { text: "Story & multi-step flows", included: false },
  { text: "Short links & lead capture", included: false },
  { text: "External API access", included: false },
];

const starterFeatures: PlanFeature[] = [
  ...unlimitedCore,
  { text: "All automation trigger types", included: true },
  { text: "Unlimited templates & multi-step flows", included: true },
  { text: FEATURE_WELCOME_DM ? "Story & welcome DM automations" : "Story automations", included: true },
  { text: "Advanced analytics dashboard", included: true },
  { text: "Short links (go.liffio.com) + click tracking", included: true },
  { text: "Lead capture from DMs & link clicks", included: true },
  { text: "Post scheduler (Instagram feed)", included: true },
  { text: "Priority email support", included: true },
  // Starter has NO external API access. Backend `BILLING_PLANS[Plan.STARTER]`
  // is `features.apiEnabled: false` with `maxApiCredentials: 0` and
  // `apiRequestsPerDay: 0`, and there is no longer an `api` gate declaring
  // Starter. The live catalogue agrees (`/api/v1/marketing/plans` serves this
  // entry as `included: false`), so the earlier `true` here was a claim the
  // product does not honour.
  { text: "External API access", included: false },
];

const growthFeatures: PlanFeature[] = [
  { text: "Everything in Starter", included: true },
  { text: "Instagram post, video & profile analytics", included: true },
  { text: "Caption, hashtag & schedule templates", included: true },
  { text: "Bulk upload", included: true },
  { text: "5 follow-up messages per automation", included: true },
  { text: "5 seats", included: true },
  { text: "Team management", included: false },
  { text: "Per-automation attribution", included: false },
  { text: "External API access", included: false },
];

const businessFeatures: PlanFeature[] = [
  ...unlimitedCore,
  { text: "Everything in Starter", included: true },
  { text: FEATURE_SALE_TRACKING ? "Full conversion analytics (comment → sale)" : "Full conversion analytics (comment → DM → click)", included: true },
  { text: "Instagram account-level insights", included: true },
  { text: "External API keys (plan-gated)", included: true },
  { text: "Team members (up to 5 seats)", included: true },
  { text: "Branded short links with UTM attribution", included: true },
  { text: "Follow-up DM sequences", included: true },
  { text: "Priority support + onboarding call", included: true },
];

const agencyFeatures: PlanFeature[] = [
  ...unlimitedCore,
  { text: "Agency white-label workspaces", included: true },
  { text: "Client sub-workspaces (CLIENT role)", included: true },
  { text: "Dedicated account manager", included: true },
  { text: "Full API access & webhooks", included: true },
  ...(FEATURE_CRM_INTEGRATION ? [{ text: "Custom integrations & CRM sync", included: true }] : []),
  { text: "Affiliate program management", included: true },
  { text: "SLA-backed priority support", included: true },
  { text: "Volume & multi-workspace pricing", included: true },
];

const planSignupUrl = (plan: string) => `${signup}?plan=${plan}&source=liffio`;

const globalPricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthly: usdMonthly(0),
    annual: usdMonthly(0),
    description: "Get started with comment-to-DM automation - no credit card required.",
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
    annual: usdAnnual(9),
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
    annual: usdAnnual(29),
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
    annual: usdAnnual(59),
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
    annual: usdAnnual(549),
    description: "White-label workspaces for agencies managing multiple client brands.",
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
    description: "Get started with comment-to-DM automation - no credit card required.",
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
    annual: inrAnnual(499),
    // No intro price. The "₹49 first month" offer was retired: no checkout path
    // ever implemented it, so it advertised a price nothing could charge. The
    // live catalogue serves `introPrice: null` for every tier. Starter is ₹499
    // permanently (D17).
    introPrice: null,
    introPriceLabel: null,
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
    annual: inrAnnual(1499),
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
    annual: inrAnnual(2499),
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
    annual: inrAnnual(22999),
    description: "White-label workspaces for agencies managing multiple client brands.",
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
  { label: "Stripe + Razorpay billing" },
];

export function getFreePlanFaqAnswer(region: PricingRegion): string {
  const price = region === "india" ? "₹0/month" : "$0/month";
  return `Yes. The Free plan is ${price}. No credit card required. You get unlimited Instagram accounts, unlimited automated DMs, comment keyword triggers, public auto-replies, a bio link page, and basic analytics.`;
}

export function getPlansOfferedFaqAnswer(region: PricingRegion): string {
  if (region === "india") {
    return "Five tiers: Free (₹0, $0), Starter (₹499/mo; $9/mo in USD), Growth (₹1,499/mo; $29/mo in USD), Business (₹2,499/mo; $59/mo in USD), and Agency (₹22,999/mo; $549/mo in USD). Annual billing charges 10 months instead of 12, so two months are free. Every plan includes unlimited Instagram accounts and unlimited automated DMs.";
  }
  return "Five tiers: Free ($0), Starter ($9/mo; ₹499/mo in India), Growth ($29/mo; ₹1,499/mo in India), Business ($59/mo; ₹2,499/mo in India), and Agency ($549/mo; ₹22,999/mo in India). Annual billing charges 10 months instead of 12, so two months are free. Every plan includes unlimited Instagram accounts and unlimited automated DMs.";
}

export function getBusinessPlanValueLabel(region: PricingRegion): string {
  return region === "india" ? "₹2,499/mo ($59/mo)" : "$59/mo (₹2,499/mo in India)";
}

export function getCreatorsProgramFaqAnswer(region: PricingRegion): string {
  const value = getBusinessPlanValueLabel(region);
  return `Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan (${value} value) at no cost in exchange for active platform usage. No credit card required.`;
}

export const featureCategories = [
  {
    name: "Comment-to-DM Automation",
    description: metaCopy.pricingCategoryApis,
    features: [
      { name: "Keyword comment triggers", free: true, starter: true, growth: true, business: true, agency: true },
      { name: "Public comment auto-replies", free: true, starter: true, growth: true, business: true, agency: true },
      { name: FEATURE_STORY_REACTIONS ? "Story mention & reaction triggers" : "Story mention & reply triggers", free: false, starter: true, growth: true, business: true, agency: true },
      ...(FEATURE_WELCOME_DM ? [{ name: "Welcome DM for new followers", free: false, starter: true, growth: true, business: true, agency: true }] : []),
      { name: "Multi-step DM flows with logic", free: false, starter: true, growth: true, business: true, agency: true },
      { name: "Follow-up DM sequences", free: false, starter: false, growth: true, business: true, agency: true },
    ],
  },
  {
    name: "Growth Toolkit",
    description: "Bio links, short links, scheduling, and analytics - all in one workspace.",
    features: [
      { name: "Bio link pages (bio.liffio.com)", free: true, starter: true, growth: true, business: true, agency: true },
      { name: "Branded short links (go.liffio.com)", free: false, starter: true, growth: true, business: true, agency: true },
      { name: "Click & referrer tracking", free: false, starter: true, growth: true, business: true, agency: true },
      { name: "Lead capture from DMs & clicks", free: false, starter: true, growth: true, business: true, agency: true },
      { name: "Post scheduler (Instagram feed)", free: false, starter: true, growth: true, business: true, agency: true },
      { name: FEATURE_SALE_TRACKING ? "Conversion analytics (comment → sale)" : "Conversion analytics (comment → DM → click)", free: false, starter: true, growth: true, business: true, agency: true },
      { name: "Instagram account insights", free: false, starter: false, growth: true, business: true, agency: true },
    ],
  },
  {
    name: "Team, API & Agency",
    description: "Collaborate with your team, integrate via API, or manage client workspaces at scale.",
    features: [
      { name: "Team members", free: "1", starter: "3", growth: "5", business: "5", agency: "Unlimited" },
      { name: "Role-based access (RBAC)", free: false, starter: true, growth: true, business: true, agency: true },
      // Starter is NOT on the API ladder — see the starterFeatures note above.
      { name: "External API keys", free: false, starter: false, growth: false, business: true, agency: true },
      { name: "Agency white-label workspaces", free: false, starter: false, growth: false, business: false, agency: true },
      { name: "Client sub-workspaces", free: false, starter: false, growth: false, business: false, agency: true },
      { name: "Affiliate program (50% commission)", free: false, starter: true, growth: true, business: true, agency: true },
    ],
  },
];

export const comparisonPlanNames = ["Free", "Starter", "Growth", "Business", "Agency"] as const;

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
      a: "Yes. Paid plans are available on monthly or annual billing. Annual billing charges 10 months instead of 12, so you get two months free - a saving of about 17% compared to paying monthly. Billing is handled securely via Stripe (global) or Razorpay (India).",
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
      a: "Agency includes white-label workspaces, client sub-workspaces with restricted CLIENT roles, dedicated account management, full API access, and volume pricing tailored to your agency.",
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
