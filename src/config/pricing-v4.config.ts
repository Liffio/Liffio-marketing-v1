/**
 * The V4 pricing design, shipped verbatim.
 *
 * 🔴 READ THIS BEFORE CHANGING A ROW.
 *
 * This sheet is transcribed from the V4 design prototype and `PRICING_PACKAGES_V4.md`
 * on an explicit decision to ship the design as drawn. Neither source lives in
 * this repo: both carry unreleased pricing and this repo is public. It is therefore the ONE
 * place on the marketing site that deliberately states entitlements the live
 * `packages` catalogue does not grant today. `docs/decisions/0004` records the
 * list and the owner of each.
 *
 * Known divergences from production, all intentional and all recorded:
 *
 *   API keys 10 / API requests per day 5,000    packages grant 0 and 0 (D4)
 *   Free "500 DMs / month"                      nothing meters DMs (blocker 25.3)
 *   AI token figures and rollover               unverified against ai_token_plan_configs
 *   Agency white-label / client sub-workspaces  all seven agency:* caps granted to nobody (B6)
 *
 * The design's launch/standard price mechanic is NOT here. It was removed on
 * instruction: there is one price per tier - today's catalogue price - and no
 * post-window figure, so the page never promises a price change it cannot honour.
 *
 * 🚩 This sheet BYPASSES `sanitizeFeatures()`, and it now feeds BOTH the pricing
 * page and the homepage cards (via `applyV4Content` in marketing-plans.server).
 * That guard still runs on the `/marketing/plans` payload first, so the API
 * bullets are still sanitized before this replaces them - but nothing the site
 * renders is protected by it any more. The divergences above are visible here,
 * in one file, rather than reintroduced somewhere the guard was expected to
 * catch them.
 */

/** `**bold**` segments are rendered with emphasis, as `<b>` does in the design. */
export type V4Feature = string;

export type V4Limit = { label: string; value: string };

export type V4PlanContent = {
  /** The `.pfor` line: who this tier is for, one sentence. */
  audience: string;
  /** The corner flag. `brand` paints the gradient, `ink` the solid dark pill. */
  flag?: { text: string; tone: "brand" | "ink" };
  cta: string;
  /** In-page anchor instead of signup, as Agency uses for "See the maths". */
  ctaAnchor?: string;
  includedLabel: string;
  features: V4Feature[];
  limitsLabel: string;
  limits: V4Limit[];
};

