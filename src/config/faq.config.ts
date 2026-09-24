import { metaCopy } from "@/config/meta-copy";
import {
  FEATURE_COLLECT_DATA_PROMPTS,
  FEATURE_CRM_INTEGRATION,
  FEATURE_STORY_REACTIONS,
  FEATURE_WELCOME_DM,
} from "@/config/feature-flags";
import {
  getCreatorsProgramFaqAnswer,
  getFreePlanFaqAnswer,
  getPlansOfferedFaqAnswer,
} from "@/config/pricing.config";
import type { PricingRegion } from "@/lib/pricing-region";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export type MarketingFaqOverrides = {
  freePlanFaqAnswer?: string;
  plansOfferedFaqAnswer?: string;
  creatorsProgramFaqAnswer?: string;
};

function plansCategory(region: PricingRegion, overrides?: MarketingFaqOverrides): FaqCategory {
  return {
    id: "plans",
    label: "Plans & billing",
    items: [
      {
        id: "starter-free",
        question: "Is the Free plan really free?",
        answer: overrides?.freePlanFaqAnswer ?? getFreePlanFaqAnswer(region),
      },
      {
        id: "plans-offered",
        question: "What plans does Liffio offer?",
        answer: overrides?.plansOfferedFaqAnswer ?? getPlansOfferedFaqAnswer(region),
      },
      {
        id: "billing-cycle",
        question: "Can I pay monthly or annually?",
        answer:
          "Yes. All paid plans are available on monthly or annual billing. Annual billing charges 10 months instead of 12, so two months are free. Payments are handled via Razorpay.",
      },
      {
        id: "dm-limit",
        question: "Are automated DMs unlimited?",
        answer:
          "Yes, on every plan, Free included. There is no monthly cap on how many automated DMs you can send, and no per-contact fees. What changes by plan is the number of automation workflows: 3 on Free, 25 on Starter, 100 on Growth and 250 on Business.",
      },
      {
        // The ONLY "How do I cancel my subscription?" node on the site. This
        // category and `userSupportCategory` both land in the single /help
        // FAQPage, so the near-identical question that used to sit there (id
        // "cancel-subscription") emitted a duplicate Question in one mainEntity
        // array, with a different cancellation path in its answer. That copy is
        // gone; its navigation path (Settings → Billing → Cancel Plan, the same
        // one the "delete-workspace" answer names) survives here.
        id: "cancel",
        question: "How do I cancel my subscription?",
        answer:
          "Go to Settings → Billing in your Liffio dashboard and click Cancel Plan. There is no cancellation fee and no notice period: your plan keeps every feature until the end of the current billing period, which can be up to 12 months on annual billing, and is simply not charged again. You can resubscribe at any time.",
      },
      {
        id: "creators-program",
        question: "Do you offer a Creators Program?",
        answer: overrides?.creatorsProgramFaqAnswer ?? getCreatorsProgramFaqAnswer(region),
      },
    ],
  };
}

const geoComplianceCategory: FaqCategory = {
  id: "instagram-dm-automation",
  label: "Instagram DM automation",
  items: [
    {
      id: "does-instagram-allow-automation",
      question: "Does Instagram allow DM automation?",
      answer:
        "Yes. Instagram permits DM automation through its official API, which is part of Meta's developer platform. Tools that connect via the official API using OAuth, rather than scraping or using your password, are the path Instagram's platform policy allows. Liffio integrates exclusively through this official API using OAuth: you approve the permissions on Meta's consent screen when you connect, and you can revoke access at any time from your Instagram settings. Never passwords, scraping, or unofficial endpoints. The distinction matters practically: tools operating outside the official API (browser automation, credential scraping, or unofficial endpoints) work outside Meta's permitted use guidelines, which is where account risk comes from.",
    },
    {
      id: "what-is-comment-to-dm",
      question: "What is comment-to-DM automation on Instagram?",
      answer:
        "Comment-to-DM automation sends a direct message to someone automatically when they comment a specific keyword on your Instagram post or Reel. Here is how it works: you connect your Instagram account via the official API, choose a post, set a trigger keyword (such as LINK, PRICE, or GUIDE), and write a DM template. When any commenter types that keyword, the automation fires and sends your pre-written DM, after a short configurable delay of 10 to 60 seconds, without you doing anything manually. For example: you post a Reel about a digital product and tell viewers to comment FREE to get the download link. Every person who comments that word receives the link in their inbox automatically, even if you are asleep or offline. One limitation: comment-to-DM only fires on posts you explicitly enable it for. It does not apply to all posts on your account automatically.",
    },
    {
      id: "will-instagram-ban",
      question: "Will Instagram ban my account for using DM automation?",
      answer:
        "Instagram's enforcement targets tools that access accounts by logging in with your password, simulating browser behavior, or using unofficial endpoints. The official Instagram API works differently. You authorize Liffio through Meta's own OAuth screen, the same login flow used by major apps like Hootsuite or Later. Your password is never entered into Liffio at any point, and Liffio never stores credentials. Meta issues an access token directly to Liffio, which you can revoke at any time from your Instagram settings under Apps and Websites. Liffio also adds a configurable 10 to 60 second delay between trigger and send, so each automated reply arrives at a natural conversational pace for the person receiving it rather than as an instant blast.",
    },
    {
      id: "can-you-automate-dm-replies",
      question: "Can you automate Instagram DM replies?",
      answer:
        `Yes. With keyword-trigger tools like Liffio, you can automate replies to incoming Instagram interactions such as comments on posts and Reels, story replies, ${FEATURE_WELCOME_DM ? "inbound DMs, and new follower events" : "and inbound DMs"}. Each automation type works through the same mechanism: you define a trigger condition (a keyword or a reply), write the message, and set a delay. When the trigger fires, Liffio sends the message automatically via Instagram's official API. For example: if you run a coaching business, you could set up a DM trigger so that anyone who sends you the word APPLY in a DM receives your application form link, without you checking your inbox. The delay is configurable between 10 and 60 seconds per automation, so replies arrive at a natural conversational pace for the recipient instead of landing the instant they comment.`,
    },
    {
      id: "cheapest-manychat-alternative",
      question: "What is the cheapest ManyChat alternative for Instagram?",
      answer:
        "Liffio. It has a free plan with no credit card required that runs comment-to-DM automation in production, not just as a demo. Paid plans start at $9/month. For comparison: since ManyChat's March 2026 pricing change, its free tier is capped at 25 Active Contacts per month, and paid plans start at $14/month for 250 contacts with per-contact overage fees as your audience grows. SendDM and LinkDM are simpler tools with focused feature sets; pricing varies. SuperProfile bundles bio-link storefronts with automation and prices accordingly. What makes Liffio structurally cheaper for Instagram-focused creators is that there are no per-contact fees. You pay the same $9/month whether you automate DMs to 100 people or 10,000 people. ManyChat charges based on how many people you interact with each month, which means a single viral Reel can trigger overage charges unexpectedly. The free plan includes one Instagram account, 3 automation workflows, comment keyword triggers, and basic analytics. That is enough to validate whether automation works for your use case before paying anything.",
    },
  ],
};

