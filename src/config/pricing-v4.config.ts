/**
 * The plan sheet: card copy, limits and the comparison matrix.
 *
 * 🔴 READ THIS BEFORE CHANGING A ROW.
 *
 * Rewritten 2026-09-25 to the plans the owner confirmed live on production.
 * Every bullet, limit and matrix row below comes from that table and nothing
 * else: a capability that is not in it does not get a row. docs/decisions/0005
 * records the table and what it replaced.
 *
 * Deliberately NOT stated anywhere on the site:
 *
 *   Agency white label beyond "agency branding and hide Liffio branding"
 *     client workspaces, custom domains, domain verification, short link
 *     domains and theme colour are not switched on
 *   Any DM cap                  DMs are unlimited on every plan, Free included
 *   The Creator plan as a tier  it is given by Liffio, never sold
 *
 * Prices are NOT here. They come live from `/marketing/plans`, so a repricing
 * moves every card and `npm run check:prices` guards every figure.
 *
 * 🚩 This sheet BYPASSES `sanitizeFeatures()` and feeds BOTH the pricing page
 * and the homepage cards (via `applyV4Content` in marketing-plans.server), so
 * it is the one place plan copy is written.
 */

/**
 * `**bold**` segments are rendered with emphasis, as `<b>` does in the design.
 *
 * `{beta}` is the one other inline marker: it renders a small Beta pill where it
 * sits. The AI features are the only thing wearing it: they ship, but they are
 * not out of beta, and the card is where a buyer decides. `stripEmphasis()`
 * removes both markers for plain-text surfaces.
 */
export type V4Feature = string;

/** `beta` draws the same pill beside the limit's label. */
export type V4Limit = { label: string; value: string; beta?: boolean };

export type V4PlanContent = {
  /** The `.pfor` line: who this tier is for, one sentence. */
  audience: string;
  /** The corner flag. `brand` paints the gradient, `ink` the solid dark pill. */
  flag?: { text: string; tone: "brand" | "ink" };
  cta: string;
  /**
   * In-page anchor instead of signup.
   *
   * Unused today. Agency carried `#agency-break-even` behind a "See the maths"
   * label; the label is now "Choose Agency", which promises a checkout, so the
   * anchor had to go with it. The break-even section still renders on /pricing
   * - nothing links to it from the cards any more.
   */
  ctaAnchor?: string;
  includedLabel: string;
  features: V4Feature[];
  limitsLabel: string;
  limits: V4Limit[];
  /**
   * Limits on calls through the Liffio API, under their own heading. They do
   * NOT limit scheduling or automations in the app, which is why they are not
   * mixed into `limits`.
   */
  apiLimitsLabel: string;
  apiLimits: V4Limit[];
};

