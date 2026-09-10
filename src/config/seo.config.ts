import type { Metadata } from "next";
import { SITE_URL, siteConfig } from "@/config/site.config";

/** Target queries aligned with ManyChat, SendDM, LinkDM, SuperProfile, and similar tools. */
export const SEO_KEYWORDS = [
  // Primary auto DM terms
  "auto dm",
  "auto dms",
  "auto dm tool",
  "auto dm tools",
  "auto dm software",
  "auto dm app",
  "auto dm service",
  "best auto dm tool",
  "free auto dm tool",
  // Instagram-specific auto DM
  "Instagram auto dm",
  "auto dm Instagram",
  "Instagram auto dm tool",
  "auto dm for Instagram",
  "Instagram auto dms",
  "Instagram auto dm free",
  "Instagram auto dm bot",
  // DM automation variations
  "dm automation",
  "dm automation tool",
  "dm automation software",
  "dming tool",
  "Instagram dm automation",
  "Instagram dm automation tool",
  "Instagram dm automation software",
  "automated dm tool",
  "automated dms Instagram",
  // Auto comment terms
  "auto comment tool",
  "auto comment reply",
  "auto comment reply Instagram",
  "Instagram auto comment",
  "Instagram auto comment reply",
  "auto reply comments Instagram",
  // Comment to DM flow
  "comment to dm",
  "comment to dm automation",
  "comment to dm tool",
  "Instagram comment automation",
  "Instagram comment to dm",
  // Keyword triggers
  "keyword trigger Instagram",
  "Instagram keyword automation",
  "keyword dm automation",
  // Story automation
  "story reply automation",
  "Instagram story automation",
  "auto reply story Instagram",
  // Auto reply terms
  "auto reply Instagram dm",
  "Instagram auto reply",
  "auto reply tool Instagram",
  "private reply tool",
  // Competitor alternatives
  "manychat alternative",
  "manychat competitor",
  "senddm alternative",
  "linkdm alternative",
  "superprofile alternative",
  "igdm alternative",
  // Bot/engagement terms
  "Instagram dm bot",
  "Instagram engagement automation",
  "Instagram marketing automation",
  "Instagram lead generation tool",
  "Instagram automation tool",
  // Meta/compliance
  "Instagram api dm tool",
] as const;

/** Primary keywords to emphasize in H1s and important sections */
export const PRIMARY_KEYWORDS = [
  "auto dm",
  "auto dm tool",
  "Instagram auto dm",
  "dm automation",
  "auto comment reply",
  "comment to dm",
] as const;

/** Competitor names for comparison content */
export const COMPETITORS = [
  "ManyChat",
  "SendDM",
  "LinkDM",
  "SuperProfile",
  "IGDM",
  "InstaChamp",
] as const;

const logoUrl = () => `${SITE_URL}${siteConfig.brand.logoDark}`;

type PageSeoInput = {
  title: string;
  description: string;
  /** App path, e.g. `/features` */
  pathname: string;
};

function ogImageUrl(path: string) {
  return `${SITE_URL}${path}`;
}

/** Builds page metadata with canonical URL, Open Graph, and Twitter cards. */
export function buildPageMetadata({
  title,
  description,
  pathname,
  ogImagePath,
  ogImageAlt,
}: PageSeoInput & { ogImagePath?: string; ogImageAlt?: string }): Metadata {
  const canonicalPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pageUrl = canonicalPath === "/" ? SITE_URL : `${SITE_URL}${canonicalPath}`;
  const imagePath = ogImagePath ?? siteConfig.meta.ogImagePath;
  const imageUrl = ogImageUrl(imagePath);
  const imageAlt = ogImageAlt ?? `${siteConfig.brand.name} - Instagram auto DM tool`;
  const isOgCard = imagePath.startsWith("/og/");

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: siteConfig.brand.name,
      type: "website",
      images: isOgCard
        ? [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }]
        : [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const rootSeo = buildPageMetadata({
  title: "Liffio — Instagram DM Automation for Creators and Brands",
  description:
    "Auto-reply to Instagram comments, story mentions, and DMs with keyword triggers. Runs 24/7 on the official Instagram API. Free plan, no card needed.",
  pathname: "/",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

export const pageSeo = {
  features: buildPageMetadata({
    title: "Instagram DM & Comment Automation Features | Liffio",
    description:
      "Comment-to-DM, story reply, DM sequences, follow gating, and more. Every automation type in one place. Built on Instagram’s official API.",
    pathname: "/features",
  }),
  pricing: buildPageMetadata({
    // The "| Liffio" suffix was traded for "₹499/mo": native INR billing with
    // GST invoices is the one differentiator no competitor pricing page claims,
    // and /pricing is the only page where it belongs in the title (the
    // description already carried GST). Google appends the site name to the
    // title link anyway, so the brand is not actually lost. 557px.
    title: "Instagram DM Automation Pricing — Free Plan, $9 or ₹499/mo",
    description:
      // "unlimited Instagram accounts" was removed here for the same reason it
      // was removed from the cards, the FAQ and llms.txt: workspacesIncluded is
      // 1 on every tier but Agency. See docs/decisions/0002.
      // "unlimited automated DMs" stays qualified with "on paid plans" — Free
      // is capped at 500 DMs/month.
      "Free plan, no credit card. From $9/mo, or ₹499/mo in India with GST invoices. One Instagram account per workspace, unlimited automated DMs on paid plans.",
    pathname: "/pricing",
  }),
  signup: {
    ...buildPageMetadata({
      title: "Start Free - Instagram Auto DM & Comment Automation",
      description:
        "Create your free Liffio account in minutes. Set up auto DMs, auto comment replies, and keyword triggers without a credit card.",
      pathname: "/signup",
    }),
    robots: { index: false, follow: true },
  },
  blog: buildPageMetadata({
    // 630px -> 537px. "and Tutorials" dropped; "Guides" already covers it and
    // the description spells out the tutorial topics.
    title: "Instagram DM Automation Blog — Guides and Scripts | Liffio",
    description:
      "How-to guides on comment-to-DM setup, story automation, DM scripts that convert, and common automation mistakes to avoid.",
    pathname: "/blog",
  }),
  help: buildPageMetadata({
    title: "Help Center - Auto DM Tool Setup & Support",
    description:
      "Get help with Liffio’s Instagram auto DM tool: connecting accounts, keyword triggers, auto comment reply, billing, and compliance.",
    pathname: "/help",
  }),
  affiliate: buildPageMetadata({
    // Was the widest title on the site at 675px, truncating inside "Instagram
    // DM Tool Referrals". 559px now: "Earn Commission on" -> "Earn on" keeps
    // the whole "Instagram DM Tool Referrals" phrase intact instead, and
    // "recurring commissions" is still the first thing the description says.
    title: "Liffio Affiliate Program — Earn on Instagram DM Tool Referrals",
    description:
      "Earn recurring commissions promoting Liffio, the Instagram DM automation and auto comment tool for creators and agencies.",
    pathname: "/affiliate",
  }),
  creatorsProgram: buildPageMetadata({
    // 617px -> 535px. Trailing "Creators" dropped as redundant with "Creators
    // Program"; "Instagram" kept because it is the keyword doing the work.
    title: "Liffio Creators Program — Free Business Plan for Instagram",
    description:
      "Qualifying creators with 5K–100K followers get Liffio’s Business plan free. Apply in 2 minutes. No credit card. Up to 50 spots available.",
    pathname: "/creators-program",
  }),
} as const;