const seoDiscoveryCategory: FaqCategory = {
  id: "auto-dm-tools",
  label: "Auto DM tools",
  items: [
    {
      id: "what-is-auto-dm-tool",
      question: "What is an auto DM tool?",
      answer:
        "An auto DM tool (also called auto DM software or DM automation tool) sends Instagram direct messages automatically when a trigger fires - for example a keyword in a comment, a story reply, or an inbound DM. Liffio is an auto DM tool that lets you set delays (10 to 60 seconds), personalize messages, and run comment-to-DM flows without manual inbox work.",
    },
    {
      id: "what-are-auto-dms",
      question: "What are auto DMs and how do they work?",
      answer:
        "Auto DMs are automated direct messages sent by an auto DM tool when someone triggers a specific action - like commenting a keyword on your post, replying to your story, or sending you a DM. With Liffio's auto DMs, you set up the trigger once, and the tool sends your pre-written message automatically 24/7.",
    },
    {
      id: "auto-comment-tool",
      question: "What is an auto comment tool for Instagram?",
      answer:
        "An auto comment tool (or auto comment reply tool) replies publicly under your Instagram post and can send a matching private DM. Liffio combines auto comment reply with comment-to-DM automation so one keyword trigger handles both the public reply and the automated DM - the signature workflow of tools like ManyChat.",
    },
    {
      id: "best-auto-dm-tool",
      question: "What is the best auto DM tool for Instagram?",
      answer:
        "The best auto DM tool depends on your needs. Liffio is ideal for creators and brands who want unlimited auto DMs on every plan, Free included, simple pricing, and a free tier. We offer the same comment-to-DM, auto comment reply, and story automation features as ManyChat, SendDM, and SuperProfile - without per-message fees.",
    },
    {
      id: "free-auto-dm-tool",
      question: "Is there a free auto DM tool for Instagram?",
      answer:
        "Yes! Liffio offers a free auto DM tool tier that lets you get started with Instagram DM automation without a credit card. The free plan includes comment-to-DM automation, public comment replies, unlimited DMs and the full post scheduler, enough to test if auto DMs work for your business.",
    },
    {
      id: "manychat-senddm-linkdm",
      question: "How does Liffio compare to ManyChat, SendDM, or LinkDM?",
      answer:
        "Like ManyChat, SendDM, LinkDM, and SuperProfile, Liffio supports keyword triggers, comment-to-DM, auto comment reply, story reply automation, and multi-step DM flows for Instagram. Liffio focuses on Instagram DM automation with unlimited auto DMs on every plan, Free included, simple pricing, and a generous free tier, making it a top ManyChat alternative.",
    },
    {
      id: "dm-automation-tool",
      question: "Is Liffio a DM automation tool or a dming tool?",
      answer:
        "Both terms describe the same workflow: automating Instagram DMs at scale. Liffio is a DM automation tool (also called a dming tool, auto DM software, or Instagram auto DM tool) for creators, coaches, and brands who want auto DMs from comments, stories, and the inbox.",
    },
    {
      id: "comment-to-dm",
      question: "How does comment-to-DM automation work?",
      answer:
        'Comment-to-DM is the core feature of any auto DM tool. You choose keywords (for example "LINK" or "GUIDE"). When someone comments that word on a post or Reel, Liffio sends your auto DM after your chosen delay and can post a public auto comment reply under their comment - the same pattern used by ManyChat, SendDM, and other Instagram auto DM tools.',
    },
    {
      id: "instagram-auto-reply",
      question: "What is Instagram auto reply?",
      answer:
        "Instagram auto reply refers to any automated response sent when someone interacts with your account - via comments, stories, or DMs. Liffio's auto reply features include auto DMs from comments, story reply automation, and DM auto responders. All powered by the same auto DM tool technology.",
    },
    {
      id: "auto-dm-safe",
      question: "Are auto DM tools safe for my Instagram account?",
      answer:
        "Yes, when you use a compliant auto DM tool like Liffio. We use official Instagram APIs, configurable send delays (10-60 seconds), and rate limiting. Unofficial bots that log in with your password or simulate a browser operate outside Meta's permitted use guidelines. Liffio connects only through Meta's OAuth consent flow.",
    },
  ],
};

