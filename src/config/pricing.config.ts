import { siteConfig } from "./site.config";

export type PlanFeature = { text: string; included: boolean };

export type PricingPlan = {
  name: string;
  monthly: string;
  annual: string;
  description: string;
  badge: string | null;
  highlight: boolean;
  popular: boolean;
  features: PlanFeature[];
  cta: string;
  href: string;
};

const signup = siteConfig.urls.appSignup;

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthly: "$0",
    annual: "$0",
    description: "Get started with comment-to-DM automation — no credit card required.",
    badge: null,
    highlight: false,
    popular: false,
    features: [
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
    ],
    cta: "Start for Free",
    href: signup,
  },
  {
    name: "Pro",
    monthly: "$11",
    annual: "$9",
    description: "Everything creators need to convert comments into sales on autopilot.",
    badge: "Most Popular",
    highlight: true,
    popular: true,
    features: [
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
    ],
    cta: "Get Pro",
    href: signup,
  },
  {
    name: "Business",
    monthly: "$79",
    annual: "$63",
    description: "Full growth toolkit for power users, brands, and high-volume creators.",
    badge: null,
    highlight: false,
    popular: false,
    features: [
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
    ],
    cta: "Get Business",
    href: signup,
  },
  {
    name: "Agency",
    monthly: "Custom",
    annual: "Custom",
    description: "White-label workspaces for agencies managing multiple client brands.",
    badge: null,
    highlight: false,
    popular: false,
    features: [
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
    ],
    cta: "Contact Sales",
    href: "mailto:support@liffio.com",
  },
];

import { metaCopy } from "@/config/meta-copy";

export const pricingPerks = [
  { icon: "🔒", label: "No contracts" },
  { icon: "↩️", label: "Cancel anytime" },
  { icon: "💳", label: "No credit card for Starter" },
  { icon: "⚡", label: "Instant setup" },
  { icon: "🌍", label: "Stripe + Razorpay billing" },
];

export const featureCategories = [
  {
    name: "Comment-to-DM Automation",
    description: metaCopy.pricingCategoryApis,
    features: [
      { name: "Keyword comment triggers", starter: true, pro: true, business: true, agency: true },
      { name: "Public comment auto-replies", starter: true, pro: true, business: true, agency: true },
      { name: "Story mention & reaction triggers", starter: false, pro: true, business: true, agency: true },
      { name: "Live stream comment-to-DM", starter: false, pro: true, business: true, agency: true },
      { name: "Welcome DM for new followers", starter: false, pro: true, business: true, agency: true },
      { name: "Multi-step DM flows with logic", starter: false, pro: true, business: true, agency: true },
      { name: "Follow-up DM sequences", starter: false, pro: false, business: true, agency: true },
    ],
  },
  {
    name: "Growth Toolkit",
    description: "Bio links, short links, scheduling, and analytics — all in one workspace.",
    features: [
      { name: "Bio link pages (bio.liffio.com)", starter: true, pro: true, business: true, agency: true },
      { name: "Branded short links (go.liffio.com)", starter: false, pro: true, business: true, agency: true },
      { name: "Click & referrer tracking", starter: false, pro: true, business: true, agency: true },
      { name: "Lead capture from DMs & clicks", starter: false, pro: true, business: true, agency: true },
      { name: "Post scheduler (Instagram feed)", starter: false, pro: true, business: true, agency: true },
      { name: "Conversion analytics (comment → sale)", starter: false, pro: true, business: true, agency: true },
      { name: "Instagram account insights", starter: false, pro: false, business: true, agency: true },
    ],
  },
  {
    name: "Team, API & Agency",
    description: "Collaborate with your team, integrate via API, or manage client workspaces at scale.",
    features: [
      { name: "Team members", starter: "1", pro: "3", business: "5", agency: "Unlimited" },
      { name: "Role-based access (RBAC)", starter: false, pro: true, business: true, agency: true },
      { name: "External API keys", starter: false, pro: false, business: true, agency: true },
      { name: "Agency white-label workspaces", starter: false, pro: false, business: false, agency: true },
      { name: "Client sub-workspaces", starter: false, pro: false, business: false, agency: true },
      { name: "Affiliate program (50% commission)", starter: false, pro: true, business: true, agency: true },
    ],
  },
];

export const pricingFaqs = [
  {
    q: "Is the Starter plan really free?",
    a: "Yes. Starter is $0/month with no credit card required. You get 1,000 automated DMs per month, comment keyword triggers, public auto-replies, a bio link page, and basic analytics.",
  },
  {
    q: "What plans does Liffio offer?",
    a: "Liffio has four tiers: Starter (free), Pro ($11/mo), Business ($79/mo), and Agency (custom pricing). Each tier unlocks more accounts, DMs, automations, and growth tools.",
  },
  {
    q: "Can I pay monthly, quarterly, or annually?",
    a: "Yes. Pro and Business plans are available on monthly or annual billing. Annual plans save 20% compared to monthly. Billing is handled securely via Stripe (global) or Razorpay (India).",
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
    a: "Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan ($79/mo value) at no cost in exchange for active platform usage.",
  },
];