export const V4_PLAN_CONTENT: Record<string, V4PlanContent> = {
  Free: {
    audience:
      "Test whether comment-to-DM converts on your own audience before paying anything.",
    cta: "Start free",
    includedLabel: "Included",
    features: [
      "**Unlimited DMs**, on every plan",
      "**Comment to DM automation**: keywords, excluded keywords, any comment, public replies, reply variants, DM button",
      "**Full post scheduler**: feed, reels, stories, carousels, media library, first comment, music, alt text, cover selection, timezone scheduling",
      "Leads list and timeline",
      "Bio link and short links",
      "Team invites and roles",
      "Affiliate programme, audit log, two factor authentication",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Workflows", value: "3" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "0" },
      { label: "Team members", value: "1" },
      { label: "AI tokens / month", value: "1,000", beta: true },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "Requests / day", value: "0" },
      { label: "API keys", value: "0" },
      { label: "Automations / day", value: "0" },
      { label: "Scheduled posts / day", value: "0" },
    ],
  },

  Starter: {
    audience: "One creator running a single account as a real acquisition channel.",
    cta: "Choose Starter",
    includedLabel: "Everything in Free, plus",
    features: [
      "**Trigger blocks**: the multi-keyword builder",
      "**Turn off Liffio branding**",
      "Follow before DM",
      "**Bio link styling**: custom slug, hide badge, icons, thumbnails, item visibility, click tracking",
      "Custom short link slugs",
      "Lead export",
      "Conversion rate and time series analytics",
      "**API access**",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Workflows", value: "25" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "2" },
      { label: "Team members", value: "3" },
      { label: "AI tokens / month", value: "10,000", beta: true },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "Requests / day", value: "200" },
      { label: "API keys", value: "5" },
      { label: "Automations / day", value: "50" },
      { label: "Scheduled posts / day", value: "50" },
    ],
  },

  Growth: {
    audience: "A serious creator posting consistently and deciding from data.",
    flag: { text: "The new step", tone: "brand" },
    cta: "Choose Growth",
    includedLabel: "Everything in Starter, plus",
    features: [
      "**Bulk upload**",
      "**Caption templates, schedule templates, hashtag groups**",
      "**Post metrics, video metrics, profile outcomes**",
      "AI insights{beta}",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Workflows", value: "100" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "5" },
      { label: "Team members", value: "5" },
      { label: "AI tokens / month", value: "30,000", beta: true },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "Requests / day", value: "500" },
      { label: "API keys", value: "10" },
      { label: "Automations / day", value: "150" },
      { label: "Scheduled posts / day", value: "150" },
    ],
  },

  Business: {
    audience: "A team that needs approvals, custom permissions and proof of what worked.",
    flag: { text: "For teams", tone: "ink" },
    cta: "Choose Business",
    includedLabel: "Everything in Growth, plus",
    features: [
      "**Approval workflow**: approve posts, activity log",
      "**Custom permissions**",
      "Analytics export",
      "**Automation attribution**",
      "AI token rollover, up to 25,000{beta}",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Workflows", value: "250" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "10" },
      { label: "Team members", value: "15" },
      { label: "AI tokens / month", value: "75,000", beta: true },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "Requests / day", value: "1,000" },
      { label: "API keys", value: "15" },
      { label: "Automations / day", value: "400" },
      { label: "Scheduled posts / day", value: "400" },
    ],
  },

  Agency: {
    audience: "Studios and multi-brand operators running 10 to 20 Instagram accounts.",
    flag: { text: "20 workspaces", tone: "ink" },
    cta: "Choose Agency",
    includedLabel: "Everything in Business, plus",
    features: [
      "**20 workspaces** on one bill and one billing date",
      "Agency branding and hide Liffio branding",
      "**Every limit is per workspace**, across all 20",
      "Cheaper per workspace than a single Growth plan",
    ],
    // Every figure below is Business's, per workspace. Stated plainly rather
    // than as "250 × 20", which reads as one pooled allowance of 5,000.
    limitsLabel: "Per workspace, across 20",
    limits: [
      { label: "Workflows", value: "250" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "10" },
      { label: "Team members", value: "15" },
      { label: "AI tokens / month", value: "75,000", beta: true },
    ],
    apiLimitsLabel: "API limits, per workspace",
    apiLimits: [
      { label: "Requests / day", value: "1,000" },
      { label: "API keys", value: "15" },
      { label: "Automations / day", value: "400" },
      { label: "Scheduled posts / day", value: "400" },
    ],
  },
};

/** Inline markers, stripped, for surfaces that render plain feature text. */
export function stripEmphasis(feature: V4Feature): string {
  return feature.replace(/\*\*/g, "").replace(/\s*\{beta\}/g, " (Beta)");
}

/**
 * The V4 bullets as the `PlanFeature[]` shape the homepage cards expect.
 *
 * Every entry is `included: true`. The sheet lists only what a tier HAS, and
 * there is no exclusion list, so the homepage shows no ✗ rows.
 *
 * The homepage card has no "Everything in Free, plus" heading of its own, and
 * every paid tier's bullets are only what it ADDS. Without the heading, Starter
 * would read as eight features where Free has twenty, so it leads the list.
 */
export function v4FeatureList(planName: string): Array<{ text: string; included: boolean }> | null {
  const content = V4_PLAN_CONTENT[planName];
  if (!content) return null;
  const lead = content.includedLabel === "Included" ? [] : [content.includedLabel];
  return [...lead, ...content.features].map((feature) => ({
    text: stripEmphasis(feature),
    included: true,
  }));
}

// ── The capability matrix ────────────────────────────────────────────────────
//
// Only capabilities named in the live plan table, in plain words. `true` renders
// a tick, `false` a dash, a string renders the value.

type MatrixRow = {
  name: string;
  free: boolean | string;
  starter: boolean | string;
  growth: boolean | string;
  business: boolean | string;
  agency: boolean | string;
};

const all = (name: string): MatrixRow => ({
  name,
  free: true,
  starter: true,
  growth: true,
  business: true,
  agency: true,
});