/** Region-aware FAQ used across the marketing site */
/**
 * FAQ set for pages that must NOT depend on the visitor's pricing region.
 * Identical to getFaqCategories() minus the "Plans & billing" category,
 * the only region-dependent block (INR vs USD amounts). Letting legal pages
 * use this keeps them statically renderable: no getPricingContext(), so no
 * headers() call, so no forced dynamic render.
 */
export function getRegionFreeFaqCategories(): FaqCategory[] {
  return getFaqCategories("global").filter((category) => category.id !== "plans");
}

export function getFaqCategories(region: PricingRegion, overrides?: MarketingFaqOverrides): FaqCategory[] {
  return [
    geoComplianceCategory,
    seoDiscoveryCategory,
    {
      id: "getting-started",
      label: "Getting started",
      items: [
        {
          id: "connect-instagram",
          question: "How do I connect my Instagram account?",
          answer: metaCopy.helpConnectAnswer,
        },
        {
          id: "setup-time",
          question: "How long does setup take?",
          answer:
            "Most creators connect Instagram and send their first automated DM in under five minutes. Pick a trigger, write your message, set your delay (10 to 60 seconds), and go live. No credit card required.",
        },
        {
          id: "keyword-triggers",
          question: "What are keyword triggers?",
          answer:
            'Keyword triggers are words or phrases in a comment that start an automation. If someone comments "LINK" on your post, Liffio can send them your link in DMs after your configured delay.',
        },
      ],
    },
    {
      id: "automations",
      label: "Automations & DMs",
      items: [
        {
          id: "dm-speed",
          question: "How quickly are automated DMs sent?",
          answer:
            "DMs send after your chosen delay - from 10 to 60 seconds after the trigger (comment, story reply, etc.). You control the timing so replies land at a natural conversational pace while staying on autopilot.",
        },
        {
          // Answers the question a reader is actually asking ("will I run
          // out?"): no, on any plan. DMs are unlimited everywhere, Free included.
          id: "what-counts-dm",
          question: "What counts as one automated DM?",
          answer:
            "Each automated message sent to a unique user counts as one DM, and follow-up replies within the same conversation thread do not count again. Every plan, Free included, is uncapped: no monthly DM quota, no per-message fee, and no contact limits.",
        },
        {
          // "and more - depending on your plan" was the opposite of citable: no
          // number, no closed list, nothing an answer engine can quote. The
          // trigger list is unchanged apart from spelling out the two it already
          // implied; the plan figures come from the limits in pricing-v4.config.
          id: "automation-types",
          question: "What can Liffio automate?",
          answer:
            `Liffio automates comment-to-DM, ${FEATURE_STORY_REACTIONS ? "story mentions and reactions" : "story replies and story mentions"}, ${FEATURE_WELCOME_DM ? "welcome DMs for new followers, " : ""}inbound DM replies, ask for follow, follow-up sequences, and data collection. Each automation sends its DM after a delay you set between 10 and 60 seconds. The Free plan includes 3 automation workflows, Starter 25, Growth 100, and Business 250.`,
        },
      ],
    },
    plansCategory(region, overrides),
    {
      id: "safety",
      label: "Safety & compliance",
      items: [
        {
          id: "safe",
          question: "Is Liffio safe for my Instagram account?",
          answer: metaCopy.helpSafeAnswer,
        },
        {
          id: "multiple-accounts",
          question: "Can I manage multiple Instagram accounts?",
          answer:
            "Each workspace connects one Instagram account, so managing several accounts means several workspaces. Free, Starter, Growth and Business include one workspace each; Agency includes 20 - each one a complete Business workspace, on a single subscription - for managing client brands at scale.",
        },
      ],
    },
  ];
}

const affiliateCategory: FaqCategory = {
  id: "affiliate",
  label: "Affiliate program",
  items: [
    {
      id: "affiliate-commission",
      question: "How much commission do affiliates earn?",
      answer:
        "Affiliates earn 50% lifetime recurring commission on every payment made by a referred workspace subscription. The 50% rate applies with no sliding scale, no cap, and no expiry, for as long as the referred user maintains an active subscription. For example, refer someone on Business ($59/mo) and earn $29.50 every month they stay subscribed.",
    },
    {
      id: "affiliate-recurring",
      question: "Is the commission recurring?",
      answer:
        "Yes, fully recurring for the lifetime of the referred subscription. As long as the referred user keeps their subscription active and unbroken (within the 15-day grace period on renewal), you earn 50% of every billing cycle. The commission stops permanently if the referred user's subscription lapses beyond the 15-day grace period.",
    },
    {
      id: "affiliate-payout",
      question: "When do affiliates get paid?",
      answer:
        "All commissions go through a 20-day hold period before becoming available. Withdrawals are on-demand with no fixed monthly payout schedule. The minimum withdrawal threshold is $50 of available balance, and processing takes 5-10 business days after approval. Payout stages: Pending (in hold) → Available → Requested → Approved → Paid.",
    },
    {
      id: "affiliate-attribution",
      question: "What is the attribution window?",
      answer:
        "90 days from signup. You earn commission on any workspace subscription the referred user purchases within 90 days of creating their account. Attribution is first-click: whichever affiliate link is clicked first gets the credit, and later clicks from other affiliates do not override it.",
    },
    {
      id: "affiliate-custom-code",
      question: "Can I create my own referral code?",
      answer:
        "Yes. In addition to an auto-generated random token, you can create one custom referral code. Requirements: alphanumeric only, 3-20 characters, unique across the platform. Both your random token and custom code are active simultaneously. Referred users can also enter your custom code manually at signup.",
    },
    {
      id: "affiliate-prohibited",
      question: "What activities are prohibited?",
      answer:
        "Prohibited activities include self-referrals (referring your own accounts or devices), incentivising sign-ups, creating fake accounts to generate commissions, misleading advertising, cookie stuffing, collusion with referred users, creating multiple Liffio accounts, and bulk link injection into DMs or mass emails. Violations result in immediate account suspension and forfeiture of all pending commissions.",
    },
    {
      id: "affiliate-refund",
      question: "What happens if a customer requests a refund?",
      answer:
        "If a referred user receives a refund on a payment for which you earned commission, the corresponding commission is clawed back from your balance. If your balance goes negative as a result, it must be cleared before any future withdrawal can be processed.",
    },
    {
      id: "affiliate-join",
      question: "How do I join the affiliate program?",
      answer:
        "The affiliate program is open to all registered Liffio users, including Free plan users, with no separate application. Create a free account, then find your unique referral link in your dashboard. No approval process, no follower count requirement, and no minimum sales threshold to join. Your affiliate link is available immediately after registration.",
    },
  ],
};

