/**
 * The plan sheet: card copy, limits and the comparison matrix.
 *
 * 🔴 READ THIS BEFORE CHANGING A ROW.
 *
 * Rewritten 2026-10-03 to the plans live on production, chatbots included.
 * Every bullet, limit and matrix row below comes from the owner's plan table
 * (docs/decisions/0006) and nothing else: a capability that is not in it does
 * not get a row.
 *
 * Deliberately NOT stated anywhere on the site:
 *
 *   Agency white label beyond "agency branding and hide Liffio branding"
 *   Any DM cap                  DMs are unlimited on every plan, Free included
 *   The Creator plan as a tier  it is given by Liffio, never sold
 *   Buttons per step as a tier difference: 13 is Instagram's own cap, the
 *     same on every plan
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
 * sits. `stripEmphasis()` removes both markers for plain-text surfaces.
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
   * In-page anchor instead of signup. Unused today: every card CTA promises a
   * checkout, so it goes to signup.
   */
  ctaAnchor?: string;
  includedLabel: string;
  /**
   * The tier's own bullets. Every card carries at least six, each one
   * capability per line, so no tier reads as "the one below, plus a little".
   */
  features: V4Feature[];
  limitsLabel: string;
  limits: V4Limit[];
  /**
   * Limits on calls through the Liffio API, under their own heading. They do
   * NOT limit scheduling, automations or chatbots in the app, which is why
   * they are not mixed into `limits`.
   */
  apiLimitsLabel: string;
  apiLimits: V4Limit[];
};