export const V4_PLAN_CONTENT: Record<string, V4PlanContent> = {
  Free: {
    audience:
      "Test whether comment-to-DM converts on your own audience before paying anything.",
    cta: "Start free",
    includedLabel: "Included",
    features: [
      "**A complete automation loop** — keyword trigger, any-comment trigger, public auto-reply",
      "Bio link page, Liffio badge shown",
      "Lead capture by username",
      "Overview analytics, 7-day history",
      "AI Insights + zero-token answers",
      "Affiliate programme, 50% recurring",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "3" },
      { label: "DMs / month", value: "500" },
      { label: "Follow-ups", value: "0" },
      { label: "Seats", value: "1" },
      { label: "AI tokens", value: "1,000" },
    ],
  },

  Starter: {
    audience: "One creator running a single account as a real acquisition channel.",
    cta: "Choose Starter",
    includedLabel: "Everything in Free, plus",
    features: [
      "**Unlimited DMs** — no quota, no contact caps",
      "All 15 automation capabilities",
      "**Follow-up sequences** — 2 per automation",
      "Full post scheduler + media library",
      "Short links, lead emails, CSV export",
      "Bio link unlocked, **badge removed**",
      "30-day analytics, conversion rate",
      "The full Lyra creative AI suite",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "25" },
      { label: "DMs / month", value: "Unlimited" },
      { label: "Follow-ups", value: "2" },
      { label: "Seats", value: "3" },
      { label: "AI tokens", value: "10,000" },
    ],
  },

  Growth: {
    audience:
      "A serious creator posting consistently and deciding from data — still working alone.",
    flag: { text: "The new step", tone: "brand" },
    cta: "Choose Growth",
    includedLabel: "Everything in Starter, plus",
    features: [
      "**Instagram post analytics** — reach, views, saves, shares, engagement rate",
      "Video metrics and profile outcomes",
      "**Best-time-to-post heatmap** from your own data",
      "90-day analytics history",
      "**Caption templates, hashtag groups, schedule templates**",
      "Bulk upload",
      "**5 follow-up messages** per automation",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "75" },
      { label: "DMs / month", value: "Unlimited" },
      { label: "Follow-ups", value: "5" },
      { label: "Seats", value: "5" },
      { label: "AI tokens", value: "30,000" },
    ],
  },

  Business: {
    audience: "More than one person touches the account, and someone must answer for results.",
    flag: { text: "For teams", tone: "ink" },
    cta: "Choose Business",
    includedLabel: "Everything in Growth, plus",
    features: [
      "**Team management** — invite, assign roles, revoke",
      "Per-user, per-module, per-action access control and ABAC",
      "**Post approval workflow** + activity log",
      "**Per-automation attribution** — DMs → clicks → leads",
      "Analytics export",
      "External API — 10 keys, 5,000 requests/day",
      "Proactive AI growth alerts",
      "AI token rollover up to 25,000",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "150" },
      { label: "DMs / month", value: "Unlimited" },
      { label: "Follow-ups", value: "5" },
      { label: "Seats", value: "15" },
      { label: "AI tokens", value: "75,000" },
    ],
  },

  Agency: {
    audience: "Studios and multi-brand operators running 10 to 20 Instagram accounts.",
    flag: { text: "20 workspaces", tone: "ink" },
    cta: "See the maths",
    ctaAnchor: "#agency-break-even",
    includedLabel: "Twenty complete Business workspaces",
    features: [
      "**Every workspace is a full Business workspace** — same features, same limits",
      "One subscription, one invoice, one renewal date",
      "**Slot-based allocation** — create workspaces as you win clients",
      "Workspace switching from a single login",
      "**Cheaper per workspace than a single Growth plan**",
    ],
    limitsLabel: "Per workspace",
    limits: [
      { label: "Automations", value: "150 × 20" },
      { label: "DMs / month", value: "Unlimited" },
      { label: "Seats", value: "15 × 20" },
      { label: "API requests/day", value: "5,000 × 20" },
      { label: "AI tokens", value: "75,000 × 20" },
    ],
  },
};

/** `**bold**` markers, stripped — for surfaces that render plain feature text. */
export function stripEmphasis(feature: V4Feature): string {
  return feature.replace(/\*\*/g, "");
}

/**
 * The V4 bullets as the `PlanFeature[]` shape the homepage cards expect.
 *
 * Every entry is `included: true`. The V4 sheet lists only what a tier HAS —
 * there is no exclusion list — so the homepage's ✗ rows disappear along with
 * the claims that produced them ("Story & multi-step flows" on Free, which
 * ADR 0002 already flagged as half-wrong).
 */
export function v4FeatureList(planName: string): Array<{ text: string; included: boolean }> | null {
  const content = V4_PLAN_CONTENT[planName];
  if (!content) return null;
  return content.features.map((feature) => ({ text: stripEmphasis(feature), included: true }));
}

// ── The capability matrix ────────────────────────────────────────────────────
//
// All 87 rows of the V4 design, in its groups and its wording. `true` renders a
// tick, `false` a dash, a string renders the value.

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

/** Free excluded, every paid tier included — the commonest shape in the sheet. */
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