export function getAffiliateFaqCategories(region: PricingRegion): FaqCategory[] {
  return [...getFaqCategories(region), affiliateCategory];
}

const pricingDetailCategory: FaqCategory = {
  id: "pricing-detail",
  label: "Plan details",
  items: [
    {
      id: "starter-features",
      question: "What features require Starter ($9/mo, ₹499/mo in India)?",
      answer:
        "Starter includes everything in Free, plus trigger blocks (the multi-keyword builder), follow before DM, the option to turn off Liffio branding, bio link styling (custom slug, hide badge, icons, thumbnails, item visibility, click tracking), custom short link slugs, lead export, conversion rate and time series analytics, and API access. Its limits are 25 automation workflows, 2 DM follow-ups, 3 team members and 10,000 AI tokens a month. API limits, for calls through the Liffio API rather than the app, are 200 requests, 50 automations and 50 scheduled posts a day, with 5 API keys. DMs are unlimited, as on every plan.",
    },
    {
      id: "growth-features",
      question: "What features require Growth ($29/mo, ₹1,499/mo in India)?",
      answer:
        "Growth includes everything in Starter, plus bulk upload, caption templates, schedule templates and hashtag groups, post metrics, video metrics and profile outcomes, and AI insights. Its limits are 100 automation workflows, 5 DM follow-ups, 5 team members and 30,000 AI tokens a month. API limits, for calls through the Liffio API rather than the app, are 500 requests, 150 automations and 150 scheduled posts a day, with 10 API keys.",
    },
    {
      // 🚩 Every item here must be something Growth does NOT already grant.
      // This answer once sold Starter features as Business additions, so the
      // tier read as costing 6.5x for things already included. The additions
      // and limits are the Business bullets and limits in pricing-v4.config.
      id: "business-features",
      question: "What features require Business ($59/mo, ₹2,499/mo in India)?",
      answer:
        "Business includes everything in Growth, plus an approval workflow (approve posts, activity log), custom permissions, analytics export and automation attribution. Its limits are 250 automation workflows, 10 DM follow-ups, 15 team members and 75,000 AI tokens a month, with rollover up to 25,000. API limits, for calls through the Liffio API rather than the app, are 1,000 requests, 400 automations and 400 scheduled posts a day, with 15 API keys. Built for brands, e-commerce teams, and coaches where more than one person touches the account.",
    },
    {
      id: "agency-features",
      question: "What features require Agency ($549/mo, ₹22,999/mo in India)?",
      answer:
        "Agency includes everything in Business, plus 20 workspaces on one bill and one billing date, agency branding, and the option to hide Liffio branding. Every limit is per workspace, across all 20: each workspace gets 250 automation workflows, 10 DM follow-ups, 15 team members and 75,000 AI tokens a month with rollover up to 25,000, plus API limits of 1,000 requests, 400 automations and 400 scheduled posts a day, with 15 API keys. Built for marketing agencies running Instagram automation across multiple brands.",
    },
    {
      id: "best-for-agencies",
      question: "Which plan is best for agencies?",
      answer:
        "The Agency plan ($549/mo, ₹22,999/mo in India) is purpose-built for agencies. It includes 20 workspaces on one bill and one billing date, each with every Business feature and limit, plus agency branding and the option to hide Liffio branding. If you manage Instagram automation for multiple brands and want each kept in its own workspace, Agency is the only plan that includes more than one.",
    },
    {
      id: "hidden-fees",
      question: "Are there any hidden fees?",
      answer:
        "No. Liffio's pricing is flat and transparent. You pay the plan price, monthly or annually, and that is the total cost. No per-message fees, no overage charges, no contact limits, no feature add-ons sold separately, and no setup fees.",
    },
    {
      // Terms 7.3, restated for the page rather than paraphrased. Keep the two
      // halves together: the India half is only reassuring next to the export
      // half, and a visitor who sees one currency needs to know why.
      id: "gst-on-prices",
      question: "Do the prices include GST?",
      answer:
        "Prices shown in rupees include GST, so the amount you see is the amount you pay, and we issue a GST tax invoice for every payment. Give us your state so we can apply the correct tax treatment, and your GSTIN if you want it on the invoice. Sales billed in US dollars are treated as exports and are billed without Indian GST, though you may owe tax in your own country on such a sale.",
    },
    {
      id: "upgrade-later",
      question: "Can I upgrade later?",
      answer:
        "Yes. Start on the Free plan and upgrade to Starter, Growth, Business, or Agency at any time from your dashboard. Upgrades take effect immediately with a prorated charge. All existing automations, data, and connected Instagram accounts carry over to the new plan automatically.",
    },
  ],
};

