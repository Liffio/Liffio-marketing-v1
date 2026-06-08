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
  "instagram auto dm",
  "auto dm instagram",
  "instagram auto dm tool",
  "auto dm for instagram",
  "instagram auto dms",
  "instagram auto dm free",
  "instagram auto dm bot",
  // DM automation variations
  "dm automation",
  "dm automation tool",
  "dm automation software",
  "dming tool",
  "instagram dm automation",
  "instagram dm automation tool",
  "instagram dm automation software",
  "automated dm tool",
  "automated dms instagram",
  // Auto comment terms
  "auto comment tool",
  "auto comment reply",
  "auto comment reply instagram",
  "instagram auto comment",
  "instagram auto comment reply",
  "auto reply comments instagram",
  // Comment to DM flow
  "comment to dm",
  "comment to dm automation",
  "comment to dm tool",
  "instagram comment automation",
  "instagram comment to dm",
  // Keyword triggers
  "keyword trigger instagram",
  "instagram keyword automation",
  "keyword dm automation",
  // Story automation
  "story reply automation",
  "instagram story automation",
  "auto reply story instagram",
  // Auto reply terms
  "auto reply instagram dm",
  "instagram auto reply",
  "auto reply tool instagram",
  "private reply tool",
  // Competitor alternatives
  "manychat alternative",
  "manychat competitor",
  "senddm alternative",
  "linkdm alternative",
  "superprofile alternative",
  "igdm alternative",
  // Bot/engagement terms
  "instagram dm bot",
  "instagram engagement automation",
  "instagram marketing automation",
  "instagram lead generation tool",
  "instagram automation tool",
  // Meta/compliance
  "meta approved dm automation",
  "instagram api dm tool",
] as const;

/** Primary keywords to emphasize in H1s and important sections */
export const PRIMARY_KEYWORDS = [
  "auto dm",
  "auto dm tool",
  "instagram auto dm",
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
  title: "Liffio - Automate Instagram DMs & Grow Your Engagement Fast",
  description:
    "Automate Instagram DMs, auto-reply to comments, stories & messages. The smartest way to grow your Instagram. Get started for free.",
  pathname: "/",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

export const pageSeo = {
  features: buildPageMetadata({
    title: "Instagram Auto DM & Auto Comment Tool - Features",
    description:
      "Auto comment reply, comment-to-DM, story reply automation, live comments, welcome DMs, and multi-step flows. Full-featured DM automation tool for Instagram creators and brands.",
    pathname: "/features",
  }),
  pricing: buildPageMetadata({
    title: "Auto DM Tool Pricing - Free & Paid Instagram Automation Plans",
    description:
      "Transparent pricing for an Instagram auto DM and auto comment tool. Free, Starter, Business, and Agency plans with unlimited automated DMs.",
    pathname: "/pricing",
  }),
  signup: buildPageMetadata({
    title: "Start Free - Instagram Auto DM & Comment Automation",
    description:
      "Create your free Liffio account in minutes. Set up auto DMs, auto comment replies, and keyword triggers without a credit card.",
    pathname: "/signup",
  }),
  blog: buildPageMetadata({
    title: "Instagram DM Automation Blog - Auto DM & Growth Guides",
    description:
      "Guides on auto DM tools, comment-to-DM automation, keyword triggers, and Instagram engagement - tips for creators comparing ManyChat, SendDM, and LinkDM.",
    pathname: "/blog",
  }),
  help: buildPageMetadata({
    title: "Help Center - Auto DM Tool Setup & Support",
    description:
      "Get help with Liffio’s Instagram auto DM tool: connecting accounts, keyword triggers, auto comment reply, billing, and compliance.",
    pathname: "/help",
  }),
  affiliate: buildPageMetadata({
    title: "Affiliate Program - Promote an Instagram Auto DM Tool",
    description:
      "Earn recurring commissions promoting Liffio, the Instagram DM automation and auto comment tool for creators and agencies.",
    pathname: "/affiliate",
  }),
  creatorsProgram: buildPageMetadata({
    title: "Creators Program - Free Instagram DM Automation for Creators",
    description:
      "Qualified creators get Business-plan access to Liffio’s auto DM tool: comment-to-DM, story automation, and unlimited keyword triggers.",
    pathname: "/creators-program",
  }),
} as const;
