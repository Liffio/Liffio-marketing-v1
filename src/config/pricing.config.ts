import { metaCopy } from "@/config/meta-copy";
import type { PricingRegion } from "@/lib/pricing-region";
import { siteConfig } from "./site.config";

export type PlanFeature = { text: string; included: boolean };

export type PricingPlan = {
  name: string;
  monthly: string;
  annual: string;
  /** Shown below the price (e.g. India Starter intro offer). */
  priceNote?: string | null;
  description: string;
  badge: string | null;
  highlight: boolean;
  popular: boolean;
  features: PlanFeature[];
  cta: string;
  href: string;
};

const signup = siteConfig.urls.appSignup;

const ANNUAL_DISCOUNT = 0.8;

function usdMonthly(amount: number): string {
  return `$${amount}`;
}

function usdAnnual(monthlyAmount: number): string {
  return `$${Math.round(monthlyAmount * ANNUAL_DISCOUNT)}`;
}

function inrMonthly(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function inrAnnual(monthlyAmount: number): string {
  return `₹${Math.round(monthlyAmount * ANNUAL_DISCOUNT).toLocaleString("en-IN")}`;
}

const freeFeatures: PlanFeature[] = [
  { text: "1 Instagram account", included: true },
  { text: "1,000 automated DMs / month", included: true },
  { text: "Comment keyword triggers", included: true },
  { text: "Public comment auto-replies", included: true },
  { text: "3 DM message templates", included: true },
  { text: "Bio link page (bio.liffio.com)", included: true },
  { text: "Basic analytics", included: true },
  { text: "Story, Live & multi-step flows", included: false },
  { text: "Short links & lead capture", included: false },
  { text: "External API access", included: false },
];

const starterFeatures: PlanFeature[] = [
  { text: "2 Instagram accounts", included: true },
  { text: "5,000 automated DMs / month", included: true },
  { text: "Comment keyword triggers", included: true },
  { text: "Public comment auto-replies", included: true },
  { text: "10 DM message templates", included: true },
  { text: "Bio link page (bio.liffio.com)", included: true },
  { text: "Basic analytics", included: true },
  { text: "Story, Live & multi-step flows", included: false },
  { text: "Short links & lead capture", included: false },
  { text: "External API access", included: false },
];

const proFeatures: PlanFeature[] = [
  { text: "5 Instagram accounts", included: true },
  { text: "50,000 automated DMs / month", included: true },
  { text: "All 8 automation trigger types", included: true },
  { text: "Unlimited templates & multi-step flows", included: true },
  { text: "Story, Live & welcome DM automations", included: true },
  { text: "Advanced analytics dashboard", included: true },
  { text: "Short links (go.liffio.com) + click tracking", included: true },
  { text: "Lead capture from DMs & link clicks", included: true },
  { text: "Post scheduler (Instagram feed)", included: true },
  { text: "Priority email support", included: true },
];

const businessFeatures: PlanFeature[] = [
  { text: "10 Instagram accounts", included: true },
  { text: "Unlimited automated DMs", included: true },
  { text: "Everything in Pro", included: true },
  { text: "Full conversion analytics (comment → sale)", included: true },
  { text: "Instagram account-level insights", included: true },
  { text: "External API keys (plan-gated)", included: true },
  { text: "Team members (up to 5 seats)", included: true },
  { text: "Branded short links with UTM attribution", included: true },
  { text: "Follow-up DM sequences", included: true },
  { text: "Priority support + onboarding call", included: true },
];

const agencyFeatures: PlanFeature[] = [
  { text: "Unlimited Instagram accounts", included: true },
  { text: "Custom DM volume limits", included: true },
  { text: "Agency white-label workspaces", included: true },
  { text: "Client sub-workspaces (CLIENT role)", included: true },
  { text: "Dedicated account manager", included: true },
  { text: "Full API access & webhooks", included: true },
  { text: "Custom integrations & CRM sync", included: true },
  { text: "Affiliate program management", included: true },
  { text: "SLA-backed priority support", included: true },
  { text: "Volume & multi-workspace pricing", included: true },
];

const globalPricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthly: usdMonthly(0),
    annual: usdMonthly(0),
    description: "Get started with comment-to-DM automation — no credit card required.",
    badge: null,
    highlight: false,
    popular: false,
    features: freeFeatures,
    cta: "Start for Free",
    href: signup,
  },
  {
    name: "Starter",
    monthly: usdMonthly(9),
    annual: usdAnnual(9),
    description: "More accounts and DMs for growing creators ready to scale engagement.",
    badge: null,
    highlight: false,
    popular: false,
    features: starterFeatures,
    cta: "Get Starter",
    href: signup,
  },
  {
    name: "Pro",
    monthly: usdMonthly(29),
    annual: usdAnnual(29),
    description: "Everything creators need to convert comments into sales on autopilot.",
    badge: "Most Popular",
    highlight: true,
    popular: true,
    features: proFeatures,
    cta: "Get Pro",
    href: signup,
  },
  {
    name: "Business",
    monthly: usdMonthly(79),
    annual: usdAnnual(79),
    description: "Full growth toolkit for power users, brands, and high-volume creators.",
    badge: null,
    highlight: false,
    popular: false,
    features: businessFeatures,
    cta: "Get Business",
    href: signup,
  },
  {
    name: "Agency",
    monthly: usdMonthly(299),
    annual: usdAnnual(299),
    description: "White-label workspaces for agencies managing multiple client brands.",
    badge: null,
    highlight: false,
    popular: false,
    features: agencyFeatures,
    cta: "Get Agency",
    href: signup,
  },
];