const homepageSeoCategory: FaqCategory = {
  id: "homepage-seo",
  label: "Instagram DM automation",
  items: [
    {
      id: "best-instagram-dm-tool",
      question: "What is the best Instagram DM automation tool?",
      answer:
        `The best Instagram DM automation tool depends on your workflow. For creators, coaches, and brands who want comment-to-DM automation${FEATURE_WELCOME_DM ? ", story reply, and welcome DMs" : " and story reply"}, with unlimited messages on every plan and no contact-based pricing, Liffio is built specifically for that use case. Tools like ManyChat offer broader multi-channel coverage (Messenger, WhatsApp, SMS) at higher price points. If your entire workflow is Instagram and you want simple pricing with unlimited DMs on every plan, Liffio is the most direct fit.`,
    },
    {
      id: "automated-dms-increase-engagement",
      question: "How do automated Instagram DMs increase engagement?",
      answer:
        `Automated DMs increase engagement by responding to every comment and ${FEATURE_STORY_REACTIONS ? "story reaction" : "story reply"}, even at 3am, even when a Reel unexpectedly goes viral. Most manually managed accounts respond to 10-20% of comment-driven DM requests; automation responds to 100%. Higher response rates mean more link clicks, more lead captures, and more conversations started, which Instagram's algorithm rewards with further reach.`,
    },
    {
      id: "comment-automation-generate-leads",
      question: "Can Instagram comment automation generate leads?",
      answer:
        `Yes, this is the primary commercial use case. Comment automation captures leads at the moment of highest intent: when someone raises their hand on your content. ${FEATURE_COLLECT_DATA_PROMPTS ? "Liffio's comment-to-DM flow can ask for an email address or phone number inside the DM conversation, capture it automatically" : "Liffio captures email addresses shared in the DM conversation automatically"}, and export${FEATURE_CRM_INTEGRATION ? "s them to CSV or a CRM" : "s them to CSV"}. Creators and brands use this to build email lists, qualify prospects, and route buyers, all without leaving Instagram.`,
    },
  ],
};

const featuresSeoCategory: FaqCategory = {
  id: "features-seo",
  label: "What Liffio can do",
  items: [
    {
      id: "automation-grow-followers",
      question: "Can Instagram automation help grow followers?",
      answer:
        "Yes, through the Ask for Follow feature. When someone comments a keyword and is about to receive the promised link or resource, Liffio first prompts them to follow your account, displaying your profile card inside the DM conversation. Liffio tracks follow conversion rates in analytics so you can see exactly how many follows each campaign generated.",
    },
    {
      id: "automated-messages-no-coding",
      question: "Can I send automated Instagram messages without coding?",
      answer:
        "Yes. No coding or technical knowledge is required at any point. Setting up a comment-to-DM automation involves three inputs: choosing your trigger keyword, writing your DM, and setting a delay. Everything is done through a visual dashboard. Connecting your Instagram account is a single OAuth step: no API keys, no webhooks, no developer needed. Most creators complete their first live automation in under five minutes.",
    },
    {
      id: "automation-works-with-reels",
      question: "Does Instagram automation work with Reels?",
      answer:
        "Yes. All of Liffio's comment-based automations work on Instagram Reels in exactly the same way as on feed posts and carousels. When someone comments your keyword on a Reel, the DM and public reply fire after your configured delay. Reels are the most common use case, because the comment CTA is a standard Reel hook that drives high comment volume, which Liffio handles automatically regardless of how many comments come in.",
    },
  ],
};

/** @deprecated Use getFaqCategories(region) */
export const homeFaqCategories = getFaqCategories("global");

/** Flat list for legacy use */
export function getAllFaqs(region: PricingRegion): FaqItem[] {
  return getFaqCategories(region).flatMap((c) => c.items);
}

const homeOverviewCategory: FaqCategory = {
  id: "overview",
  label: "About Liffio",
  items: [
    {
      id: "what-is-liffio",
      question: "What is Liffio?",
      answer:
        "Liffio is an Instagram DM automation tool that sends personalised DMs automatically when someone comments a keyword on your post, reacts to your story, or messages you. No manual inbox work required.",
    },
    {
      id: "is-liffio-free",
      question: "Is Liffio free to use?",
      answer:
        "Yes. Liffio has a free plan with no credit card required. It includes unlimited DMs, 3 automation workflows, comment keyword triggers, public replies, the full post scheduler, a bio link and short links.",
    },
    {
      id: "is-liffio-safe",
      question: "Is Liffio safe for my Instagram account?",
      answer:
        "Yes. Liffio connects through Instagram's official API using Meta's OAuth consent flow, so your password is never shared, and sends every DM with a configurable 10 to 60 second delay so replies arrive at a natural conversational pace.",
    },
  ],
};

export function getHomeFaqCategories(
  region: PricingRegion,
  overrides?: MarketingFaqOverrides,
): FaqCategory[] {
  const gettingStarted = getFaqCategories(region, overrides).find((c) => c.id === "getting-started");
  return [
    homeOverviewCategory,
    {
      id: "getting-started",
      label: "Getting started",
      items: gettingStarted?.items.slice(0, 2) ?? [],
    },
  ];
}

/**
 * FAQ set for /features. Takes no region.
 *
 * `plansCategory()` is the ONLY region-aware block in `getFaqCategories()`:
 * every other category is a module-level const or a literal built from
 * `metaCopy` and feature flags. This function returns `geoCompliance`, its own
 * "automations" category, `safety` and `featuresSeo`, and never "plans", so the
 * region argument could not reach the output. Passing "global" is therefore not
 * a default. It is the same result any region produced. Dropping the argument
 * removes the route's only `getPricingContext()` call, and with it the
 * `await headers()` that forced /features to render dynamically.
 */
