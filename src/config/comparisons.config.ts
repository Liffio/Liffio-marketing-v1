// ── Competitor comparison ("Liffio vs X") data ───────────────────────────────
// Powers the dynamic /vs/[slug] route and the /compare hub.
// Adding a competitor = add an entry here. No new page file needed.
//
// Pricing/feature claims are conservative and framed around Liffio's verifiable
// advantages (flat pricing, unlimited DMs, unlimited accounts, INR billing,
// Instagram-only focus). Each page carries a "verify current pricing" note since
// competitor plans change.

export type ComparisonRow = {
  feature: string;
  liffio: boolean | string;
  competitor: boolean | string;
};

export type CompetitorPricing = {
  name: string;
  free: boolean | string;
  paidFrom: string;
  perContact: boolean;
  instagramOnly: boolean;
};

export type ComparisonFaq = { question: string; answer: string };

export type Comparison = {
  slug: string; // /vs/<slug>
  competitor: string; // display name
  /** SERP meta */
  metaTitle: string;
  metaDescription: string;
  /** Hero */
  heroSubtitle: string;
  /** One-line positioning used on the /compare hub card */
  hubBlurb: string;
  /** "Why creators are switching" intro paragraphs */
  whyIntro: string[];
  /** Bulleted differences (title + body) */
  whyPoints: { title: string; body: string }[];
  /** Feature table — competitor column values per row */
  tableRows: ComparisonRow[];
  /** Pricing table rows (Liffio row is added automatically) */
  pricing: CompetitorPricing;
  /** Competitor pricing prose */
  pricingNote: string;
  faq: ComparisonFaq[];
};

const LIFFIO_PRICING: CompetitorPricing = {
  name: "Liffio",
  free: true,
  paidFrom: "$9/month",
  perContact: false,
  instagramOnly: true,
};

export function liffioPricingRow(): CompetitorPricing {
  return LIFFIO_PRICING;
}

