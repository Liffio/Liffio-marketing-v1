// ── Competitor comparison ("Liffio vs X") data ───────────────────────────────
// Powers the dynamic /vs/[slug] route and the /compare hub.
// Adding a competitor = add an entry here. No new page file needed.
//
// ── The verified-pricing regime (replaces the old "Check their plans" rule) ──
//
// Every competitor number in this file was read off that vendor's own pricing
// page on 2026-11-13 and is recorded with a `// Verified <date> from <url>`
// comment directly above it. Nothing here is sourced from a third-party
// comparison blog, a roundup post or another competitor's "vs" page: that is how
// the false Zorcha DM-cap row got published once already.
//
// Four rules follow from that, and they are not negotiable:
//
//   1. No cell may fall through to a placeholder. `rows()` takes a REQUIRED
//      value for every row, so a new entry cannot compile until someone has
//      looked each fact up. "Check their plans" is gone: it filled five rows on
//      five pages with the same non-answer and told a reader nothing.
//   2. Where the vendor does not publish a fact, say so in the vendor's terms:
//      "not publicly listed" when no number exists anywhere, "could not verify"
//      when we looked and could not confirm it. Never a bare `false`, because a
//      cross is a positive claim that the thing is absent.
//   3. Every visible competitor price carries "as of November 2026" in the
//      user-facing copy, and every `pricingNote` prints that vendor's own
//      pricing URL. `pricingNote` renders as plain text in a <p> on
//      /vs/[slug], so the URL goes in as a bare URL, not an anchor tag.
//   4. Meta / official-API status is NEVER a checkmark. None of these claims
//      was independently verified, so the Meta row is a string on both sides and
//      is attributed as the vendor's own wording.
//
// `lastUpdated` on each entry is the date that entry's facts were checked. When
// you re-verify, move the date AND the per-price comments together.
//
// ── Liffio's own facts (do not retype from memory) ──
//
// Prices come from pricing.config.ts: $0 / $9 / $29 / $59 / $549 and
// ₹0 / ₹499 / ₹1,499 / ₹2,499 / ₹22,999. Chatbot tiering comes from
// pricing-v4.config.ts. Unlimited automated DMs on every plan, Free included, is
// true and is the sharpest differentiator against every DM-metered rival, but it
// is NOT one against Zorcha, which is also unlimited: the Zorcha entry says so
// out loud rather than scoring a point it has not won.
//
// One workspace connects exactly one Instagram account; only Agency includes
// more (20 workspaces). Do not reintroduce "unlimited Instagram accounts" or
// agency white label beyond agency branding and hiding Liffio branding.
//
// Feature claims are checked against feature-flags.ts. Story REPLIES and story
// MENTIONS ship and are not gated. Story REACTIONS, welcome DM, comment
// mentions, branching logic, CRM integration and sale tracking are all gated OFF
// and must not be claimed here in any flag state.
//
// ── Style ──
//
// No em dashes and no en dashes anywhere, comments included: `npm run
// check:dashes` fails the build on them. Commas, colons and plain hyphens only.
// metaTitle under 60 characters, metaDescription under 155.

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
  /** Date this entry's competitor facts were last read off the vendor's site. */
  lastUpdated: string;
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
  /** Feature table: competitor column values per row */
  tableRows: ComparisonRow[];
  /** Pricing table rows (Liffio row is added automatically) */
  pricing: CompetitorPricing;
  /** Competitor pricing prose. Must name the vendor's pricing URL. */
  pricingNote: string;
  faq: ComparisonFaq[];
};

/**
 * 🔴 CURRENCY AND REGIONAL CLAIMS. Vendor pricing pages geo-localize. A curl
 * result shows the vendor's DEFAULT or US view and is not evidence about what an
 * Indian customer sees, so a currency claim must be read in a browser located in
 * the relevant region before it goes in this file. An earlier pass read
 * senddm.ai/pricing with curl, saw dollars, and wrote "no rupee pricing" across
 * the site; SendDM in fact publishes a full rupee rate card.
 *
 * Where a vendor has two rate cards, print BOTH with the region named, never the
 * one that flatters Liffio. Format: "₹399/month in India, or $9/month
 * internationally, both on annual billing, as of November 2026".
 *
 * Liffio's own figures come from src/config/pricing.config.ts, verified
 * 2026-11-13, and are never retyped from memory.
 */
const LIFFIO_PRICING: CompetitorPricing = {
  name: "Liffio",
  free: true,
  paidFrom: "₹499/month in India, $9/month internationally",
  perContact: false,
  instagramOnly: true,
};

export function liffioPricingRow(): CompetitorPricing {
  return LIFFIO_PRICING;
}

/**
 * One cell per feature row, per competitor. EVERY field is required.
 *
 * 🚩 This type used to be `Partial<Record<string, boolean | string>>` with `??`
 * defaults behind it, and five of the rows defaulted to the literal string
 * "Check their plans". The result was five near-identical tables where the
 * competitor column said nothing on 5 of 5 pages. Making the fields required
 * means a new entry does not compile until each fact has actually been looked up
 * on the vendor's own site, and there is no default left to hide behind.
 *
 * A fact the vendor does not publish is still a value: use "not publicly listed"
 * (nothing exists to read) or "could not verify" (we looked, it is unconfirmed).
 * Do NOT use `false` for either, because a cross asserts the feature is absent,
 * which is a negative claim about a competitor that we cannot source.
 */