export const V4_FEATURE_CATEGORIES: ReadonlyArray<{
  name: string;
  description?: string;
  features: MatrixRow[];
}> = [
  {
    name: "Automation",
    features: [
      all("Comment keyword trigger"),
      all("Any-comment trigger"),
      all("Public comment auto-reply"),
      all("Post scope: all posts"),
      paid("Post scope: next / specific post"),
      paid("Excluded keywords"),
      paid("DM button + link"),
      paid("DM button click tracking"),
      paid("Reply variants"),
      paid("Follow-before-DM"),
      paid("Structured trigger blocks"),
      { name: "DM follow-up sequences", free: false, starter: "2", growth: "5", business: "5", agency: "5" },
      all("Auto-retry & account-trust protection"),
    ],
  },
  {
    name: "DMs",
    features: [
      values("Automated DM sending", "500/mo", "Unlimited", "Unlimited", "Unlimited", "Unlimited"),
      all("DM retry with backoff"),
      all("Instagram trust-tier protection"),
    ],
  },
  {
    name: "Scheduler",
    features: [
      paid("Feed posts, Reels, carousels"),
      paid("Trial reels, collaborators, first comment"),
      paid("Instagram music on Reels"),
      paid("Alt text, cover selection, thumbnail offset"),
      paid("Location tag, timezone scheduling"),
      paid("Media library"),
      growthUp("Best-time-to-post heatmap"),
      growthUp("Caption templates"),
      growthUp("Hashtag groups"),
      growthUp("Posting schedule templates"),
      growthUp("Bulk upload"),
      businessUp("Approval workflow + approve posts"),
      businessUp("Post activity log"),
    ],
  },
  {
    name: "Bio link & short links",
    features: [
      all("Bio link page, link items, socials, ordering"),
      paid("Bio link custom slug, icons, thumbnails, visibility"),
      paid("Bio link click analytics"),
      paid("Remove “Powered by Liffio” badge"),
      paid("Short links + custom slug + edit destination"),
      paid("Short link click tracking"),
      paid("Short link lead attribution"),
    ],
  },
  {
    name: "Leads",
    features: [
      all("Lead capture + dedupe"),
      all("Lead identity (username)"),
      paid("Lead email addresses"),
      paid("Click state, follow state"),
      paid("Source media, trigger provenance"),
      paid("Lead CSV export"),
    ],
  },
  {
    name: "Analytics",
    features: [
      all("Overview — DMs, leads, clicks, automations"),
      { name: "Time-series charts", free: false, starter: "30d", growth: "90d", business: "90d", agency: "90d" },
      paid("Conversion rate"),
      growthUp("Post metrics — reach, views, saves, shares, ER"),
      growthUp("Video metrics"),
      growthUp("Profile outcomes"),
      businessUp("Per-automation attribution"),
      businessUp("Analytics export"),
    ],
  },
  {
    name: "Lyra AI",
    features: [
      all("AI Insights across dashboard, analytics, scheduler"),
      all("Zero-token quick answers"),
      paid("Caption, hashtag, content-idea assist"),
      paid("Media analyze — summary, OCR, vision"),
      paid("Automation Copilot + keyword suggest"),
      paid("DM message assist, bio text assist"),
      paid("Creator Assistant"),
      businessUp("Proactive AI growth alerts"),
      values("Monthly tokens per workspace", "1,000", "10,000", "30,000", "75,000", "75,000"),
      { name: "AI token rollover", free: false, starter: false, growth: false, business: "25,000", agency: "25,000" },
    ],
  },
  {
    name: "Team, permissions & approval",
    features: [
      all("View members"),
      businessUp("Invite / remove members, assign roles"),
      businessUp("Resend / revoke invites"),
      businessUp("Per-user × per-module × per-action access control"),
      businessUp("Per-capability overrides — user and workspace"),
      businessUp("ABAC policies"),
    ],
  },
  {
    name: "API",
    features: [
      businessUp("API key create / view / revoke"),
      businessUp("API docs access, usage stats, key expiry"),
    ],
  },
  {
    name: "Limits — per workspace, never pooled",
    features: [
      values("Workspaces per subscription", "1", "1", "1", "1", "20"),
      values("Instagram accounts per workspace", "1", "1", "1", "1", "1 each"),
      values("Automations", "3", "25", "75", "150", "150"),
      values("DMs per month", "500", "Unlimited", "Unlimited", "Unlimited", "Unlimited"),
      values("Follow-ups per automation", "0", "2", "5", "5", "5"),
      values("Team seats", "1", "3", "5", "15", "15"),
      values("Scheduled posts per day", "3", "30", "100", "200", "200"),
      values("API keys", "0", "0", "0", "10", "10"),
      values("API requests per day", "0", "0", "0", "5,000", "5,000"),
      values("Analytics history", "7 days", "30 days", "90 days", "90 days", "90 days"),
      values("Lead storage", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"),
    ],
  },
  {
    name: "Account, notifications & programmes",
    features: [
      all("Instagram connect, workspace rename, workspace switch"),
      all("Drafts autosave"),
      all("In-app notifications"),
      all("Two-factor authentication"),
      all("Billing self-service — invoices, portal, cancel"),
      all("Affiliate programme — 50% recurring"),
      all("Creator Program eligibility"),
      values("Support", "Community", "Email", "Email", "Priority", "Priority"),
    ],
  },
];