// Shared Liffio-advantage feature rows. Competitor values are set per entry.
function rows(competitor: Partial<Record<string, boolean | string>>): ComparisonRow[] {
  return [
    { feature: "Comment-to-DM automation", liffio: true, competitor: competitor.commentDm ?? true },
    { feature: "Story reply automation", liffio: true, competitor: competitor.story ?? true },
    { feature: "Live stream reply automation", liffio: true, competitor: competitor.live ?? "paid only" },
    { feature: "Unlimited automated DMs (free plan)", liffio: true, competitor: competitor.unlimitedDm ?? false },
    { feature: "Free plan that works in production", liffio: true, competitor: competitor.free ?? "limited" },
    { feature: "Unlimited Instagram accounts", liffio: true, competitor: competitor.unlimitedAccounts ?? false },
    { feature: "Flat pricing (no per-contact fees)", liffio: true, competitor: competitor.flat ?? false },
    { feature: "Agency white-label workspaces", liffio: true, competitor: competitor.agency ?? false },
    { feature: "Instagram-only focus", liffio: true, competitor: competitor.igOnly ?? true },
    { feature: "Native INR billing + GST invoices", liffio: true, competitor: competitor.inr ?? false },
  ];
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "replyrush",
    competitor: "ReplyRush",
    metaTitle: "Liffio vs ReplyRush — Instagram DM Automation Compared (2026)",
    metaDescription:
      "Liffio vs ReplyRush for Instagram DM automation. Compare comment-to-DM, pricing, free plans, and unlimited accounts. Flat pricing, no per-contact fees.",
    heroSubtitle:
      "Both automate Instagram comment-to-DM. The difference is in pricing structure, unlimited accounts, and how far the free plan actually gets you.",
    hubBlurb: "Flat pricing and unlimited accounts vs ReplyRush's tiered plans.",
    whyIntro: [
      "ReplyRush is a capable Instagram and Facebook DM automation tool with a large content library and a free tier. It covers the core comment-to-DM workflow well and is a reasonable choice for creators who want a straightforward setup.",
      "Where creators start comparing is on the details that show up once you scale: how many Instagram accounts you can connect without paying more, whether the free plan stays usable in production, and whether pricing stays flat as your audience grows.",
    ],
    whyPoints: [
      {
        title: "Unlimited accounts at every tier",
        body: "Liffio includes unlimited connected Instagram accounts on every plan, including free. Agencies and creators managing multiple handles do not pay a per-account surcharge.",
      },
      {
        title: "Free plan built for production",
        body: "Liffio's free plan runs unlimited comment-to-DM on posts and Reels — not a time-limited trial. You can prove out the workflow before paying anything.",
      },
      {
        title: "Instagram-first, eight automation types",
        body: "Comment-to-DM, story reply, live reply, DM reply, follow gating, re-engagement, lead capture, and welcome messages — all in one Instagram-focused dashboard.",
      },
    ],
    tableRows: rows({ free: "yes", unlimitedDm: "limited", flat: "tiered", inr: true, igOnly: "IG + FB" }),
    pricing: { name: "ReplyRush", free: true, paidFrom: "Tiered plans", perContact: false, instagramOnly: false },
    pricingNote:
      "ReplyRush offers a free tier and paid plans priced by usage tier. Liffio's difference is flat pricing with unlimited DMs and unlimited connected accounts at every level — the bill does not move when a Reel goes viral or when you add another handle.",
    faq: [
      {
        question: "Is Liffio a good ReplyRush alternative?",
        answer:
          "Yes, especially if you manage more than one Instagram account or want a free plan you can run in production. Liffio includes unlimited connected accounts and unlimited automated DMs on every plan, with flat pricing that does not scale with your contact count. Both tools connect through Instagram's official API.",
      },
      {
        question: "Can I move my ReplyRush automations to Liffio?",
        answer:
          "There is no direct import, so migration is manual: note each active automation's trigger keyword, delay, and DM text, then recreate them in Liffio. A typical creator with three to five automations finishes in one to two hours. Run both tools in parallel for a few days before cutting over.",
      },
      {
        question: "Do both tools use the official Instagram API?",
        answer:
          "Yes. Both Liffio and ReplyRush connect through Meta's official OAuth flow — no password sharing, no browser automation. Liffio requests the standard messaging permissions Meta requires and adds a configurable send delay to keep sending patterns natural.",
      },
    ],
  },
  {
    slug: "linkdm",
    competitor: "LinkDM",
    metaTitle: "Liffio vs LinkDM — Instagram Auto DM Tool Comparison (2026)",
    metaDescription:
      "Liffio vs LinkDM for Instagram comment-to-DM automation. Compare features, pricing, free plans, and multi-account support. Flat pricing, unlimited DMs.",
    heroSubtitle:
      "LinkDM focuses on link-in-DM delivery. Liffio covers the full automation stack — eight workflow types, unlimited accounts, and a production-ready free plan.",
    hubBlurb: "Full automation stack and unlimited accounts vs LinkDM's link-delivery focus.",
    whyIntro: [
      "LinkDM is a clean, focused Instagram tool built around delivering links via DM when someone comments a keyword. It does that one job well and is a Meta Business Partner.",
      "Creators comparing the two usually want more than link delivery: story and live automation, re-engagement sequences, lead capture, and the ability to run several accounts without paying per handle. That is where the feature surface starts to matter.",
    ],
    whyPoints: [
      {
        title: "Eight automation types, not just links",
        body: "Beyond comment-to-DM link delivery, Liffio handles story replies, live replies, DM sequences, follow gating, re-engagement, lead capture, and welcome messages.",
      },
      {
        title: "Unlimited accounts and DMs",
        body: "Connect every handle you manage at no extra cost, and send unlimited automated DMs on every plan — including the free tier.",
      },
      {
        title: "Flat, predictable pricing",
        body: "Liffio's paid plans start at $9/month flat. No per-contact metering, no surprise overage when a post takes off.",
      },
    ],
    tableRows: rows({ story: "limited", live: false, agency: "limited", unlimitedDm: "limited", inr: true }),
    pricing: { name: "LinkDM", free: false, paidFrom: "From ~$19/month", perContact: false, instagramOnly: true },
    pricingNote:
      "LinkDM is Instagram-focused with paid plans. Liffio adds a production-ready free plan, unlimited connected accounts, and a broader automation set at a lower entry price. Verify LinkDM's current pricing on their site, as plans change.",
    faq: [
      {
        question: "Is Liffio a good LinkDM alternative?",
        answer:
          "Yes, if you want more than link-in-DM delivery. Liffio covers eight automation types, includes a free plan that runs in production, and connects unlimited Instagram accounts. Both tools are Instagram-focused and use the official API.",
      },
      {
        question: "Does Liffio have a free plan like the tools I'm comparing?",
        answer:
          "Liffio has a genuine free plan — not a trial. It includes unlimited automated DMs, comment keyword triggers on posts and Reels, public comment auto-replies, a bio link page, and basic analytics. Paid plans start at $9/month when you outgrow it.",
      },
      {
        question: "How do I switch from LinkDM to Liffio?",
        answer:
          "Document your active LinkDM automations, connect your Instagram account to Liffio through Meta OAuth, recreate each automation, and run both in parallel for a few days before revoking LinkDM's access in Instagram settings. Most setups take under two hours.",
      },
    ],
  },
  {
    slug: "superprofile",
    competitor: "SuperProfile",
    metaTitle: "Liffio vs SuperProfile — Instagram DM Automation Compared (2026)",
    metaDescription:
      "Liffio vs SuperProfile for Instagram DM automation. Compare dedicated automation features, pricing, and free plans. Instagram-focused, flat pricing.",
    heroSubtitle:
      "SuperProfile bundles automation into a creator-monetization platform. Liffio is dedicated Instagram DM automation — deeper on the automation itself, flat priced.",
    hubBlurb: "Dedicated DM automation vs SuperProfile's all-in-one creator suite.",
    whyIntro: [
      "SuperProfile is a broad creator-monetization platform — link-in-bio, digital product storefronts, and DM automation bundled together. If a storefront is your primary need, that bundle is useful.",
      "If Instagram DM automation is the actual job, a dedicated tool goes deeper: more automation types, more control over triggers and delays, and pricing that reflects automation rather than a storefront suite you may not use.",
    ],
    whyPoints: [
      {
        title: "Dedicated to Instagram automation",
        body: "Liffio's entire product is Instagram DM automation — eight workflow types with fine-grained keyword, delay, and reply controls, rather than automation as one feature in a larger suite.",
      },
      {
        title: "Unlimited accounts and DMs",
        body: "Every plan includes unlimited connected Instagram accounts and unlimited automated DMs, free tier included.",
      },
      {
        title: "Flat pricing for the automation you use",
        body: "Paid plans start at $9/month flat — you pay for DM automation, not a bundled storefront platform.",
      },
    ],
    tableRows: rows({ igOnly: "part of suite", flat: "suite pricing", unlimitedAccounts: "varies", inr: true }),
    pricing: { name: "SuperProfile", free: true, paidFrom: "Suite pricing", perContact: false, instagramOnly: false },
    pricingNote:
      "SuperProfile bundles bio-link and storefront tools with automation, priced as a suite. Liffio prices the automation directly — flat, from $9/month, with unlimited DMs and accounts. Choose SuperProfile if the storefront is central; choose Liffio if DM automation is the priority.",
    faq: [
      {
        question: "Is Liffio a good SuperProfile alternative?",
        answer:
          "Yes, if Instagram DM automation is your main need rather than a bio-link storefront. Liffio is a dedicated automation tool with eight workflow types, unlimited accounts and DMs, and flat pricing. SuperProfile is better if you primarily want a monetization storefront with automation attached.",
      },
      {
        question: "Does Liffio include a bio link page?",
        answer:
          "Yes. Liffio includes a bio link page (bio.liffio.com) and short links (go.liffio.com) alongside DM automation, so you get the link-in-bio basics without a separate tool — while keeping the focus on automation depth.",
      },
      {
        question: "Can I run both during migration?",
        answer:
          "Yes. Both use the official Instagram API, so you can connect both during a short migration window. Recreate your automations in Liffio, verify delivery for a few days, then disable the SuperProfile automations to avoid duplicate DMs.",
      },
    ],
  },
  {
    slug: "zorcha",
    competitor: "Zorcha",
    metaTitle: "Liffio vs Zorcha — Instagram DM Automation Tool Comparison (2026)",
    metaDescription:
      "Liffio vs Zorcha for Instagram comment-to-DM automation. Compare features, pricing, free plans, and multi-account support. Flat pricing, unlimited DMs.",
    heroSubtitle:
      "Comparing Zorcha for Instagram DM automation? Here's how Liffio stacks up on automation depth, unlimited accounts, and flat pricing.",
    hubBlurb: "Proven automation stack, unlimited accounts, and flat pricing vs Zorcha.",
    whyIntro: [
      "Zorcha is one of the newer entrants in Instagram DM automation. Newer tools can move fast, but creators comparing options usually weigh automation depth, account limits, and pricing predictability before committing.",
      "Liffio's position is a complete, Instagram-focused automation set with unlimited accounts and DMs on every plan, and flat pricing that stays put as you scale.",
    ],
    whyPoints: [
      {
        title: "Eight automation types in one place",
        body: "Comment-to-DM, story reply, live reply, DM reply, follow gating, re-engagement, lead capture, and welcome messages — a complete stack rather than a subset.",
      },
      {
        title: "Unlimited accounts and DMs",
        body: "Connect every handle you manage and send unlimited automated DMs on every plan, free tier included.",
      },
      {
        title: "Flat pricing from $9/month",
        body: "No per-contact metering. Your bill stays flat whether a Reel gets 50 comments or 50,000.",
      },
    ],
    tableRows: rows({ inr: true }),
    pricing: { name: "Zorcha", free: "varies", paidFrom: "Check site", perContact: false, instagramOnly: true },
    pricingNote:
      "Zorcha's plans and free tier change as a newer product — verify current details on their site. Liffio's constant is flat pricing from $9/month with unlimited DMs and unlimited connected accounts at every tier.",
    faq: [
      {
        question: "Is Liffio a good Zorcha alternative?",
        answer:
          "Yes. Liffio offers a complete Instagram automation stack — eight workflow types — with unlimited connected accounts, unlimited automated DMs, and flat pricing from $9/month. Both connect through Instagram's official API.",
      },
      {
        question: "Does Liffio have a free plan?",
        answer:
          "Yes, a genuine free plan (not a trial) with unlimited automated DMs, comment keyword triggers on posts and Reels, public comment auto-replies, a bio link page, and basic analytics. Paid plans start at $9/month.",
      },
      {
        question: "Is Liffio safe for my Instagram account?",
        answer:
          "Yes. Liffio connects through Meta's official OAuth — your password is never shared — and adds a configurable 10–60 second send delay so sending patterns stay natural and within Meta's permitted use guidelines.",
      },
    ],
  },
  {
    slug: "instachamp",
    competitor: "InstaChamp",
    metaTitle: "Liffio vs InstaChamp — Instagram DM Automation Comparison (2026)",
    metaDescription:
      "Liffio vs InstaChamp (by MobileMonkey) for Instagram DM automation. Compare comment-to-DM, pricing, free plans, and Instagram-only focus. Flat pricing.",
    heroSubtitle:
      "InstaChamp comes from the MobileMonkey chatbot lineage. Liffio is purpose-built for Instagram — simpler setup, flat pricing, unlimited accounts.",
    hubBlurb: "Purpose-built Instagram automation vs InstaChamp's chatbot-platform roots.",
    whyIntro: [
      "InstaChamp is an Instagram automation product from the MobileMonkey family, which grew out of multi-channel chatbot tooling. That heritage brings breadth, but also complexity aimed at chatbot builders.",
      "Creators who just want reliable Instagram comment-to-DM, story, and live automation often prefer a tool built only for Instagram — fewer settings designed for other platforms, faster setup, and pricing scoped to Instagram automation.",
    ],
    whyPoints: [
      {
        title: "Built only for Instagram",
        body: "No multi-channel chatbot complexity. Liffio's settings and flow builder are scoped to Instagram, so a keyword-to-DM automation takes minutes, not an afternoon.",
      },
      {
        title: "Unlimited accounts and DMs",
        body: "Every plan includes unlimited connected Instagram accounts and unlimited automated DMs, free tier included.",
      },
      {
        title: "Flat pricing from $9/month",
        body: "Predictable flat pricing with no per-contact fees, plus native INR billing for creators in India.",
      },
    ],
    tableRows: rows({ igOnly: "multi-channel", live: "paid only", inr: true }),
    pricing: { name: "InstaChamp", free: true, paidFrom: "From ~$29/month", perContact: false, instagramOnly: false },
    pricingNote:
      "InstaChamp offers a free tier and paid plans from the MobileMonkey platform. Liffio's difference is an Instagram-only focus, unlimited accounts and DMs, and flat pricing from $9/month. Verify InstaChamp's current pricing on their site.",
    faq: [
      {
        question: "Is Liffio a good InstaChamp alternative?",
        answer:
          "Yes, especially if you want Instagram-only automation without multi-channel chatbot complexity. Liffio is purpose-built for Instagram, includes unlimited accounts and DMs, and prices flat from $9/month. Both use the official Instagram API.",
      },
      {
        question: "Is Liffio simpler to set up than a chatbot platform?",
        answer:
          "Yes. Because Liffio is Instagram-only, the flow builder is scoped to keyword-to-DM workflows. Most comment-to-DM automations are created in five to ten minutes without navigating features built for other channels.",
      },
      {
        question: "How do I migrate from InstaChamp to Liffio?",
        answer:
          "Document your active InstaChamp automations, connect Instagram to Liffio via Meta OAuth, recreate each automation, and run both in parallel briefly before revoking InstaChamp's access in Instagram settings. Typical migration takes one to two hours.",
      },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}

/** Existing dedicated "X alternative" landing pages, surfaced on the /compare hub. */
export const ALTERNATIVE_PAGES = [
  { name: "ManyChat", href: "/manychat-alternative", blurb: "Flat pricing vs ManyChat's per-contact model." },
  { name: "SendDM", href: "/senddm-alternative", blurb: "Free plan and broader automation vs SendDM." },
  { name: "Chatfuel", href: "/chatfuel-alternative", blurb: "Instagram-first simplicity vs Chatfuel's bot builder." },
] as const;