export function getFeaturesFaqCategories(): FaqCategory[] {
  const all = getFaqCategories("global");
  const automations = all.find((c) => c.id === "automations");
  const safety = all.find((c) => c.id === "safety");
  return [
    geoComplianceCategory,
    {
      id: "automations",
      label: "How automations work",
      items: [
        {
          id: "comment-to-dm-how",
          question: "How does comment-to-DM automation work?",
          answer:
            'You set a keyword (e.g. "LINK"). When someone comments that word on your post or Reel, Liffio automatically sends them a DM after your chosen delay (10 to 60 seconds) and optionally posts a public reply under their comment.',
        },
        {
          // A bare list answers nothing on its own. Same trigger set as before,
          // now self-contained: how they fire, and what each plan gets to run.
          id: "automation-types-features",
          question: "What types of Instagram automation does Liffio support?",
          answer:
            `Liffio supports comment-to-DM, story reply, inbound DM reply, ask for follow, follow-up sequences, ${FEATURE_WELCOME_DM ? "data collection, and welcome DM for new followers" : "and data collection"}, all through Instagram's official API. Each one fires after a delay you set between 10 and 60 seconds. The Free plan includes 3 automation workflows, Starter 25, Growth 100, and Business 250.`,
        },
        {
          id: "manychat-alternative-features",
          question: "Is Liffio a ManyChat alternative?",
          answer:
            "Yes. Liffio offers the same core comment-to-DM, story automation, and keyword trigger features as ManyChat, with unlimited automated DMs on every plan, Free included, simpler pricing, and a generous free tier.",
        },
        ...(automations?.items.slice(0, 2) ?? []),
      ],
    },
    ...(safety ? [safety] : []),
    featuresSeoCategory,
  ];
}

export function getPricingFaqCategories(
  region: PricingRegion,
  overrides?: MarketingFaqOverrides,
): FaqCategory[] {
  return [
    plansCategory(region, overrides),
    {
      id: "pricing-overview",
      label: "Pricing",
      items: [
        {
          id: "how-much",
          question: "How much does Liffio cost?",
          answer:
            "Liffio has five plans: Free ($0, ₹0), Starter ($9/mo, ₹499/mo in India), Growth ($29/mo, ₹1,499/mo), Business ($59/mo, ₹2,499/mo), and Agency ($549/mo, ₹22,999/mo). Every plan, Free included, sends unlimited automated DMs. Every plan connects one Instagram account per workspace. Annual billing charges 10 months instead of 12, so two months are free.",
        },
        {
          id: "india-pricing",
          question: "Does Liffio support Indian pricing?",
          answer:
            "Yes. Liffio auto-detects your country and shows INR pricing for India and USD pricing elsewhere. Every plan, in either currency, is billed via Razorpay.",
        },
      ],
    },
  ];
}

