import { metaCopy } from "@/config/meta-copy";
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
          "Yes. All paid plans are available on monthly or annual billing. Annual billing saves 20%. Payments are handled via Stripe (global) or Razorpay (India).",
      },
      {
        id: "dm-limit",
        question: "Are automated DMs unlimited?",
        answer:
          "Yes. Every plan includes unlimited automated DMs - there is no monthly cap on how many messages you can send.",
      },
      {
        id: "cancel",
        question: "How do I cancel my subscription?",
        answer:
          "Cancel anytime from account settings. There are no cancellation fees - your plan stays active until the end of the current billing period.",
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
        "Yes. Instagram permits DM automation through its official Messaging API, which is part of Meta's developer platform. Tools that connect via the official API using OAuth — rather than scraping or using your password — are explicitly allowed under Instagram's platform policy. The Instagram Messaging API lets authorized tools send direct messages on behalf of a connected account, respond to story replies, react to live comment events, and trigger welcome messages to new followers. To use it, the tool must go through Meta's App Review process and receive specific messaging permissions. Liffio holds all required permissions and uses the official API only. The distinction matters practically: accounts that use automation tools built on official API access do not face action from Instagram. Accounts that use tools operating outside the official API — browser automation, credential scraping, or unofficial endpoints — risk suspension regardless of volume.",
    },
    {
      id: "what-is-comment-to-dm",
      question: "What is comment-to-DM automation on Instagram?",
      answer:
        "Comment-to-DM automation sends a direct message to someone automatically when they comment a specific keyword on your Instagram post or Reel. Here is how it works: you connect your Instagram account via the official API, choose a post, set a trigger keyword (such as LINK, PRICE, or GUIDE), and write a DM template. When any commenter types that keyword, the automation fires and sends your pre-written DM — after a short configurable delay of 10 to 60 seconds — without you doing anything manually. For example: you post a Reel about a digital product and tell viewers to comment FREE to get the download link. Every person who comments that word receives the link in their inbox automatically, even if you are asleep or offline. One limitation: comment-to-DM only fires on posts you explicitly enable it for. It does not apply to all posts on your account automatically.",
    },
    {
      id: "will-instagram-ban",
      question: "Will Instagram ban my account for using DM automation?",
      answer:
        "No, not if you use a tool that connects through Instagram's official API. Instagram acts against accounts that use bots or tools that access your account by logging in with your password, simulating browser behavior, or using unofficial endpoints. The official Instagram Messaging API works differently. You authorize Liffio through Meta's own OAuth screen — the same login flow used by major apps like Hootsuite or Later. Your password is never entered into Liffio at any point, and Liffio never stores credentials. Meta issues an access token directly to Liffio, which you can revoke at any time from your Instagram settings under Apps and Websites. Beyond authentication method, send frequency matters. Liffio adds a 10–60 second configurable delay between trigger and send, which distributes DM volume over time and avoids the burst patterns associated with spam accounts. Running at normal usage volumes with a compliant tool carries no meaningful ban risk.",
    },
    {
      id: "can-you-automate-dm-replies",
      question: "Can you automate Instagram DM replies?",
      answer:
        "Yes. With keyword-trigger tools like Liffio, you can automate replies to five types of incoming Instagram interactions: comments on posts and Reels, story replies, live stream messages, inbound DMs, and new follower events. Each automation type works through the same mechanism: you define a trigger condition (a keyword, any reply, or a follower event), write the message, and set a delay. When the trigger fires, Liffio sends the message automatically via Instagram's official API. For example: if you run a coaching business, you could set up a DM trigger so that anyone who sends you the word APPLY in a DM receives your application form link instantly — without you checking your inbox. The delay is configurable between 10 and 60 seconds per automation. Instant zero-delay replies can trigger spam detection patterns; a short delay makes sends feel like a human responded quickly. That distinction matters for account safety at high volumes.",
    },
    {
      id: "cheapest-manychat-alternative",
      question: "What is the cheapest ManyChat alternative for Instagram?",
      answer:
        "Liffio. It has a free plan with no credit card required that runs comment-to-DM automation in production — not just as a demo. Paid plans start at $9/month. For comparison: ManyChat's free tier is heavily limited, and paid plans start at $15/month and scale with contact count as your audience grows. SendDM and LinkDM are simpler tools with focused feature sets; pricing varies. SuperProfile bundles bio-link storefronts with automation and prices accordingly. What makes Liffio structurally cheaper for Instagram-focused creators is that there are no per-contact fees. You pay the same $9/month whether you automate DMs to 100 people or 10,000 people. ManyChat charges based on total contact count, which means a single viral Reel can push you into a higher tier unexpectedly. The free plan includes unlimited Instagram accounts, unlimited automated DMs, comment keyword triggers, and basic analytics — enough to validate whether automation works for your use case before paying anything.",
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
        "An auto DM tool (also called auto DM software or DM automation tool) sends Instagram direct messages automatically when a trigger fires - for example a keyword in a comment, a story reply, or an inbound DM. Liffio is an auto DM tool that lets you set delays (10–60 seconds), personalize messages, and run comment-to-DM flows without manual inbox work.",
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
        "The best auto DM tool depends on your needs. Liffio is ideal for creators and brands who want unlimited auto DMs, simple pricing, and a free tier. We offer the same comment-to-DM, auto comment reply, and story automation features as ManyChat, SendDM, and SuperProfile - without per-message limits.",
    },
    {
      id: "free-auto-dm-tool",
      question: "Is there a free auto DM tool for Instagram?",
      answer:
        "Yes! Liffio offers a free auto DM tool tier that lets you get started with Instagram DM automation without a credit card. The free plan includes comment-to-DM automation, auto comment reply, and basic analytics - enough to test if auto DMs work for your business.",
    },
    {
      id: "manychat-senddm-linkdm",
      question: "How does Liffio compare to ManyChat, SendDM, or LinkDM?",
      answer:
        "Like ManyChat, SendDM, LinkDM, and SuperProfile, Liffio supports keyword triggers, comment-to-DM, auto comment reply, story reply automation, and multi-step DM flows for Instagram. Liffio focuses on Instagram DM automation with unlimited auto DMs on every plan, simple pricing, and a generous free tier - making it a top ManyChat alternative.",
    },
    {
      id: "dm-automation-tool",
      question: "Is Liffio a DM automation tool or a dming tool?",
      answer:
        "Both terms describe the same workflow: automating Instagram DMs at scale. Liffio is a DM automation tool (also called a dming tool, auto DM software, or Instagram auto DM tool) for creators, coaches, and brands who want auto DMs from comments, stories, live chat, and the inbox.",
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
        "Instagram auto reply refers to any automated response sent when someone interacts with your account - via comments, stories, DMs, or live streams. Liffio's auto reply features include auto DMs from comments, story reply automation, DM auto responders, and live comment triggers. All powered by the same auto DM tool technology.",
    },
    {
      id: "auto-dm-safe",
      question: "Are auto DM tools safe for my Instagram account?",
      answer:
        "Yes, when you use a compliant auto DM tool like Liffio. We use official Instagram APIs, human-like delays (10-60 seconds), and rate limiting to keep your account safe. Unlike unofficial bots, Liffio's auto DMs don't risk account suspension.",
    },
  ],
};

