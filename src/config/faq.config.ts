import { metaCopy } from "@/config/meta-copy";

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

export const homeFaqCategories: FaqCategory[] = [
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
          "Most creators connect Instagram and send their first automated DM in under five minutes. Pick a trigger, write your message, set your delay (10–60 seconds), and go live.",
      },
      {
        id: "keyword-triggers",
        question: "What are keyword triggers?",
        answer:
          "Keyword triggers are words or phrases in a comment that start an automation. If someone comments \"LINK\" on your post, Liffio can send them your link in DMs after your configured delay.",
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
          "DMs send after your chosen delay — from 10 to 60 seconds after the trigger (comment, story reply, etc.). You control the timing for more human-like replies while staying on autopilot.",
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
          "Comment-to-DM, story mentions and reactions, live stream comments, welcome DMs for new followers, multi-step flows, follow-up sequences, and more — depending on your plan.",
      },
    ],
  },
  {
    id: "plans",
    label: "Plans & billing",
    items: [
      {
        id: "starter-free",
        question: "Is the Starter plan really free?",
        answer:
          "Yes. Starter is $0/month with no credit card required. You get 1,000 automated DMs per month, comment keyword triggers, public auto-replies, a bio link page, and basic analytics.",
      },
      {
        id: "plans-offered",
        question: "What plans does Liffio offer?",
        answer:
          "Four tiers: Starter (free), Pro ($11/mo), Business ($79/mo), and Agency (custom). Each unlocks more accounts, DMs, automations, and growth tools.",
      },
      {
        id: "billing-cycle",
        question: "Can I pay monthly or annually?",
        answer:
          "Yes. Pro and Business are available monthly or annually. Annual billing saves 20%. Payments are handled via Stripe (global) or Razorpay (India).",
      },
      {
        id: "dm-limit",
        question: "What happens when I reach my DM limit?",
        answer:
          "Automation pauses until your next billing cycle. You receive email alerts at 80% and 100% of your monthly limit.",
      },
      {
        id: "cancel",
        question: "How do I cancel my subscription?",
        answer:
          "Cancel anytime from account settings. There are no cancellation fees — your plan stays active until the end of the current billing period.",
      },
    ],
  },
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
          "Yes. Pro includes up to 5 accounts, Business up to 10, and Agency supports unlimited accounts with white-label workspaces for clients.",
      },
    ],
  },
];

/** Flat list for help page and other surfaces */
export const allFaqs: FaqItem[] = homeFaqCategories.flatMap((c) => c.items);
