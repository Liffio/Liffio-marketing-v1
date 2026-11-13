// ── /compare roundup data: every Instagram comment-to-DM tool we checked ─────
//
// This file backs the multi-vendor roundup on /compare. It is NOT the same data
// as comparisons.config.ts: that file powers the single-vendor /vs/[slug] pages
// and frames each competitor against Liffio. This one is a roundup, so Liffio is
// one row among many and is not ranked first by default.
//
// 🚩 RULES FOR EVERY COMPETITOR FIGURE IN THIS FILE
//   1. Every price was read off the vendor's own public pricing page on the date
//      recorded in the comment above its entry. No third-party comparison blog,
//      no vendor's claim about a rival, no memory.
//   2. If a vendor does not publish a price publicly, the cell reads "Not
//      publicly listed (November 2026)" and the prose says why. It is never
//      guessed and never left blank.
//   3. `pricingUrl` is the page the figure came from, and the page renders it as
//      a link so a reader can re-check the number themselves. Prices move; the
//      link is the part that stays correct.
//   4. API and Meta-approval claims are the VENDOR's claims. None of them were
//      independently verified, and the copy says so.
//
// 🚩 Do not add a tool here without a pricing-page URL and a verification date.
//
// 🚩 Vendor pricing pages GEO-LOCALIZE. A curl result shows the vendor's
// default or US view and is not evidence about what an Indian customer sees, so
// a currency or regional claim must be read in a browser located in the relevant
// region. Where a vendor publishes two rate cards, print BOTH with the region
// named, never the one that flatters Liffio.
//
// 🚩 Entries are deliberately tight, roughly 100 words each. The page has a
// word budget and thirteen tools to spend it on, so each assessment states the
// verified prices, the one thing the tool is genuinely best at, and the thing
// that rules it out. Resist growing any single entry: a longer Liffio entry in
// particular turns a roundup back into a landing page.

export type RoundupTool = {
  /** Display name. */
  name: string;
  /** The vendor's own public pricing page: the source for every figure below. */
  pricingUrl: string;
  /** Human-readable verification date, printed on the page. */
  verified: string;
  /** One line for the table: free plan. */
  freePlan: string;
  /** One line for the table: cheapest paid entry. */
  paidFrom: string;
  /** One line for the table: how the meter works. */
  model: string;
  /** One line for the table: automated DM volume. */
  dmLimit: string;
  /** One line for the table: chatbot or AI layer. */
  chatbot: string;
  /** Short "who it suits" line, printed under the heading. */
  bestFor: string;
  /** The honest assessment, one string per paragraph. */
  assessment: string[];
  /** Deep-link into Liffio's own comparison cluster, in body copy. */
  internalLink?: { lead: string; href: string; label: string; tail?: string };
  /** True for Liffio's own row, used only for table styling. */
  isLiffio?: boolean;
};