const indiaPricingPlans: PricingPlan[] = [
  {
    name: "Free",
    monthly: inrMonthly(0),
    annual: inrMonthly(0),
    description: "Get started with comment-to-DM automation — no credit card required.",
    badge: null,
    highlight: false,
    popular: false,
    features: freeFeatures,
    cta: "Start for Free",
    href: signup,
  },
  {
    name: "Starter",
    monthly: inrMonthly(499),
    annual: inrAnnual(499),
    priceNote: "₹49 first month",
    description: "More accounts and DMs for growing creators ready to scale engagement.",
    badge: null,
    highlight: false,
    popular: false,
    features: starterFeatures,
    cta: "Get Starter",
    href: signup,
  },
  {
    name: "Pro",
    monthly: inrMonthly(999),
    annual: inrAnnual(999),
    description: "Everything creators need to convert comments into sales on autopilot.",
    badge: "Most Popular",
    highlight: true,
    popular: true,
    features: proFeatures,
    cta: "Get Pro",
    href: signup,
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
    href: signup,
  },
  {
    name: "Agency",
    monthly: inrMonthly(9999),
    annual: inrAnnual(9999),
    description: "White-label workspaces for agencies managing multiple client brands.",
    badge: null,
    highlight: false,
    popular: false,
    features: agencyFeatures,
    cta: "Get Agency",
    href: signup,
  },
];

/** @deprecated Use getPricingPlans(region) for region-aware pricing. */
export const pricingPlans = globalPricingPlans;

export function getPricingPlans(region: PricingRegion): PricingPlan[] {
  return region === "india" ? indiaPricingPlans : globalPricingPlans;
}

export const pricingPerks = [
  { icon: "🔒", label: "No contracts" },
  { icon: "↩️", label: "Cancel anytime" },
  { icon: "💳", label: "No credit card for Free" },
  { icon: "⚡", label: "Instant setup" },
  { icon: "🌍", label: "Stripe + Razorpay billing" },
];