/** Starter and up: Free excluded, every paid tier included. */
const paid = (name: string): MatrixRow => ({
  name,
  free: false,
  starter: true,
  growth: true,
  business: true,
  agency: true,
});

/** Growth and up. */
const growthUp = (name: string): MatrixRow => ({
  name,
  free: false,
  starter: false,
  growth: true,
  business: true,
  agency: true,
});

/** Business and up. */
const businessUp = (name: string): MatrixRow => ({
  name,
  free: false,
  starter: false,
  growth: false,
  business: true,
  agency: true,
});

const values = (
  name: string,
  free: string,
  starter: string,
  growth: string,
  business: string,
  agency: string,
): MatrixRow => ({ name, free, starter, growth, business, agency });

/** Agency only. */
const agencyOnly = (name: string): MatrixRow => ({
  name,
  free: false,
  starter: false,
  growth: false,
  business: false,
  agency: true,
});

export const V4_FEATURE_CATEGORIES: ReadonlyArray<{
  name: string;
  description?: string;
  /** Draws a Beta pill beside the group name. */
  beta?: boolean;
  features: MatrixRow[];
}> = [
  {
    // First, on purpose: it is the one line that is the same on every plan.
    name: "DMs",
    description: "No cap on any plan, Free included.",
    features: [values("Automated DMs", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited")],
  },
  {
    name: "Comment to DM automation",
    features: [
      all("Keyword triggers"),
      all("Excluded keywords"),
      all("Any comment trigger"),
      all("Public replies"),
      all("Reply variants"),
      all("DM button"),
      paid("Trigger blocks: the multi-keyword builder"),
      paid("Follow before DM"),
      paid("Turn off Liffio branding"),
    ],
  },
  {
    name: "Post scheduler",
    features: [
      all("Feed posts, reels, stories, carousels"),
      all("Media library"),
      all("First comment, music, alt text"),
      all("Cover selection, timezone scheduling"),
      growthUp("Bulk upload"),
      growthUp("Caption templates"),
      growthUp("Schedule templates"),
      growthUp("Hashtag groups"),
      businessUp("Approval workflow and approve posts"),
      businessUp("Activity log"),
    ],
  },
  {
    name: "Bio link & short links",
    features: [
      all("Bio link"),
      paid("Bio link custom slug"),
      paid("Hide the bio link badge"),
      paid("Bio link icons, thumbnails, item visibility"),
      paid("Bio link click tracking"),
      all("Short links"),
      paid("Short link custom slugs"),
    ],
  },
  {
    name: "Leads",
    features: [all("Leads list and timeline"), paid("Lead export")],
  },
  {
    name: "Analytics",
    features: [
      paid("Conversion rate"),
      paid("Time series analytics"),
      growthUp("Post metrics"),
      growthUp("Video metrics"),
      growthUp("Profile outcomes"),
      businessUp("Analytics export"),
      businessUp("Automation attribution"),
    ],
  },
  {
    name: "AI",
    beta: true,
    features: [
      values("AI tokens per month", "1,000", "10,000", "30,000", "75,000", "75,000"),
      growthUp("AI insights"),
      { name: "AI token rollover", free: false, starter: false, growth: false, business: "Up to 25,000", agency: "Up to 25,000" },
    ],
  },
  {
    name: "Team & account",
    features: [
      all("Team invites and roles"),
      businessUp("Custom permissions"),
      all("Audit log"),
      all("Two factor authentication"),
      all("Affiliate programme"),
    ],
  },
  {
    name: "API limits",
    description: "Calls through the Liffio API, per workspace. Scheduling and automations in the app are not limited by these.",
    features: [
      paid("API access"),
      values("API requests per day", "0", "200", "500", "1,000", "1,000"),
      values("API keys", "0", "5", "10", "15", "15"),
      values("Automations per day via API", "0", "50", "150", "400", "400"),
      values("Scheduled posts per day via API", "0", "50", "150", "400", "400"),
    ],
  },
  {
    name: "Agency",
    features: [
      agencyOnly("One bill and one billing date for all 20 workspaces"),
      agencyOnly("Agency branding and hide Liffio branding"),
    ],
  },
  {
    name: "Limits: per workspace, never pooled",
    features: [
      values("Workspaces", "1", "1", "1", "1", "20"),
      values("Automation workflows", "3", "25", "100", "250", "250"),
      values("DM follow-ups", "0", "2", "5", "10", "10"),
      values("Team members", "1", "3", "5", "15", "15"),
    ],
  },
];