export const ROUNDUP_TOOLS: RoundupTool[] = [
  // ── Liffio ────────────────────────────────────────────────────────────────
  // Source: src/config/pricing.config.ts (the live plan sheet, which
  // `npm run check:prices` holds against the billing catalogue). Feature claims
  // checked against src/config/feature-flags.ts on 13 November 2026: story
  // reactions, welcome DM, comment @mentions, branching logic, in-DM data
  // prompting, CRM integrations and sale tracking are all gated OFF and are not
  // claimed anywhere below. Story replies and story mentions do ship.
  {
    name: "Liffio",
    pricingUrl: "/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, $0 or ₹0, 3 automations, 2 chatbots",
    paidFrom: "$9/mo, or ₹499/mo in India",
    model: "Flat rate per workspace",
    dmLimit: "Unlimited on every plan, Free included",
    chatbot: "Yes, separate module, 2 on Free",
    bestFor: "Instagram-only automation at a bill that does not move, with rupee billing.",
    isLiffio: true,
    assessment: [
      "Liffio is Instagram-only: comment-to-DM on posts and Reels, public comment auto-replies, story replies and story mentions, DM reply automation, follow gating, follow-up sequences, passive email capture, and chatbots as their own module. As of November 2026: Free $0 or ₹0, Starter $9 or ₹499, Growth $29 or ₹1,499, Business $59 or ₹2,499, Agency $549 or ₹22,999 per month. DMs are unlimited on every tier including Free, rupees are billed natively with GST, and one workspace equals one Instagram account, with Agency bundling 20 of them onto one subscription.",
      "Wrong answer if you need WhatsApp or Messenger (that is ManyChat or Chatfuel), branching or conditional logic, a flow that asks for an email and stores it, CRM sync, or revenue attribution: analytics stop at comment to DM to click. If a visual builder with conditions is the gap, InstantDM and Chatfuel ship one and Liffio does not. Liffio states it is a Meta-verified Tech Provider with App Review approval, which is Liffio's own claim, like every vendor claim here.",
    ],
  },

  // ── ManyChat ──────────────────────────────────────────────────────────────
  // Source attempted: https://manychat.com/pricing on 13 November 2026.
  // manychat.com returns HTTP 403 behind a domain-wide Cloudflare bot wall to
  // all automated access, so NO figure could be read from the vendor's own page.
  // 🚩 Do not publish a ManyChat number here. Third-party comparison sites carry
  // figures for it; a competitor price sourced from another competitor's blog is
  // exactly the mistake the comparisons.config.ts header warns about. The
  // per-contact MODEL is publicly stated by ManyChat and is safe to describe.
  {
    name: "ManyChat",
    pricingUrl: "https://manychat.com/pricing",
    verified: "13 November 2026",
    freePlan: "Not publicly listed (November 2026)",
    paidFrom: "Not publicly listed (November 2026)",
    model: "Per contact, stated publicly by ManyChat",
    dmLimit: "Not publicly listed (November 2026)",
    chatbot: "Yes, multi-channel flow builder",
    bestFor: "One campaign across Instagram, Messenger and WhatsApp at once.",
    assessment: [
      "ManyChat popularised comment-to-DM and is still the default. Multi-channel by design, the most mature flow builder here, and more tutorial content than everything else on this page combined. If Instagram is one of three channels rather than the only one, nothing Instagram-only here replaces it.",
      "Its pricing comes with a caveat: manychat.com returns a 403 to automated requests, so no figure could be read off their own page in November 2026, and this roundup publishes none rather than repeat a number from someone else's comparison post. Check it yourself. ManyChat does state the shape publicly: per contact, so cost tracks how many people interacted with your automations, not how many messages you sent. That meter reacts hardest when one Reel travels. Inro prices the same way.",
    ],
    internalLink: {
      lead: "For the whole field in long form, see",
      href: "/blog/manychat-alternatives",
      label: "the guide to ManyChat alternatives",
      tail: "which also covers migration step by step.",
    },
  },

  // ── Chatfuel ──────────────────────────────────────────────────────────────
  // Source: https://chatfuel.com/pricing, read 13 November 2026.
  // Business S US$18/mo billed yearly, US$20/mo billed monthly. Agency S
  // US$90/mo billed yearly. No free plan, 7-day trial. Per-bot plus metered
  // credits (AI replies, WhatsApp templates, lead events); credits do not roll
  // over. Official Graph API stated by the vendor. USD only, no INR or EUR.
  {
    name: "Chatfuel",
    pricingUrl: "https://chatfuel.com/pricing",
    verified: "13 November 2026",
    freePlan: "No free plan, 7-day trial",
    paidFrom: "US$18/mo yearly, US$20/mo monthly",
    model: "Per bot plus credits that do not roll over",
    dmLimit: "Governed by credits, not a DM count",
    chatbot: "Yes, AI agent and full builder",
    bestFor: "An AI agent holding real conversations across WhatsApp and Instagram.",
    assessment: [
      "Chatfuel is a chatbot platform, not a comment-to-DM utility, and its AI agent work is the most serious here after ManyChat. As of November 2026: Business S at US$18 per month billed yearly or US$20 billed monthly, Agency S at US$90 billed yearly, no free plan and a 7-day trial. You pay per bot, then spend credits on AI replies, WhatsApp templates and lead events, and those credits do not roll over, so a busy month can run dry. That is why $18 here is not comparable to $19 elsewhere. USD only, official Graph API stated. Buy it if the conversation is the product.",
    ],
    internalLink: {
      lead: "On keyword automation versus a bot builder, see",
      href: "/chatfuel-alternative",
      label: "the Liffio versus Chatfuel comparison",
    },
  },

  // ── Metricool ─────────────────────────────────────────────────────────────
  // Source: https://metricool.com/pricing/, read 13 November 2026.
  // Free $0 exists but comment-to-DM is NOT included on it. Starter covers 5
  // brands at $20/mo billed annually, $25/mo billed monthly. Comment-to-DM
  // requires the Flows add-on, an EXTRA $12/mo for 2,500 executions.
  // 🚩 Always state the Flows footnote with the Starter price: quoting $20 alone
  // describes a plan that cannot do comment-to-DM at all. EUR and USD only. The
  // site does not state use of an official API.
  {
    name: "Metricool",
    pricingUrl: "https://metricool.com/pricing/",
    verified: "13 November 2026",
    freePlan: "Yes, $0, but comment-to-DM is not on it",
    paidFrom: "$20/mo yearly or $25/mo monthly for 5 brands, plus $12/mo Flows add-on",
    model: "Suite subscription plus per-execution add-on",
    dmLimit: "Flows add-on covers 2,500 executions/mo",
    chatbot: "No chatbot layer",
    bestFor: "Managers already buying scheduling and analytics for several brands.",
    assessment: [
      "Metricool is a scheduling and analytics suite that grew DM automation, which changes who it suits. As of November 2026, Starter covers 5 brands at $20 per month billed annually or $25 billed monthly, cheap per brand if you wanted a scheduler anyway. Two footnotes matter more than the headline: the free plan exists but comment-to-DM is not on it, and on paid plans it needs the Flows add-on at an extra $12 per month for 2,500 executions. The real price is two line items with an execution ceiling. The site does not state that it uses an official Meta API, which every other tool here claims.",
    ],
  },

  // ── ReplyRush ─────────────────────────────────────────────────────────────
  // Source: https://www.replyrush.com/pricing, read 13 November 2026.
  // Monthly billing only, no annual option published. Free $0/₹0, Lite
  // $10/₹900, Boost $25/₹2,100, MAX $100/₹8,400. Monthly DM caps
  // 1,500 / 7,500 / 40,000 / 400,000. Instagram accounts 1 / 1 / 3 / 5.
  // Publishes INR prices directly. No AI chatbot layer.
  {
    name: "ReplyRush",
    pricingUrl: "https://www.replyrush.com/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, $0 or ₹0, 1 account",
    paidFrom: "Lite $10/mo or ₹900/mo",
    model: "Tiered monthly DM caps, monthly billing only",
    dmLimit: "1,500 / 7,500 / 40,000 / 400,000 per month",
    chatbot: "No AI chatbot",
    bestFor: "A cheap rupee entry price, with steady monthly volume.",
    assessment: [
      "ReplyRush is refreshingly legible. As of November 2026: Free at $0 or ₹0, Lite at $10 or ₹900, Boost at $25 or ₹2,100 and MAX at $100 or ₹8,400 per month, monthly billing only. Each tier states its DM cap outright, 1,500 then 7,500 then 40,000 then 400,000, with 1, 1, 3 and 5 accounts. Rupee prices save an Indian creator a forex markup on every renewal, and three accounts at ₹2,100 undercuts three Liffio workspaces. The trade is the cap and the missing chatbot: 1,500 DMs disappears quickly on one Reel that outperforms.",
    ],
    internalLink: {
      lead: "The tier-by-tier version is on",
      href: "/vs/replyrush",
      label: "the Liffio versus ReplyRush comparison",
    },
  },

  // ── LinkDM ────────────────────────────────────────────────────────────────
  // Source: https://www.linkdm.com/pricing, read 13 November 2026.
  // Free $0: 1 account, 1,000 DMs/mo. Pro $19/mo or $182/yr: 3 accounts,
  // 25,000 DMs/mo. Platinum+ $99/mo or $832/yr: 10 accounts, 300,000 DMs/mo.
  // No chatbot. Explicitly no link-in-bio feature. Analytics are click-level.
  {
    name: "LinkDM",
    pricingUrl: "https://www.linkdm.com/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, $0, 1 account, 1,000 DMs/mo",
    paidFrom: "Pro $19/mo or $182/yr",
    model: "Flat tier with a large DM allowance",
    dmLimit: "1,000 Free, 25,000 Pro, 300,000 Platinum+",
    chatbot: "No chatbot",
    bestFor: "Link delivery at volume across several accounts.",
    assessment: [
      "LinkDM does one job and prices it well. As of November 2026: Free at $0 with 1 account and 1,000 DMs per month, Pro at $19 per month or $182 per year with 3 accounts and 25,000 DMs, and Platinum+ at $99 per month or $832 per year with 10 accounts and 300,000 DMs. No chatbot, no link-in-bio (the site says so outright), click-level analytics. On multi-account economics it is the best value here and it would be dishonest to bury that: ten accounts for $99 is about $10 each. For a small agency delivering comment-to-DM links, this list has no better answer.",
    ],
    internalLink: {
      lead: "The feature-by-feature version is on",
      href: "/vs/linkdm",
      label: "the Liffio versus LinkDM comparison",
    },
  },

  // ── Zorcha ────────────────────────────────────────────────────────────────
  // Source: https://zorcha.com/pricing/ and https://zorcha.com/in/pricing/,
  // both read 13 November 2026.
  // USD monthly: Free $0, Pro $14.99, Ultimate $39.99, Business $109.99.
  // INR monthly: Free ₹0, Pro ₹1,199, Ultimate ₹2,999, Business ₹8,999.
  // INR annual, per month: ₹799 / ₹1,999 / ₹5,999.
  // Unlimited automations, DMs and contacts on EVERY tier including Free; the
  // meter is AI credits instead. Indian company.
  // 🚩 Zorcha also offers unlimited DMs on every tier. Never present unlimited
  // DMs as a Liffio-only advantage on this page.
  {
    name: "Zorcha",
    pricingUrl: "https://zorcha.com/pricing/",
    verified: "13 November 2026",
    freePlan: "Yes, $0 or ₹0, with unlimited DMs",
    paidFrom: "Pro $14.99/mo, ₹1,199/mo, ₹799/mo annual",
    model: "Flat tier, AI credits metered instead of DMs",
    dmLimit: "Unlimited on every tier, Free included",
    chatbot: "AI features metered by credits",
    bestFor: "Uncapped DMs on a free plan, priced in rupees too.",
    assessment: [
      "Zorcha is the other tool here that leaves automated DMs uncapped on every tier, Free included, and that deserves credit rather than a hedge. Automations and contacts are uncapped too; it meters AI credits instead, which charges for the expensive part rather than the cheap one. As of November 2026: USD Free $0, Pro $14.99, Ultimate $39.99, Business $109.99 per month; rupees Free ₹0, Pro ₹1,199, Ultimate ₹2,999, Business ₹8,999 per month, or ₹799, ₹1,999 and ₹5,999 annually. An Indian company, so Pro at ₹799 sits between Liffio at ₹499 and ReplyRush at ₹900 and features decide it. What Free gates is capability, not volume.",
    ],
    internalLink: {
      lead: "A longer look at where the two diverge is on",
      href: "/vs/zorcha",
      label: "the Liffio versus Zorcha comparison",
    },
  },

  // ── InstantDM ─────────────────────────────────────────────────────────────
  // Source: https://instantdm.com/pricing, verified 2026-11-13 in BOTH regional
  // views: curl for the international card, an India-geolocated browser for the
  // rupee card.
  // 🔴 The page GEO-LOCALIZES behind a USD/INR selector. An earlier pass read it
  // with curl and recorded "INR selector, no INR prices". That was false: there
  // is a full rupee card.
  //   India:         Free ₹0; Legend Pro ₹833/mo; Trendsetter ₹1,666;
  //                  Trendsetter Pro ₹4,165; Multi Pro ₹667 per account per
  //                  month, or ₹79,999/yr for 10 accounts.
  //                  Multi Starter NOT captured in INR: quote it in USD only.
  //   International: Free $0; Legend Pro $9.99/mo; Trendsetter $24.99;
  //                  Trendsetter Pro $49.99; Multi Pro $990/yr for 10 accounts;
  //                  Multi Starter $160/yr for 3 accounts.
  // ALL paid prices are billed yearly; monthly prices are NOT published on the
  // page, so do not state one. Free tier: 500 DM automations per month,
  // 1 Instagram account, 3 trigger words. Ships a visual flow builder and an AI
  // agent.
  {
    name: "InstantDM",
    pricingUrl: "https://instantdm.com/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, ₹0 or $0, 500 DMs/mo, 1 account, 3 triggers",
    paidFrom: "Legend Pro ₹833/mo in India, $9.99/mo internationally, billed yearly",
    model: "Annual billing only, monthly prices not published",
    dmLimit: "500/mo on Free, higher on paid tiers",
    chatbot: "Yes, visual flow builder and AI agent",
    bestFor: "A cheap flow builder and AI agent, paid yearly.",
    assessment: [
      "InstantDM is the cheapest way here to get a visual flow builder and an AI agent in one product. Its page geo-localizes behind a currency selector, so as of November 2026 the rupee card reads Free ₹0, Legend Pro ₹833 a month, Trendsetter ₹1,666 and Trendsetter Pro ₹4,165, against $0, $9.99, $24.99 and $49.99 internationally. Multi Pro covers ten accounts at ₹79,999 a year or $990. Worth noting that ₹833 against $9.99 is roughly $9.90, so this rupee card is a conversion rather than an India discount. Free gives 500 DM automations per month, 1 account and 3 trigger words.",
      "One catch belongs in bold: every paid price is billed yearly and no monthly price is published at all, so ₹833 is really a commitment of about ₹10,000. Three trigger words is the limit you hit before the 500 DMs.",
    ],
  },

  // ── SendDM ────────────────────────────────────────────────────────────────
  // Source: https://senddm.ai/pricing, verified 2026-11-13 in BOTH regional
  // views: curl for the international rate card, an India-geolocated browser for
  // the rupee rate card.
  // 🔴 THE PAGE GEO-LOCALIZES. A curl result shows the default or US view and is
  // NOT evidence about what an Indian customer sees. SendDM was left off this
  // roundup because its pricing was treated as unverified after a curl read; it
  // is verified now, in both regions, and both rate cards go in the copy.
  // Tier names are identical in both regions: Free, Creator, Growth, Scale,
  // Custom. Annual per month / monthly / billed yearly:
  //   India:         Free ₹0; Creator ₹399/₹499/₹4,790; Growth ₹719/₹899/₹8,630;
  //                  Scale ₹1,439/₹1,799/₹17,270; Custom quote
  //   International: Free $0;  Creator $9/$11/$105.60;   Growth $16/$20/$192;
  //                  Scale $31/$39/$374;                 Custom quote
  // Free: 300 DMs/mo, 1 Instagram account, 3 message templates, basic keyword
  // triggers, 1 conversation starter, 5 links in bio, 5 scheduled posts/mo,
  // 2 story mention replies. Creator: unlimited DMs, 5 accounts, 2,000 AI
  // credits/mo, unlimited templates, advanced triggers, Rewind, analytics.
  // Growth: 10 accounts, 10,000 AI credits, WhatsApp/Email redirect, priority
  // support. Scale: 20 accounts, 25,000 AI credits.
  // 🚩 EVERY PAID TIER HAS UNLIMITED DMs. Only Free is capped at 300. Never
  // present unlimited DMs as a Liffio-only advantage against SendDM.
  {
    name: "SendDM",
    pricingUrl: "https://senddm.ai/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, ₹0 or $0, 300 DMs/mo, 1 account",
    paidFrom: "Creator ₹399/mo in India, $9/mo internationally, annual",
    model: "Flat tier, AI credits metered instead of DMs",
    dmLimit: "300/mo on Free, unlimited on every paid tier",
    chatbot: "Conversation starters and AI credits, not broken out as a tier",
    bestFor: "Indian creators who want a discounted rupee price and several accounts.",
    assessment: [
      "SendDM prices India properly, which is the finding here. Its page geo-localizes, so as of November 2026 the rupee card reads Free ₹0, Creator ₹399, Growth ₹719 and Scale ₹1,439 per month on annual billing (₹499, ₹899 and ₹1,799 monthly), while the international card reads $0, $9, $16 and $31 annual. ₹399 against its own $9 is roughly $4.75, so this is a real discount rather than a conversion, and few vendors here do that. Free caps at 300 DMs a month, but every paid tier is unlimited, and the tiers bundle 5, 10 and 20 Instagram accounts. On accounts per rupee nothing here beats it.",
      "What it meters instead is AI credits, 2,000 on Creator up to 25,000 on Scale, so the AI replies are the expensive part rather than the DMs. The pricing page does not break out a chatbot tier and does not state who invoices you or on what rails, so if you need full back-and-forth conversations or a GST tax invoice from an Indian entity, ask before you buy. Free is the thin part: one account, three message templates and one conversation starter is a trial in practice.",
    ],
    internalLink: {
      lead: "The head-to-head version is on",
      href: "/senddm-alternative",
      label: "the Liffio versus SendDM comparison",
    },
  },

  // ── CreatorFlow ───────────────────────────────────────────────────────────
  // Source: https://creatorflow.so/pricing, read 13 November 2026.
  // Free $0: 1 Instagram account, 500 DMs/mo. Pro $15/mo, or $12/mo billed
  // annually. Growth $30/mo, or $24/mo billed annually. Agency: custom pricing.
  // Flat rate. Additional DM packs sold at $5 per 1,000 DMs.
  {
    name: "CreatorFlow",
    pricingUrl: "https://creatorflow.so/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, $0, 1 account, 500 DMs/mo",
    paidFrom: "Pro $15/mo, or $12/mo billed annually",
    model: "Flat rate, DM top-up packs at $5 per 1,000",
    dmLimit: "500/mo Free, tier allowance plus packs on paid",
    chatbot: "Not the focus of the product",
    bestFor: "Volume that is flat most months and spikes on launches.",
    assessment: [
      "CreatorFlow prices flat and keeps the ladder short. As of November 2026: Free at $0 with 1 account and 500 DMs per month, Pro at $15 per month or $12 annually, Growth at $30 or $24 annually, Agency on custom pricing. The interesting mechanic is DM packs at $5 per 1,000. Most tools here force a tier upgrade at a ceiling, a permanent increase bought for a temporary problem; a pack solves the launch month and then stops costing anything. Nothing else here offers that. Buy packs monthly, though, and a higher flat tier elsewhere is cheaper.",
    ],
  },

  // ── Inro ──────────────────────────────────────────────────────────────────
  // Source: https://inro.social/pricing, read 13 November 2026.
  // Free €0: 100 active contacts per month. Pro from €12.99/mo. Annual Pro
  // €1,249/year. Managed service from €249/mo. PER-CONTACT pricing model.
  // Prices are quoted in EUR on the vendor's page; do not convert them.
  {
    name: "Inro",
    pricingUrl: "https://inro.social/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, €0, 100 active contacts/mo",
    paidFrom: "Pro from €12.99/mo, Annual Pro €1,249/yr",
    model: "Per active contact",
    dmLimit: "Governed by contact count, not DM count",
    chatbot: "Yes, plus managed service from €249/mo",
    bestFor: "A small, high-value contact list, or budget but no time.",
    assessment: [
      "Inro prices per active contact, the same shape as ManyChat, and quotes in euros. As of November 2026: Free at €0 with 100 active contacts per month, Pro from €12.99 per month, Annual Pro at €1,249 per year, and a Managed service from €249 per month. Per-contact suits one business and punishes another: fine if you sell something expensive to a few hundred people, sharp if one Reel brings thousands onto the meter. The Managed tier is the differentiated thing, because plenty of brands buy a $19 tool and never configure it. No other tool here sells the labour.",
    ],
  },

  // ── InstaChamp ────────────────────────────────────────────────────────────
  // Source attempted 13 November 2026: instachamp.com is a DEAD DOMAIN that
  // redirects to a GoDaddy for-sale parking page. The product has been folded
  // into Customers.ai; https://customers.ai/instachamp is the surviving page and
  // it shows TWO CONFLICTING PRICES for one plan, so no figure from it is
  // publishable. Pricing therefore reads "not publicly listed".
  // 🚩 There is no product called "DMChamp". Do not invent one.
  {
    name: "InstaChamp",
    pricingUrl: "https://customers.ai/instachamp",
    verified: "13 November 2026",
    freePlan: "Not publicly listed (November 2026)",
    paidFrom: "Not publicly listed (November 2026)",
    model: "Not publicly listed (November 2026)",
    dmLimit: "Not publicly listed (November 2026)",
    chatbot: "Yes, from the MobileMonkey lineage",
    bestFor: "Hard to recommend in November 2026. Check its status first.",
    assessment: [
      "InstaChamp came out of the MobileMonkey lineage and used to be a common name here, which is why it is still on the list. Its state in November 2026 is the finding rather than its feature set. instachamp.com no longer serves the product: it redirects to a GoDaddy page offering the domain for sale. The product is folded into Customers.ai, and that page shows two conflicting prices for one plan, so there is no figure we will print. That does not prove the product is gone, but a dead domain and contradictory pricing should slow a purchase. Already paying? Confirm status and renewal terms with Customers.ai.",
    ],
    internalLink: {
      lead: "The longer version, including what a migration involves, is on",
      href: "/vs/instachamp",
      label: "the Liffio versus InstaChamp comparison",
    },
  },

  // ── SuperProfile ──────────────────────────────────────────────────────────
  // Source: https://superprofile.bio/in/pricing, read 13 November 2026.
  // India: Starter free; Creator ₹99 for the first month, then ₹499/mo.
  // Global: Creator $4.99 for the first month, then $29/mo.
  // 🚩 Both paid figures are INTRODUCTORY first-month rates followed by a
  // standing rate. Always print both halves. Quoting ₹99 or $4.99 alone compares
  // a promo against other vendors' standing prices.
  // Vendor states an official Meta messaging API, story replies, Live triggers,
  // and intent matching that handles typos and Hinglish. No chatbot layer.
  {
    name: "SuperProfile",
    pricingUrl: "https://superprofile.bio/in/pricing",
    verified: "13 November 2026",
    freePlan: "Yes, Starter is free in India",
    paidFrom: "₹99 first month then ₹499/mo in India, $4.99 then $29/mo globally",
    model: "Creator suite subscription, introductory first month",
    dmLimit: "Not published as a headline number",
    chatbot: "No chatbot layer",
    bestFor: "Indian creators selling digital products to a Hinglish audience.",
    assessment: [
      "SuperProfile is a creator monetisation platform first: link in bio, storefront, payments. But the comment-to-DM tool inside it is real rather than decorative. The vendor states it runs on an official Meta messaging API and covers story replies and Live triggers as well as comments.",
      "The feature that stands out, and that nothing else here advertises, is intent matching for typos and Hinglish. If your audience is Indian, many comments will not be the exact trigger word, and every tool doing exact matching silently drops those people. Pricing as of November 2026: in India, Starter is free and Creator is ₹99 for the first month then ₹499 per month; globally, Creator is $4.99 then $29 per month. Compare the standing rate, not the promo. No chatbot layer.",
    ],
    internalLink: {
      lead: "The dedicated-tool versus creator-suite trade-off is covered on",
      href: "/vs/superprofile",
      label: "the Liffio versus SuperProfile comparison",
    },
  },
];

/** Columns for the summary table, in render order. */
export const TABLE_COLUMNS = [
  { key: "freePlan", label: "Free plan" },
  { key: "paidFrom", label: "Paid from, November 2026" },
  { key: "model", label: "Pricing model" },
  { key: "dmLimit", label: "Automated DM volume" },
  { key: "chatbot", label: "Chatbot or AI" },
] as const satisfies readonly { key: keyof RoundupTool; label: string }[];