/** Region-aware FAQ used across the marketing site */
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
            "Most creators connect Instagram and send their first automated DM in under five minutes. Pick a trigger, write your message, set your delay (10–60 seconds), and go live. No credit card required.",
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
            "DMs send after your chosen delay - from 10 to 60 seconds after the trigger (comment, story reply, etc.). You control the timing for more human-like replies while staying on autopilot.",
        },
        {
          id: "what-counts-dm",
          question: "What counts as one automated DM?",
          answer:
            "Each automated message sent to a unique user counts as one DM. Replies within the same conversation thread do not count as additional DMs.",
        },
        {
          id: "automation-types",
          question: "What can Liffio automate?",
          answer:
            "Comment-to-DM, story mentions and reactions, live stream comments, welcome DMs for new followers, multi-step flows, follow-up sequences, and more - depending on your plan.",
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
            "Yes. All plans include unlimited Instagram accounts. Agency adds white-label workspaces for managing client brands at scale.",
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
      question: "How much can I earn as an affiliate?",
      answer:
        "You earn 25% commission in month one, then 10% in months two and three for each referred workspace, within a 90-day attribution window. Payouts are available on demand from $50.",
    },
    {
      id: "affiliate-plans",
      question: "Which plans earn commission?",
      answer:
        "Commissions apply to paid Starter, Business, and Agency subscriptions. Free signups and Creators Program access do not generate commission.",
    },
  ],
};