export const featureCategories = [
  {
    name: "Comment-to-DM Automation",
    description: metaCopy.pricingCategoryApis,
    features: [
      { name: "Keyword comment triggers", free: true, starter: true, pro: true, business: true, agency: true },
      { name: "Public comment auto-replies", free: true, starter: true, pro: true, business: true, agency: true },
      { name: "Story mention & reaction triggers", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Live stream comment-to-DM", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Welcome DM for new followers", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Multi-step DM flows with logic", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Follow-up DM sequences", free: false, starter: false, pro: false, business: true, agency: true },
    ],
  },
  {
    name: "Growth Toolkit",
    description: "Bio links, short links, scheduling, and analytics — all in one workspace.",
    features: [
      { name: "Bio link pages (bio.liffio.com)", free: true, starter: true, pro: true, business: true, agency: true },
      { name: "Branded short links (go.liffio.com)", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Click & referrer tracking", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Lead capture from DMs & clicks", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Post scheduler (Instagram feed)", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Conversion analytics (comment → sale)", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "Instagram account insights", free: false, starter: false, pro: false, business: true, agency: true },
    ],
  },
  {
    name: "Team, API & Agency",
    description: "Collaborate with your team, integrate via API, or manage client workspaces at scale.",
    features: [
      { name: "Team members", free: "1", starter: "2", pro: "3", business: "5", agency: "Unlimited" },
      { name: "Role-based access (RBAC)", free: false, starter: false, pro: true, business: true, agency: true },
      { name: "External API keys", free: false, starter: false, pro: false, business: true, agency: true },
      { name: "Agency white-label workspaces", free: false, starter: false, pro: false, business: false, agency: true },
      { name: "Client sub-workspaces", free: false, starter: false, pro: false, business: false, agency: true },
      { name: "Affiliate program (50% commission)", free: false, starter: true, pro: true, business: true, agency: true },
    ],
  },
];

export const comparisonPlanNames = ["Free", "Starter", "Pro", "Business", "Agency"] as const;

type PlanColumn = (typeof comparisonPlanNames)[number];

export function getPricingFaqs(region: PricingRegion) {
  const isIndia = region === "india";

  return [
    {
      q: "Is the Free plan really free?",
      a: isIndia
        ? "Yes. Free is ₹0/month with no credit card required. You get 1,000 automated DMs per month, comment keyword triggers, public auto-replies, a bio link page, and basic analytics."
        : "Yes. Free is $0/month with no credit card required. You get 1,000 automated DMs per month, comment keyword triggers, public auto-replies, a bio link page, and basic analytics.",
    },
    {
      q: "What plans does Liffio offer?",
      a: isIndia
        ? "Liffio has five tiers: Free (₹0), Starter (₹499/mo, ₹49 first month), Pro (₹999/mo), Business (₹2,499/mo), and Agency (₹9,999/mo). Each tier unlocks more accounts, DMs, automations, and growth tools."
        : "Liffio has five tiers: Free ($0), Starter ($9/mo), Pro ($29/mo), Business ($79/mo), and Agency ($299/mo). Each tier unlocks more accounts, DMs, automations, and growth tools.",
    },
    {
      q: "Can I pay monthly, quarterly, or annually?",
      a: "Yes. Paid plans are available on monthly or annual billing. Annual plans save 20% compared to monthly. Billing is handled securely via Stripe (global) or Razorpay (India).",
    },
    {
      q: "Is Liffio safe for my Instagram account?",
      a: metaCopy.pricingFaqSafe,
    },
    {
      q: "What counts as one DM?",
      a: "Each automated message sent to a unique user counts as one DM. Replies within the same conversation thread do not count as additional DMs.",
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Yes. You can change plans at any time from your workspace billing settings. Upgrades take effect immediately; downgrades apply at the end of your current billing period.",
    },
    {
      q: "What's included in the Agency plan?",
      a: "Agency includes white-label workspaces, client sub-workspaces with restricted CLIENT roles, unlimited accounts, custom DM limits, dedicated account management, API access, and volume pricing tailored to your agency.",
    },
    {
      q: "Do you offer a Creators Program?",
      a: isIndia
        ? "Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan (₹2,499/mo value) at no cost in exchange for active platform usage."
        : "Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan ($79/mo value) at no cost in exchange for active platform usage.",
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