export function getCreatorsFaqCategories(
  region: PricingRegion,
  overrides?: MarketingFaqOverrides,
): FaqCategory[] {
  const plans = plansCategory(region, overrides);
  const cancelItem = plans.items.find((i) => i.id === "cancel");
  return [
    {
      id: "creators",
      label: "Creators Program",
      items: [
        {
          id: "who-qualifies",
          question: "Who qualifies for the Creators Program?",
          answer:
            "Creators with 5,000 to 100,000 Instagram followers, an engagement rate above 3%, and content posted at least once per week. You should already drive comment engagement on posts and actively sell products, courses, or services. Applications are reviewed manually within 48 to 72 hours.",
        },
        {
          id: "free-forever",
          question: "Is it really free forever?",
          answer:
            "Yes - for as long as you meet the monthly activity requirements. There is no hidden trial period. Accepted creators keep everything in the Business plan at no cost while they remain active in the program, except turning off Liffio branding: Liffio adds a closing line in your automated DMs, written as your own recommendation, that reads \"I automate my DMs with @Liffio\" and ends with a link to Liffio, sends a separate branded DM a few minutes later, with a \"Get the tool now!\" button that links to Liffio, whenever an automation has no follow-up steps of its own, and keeps the \"Powered by @Liffio\" badge on your bio link page.",
        },
        {
          id: "activity-requirements",
          question: "What happens if I don't meet the monthly activity requirements?",
          answer:
            "We'll reach out first if your activity drops. If you are behind on the monthly requirements, we email you around day 25 of the month. Missing them by the end of the month counts as a violation: the first gets a written warning and 7 days to fix it, and a second ends your creator access. You can always upgrade to a paid plan and keep your account.",
        },
        {
          id: "multiple-accounts",
          question: "Can I have multiple Instagram accounts in one workspace?",
          answer:
            "No - a workspace connects exactly one Instagram account. Managing several profiles means several workspaces, and only Agency includes more than one (20). This applies to Creators Program access too.",
        },
        {
          id: "track-dms",
          question: "How do I track my monthly requirements?",
          answer:
            "There is no DM minimum. Liffio checks its own records: whether you have an automation active, and which of your posts or reels have a Liffio automation attached. You can see both in your dashboard, and if you are behind we email you around day 25 of the month.",
        },
        {
          id: "bio-badge",
          question: "What branding does Liffio add while I'm in the program?",
          answer:
            "Three things, and they are the trade for free access. Liffio adds a closing line in your automated DMs, written as your own recommendation, that reads \"I automate my DMs with @Liffio\" and ends with a link to Liffio. It sends a separate branded DM a few minutes later, with a \"Get the tool now!\" button that links to Liffio, whenever an automation has no follow-up steps of its own. And it keeps the \"Powered by @Liffio\" badge on your bio link page. Removing, hiding or working around any of them ends your Creators Program access.",
        },
        {
          id: "monthly-requirements",
          question: "What are the monthly requirements?",
          answer:
            "Each calendar month, keep at least one Liffio automation active and publish at least 2 posts or reels that use a Liffio automation. There is no minimum number of DMs, and you should not inflate message volume. Keep Liffio branding on throughout. If you are behind, we email you around day 25 of the month.",
        },
        {
          id: "followers-needed",
          question: "How many followers do I need?",
          answer:
            "Between 5,000 and 100,000. The program is designed for mid-tier creators, not micro-accounts under 5K, and not large accounts over 100K who typically have dedicated marketing budgets. The focus is on creators who already drive meaningful comment engagement relative to their audience size (3%+ engagement rate).",
        },
        {
          id: "approval-time",
          question: "How long does approval take?",
          answer:
            "All applications are reviewed manually within 48 to 72 hours. If accepted, you receive confirmation via email and access to everything in the Business plan from day one, except turning off Liffio branding: Liffio adds a closing line in your automated DMs, written as your own recommendation, that reads \"I automate my DMs with @Liffio\" and ends with a link to Liffio, sends a separate branded DM a few minutes later, with a \"Get the tool now!\" button that links to Liffio, whenever an automation has no follow-up steps of its own, and keeps the \"Powered by @Liffio\" badge on your bio link page. If not accepted, you can reapply after a cooldown period, which we tell you in that email. Liffio does not provide reasons for rejection.",
        },
        {
          id: "creators-features-included",
          question: "What features are included in the Creators Program?",
          answer:
            "Creators Program access includes everything in Business except turning off Liffio branding. That is the trade for free access: Liffio adds a closing line in your automated DMs, written as your own recommendation, that reads \"I automate my DMs with @Liffio\" and ends with a link to Liffio, sends a separate branded DM a few minutes later, with a \"Get the tool now!\" button that links to Liffio, whenever an automation has no follow-up steps of its own, and keeps the \"Powered by @Liffio\" badge on your bio link page. Everything else is included: unlimited automated DMs, up to 250 automation workflows, 10 DM follow-ups, 15 team members, 75,000 AI tokens a month with rollover up to 25,000, API access with Business limits: 1,000 requests, 400 automations and 400 scheduled posts a day, and 15 API keys, the full post scheduler with approvals, post and video metrics, automation attribution, and priority email support. Not included: additional workspaces or any Agency feature. It covers one workspace, and it is given by Liffio, not sold.",
        },
        {
          id: "how-to-apply",
          question: "How do I apply for the Creators Program?",
          answer:
            "Apply from inside Liffio, in the Creators Program section of your account at app.liffio.com/creators-program. The creators page on liffio.com links you there. There is no long form: we use your Liffio account name and email, and your connected Instagram account's username, follower count and posting activity. Connect your Instagram account before you apply, or we cannot assess your profile. Applications submitted through email, social media, or direct message are not accepted. Spots are limited to 50 in the initial launch phase.",
        },
      ],
    },
    {
      id: "plans-billing",
      label: "After the program",
      items: [
        ...(cancelItem ? [cancelItem] : []),
        {
          id: "after-program",
          question: "What happens when the Creators Program ends?",
          answer:
            "If you leave the program or it concludes, your account stays active - you just move to a paid plan. You'll get advance notice and a discounted rate as a program alumni.",
        },
      ],
    },
  ];
}