export function getAffiliateFaqCategories(region: PricingRegion): FaqCategory[] {
  return [...getFaqCategories(region), affiliateCategory];
}

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
        "Yes. Liffio has a free plan with no credit card required. It includes unlimited Instagram accounts, unlimited automated DMs, comment keyword triggers, and basic analytics.",
    },
    {
      id: "is-liffio-safe",
      question: "Is Liffio safe for my Instagram account?",
      answer:
        "Yes. Liffio uses official Meta/Instagram APIs and human-like delays (10–60 seconds) to keep your account fully compliant with Instagram's terms of service.",
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

export function getFeaturesFaqCategories(region: PricingRegion): FaqCategory[] {
  const all = getFaqCategories(region);
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
            'You set a keyword (e.g. "LINK"). When someone comments that word on your post or Reel, Liffio automatically sends them a DM after your chosen delay (10–60 seconds) and optionally posts a public reply under their comment.',
        },
        {
          id: "automation-types-features",
          question: "What types of Instagram automation does Liffio support?",
          answer:
            "Liffio supports 8 automation types: comment-to-DM, story reply, live stream DM, inbound DM reply, ask for follow, smart re-engage, data collection, and welcome DM for new followers.",
        },
        {
          id: "manychat-alternative-features",
          question: "Is Liffio a ManyChat alternative?",
          answer:
            "Yes. Liffio offers the same core comment-to-DM, story automation, and keyword trigger features as ManyChat - with unlimited automated DMs on every plan, simpler pricing, and a generous free tier.",
        },
        ...(automations?.items.slice(0, 2) ?? []),
      ],
    },
    ...(safety ? [safety] : []),
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
            "Liffio has four plans: Free ($0/mo), Starter ($9/mo), Business ($79/mo), and Agency ($299/mo). All plans include unlimited Instagram accounts and unlimited automated DMs. Annual billing saves 20%.",
        },
        {
          id: "india-pricing",
          question: "Does Liffio support Indian pricing?",
          answer:
            "Yes. Liffio auto-detects your country and shows INR pricing for India, processed via Razorpay. Global plans are billed in USD via Stripe.",
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
            "Creators with 5,000–100,000 Instagram followers, an engagement rate above 3%, and content posted at least once per week. You should already drive comment engagement on posts and actively sell products, courses, or services. Applications are reviewed manually within 48–72 hours.",
        },
        {
          id: "free-forever",
          question: "Is it really free forever?",
          answer:
            "Yes - for as long as you meet the monthly activity requirements. There is no hidden trial period. Accepted creators keep Business-plan access at no cost while they remain active in the program.",
        },
        {
          id: "activity-requirements",
          question: "What happens if I don't meet the monthly activity requirements?",
          answer:
            "We'll reach out first if your activity drops. Creators who consistently miss the 300 DM/month minimum or drop below 2 active campaigns may be moved off the program with 14 days' notice. You can always upgrade to a paid plan and keep your account.",
        },
        {
          id: "multiple-accounts",
          question: "Can I have multiple Instagram accounts in one workspace?",
          answer:
            "Yes. All Liffio plans - including Creators Program access - support unlimited Instagram accounts per workspace. You can manage multiple profiles from a single dashboard.",
        },
        {
          id: "track-dms",
          question: "How do I track my 300 DM/month minimum?",
          answer:
            "Your workspace analytics dashboard shows automated DM volume in real time. The 300 DM minimum counts unique automated messages sent - not replies within the same thread. You can set up a comment-to-DM flow on a single active post to hit this threshold easily.",
        },
        {
          id: "bio-badge",
          question: "What does the \"⚡ Powered by @Liffio\" bio link badge look like?",
          answer:
            "It's a small footer line on your bio link page (bio.liffio.com/yourusername). It reads \"⚡ Powered by @Liffio\" and links to liffio.com. It's subtle - one line at the bottom of your public link page. Removing or hiding it ends your Creators Program eligibility.",
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
    {
      id: "cancel-subscription",
      question: "How do I cancel my subscription?",
      answer:
        "Go to Settings → Billing in your dashboard and click 'Cancel Plan'. Your access stays active until the end of the current billing period - there is no immediate loss of features and no cancellation fee. You can reactivate at any time.",
    },
    {
      id: "refund-timeline",
      question: "How long do refunds take?",
      answer:
        "Approved refunds are processed within 5–10 business days back to your original payment method. Stripe refunds (global) typically appear within 5–7 days. Razorpay refunds (India) take 7–10 business days. Email support@liffio.com to request a refund - see our Refund Policy for eligibility.",
    },
    {
      id: "switch-plans",
      question: "Can I switch plans mid-cycle?",
      answer:
        "Yes. Upgrades take effect immediately and you're charged a prorated amount for the remaining days in your billing cycle. Downgrades take effect at the start of your next billing period - you keep your current plan until then.",
    },
  ],
};

export function getHelpFaqCategories(
  region: PricingRegion,
  overrides?: MarketingFaqOverrides,
): FaqCategory[] {
  return [...getFaqCategories(region, overrides), userSupportCategory];
}