type CompetitorCells = {
  commentDm: boolean | string;
  storyReplies: boolean | string;
  storyMentions: boolean | string;
  dmVolume: boolean | string;
  freePlan: boolean | string;
  accounts: boolean | string;
  flat: boolean | string;
  igOnly: boolean | string;
  inr: boolean | string;
  chatbots: boolean | string;
  chatbotsSeparate: boolean | string;
  freeChatbots: boolean | string;
  chatbotBuilder: boolean | string;
  iceBreakers: boolean | string;
  chatbotLeadCapture: boolean | string;
  bioLink: boolean | string;
  /**
   * String on both sides, always. Meta / official-API status is the vendor's own
   * claim and was not independently verified, so it must not render as a bare
   * checkmark in either column.
   */
  metaClaim: string;
};

function rows(c: CompetitorCells): ComparisonRow[] {
  return [
    { feature: "Comment-to-DM automation", liffio: true, competitor: c.commentDm },
    { feature: "Story reply automation", liffio: true, competitor: c.storyReplies },
    { feature: "Story mention automation", liffio: true, competitor: c.storyMentions },
    {
      feature: "Automated DMs included",
      liffio: "Unlimited on every plan, Free included",
      competitor: c.dmVolume,
    },
    { feature: "Free plan you can run in production", liffio: true, competitor: c.freePlan },
    {
      feature: "Instagram accounts per subscription",
      liffio: "1 per workspace (Agency: 20)",
      competitor: c.accounts,
    },
    { feature: "Flat pricing, no per-contact or per-send fees", liffio: true, competitor: c.flat },
    { feature: "Instagram-only focus", liffio: true, competitor: c.igOnly },
    { feature: "Rupee price list and Razorpay billing", liffio: true, competitor: c.inr },
    { feature: "Chatbots for full DM conversations", liffio: true, competitor: c.chatbots },
    { feature: "Chatbots separate from comment to DM", liffio: true, competitor: c.chatbotsSeparate },
    {
      feature: "Live chatbots on the free plan",
      liffio: "2, with 500 conversations a month",
      competitor: c.freeChatbots,
    },
    {
      feature: "Chatbot questions, conditions and media",
      liffio: "Starter and up",
      competitor: c.chatbotBuilder,
    },
    {
      feature: "Ice breakers and chatbot story triggers",
      liffio: "Growth and up",
      competitor: c.iceBreakers,
    },
    {
      feature: "Chatbot lead capture and webhook step",
      liffio: "Business and Agency",
      competitor: c.chatbotLeadCapture,
    },
    { feature: "Bio link page and short links", liffio: true, competitor: c.bioLink },
    {
      feature: "Official Meta API status, in each vendor's own words",
      liffio: "Meta-verified Tech Provider, App Review approved",
      competitor: c.metaClaim,
    },
  ];
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "replyrush",
    competitor: "ReplyRush",
    lastUpdated: "2026-11-13",
    metaTitle: "Liffio vs ReplyRush: DM Caps and Pricing (2026)",
    metaDescription:
      "ReplyRush meters DMs from 1,500 to 400,000 a month. Liffio sends unlimited on every plan, Free included, and adds a chatbot module.",
    heroSubtitle:
      "ReplyRush sells DM volume in four steps: 1,500 a month on Free up to 400,000 on MAX. Liffio does not meter DMs at all, and it ships chatbots as their own module.",
    hubBlurb: "Unmetered DMs and a chatbot module against ReplyRush's four DM-volume tiers.",
    whyIntro: [
      "ReplyRush is built around DM volume. Its four plans, Free, Lite, Boost and MAX, are mostly a ladder of send caps: 1,500 DMs a month, then 7,500, then 40,000, then 400,000. Trigger counts and data retention climb the same ladder, 5 triggers and 30 days of history on Free up to 500 triggers and 365 days on MAX.",
      "That design decides things for you. You pick a tier by guessing next month's comment volume, and a Reel that outperforms costs you an upgrade. Liffio takes volume off the table: every plan, Free included, sends unlimited automated DMs, so what you are choosing between tiers is features rather than headroom.",
      "The other gap is conversation. ReplyRush's own FAQ positions the product as working without complex chatbot setups, and we found no AI chatbot on it: it leans on Flow Automation and a Smart Menu instead. Liffio keeps comment-to-DM simple and puts full DM conversations in a separate chatbot module, with 2 live chatbots on Free, 5 on Starter, 15 on Growth and unlimited on Business.",
    ],
    whyPoints: [
      {
        title: "No DM ladder to climb",
        body: "ReplyRush's Free tier stops at 1,500 DMs a month and even MAX stops at 400,000. Liffio has no monthly DM cap on any plan, so a Reel that triples your comments does not move your bill.",
      },
      {
        title: "ReplyRush's free tier locks the comment trigger",
        body: "On ReplyRush, Free excludes Comment Auto Reply, Follow Gated DM, Email Collector, Follow Up and SendBack. Liffio's free plan runs the comment keyword trigger, public comment replies, 2 live chatbots and a bio link page.",
      },
      {
        title: "Instagram seats are counted, then counted again",
        body: "ReplyRush allows 1 Instagram account on Free and Lite, 3 on Boost and 5 on MAX. Liffio connects one Instagram account per workspace, and the Agency plan bundles 20 workspaces onto a single invoice and renewal date.",
      },
    ],
    tableRows: rows({
      commentDm: "Comment Auto Reply, not on Free",
      storyReplies: true,
      storyMentions: true,
      dmVolume: "1,500/mo Free, 7,500 Lite, 40,000 Boost, 400,000 MAX",
      freePlan: "Yes, without Comment Auto Reply or Email Collector",
      accounts: "1 Free, 1 Lite, 3 Boost, 5 MAX",
      flat: "Four volume tiers, no per-contact fee",
      igOnly: "Instagram and Facebook",
      inr: "Rupee prices listed, GST invoices not stated",
      chatbots: "No AI chatbot, its FAQ says it works without chatbot setups",
      chatbotsSeparate: "No separate chatbot module",
      freeChatbots: "No chatbot module to tier",
      chatbotBuilder: "Flow Automation and Smart Menu instead",
      iceBreakers: "Story triggers yes, ice breakers could not verify",
      chatbotLeadCapture: "Email Collector on paid tiers, webhook step could not verify",
      bioLink: "Could not verify",
      metaClaim: "Says it is an \"Official Meta Business Partner\" that \"operates through official Meta APIs\"",
    }),
    // Verified 2026-11-13 from https://www.replyrush.com/pricing
    // Monthly only, no annual option: $0/₹0, $10/₹900, $25/₹2,100, $100/₹8,400.
    pricing: {
      name: "ReplyRush",
      free: "Yes, $0 or ₹0",
      paidFrom: "$10/month, ₹900 in India, as of November 2026",
      perContact: false,
      instagramOnly: false,
    },
    // Verified 2026-11-13 from https://www.replyrush.com/pricing
    pricingNote:
      "ReplyRush is monthly only, with no annual option: Free at $0 or ₹0, Lite at $10 or ₹900, Boost at $25 or ₹2,100 and MAX at $100 or ₹8,400, all as of November 2026. What each step buys is mostly volume: 1,500, 7,500, 40,000 and 400,000 DMs a month, with 5, 20, 50 and 500 triggers and 30, 180, 180 and 365 days of retention. Liffio charges $9 for Starter, $29 for Growth, $59 for Business and $549 for Agency, or ₹499, ₹1,499, ₹2,499 and ₹22,999, and meters DMs on none of them. Read ReplyRush's current numbers for yourself at https://www.replyrush.com/pricing, since tier contents move.",
    faq: [
      {
        question: "Does ReplyRush use the official Instagram API?",
        answer:
          "ReplyRush's own site describes it as an \"Official Meta Business Partner\" that \"operates through official Meta APIs\". That is the vendor's claim, quoted as written, and we did not independently verify it. Liffio's side of the same question: the business is Meta-verified as a Tech Provider and its Instagram permissions passed Meta's App Review. Either way the practical test is the same. Connect through Instagram Login, approve the permissions on Instagram's own screen, and never type your Instagram password into a third-party tool. A tool that asks for the password is the one to walk away from.",
      },
      {
        question: "What happens on ReplyRush when a Reel goes viral?",
        answer:
          "You spend DM allowance. The caps are 1,500 a month on Free, 7,500 on Lite, 40,000 on Boost and 400,000 on MAX as of November 2026, so a Reel pulling 20,000 comments pushes a Lite or Boost account into an upgrade mid-month. Liffio has no monthly DM cap on any plan. It does add a configurable 10 to 60 second send delay, which spreads delivery so replies arrive at a conversational pace instead of in one burst.",
      },
      {
        question: "Can I keep my ReplyRush trigger keywords?",
        answer:
          "You retype them. There is no import between the two tools, so copy each trigger's keyword, delay and DM text out of ReplyRush first. ReplyRush allows 5 triggers on Free and 20 on Lite, so most accounts have a short list to move. Budget about an hour, rebuild them in Liffio, then run both tools on one quiet post for a few days to confirm delivery before switching ReplyRush off.",
      },
      {
        question: "Does Liffio charge in rupees the way ReplyRush does?",
        answer:
          "Both publish rupee prices. ReplyRush lists ₹900, ₹2,100 and ₹8,400 for Lite, Boost and MAX as of November 2026. Liffio bills ₹499 for Starter, ₹1,499 for Growth, ₹2,499 for Business and ₹22,999 for Agency through Razorpay, and annual billing charges ten months instead of twelve. Whether ReplyRush issues GST invoices is not stated on its pricing page, so the comparison table leaves that unmarked rather than guessing.",
      },
    ],
  },
  {
    slug: "linkdm",
    competitor: "LinkDM",
    lastUpdated: "2026-11-13",
    metaTitle: "Liffio vs LinkDM: Link Delivery vs Chatbots (2026)",
    metaDescription:
      "LinkDM caps DMs at 1,000 to 300,000 a month and offers no link in bio. Liffio has no DM cap and adds a full chatbot module.",
    heroSubtitle:
      "LinkDM puts a link in someone's inbox when they comment, and it does that cleanly. Liffio does the same job without a monthly DM cap, and adds full DM conversations as a separate module.",
    hubBlurb: "No DM cap and a chatbot module against LinkDM's three link-delivery tiers.",
    whyIntro: [
      "LinkDM has a narrow brief and sticks to it. Comment-to-DM fires from Reels, posts, stories, ads and the inbox, story replies and story mentions work, Inbox Starters open a thread, and Flow Automation chains steps. Analytics are click counts. Its own FAQ states that it does not offer a link in bio page in the Linktree sense, which is unusually straight talk for this category.",
      "The limit is volume and depth. LinkDM's November 2026 pricing allows 1,000 DMs a month on Free, 25,000 on Pro and 300,000 on Platinum+, with 1, 3 and 10 Instagram accounts to match. We found no AI chatbot on it. So the real question is not whether LinkDM delivers a link well, because it does, but what happens when the person who got that link replies and wants a conversation.",
      "Liffio answers that with a chatbot module that sits beside comment-to-DM rather than inside it. Free carries 2 live chatbots with 500 conversations a month. Starter adds questions, conditions, media and personalization. Growth adds ice breakers, chain bots and story triggers on the bot itself. Business makes live chatbots unlimited and adds a lead capture step, a webhook step and A/B testing on a single step.",
    ],
    whyPoints: [
      {
        title: "Your bill does not track your comment count",
        body: "LinkDM charges $19 a month for 25,000 DMs and $99 for 300,000, as of November 2026. Liffio's $9 Starter plan has no DM ceiling at all, so a post that outperforms costs nothing extra.",
      },
      {
        title: "A bio link page included, not declined",
        body: "LinkDM's FAQ says it does not provide a link in bio. Liffio ships a bio link page and short links on every plan, Free included, with custom slugs, styling and click tracking on paid plans.",
      },
      {
        title: "Conversations, not only a link drop",
        body: "When a follower replies to a Liffio DM, a chatbot can take the thread: questions, conditions, media, chain bots, and on Business a webhook step that pushes the answers out. LinkDM's published feature set stops at Flow Automation and Inbox Starters.",
      },
    ],
    tableRows: rows({
      commentDm: "Yes, on Reels, posts, stories, ads and the inbox",
      storyReplies: true,
      storyMentions: true,
      dmVolume: "1,000/mo Free, 25,000 Pro, 300,000 Platinum+",
      freePlan: "Yes, 1 account and 1,000 DMs a month",
      accounts: "1 Free, 3 Pro, 10 Platinum+",
      flat: "Three published tiers, no per-contact fee",
      igOnly: "Instagram plus Facebook DM",
      inr: "Priced in USD only",
      chatbots: "No AI chatbot",
      chatbotsSeparate: "No separate chatbot module",
      freeChatbots: "No chatbot module to tier",
      chatbotBuilder: "Flow Automation and Inbox Starters instead",
      iceBreakers: "Inbox Starters yes, chatbot story triggers not applicable",
      chatbotLeadCapture: "Click analytics only, no webhook step published",
      bioLink: "No, its FAQ says it is not a Linktree style link in bio",
      metaClaim: "Says it is a \"certified Meta Business Partner since 2021\" that \"exclusively uses the official Instagram APIs\"",
    }),
    // Verified 2026-11-13 from https://www.linkdm.com/pricing
    // Free $0; Pro $19/mo or $182/yr; Platinum+ $99/mo or $832/yr; Partners and
    // Enterprise are quote-only. NOTE: linkdm.com/features is a 404, do not link it.
    pricing: {
      name: "LinkDM",
      free: "Yes, 1 account and 1,000 DMs/month",
      paidFrom: "$19/month as of November 2026",
      perContact: false,
      instagramOnly: false,
    },
    // Verified 2026-11-13 from https://www.linkdm.com/pricing
    pricingNote:
      "LinkDM publishes Free at $0, Pro at $19 a month or $182 a year, and Platinum+ at $99 a month or $832 a year, with Partners and Enterprise quoted on request. Those are the figures as of November 2026. The tiers buy accounts and DM volume: 1 account and 1,000 DMs a month, then 3 accounts and 25,000, then 10 accounts and 300,000. Liffio's Starter is $9 a month or ₹499, Growth $29 or ₹1,499, Business $59 or ₹2,499 and Agency $549 or ₹22,999, with no DM ceiling on any of them and one Instagram account per workspace. Check LinkDM's own page at https://www.linkdm.com/pricing before you commit, because what sits inside each tier changes.",
    faq: [
      {
        question: "Does LinkDM run on the official Instagram API?",
        answer:
          "LinkDM's site describes it as a \"certified Meta Business Partner since 2021\" that \"exclusively uses the official Instagram APIs\". We are repeating the vendor's wording there, not confirming it. On the Liffio side, the business is Meta-verified as a Tech Provider and the Instagram permissions passed Meta's App Review. The useful check for any tool in this category is identical: you should be approving permissions on Instagram's own consent screen, and no tool should ever ask you to enter your Instagram password.",
      },
      {
        question: "Does LinkDM give me a link in bio page?",
        answer:
          "No, and it says so itself: LinkDM's FAQ states that it does not offer a link in bio page the way Linktree does. Its job is delivering a link inside a DM. Liffio includes a bio link page and short links on every plan including Free, so the link on your profile and the automation that sends links live in one tool. Paid plans add a custom slug, styling, click tracking and the option to hide the Liffio badge.",
      },
      {
        question: "Is $19 a month for 25,000 DMs good value?",
        answer:
          "It depends entirely on staying under 25,000. That is LinkDM's Pro allowance as of November 2026, against 1,000 a month on Free and 300,000 on Platinum+ at $99. Liffio's Starter is $9 a month with no allowance to run down, so the choice is $19 for a ceiling against $9 for none. In fairness, if you genuinely expect under a thousand DMs a month forever, LinkDM's free tier covers you and nothing here beats free.",
      },
      {
        question: "How long does moving off LinkDM take?",
        answer:
          "Most accounts finish inside two hours. List your LinkDM automations with their keyword, destination link and any delay, connect Instagram to Liffio through Instagram Login, then rebuild them. Keep both live on one low-traffic post for a few days and watch for duplicate DMs, since both tools will answer the same comment. Once Liffio is delivering, turn the LinkDM automations off and revoke its access in your Instagram app settings.",
      },
    ],
  },
  {
    slug: "superprofile",
    competitor: "SuperProfile",
    lastUpdated: "2026-11-13",
    metaTitle: "Liffio vs SuperProfile: Chatbots or Creator Suite",
    metaDescription:
      "SuperProfile does real comment-to-DM with typo and Hinglish intent matching, but has no chatbot layer. Liffio adds one, flat priced.",
    heroSubtitle:
      "SuperProfile is a real comment-to-DM competitor, with intent matching that copes with typos and Hinglish. What it has no layer for is a full DM conversation, which is where Liffio's chatbot module comes in.",
    hubBlurb: "SuperProfile matches intent well and has no chatbot layer. Liffio has both.",
    whyIntro: [
      "SuperProfile deserves a correction that older comparisons get wrong, including an older version of this page: it is not a storefront with DMs bolted on. It triggers on comments, story replies, Live comments and inbound DMs. Its keyword matching works on intent rather than exact strings, so typos and Hinglish phrasings still fire. Creator connects up to 5 Instagram accounts, and it reports runs and clicks per automation. That is a genuine competitor on the automation itself.",
      "The missing layer is conversation. SuperProfile has no chatbot: AI replies and comment moderation are available on a paid plan, but there is no step builder that asks a question, reads the answer against a condition, sends media and hands the thread on. Liffio's chatbot module does exactly that, and it is priced into every tier: 2 live bots on Free with 500 conversations a month, 5 on Starter with questions, conditions, media and personalization, 15 on Growth with ice breakers and chain bots, unlimited on Business with lead capture, a webhook step and A/B testing on a step.",
      "The second difference is what else you are paying for. SuperProfile wraps the automation in an all-in-one creator platform: link-in-bio storefront, digital products, courses, communities, events and coaching. If you want that platform, the automation effectively comes with it and the bundle is good value. If all you want is Instagram DM automation, you are buying a lot of surface you will never open.",
    ],
    whyPoints: [
      {
        title: "A chatbot layer SuperProfile does not have",
        body: "SuperProfile's paid plans add AI replies and comment moderation, which is not a conversation builder. Liffio's chatbots are steps you design: questions, conditions, media, chain bots, and on Business a lead capture step and a webhook step.",
      },
      {
        title: "The free plans are limited in different ways",
        body: "SuperProfile's Starter is free forever with unlimited AutoDMs on Reels and posts, but one keyword per automation and 10 leads through lead magnets, and Stories, Lives, scheduling and AI replies need a paid plan. Liffio's free plan runs 2 live chatbots and the comment keyword trigger with no DM cap.",
      },
      {
        title: "At the same rupee price, you are buying different things",
        body: "SuperProfile's Creator plan settles at ₹499 a month, or $29 globally, after a promotional first month, as of November 2026. Liffio's Starter is ₹499 or $9. So in India the rupee figure is identical and the question is which product you actually want.",
      },
    ],
    tableRows: rows({
      commentDm: "Yes, Reels and posts on Free, Stories and Lives need a paid plan",
      storyReplies: "Yes, on a paid plan",
      storyMentions: "Could not verify",
      dmVolume: "Unlimited AutoDMs on Reels and Posts, Free included",
      freePlan: "Starter free forever, 1 keyword per automation, 10 lead magnet leads",
      accounts: "Up to 5 on Creator",
      flat: "Suite pricing, no per-contact fee",
      igOnly: "No, a full creator platform: storefront, courses, communities, events",
      inr: "Yes, rupee price list; GST invoices not stated",
      chatbots: "No chatbot layer",
      chatbotsSeparate: "No chatbot module to separate",
      freeChatbots: "Not offered",
      chatbotBuilder: "AI replies and moderation on a paid plan, not a step builder",
      iceBreakers: "Live comment and inbound DM triggers instead",
      chatbotLeadCapture: "Lead magnets capture leads, webhook step could not verify",
      bioLink: true,
      metaClaim: "Says automation runs through \"Meta's official messaging API\", and warns against tools that ask for your password",
    }),
    // Verified 2026-11-13 from https://superprofile.bio/in/pricing and
    // https://superprofile.bio/pricing
    // India: Starter free forever; Creator ₹99 first month then ₹499; Pro quote-only.
    // Global: Starter free; Creator $4.99 first month then $29/mo; Pro quote-only.
    // Annual prices are not listed on either page: could not verify.
    pricing: {
      name: "SuperProfile",
      free: "Yes, Starter free forever",
      paidFrom: "$29/month, ₹499 in India, after a promo month, as of November 2026",
      perContact: false,
      instagramOnly: false,
    },
    // Verified 2026-11-13 from https://superprofile.bio/in/pricing and
    // https://superprofile.bio/pricing
    pricingNote:
      "SuperProfile's India list is a free-forever Starter, a Creator plan at ₹99 for the first month and ₹499 after that, and a Pro plan on a custom quote. Globally that is a free Starter, Creator at $4.99 for the first month and $29 a month after, and Pro by quote. All of those are as of November 2026, and annual prices are not listed on either page, so we could not verify them. Liffio's Starter is ₹499 or $9 a month, Growth ₹1,499 or $29, Business ₹2,499 or $59 and Agency ₹22,999 or $549. In rupees, SuperProfile's Creator and Liffio's Starter both land on ₹499, so price is not the deciding factor in India: product shape is. SuperProfile's current figures are at https://superprofile.bio/in/pricing.",
    faq: [
      {
        question: "Does SuperProfile actually do comment-to-DM, or just storefronts?",
        answer:
          "It genuinely does comment-to-DM, and anyone saying otherwise has not looked recently. SuperProfile triggers on comments, story replies, Live comments and inbound DMs, and its keyword matching works on intent, so a misspelled keyword or a Hinglish phrasing still fires the automation. Creator connects up to 5 Instagram accounts and reports runs and clicks per automation. The gap is not the trigger, it is what happens after the first DM lands.",
      },
      {
        question: "Is SuperProfile's Instagram connection safe?",
        answer:
          "SuperProfile states that its automation runs through \"Meta's official messaging API\", and it warns readers against tools that ask for an Instagram password, which is sound advice whoever gives it. That is the vendor's own account of its setup, repeated here rather than independently confirmed. Liffio's position is a Meta-verified Tech Provider business with Instagram permissions approved through Meta's App Review. On either tool, approve permissions on Instagram's screen and revoke them from Instagram when you want out.",
      },
      {
        question: "What does Liffio's chatbot module do that SuperProfile cannot?",
        answer:
          "Hold a conversation with structure. A Liffio chatbot asks a question, reads the answer against conditions, sends media, chains into another bot, and from Business up writes the answers into your leads list or pushes them to a webhook, with A/B testing on a single step. SuperProfile offers AI replies and moderation on a paid plan, which answers messages but does not give you a flow you designed and can inspect. If your DM strategy ends at delivering a link, you will not miss it.",
      },
      {
        question: "I already use SuperProfile for digital products. Should I switch?",
        answer:
          "Probably not wholesale. If your storefront, courses, communities, events or coaching already run there, tearing all that out to change DM tools makes no sense. Liffio has a bio link page and short links, but it is not a monetization platform and does not pretend to be. A sensible split is keeping SuperProfile for selling and running Liffio for automation, with any given automation live in only one tool so a single comment does not produce two DMs.",
      },
    ],
  },
  {
    slug: "zorcha",
    competitor: "Zorcha",
    lastUpdated: "2026-11-13",
    metaTitle: "Liffio vs Zorcha: Who Meters What (2026)",
    metaDescription:
      "Zorcha does not meter DMs either. It meters AI credits and takes 1 to 8% of digital sales. Here is where Liffio and Zorcha really differ.",
    heroSubtitle:
      "Zorcha is the one rival that also leaves DMs unlimited, Free included. So this comparison is about what each tool does meter: AI credits and a sales fee on one side, plan features on the other.",
    hubBlurb: "Both leave DMs unlimited. Zorcha meters AI credits and takes a cut of digital sales.",
    whyIntro: [
      "Start with the thing most comparison pages get wrong about Zorcha, this one included until now: it does not cap DMs. Its pricing pages list unlimited automations, unlimited DMs and unlimited contacts on every tier, Free included. Liffio's usual headline, unlimited DMs on every plan, is therefore not a differentiator here, and claiming it as one would be dishonest.",
      "What Zorcha meters is AI and sales. AI FAQs run 20, 40, 80 and 80 across Free, Pro, Ultimate and Business. AI credits run 15,000, then 150,000, then 1.5 million, then 7.5 million. And Zorcha takes a digital product fee of 8%, 5%, 3% and 1% by tier. Its Free plan separately withholds the Flow Builder, Follow Up, Segments, Broadcasts, Personalised DMs, DM Variations and Re Run. So the free tier sends as much as you like with the builder locked.",
      "Zorcha Software Pvt Ltd is an Indian company publishing a rupee price list alongside dollars, which also removes the India advantage Liffio normally has. The remaining differences are narrower and more specific. Zorcha's AI FAQ answers questions out of a metered credit pool. Liffio's chatbots are a step builder you own outright, with conditions, media, chain bots, A/B testing on a step and a webhook step, and no credit meter behind any of it.",
    ],
    whyPoints: [
      {
        title: "A chatbot builder, not a metered FAQ",
        body: "Zorcha's AI FAQ allows 20 questions on Free and 80 at the top, drawing on an AI credit pool. Liffio's chatbots are structural: 15 steps and 5 keywords per bot on Free, and unlimited steps, keywords and condition rules on Business, with no credit meter.",
      },
      {
        title: "No cut of what you sell",
        body: "Zorcha charges a digital product fee of 8% on Free, falling to 5%, 3% and 1% as you move up. Liffio takes no percentage of your sales, so what you charge is what you keep.",
      },
      {
        title: "A stated Instagram account limit",
        body: "Zorcha's pricing pages do not state an Instagram account limit on any tier, so there is none to report. Liffio connects one Instagram account per workspace, and Agency includes 20 workspaces on a single invoice.",
      },
    ],
    tableRows: rows({
      commentDm: true,
      storyReplies: "Yes, but documented in a blog post, not on a product page",
      storyMentions: "Could not verify",
      dmVolume: "Unlimited on every tier, Free included",
      freePlan: "Yes, but no Flow Builder, Follow Up, Segments or Broadcasts",
      accounts: "Not stated on their pricing pages",
      flat: "Flat tiers, plus AI credit caps and a 1 to 8% digital product fee",
      igOnly: "Instagram plus Facebook DM",
      inr: "Yes, an Indian company with a rupee list; GST invoices not stated",
      chatbots: "AI FAQ replies, metered, rather than a general chatbot",
      chatbotsSeparate: "Flow Builder is the paid builder, AI FAQ is a separate thing",
      freeChatbots: "Flow Builder not on Free, 20 AI FAQs are",
      chatbotBuilder: "Flow Builder on paid tiers",
      iceBreakers: "Could not verify",
      chatbotLeadCapture: "Email and phone capture yes, webhook step could not verify",
      bioLink: true,
      metaClaim: "Says \"Zorcha is a Meta Tech Provider\" that \"uses official Meta APIs\"",
    }),
    // Verified 2026-11-13 from https://zorcha.com/pricing/ and https://zorcha.com/in/pricing/
    // USD monthly: $0 / $14.99 / $39.99 / $109.99. USD annual per month: $9.99 / $24.99 / $79.99.
    // INR monthly: ₹0 / ₹1,199 / ₹2,999 / ₹8,999. INR annual per month: ₹799 / ₹1,999 / ₹5,999.
    pricing: {
      name: "Zorcha",
      free: "Yes, $0 or ₹0, builder locked",
      paidFrom: "$14.99/month, ₹1,199 in India, as of November 2026",
      perContact: false,
      instagramOnly: false,
    },
    // Verified 2026-11-13 from https://zorcha.com/pricing/ and https://zorcha.com/in/pricing/
    pricingNote:
      "Zorcha prices monthly at $0, $14.99, $39.99 and $109.99 for Free, Pro, Ultimate and Business, or on annual billing at $9.99, $24.99 and $79.99 a month for the paid three. In rupees that is ₹0, ₹1,199, ₹2,999 and ₹8,999 monthly, and ₹799, ₹1,999 and ₹5,999 a month annually. All as of November 2026. DMs, automations and contacts are unlimited on every one of those tiers, so compare on the meters that do exist: AI FAQ counts, AI credits, and the digital product fee of 8% down to 1%. Liffio's equivalents are $9, $29, $59 and $549, or ₹499, ₹1,499, ₹2,499 and ₹22,999, with no AI credit pool and no cut of sales. Zorcha's current numbers are at https://zorcha.com/pricing/.",
    faq: [
      {
        question: "Does Zorcha really not limit DMs?",
        answer:
          "Correct, and we will not pretend otherwise to win a row in a table. Zorcha's pricing pages as of November 2026 list unlimited automations, unlimited DMs and unlimited contacts on all four tiers, Free included. Liffio also sends unlimited automated DMs on every plan, so on volume these two are level and any page telling you Zorcha meters DMs is wrong. The questions worth asking instead are what each tool does meter, and how far its builder goes.",
      },
      {
        question: "Is Zorcha connected to Meta properly?",
        answer:
          "Zorcha's site says \"Zorcha is a Meta Tech Provider\" and that it \"uses official Meta APIs\". That is their claim as published, and we have not independently verified it. Liffio is also a Meta-verified Tech Provider, with Instagram permissions granted through Meta's App Review. Both statuses are table stakes rather than a selling point. What matters in practice is that you authorize the tool on Instagram's own consent screen, and that no tool ever asks you for your Instagram password.",
      },
      {
        question: "Zorcha prices in rupees too. Does Liffio still make sense in India?",
        answer:
          "On currency alone it is a tie. Zorcha Software Pvt Ltd is an Indian company with a rupee price list, and Liffio bills in rupees through Razorpay. The tiebreakers sit elsewhere. Zorcha's Free plan withholds the Flow Builder, Follow Up, Segments, Broadcasts, Personalised DMs, DM Variations and Re Run, while Liffio's free plan includes 2 live chatbots, the comment keyword trigger, public replies, a bio link page and overview analytics. And if you sell digital products, Zorcha's fee starts at 8% of each sale.",
      },
      {
        question: "What about story automations on Zorcha?",
        answer:
          "Only partly verifiable. Story replies appear in a Zorcha blog post but not on any product page, and story mentions we could not confirm at all, so the table marks both rather than scoring them either way. Liffio's story replies and story mentions both ship and are not behind a flag, and from Growth up a chatbot can be triggered by a story reply or a story mention as well. Story reactions, the emoji kind, are not live on Liffio and are not claimed anywhere.",
      },
    ],
  },
  {
    slug: "instachamp",
    competitor: "InstaChamp",
    lastUpdated: "2026-11-13",
    metaTitle: "Liffio vs InstaChamp: A Legacy Tool in 2026",
    metaDescription:
      "InstaChamp's own domain redirects to a parking page and its pricing is not publicly listed. What that means if you were about to buy.",
    heroSubtitle:
      "InstaChamp now lives inside Customers.ai, its old domain redirects to a for-sale page, and its pricing is not publicly listed as of November 2026. Liffio publishes every number it charges.",
    hubBlurb: "A published, maintained price list against InstaChamp's unlisted pricing and parked domain.",
    whyIntro: [
      "Check where InstaChamp lives before you check anything else. instachamp.com is a dead domain that redirects to a GoDaddy for-sale parking page. The product now sits inside Customers.ai, the company formerly called MobileMonkey, branded InstaChamp by Customers.ai, and login still goes to app.mobilemonkey.com. Customers.ai files it under Other Products while the company's own focus has moved to ecommerce visitor identification.",
      "Then try to find out what it costs. The InstaChamp page shows Platinum at $19 a month and at $9.95 a month simultaneously, behind a rotating promotional banner, and customers.ai/pricing publishes no priced plans at all. So the honest statement is that InstaChamp pricing is not publicly listed as of November 2026, and neither of those two conflicting numbers is printed here as fact.",
      "What is documented is the shape of the model: a promotional free tier with 250 contacts and 10 branding-free sends, then per-contact pricing plus metered sends, with overage at $5 per 1,000 sends and $10 per 500 contacts. Story mention replies and keyword triggers cap at 5 on VIP and are unlimited on Platinum. Liffio's model has neither a contact count nor a send meter: unlimited automated DMs on every plan, Free included, at $9, $29, $59 and $549, or ₹499, ₹1,499, ₹2,499 and ₹22,999.",
    ],
    whyPoints: [
      {
        title: "You can read the price before you sign up",
        body: "Liffio's five tiers are published in dollars and rupees, with annual totals. InstaChamp's are not publicly listed as of November 2026, and the one page showing numbers shows two different ones for the same plan.",
      },
      {
        title: "Contacts and sends are not the unit of billing",
        body: "InstaChamp bills per contact plus metered sends, with overage at $5 per 1,000 sends and $10 per 500 contacts. Liffio charges a flat monthly fee and counts neither, so a month with ten times the comments costs exactly the same.",
      },
      {
        title: "A product that is still the main product",
        body: "Customers.ai lists InstaChamp under Other Products while it builds ecommerce visitor identification. Instagram DM automation is the whole of what Liffio does, which is where every release goes.",
      },
    ],
    tableRows: rows({
      commentDm: true,
      storyReplies: "Could not verify",
      storyMentions: "Story mention replies: 5 on VIP, unlimited on Platinum",
      dmVolume: "Metered sends, overage $5 per 1,000 sends",
      freePlan: "Promotional only: 250 contacts and 10 branding-free sends",
      accounts: "Could not verify",
      flat: "No, per-contact plus metered sends",
      igOnly: "No, part of Customers.ai, whose focus is ecommerce visitor identification",
      // No pricing of any kind is publicly listed, so there is no rupee price
      // to read. That is not the same as a vendor that publishes USD only.
      inr: "No pricing published at all, so no rupee price to read",
      chatbots: "Conversation paths, from the MobileMonkey lineage",
      chatbotsSeparate: "Conversation paths are the same builder as the triggers",
      freeChatbots: "Free tier is promotional, bot limits not publicly listed",
      chatbotBuilder: "Conversation paths, tiering not publicly listed",
      iceBreakers: "Keyword triggers: 5 on VIP, unlimited on Platinum",
      chatbotLeadCapture: "Could not verify",
      bioLink: "Could not verify",
      metaClaim: "Says it is \"powered by the one and only Meta Messenger API\", and does not say official Instagram API",
    }),
    // Verified 2026-11-13 from https://customers.ai/instachamp and https://customers.ai/pricing
    // Pricing is NOT publicly listed. The InstaChamp page shows Platinum at
    // "$19 / month" and "$9.95 / month" at the same time behind a rotating
    // "THIS WEEK!" promo banner, and customers.ai/pricing publishes no priced
    // plans at all. Do NOT publish either conflicting number as fact.
    // instachamp.com itself 307-redirects to a GoDaddy for-sale parking page.
    pricing: {
      name: "InstaChamp",
      free: "Promotional: 250 contacts, 10 sends",
      paidFrom: "Not publicly listed as of November 2026",
      perContact: true,
      instagramOnly: false,
    },
    // Verified 2026-11-13 from https://customers.ai/instachamp and https://customers.ai/pricing
    pricingNote:
      "InstaChamp pricing is not publicly listed as of November 2026. The customers.ai/instachamp page shows Platinum at both $19 a month and $9.95 a month at once behind a rotating weekly promotion, and customers.ai/pricing carries no priced plans, so neither figure is reported here as fact. What is stated is the structure: a promotional free tier of 250 contacts and 10 branding-free sends, then per-contact pricing with metered sends, overage at $5 per 1,000 sends and $10 per 500 contacts. Liffio's list is fixed and public: $0, $9, $29, $59 and $549 a month, or ₹0, ₹499, ₹1,499, ₹2,499 and ₹22,999, with unlimited automated DMs on all of them. If you need InstaChamp's real number, ask Customers.ai for it at https://customers.ai/instachamp, because the page will not tell you.",
    faq: [
      {
        question: "Is InstaChamp still being sold?",
        answer:
          "In a limited way. The instachamp.com domain redirects to a GoDaddy parking page, the product is reachable only as InstaChamp by Customers.ai, and login still runs through app.mobilemonkey.com. Customers.ai lists it under Other Products while selling ecommerce visitor identification as its main line. Treat it as a legacy product. That is not an accusation, it is what the vendor's own site structure says about where the attention goes.",
      },
      {
        question: "What does InstaChamp claim about its Meta access?",
        answer:
          "Its page says the product is \"powered by the one and only Meta Messenger API\". Notably it does not say official Instagram API, and we did not verify either way. Liffio's Instagram access comes through Meta's Instagram API: the business is Meta-verified as a Tech Provider and the permissions passed Meta's App Review. When you evaluate any tool here, read which API it actually names, then authorize on Instagram's own consent screen and keep your password to yourself.",
      },
      {
        question: "How do per-contact fees add up next to a flat plan?",
        answer:
          "InstaChamp charges by contacts held plus sends used, with published overage at $10 per 500 contacts and $5 per 1,000 sends. A list of 10,000 contacts receiving two DMs each is a contact bill plus 20,000 metered sends on top. On Liffio the same month costs the plan fee and nothing else, because contacts carry no price and DMs are not metered on any plan, Free included. That is the whole of the pricing argument here.",
      },
      {
        question: "What would I lose by moving off InstaChamp?",
        answer:
          "Mostly caps. InstaChamp allows 5 keyword triggers and 5 story mention replies on VIP, unlimited on Platinum, and its conversation paths are the builder you would be leaving behind. Liffio's story replies and story mentions both ship, and chatbots are a separate module: 2 live bots on Free, 5 on Starter, 15 on Growth, unlimited on Business, with lead capture and a webhook step from Business up. Multi-account support and analytics on InstaChamp we could not verify, so check those inside your own account before you cancel.",
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
  // Both tools publish rupee prices and both lift the DM cap on paid plans, so
  // this blurb must not claim either as a Liffio-only edge.
  { name: "SendDM", href: "/senddm-alternative", blurb: "No DM cap on the free plan, and chatbots as their own module, vs SendDM." },
  { name: "Chatfuel", href: "/chatfuel-alternative", blurb: "Instagram-first simplicity, with chatbots as their own module, vs Chatfuel's bot builder." },
] as const;