const userSupportCategory: FaqCategory = {
  id: "user-support",
  label: "Troubleshooting & account",
  items: [
    {
      id: "automations-not-firing",
      question: "Why aren't my automations firing?",
      answer:
        "First, check that the automation is toggled on and the correct post or account is selected. Make sure the trigger keyword matches exactly what commenters type (check case sensitivity settings). If the automation was recently created, it can take up to 60 seconds to activate. If it still isn't working, try disconnecting and reconnecting your Instagram account from Settings.",
    },
    {
      id: "reconnect-instagram",
      question: "How do I reconnect my Instagram account?",
      answer:
        "Go to Settings → Connected Accounts in your Liffio dashboard. Click 'Disconnect' next to your Instagram account, then click 'Connect Instagram' to re-authorise via Meta login. This refreshes your access token and resolves most permission-related issues.",
    },
    {
      id: "meta-permission-error",
      question: "Why did I receive a Meta permission error?",
      answer:
        "Meta permission errors usually mean your access token has expired or a required permission was revoked. Go to Settings → Connected Accounts and reconnect your Instagram account. If the error persists, check that your Instagram account is linked to a Facebook Page and that the account type is set to 'Professional' (Creator or Business) in Instagram settings.",
    },
    // 🚩 "How do I cancel my subscription?" is NOT re-asked here. `plansCategory`
    // already carries it (id "cancel") and both categories are concatenated into
    // one FAQPage on /help: two Question nodes with the identical `name` and
    // different answers in a single mainEntity array. The path this copy named
    // (Settings → Billing → Cancel Plan) was the correct one and has been moved
    // into the surviving answer; re-adding the question here reopens the defect.
    {
      id: "refund-timeline",
      question: "How long do refunds take?",
      answer:
        "Approved refunds are processed within 5 to 10 business days back to your original payment method. Razorpay refunds typically take 7 to 10 business days. Email support@liffio.com to request a refund - see our Refund Policy for eligibility.",
    },
    {
      id: "switch-plans",
      question: "Can I switch plans mid-cycle?",
      answer:
        "Yes. Upgrades take effect immediately and you're charged a prorated amount for the remaining days in your billing cycle. Downgrades take effect at the start of your next billing period - you keep your current plan until then.",
    },
    {
      id: "dms-not-sending",
      question: "Why are my DMs not sending?",
      answer:
        "If automations are triggering but DMs are not arriving, check: your Instagram account must be set to Professional (Creator or Business), because personal accounts cannot receive or send API-driven DMs. Confirm your Instagram account is linked to a Facebook Page in Meta Business Suite. Check that the recipient's DM settings allow messages from accounts they don't follow. Your delay setting must be at least 10 seconds, the minimum the platform supports. Go to Settings → Connected Accounts and reconnect to refresh your access token. If DMs are still not sending, email support@liffio.com with your account email and the affected automation name.",
    },
    {
      id: "reconnect-facebook",
      question: "How do I reconnect my Facebook Page?",
      answer:
        "A Facebook Page connection is required for Liffio's API access to function. Go to Settings → Connected Accounts and disconnect your Instagram account. In Meta Business Suite, confirm your Instagram account is still linked to your Facebook Page under Accounts → Instagram Accounts. If the link has been removed, re-link Instagram to your Facebook Page in Meta Business Suite first. Then return to Liffio and click Connect Instagram. The OAuth flow will detect the linked Page automatically.",
    },
    {
      id: "keyword-trigger-not-working",
      question: "Why isn't my keyword trigger working?",
      answer:
        "If commenters are typing your keyword but automations are not triggering, check: the automation is toggled ON and linked to the correct post. Use 'contains' matching so partial matches still trigger. Set case sensitivity to case-insensitive so LINK, Link, and link all work. Test by commenting the exact keyword from a second Instagram account and waiting the full delay period. Note that self-triggers (from the same account that owns the automation) may behave differently.",
    },
    {
      id: "export-leads",
      question: "How do I export leads?",
      answer:
        `Leads captured through the Collect User Data automation are stored in your workspace analytics. Go to Analytics → Leads in your Liffio dashboard, select the date range or campaign, and click Export CSV. The file includes all captured fields with timestamps and source campaign. CSV export is available on Starter and above. Free plan users can view leads in the dashboard but cannot export.${FEATURE_CRM_INTEGRATION ? " For CRM integration (Business and Agency plans), connect your CRM from Settings → Integrations." : ""}`,
    },
    {
      id: "reset-password",
      question: "How do I reset my password?",
      answer:
        "Go to liffio.com/login and click Forgot Password. Enter the email address associated with your Liffio account and check your inbox for a reset email (check spam if it does not arrive within 2 minutes). Click the reset link, enter your new password, and confirm. If you signed up via Google or Meta OAuth, use the same OAuth sign-in method, because there is no separate Liffio password to reset.",
    },
    {
      id: "add-team-members",
      question: "How do I add team members?",
      answer:
        "Go to Settings → Team in your Liffio dashboard and click Invite Member, then enter their email address and select their role. They will receive an email invitation to join your workspace. Team members by plan: Free 1 (the owner), Starter up to 3, Growth up to 5, Business up to 15, and Agency up to 15 in each of its 20 workspaces.",
    },
    {
      id: "delete-workspace",
      question: "How do I delete a workspace?",
      answer:
        "Workspace deletion is permanent and cannot be undone: all automations, leads, analytics, and connected Instagram accounts will be deleted. First cancel your subscription if on a paid plan (Settings → Billing → Cancel Plan), then go to Settings → Workspace → Danger Zone, click Delete Workspace and confirm by typing the workspace name. If you only want to remove a specific Instagram account, go to Settings → Connected Accounts → Disconnect instead.",
    },
    {
      id: "connect-multiple-accounts",
      question: "How do I connect multiple Instagram accounts?",
      answer:
        "Go to Settings → Connected Accounts in your Liffio dashboard and click Connect Instagram. Each account requires its own Meta OAuth authorization. A workspace connects one Instagram account, so a second account needs a second workspace - and only Agency includes more than one (20). Each workspace's automations run independently.",
    },
    {
      id: "contact-support",
      question: "How do I contact support?",
      answer:
        "Email support@liffio.com for a response within 24 hours, or use the contact form at liffio.com/help. When emailing, include your account email, the Instagram username affected, and a description of the issue. Screenshots help speed up resolution.",
    },
    {
      id: "refunds-policy",
      question: "How do refunds work?",
      answer:
        "Liffio's payments are generally non-refundable as a SaaS product with immediate digital access. Exceptions may be made for technical failure (a major platform bug preventing use for more than 48 consecutive hours), billing errors (documented incorrect charges due to a system error), or double payments (accidental duplicate payment for the same account). To request a refund, email support@liffio.com with your account email, transaction ID, and reason. Approved refunds process in 5-10 business days. No refunds are issued if your Instagram account is limited or banned by Meta while using Liffio.",
    },
  ],
};

export function getHelpFaqCategories(
  region: PricingRegion,
  overrides?: MarketingFaqOverrides,
): FaqCategory[] {
  return [...getFaqCategories(region, overrides), userSupportCategory];
}

export function getPricingDetailedFaqCategories(
  region: PricingRegion,
  overrides?: MarketingFaqOverrides,
): FaqCategory[] {
  return [...getFaqCategories(region, overrides), pricingDetailCategory];
}

export function getHomepageFaqCategories(): FaqCategory[] {
  // Lean home set: /pricing owns the full plans/billing/setup FAQ. The home
  // page keeps only its unique questions plus the decision-critical
  // compliance set, so the two pages no longer duplicate ~29 Q&A pairs in
  // visible content and FAQPage JSON-LD.
  return [homeOverviewCategory, geoComplianceCategory, homepageSeoCategory];
}