export const V4_PLAN_CONTENT: Record<string, V4PlanContent> = {
  Free: {
    audience:
      "Test whether comment to DM converts on your own audience before paying anything.",
    cta: "Start free",
    includedLabel: "Included",
    features: [
      "**Comment to DM that works**: keyword and any comment triggers, public auto reply",
      "**2 live chatbots** with link buttons and chat analytics",
      "**Bio link page and short links**, Liffio badge shown",
      "**Leads list** with the full interaction timeline",
      "**Overview analytics**",
      "**Unlimited DMs**, no quota, no contact caps",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "3" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "0" },
      { label: "Live chatbots", value: "2" },
      { label: "Steps per bot", value: "15" },
      { label: "Keywords per bot", value: "5" },
      { label: "Follow-ups per step", value: "0" },
      { label: "Team members", value: "1" },
      { label: "AI tokens / month", value: "1,000" },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "API requests / day", value: "0" },
      { label: "API keys", value: "0" },
    ],
  },

  Starter: {
    audience: "One creator running a single account as a real acquisition channel.",
    cta: "Choose Starter",
    includedLabel: "Everything in Free, plus",
    features: [
      "**Liffio branding off**, on DMs, chatbots and your bio link",
      "**Trigger blocks**: a different reply for every keyword on one post",
      "**Follow before DM**, on automations and chatbots",
      "**5 live chatbots** with questions, conditions, media and personalization",
      "**Follow-up sequences**, 2 per automation, plus 1 follow-up per chatbot step",
      "**Lead export**, conversion rate and 30 day history",
      "**Custom slugs and bio link styling** with click tracking",
      "**API access**: 200 requests a day, 5 keys",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "25" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "2" },
      { label: "Live chatbots", value: "5" },
      { label: "Steps per bot", value: "40" },
      { label: "Keywords per bot", value: "15" },
      { label: "Follow-ups per step", value: "1" },
      { label: "Team members", value: "3" },
      { label: "AI tokens / month", value: "10,000" },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "API requests / day", value: "200" },
      { label: "API keys", value: "5" },
    ],
  },

  Growth: {
    audience:
      "A serious creator posting consistently and deciding from data, still working alone.",
    flag: { text: "The new step", tone: "brand" },
    cta: "Choose Growth",
    includedLabel: "Everything in Starter, plus",
    features: [
      "**Ice breakers**: 4 tappable questions above every empty DM thread",
      "**Story reply and story mention triggers**",
      "**Default reply** answers any DM that matches nothing",
      "**15 live chatbots** with chain bots, templates and tags",
      "**Start a chatbot from a comment**",
      "**Post, video and profile metrics** with 90 day history",
      "**Caption and schedule templates**, hashtag groups, bulk upload",
      "**5 follow-ups per automation**, 2 per chatbot step, and 30,000 AI tokens",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "100" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "5" },
      { label: "Live chatbots", value: "15" },
      { label: "Steps per bot", value: "100" },
      { label: "Keywords per bot", value: "40" },
      { label: "Follow-ups per step", value: "2" },
      { label: "Team members", value: "5" },
      { label: "AI tokens / month", value: "30,000" },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "API requests / day", value: "500" },
      { label: "API keys", value: "10" },
    ],
  },

  Business: {
    audience: "More than one person touches the account, and someone must answer for results.",
    flag: { text: "For teams", tone: "ink" },
    cta: "Choose Business",
    includedLabel: "Everything in Growth, plus",
    features: [
      "**Chatbot lead capture**: answers land straight in your leads list",
      "**Webhook step**: send answers to your own system mid chat",
      "**A/B testing on chatbot steps**",
      "**Handover routing and business hours**",
      "**Unlimited live chatbots**",
      "**Post approvals and activity log**",
      "**Per person permissions** for up to 15 team members",
      "**Analytics export** and per automation attribution",
    ],
    limitsLabel: "Limits",
    limits: [
      { label: "Automations", value: "250" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "10" },
      { label: "Live chatbots", value: "Unlimited" },
      { label: "Steps per bot", value: "Unlimited" },
      { label: "Keywords per bot", value: "Unlimited" },
      { label: "Follow-ups per step", value: "3" },
      { label: "Team members", value: "15" },
      { label: "AI tokens / month", value: "75,000" },
    ],
    apiLimitsLabel: "API limits",
    apiLimits: [
      { label: "API requests / day", value: "1,000" },
      { label: "API keys", value: "15" },
    ],
  },

  Agency: {
    audience: "Studios and multi brand operators running 10 to 20 Instagram accounts.",
    flag: { text: "20 workspaces", tone: "ink" },
    cta: "Choose Agency",
    includedLabel: "Twenty complete Business workspaces",
    features: [
      "**Every workspace is a full Business workspace**: same features, same limits",
      "**One subscription, one invoice**, one renewal date for all 20",
      "**Agency branding** and hide Liffio branding",
      "**Client workspaces**, created as you win clients",
      "**Switch workspaces** from one login",
      "**Cheaper per workspace** than a single Growth plan",
    ],
    // Every figure below is Business's, per workspace. Stated plainly rather
    // than as "250 x 20", which reads as one pooled allowance of 5,000.
    limitsLabel: "Per workspace, across 20",
    limits: [
      { label: "Automations", value: "250" },
      { label: "DMs", value: "Unlimited" },
      { label: "DM follow-ups", value: "10" },
      { label: "Live chatbots", value: "Unlimited" },
      { label: "Steps per bot", value: "Unlimited" },
      { label: "Keywords per bot", value: "Unlimited" },
      { label: "Follow-ups per step", value: "3" },
      { label: "Team members", value: "15" },
      { label: "AI tokens / month", value: "75,000" },
    ],
    apiLimitsLabel: "API limits, per workspace",
    apiLimits: [
      { label: "API requests / day", value: "1,000" },
      { label: "API keys", value: "15" },
    ],
  },
};

/** Inline markers, stripped, for surfaces that render plain feature text. */
export function stripEmphasis(feature: V4Feature): string {
  return feature.replace(/\*\*/g, "").replace(/\s*\{beta\}/g, " (Beta)");
}

/**
 * The bullets as the `PlanFeature[]` shape the homepage cards expect.
 *
 * Every entry is `included: true`. The sheet lists only what a tier HAS, and
 * there is no exclusion list, so the homepage shows no ✗ rows. The homepage
 * card has no "Everything in Free, plus" heading of its own, so it leads the
 * list for every tier that builds on another.
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

/** Agency only. */
const agencyOnly = (name: string): MatrixRow => ({
  name,
  free: false,
  starter: false,
  growth: false,
  business: false,
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
    // Its own group, never mixed into automations: chatbots are a separate
    // module, and folding them in would hide how much there is.
    name: "Chatbots",
    description: "Full DM conversations, a separate module from comment to DM automation.",
    features: [
      all("Build and publish a chatbot"),
      all("Manage contacts"),
      all("Link buttons"),
      all("Chat analytics"),
      paid("Questions"),
      paid("Conditions"),
      paid("Media messages"),
      paid("Personalization"),
      paid("Follow-ups inside a chat"),
      paid("Follow gate before the bot replies"),
      paid("Turn off Liffio chatbot branding"),
      growthUp("Ice breakers"),
      growthUp("Story reply and story mention triggers"),
      growthUp("Default reply for unmatched DMs"),
      growthUp("Chain bots"),
      growthUp("Chatbot templates"),
      growthUp("Tags"),
      growthUp("Start a chatbot from a comment"),
      businessUp("Lead capture into the leads list"),
      businessUp("Webhook step"),
      businessUp("A/B testing on a step"),
      businessUp("Handover routing"),
      businessUp("Business hours"),
      businessUp("Notify step"),
      values("Live chatbots", "2", "5", "15", "Unlimited", "Unlimited"),
      values("Steps per bot", "15", "40", "100", "Unlimited", "Unlimited"),
      values("Keywords per bot", "5", "15", "40", "Unlimited", "Unlimited"),
      values("Condition rules", "0", "5", "15", "Unlimited", "Unlimited"),
      values("Follow-ups per step", "0", "1", "2", "3", "3"),
      values("Chatbot conversations a month", "500", "Unlimited", "Unlimited", "Unlimited", "Unlimited"),
      values("Buttons per step, Instagram's own cap", "13", "13", "13", "13", "13"),
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
      paid("Bio link styling"),
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
      all("Overview analytics"),
      paid("Conversion rate"),
      { name: "Analytics history", free: false, starter: "30 days", growth: "90 days", business: "90 days", agency: "90 days" },
      growthUp("Post metrics"),
      growthUp("Video metrics"),
      growthUp("Profile outcomes"),
      growthUp("AI insights"),
      businessUp("Analytics export"),
      businessUp("Per automation attribution"),
    ],
  },
  {
    name: "Team & account",
    features: [
      all("Team invites and roles"),
      businessUp("Per person permissions"),
      all("Audit log"),
      all("Two factor authentication"),
      all("Affiliate programme"),
    ],
  },
  {
    name: "Agency",
    features: [
      agencyOnly("One bill and one billing date for all 20 workspaces"),
      agencyOnly("Agency branding and hide Liffio branding"),
      agencyOnly("Client workspaces"),
    ],
  },
  {
    name: "Limits: per workspace, never pooled",
    features: [
      values("Workspaces", "1", "1", "1", "1", "20"),
      values("Automation workflows", "3", "25", "100", "250", "250"),
      values("DM follow-ups per automation", "0", "2", "5", "10", "10"),
      values("Team members", "1", "3", "5", "15", "15"),
      values("AI tokens per month", "1,000", "10,000", "30,000", "75,000", "75,000"),
    ],
  },
  {
    name: "API limits",
    description:
      "Calls through the Liffio API, per workspace. Scheduling, automations and chatbots in the app are not limited by these.",
    features: [
      paid("API access"),
      values("API requests per day", "0", "200", "500", "1,000", "1,000"),
      values("API keys", "0", "5", "10", "15", "15"),
      values("Automations per day via API", "0", "50", "150", "400", "400"),
      values("Scheduled posts per day via API", "0", "50", "150", "400", "400"),
    ],
  },
];
