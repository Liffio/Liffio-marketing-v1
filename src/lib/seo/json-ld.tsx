import type { FaqCategory } from "@/config/faq.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { FEATURE_WELCOME_DM } from "@/config/feature-flags";

function JsonLdScript({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.brand.name,
        legalName: "Liffio Private Limited",
        url: SITE_URL,
        // 🚩 2280×765 are the file's REAL pixel dimensions, read from its PNG
        // IHDR header, not a guess and not the CSS size it is rendered at.
        // This used to declare 200×60, which was wrong by an order of magnitude
        // and, more importantly, put the declared height under Google's 112px
        // minimum for an Organization logo, disqualifying the node on its own
        // stated numbers.
        //
        // 🚩 The file is a PNG byte-for-byte (it starts 89 50 4E 47, and is
        // identical to logo-light.png) wearing a .webp filename. That is a
        // content-type lie, but it is NOT fixable here: other code and possibly
        // external references point at this exact path, so renaming or
        // re-encoding the asset is a separate change. Do not "fix" it by
        // editing this URL: the URL must keep matching the file that exists.
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo/inline-transparent.webp`,
          width: 2280,
          height: 765,
        },
        description:
          "Liffio is an Instagram DM automation tool for creators, coaches, and agencies. Auto-reply to comments, stories, and DMs using keyword triggers, with no password required, built on Meta's official API.",
        foundingDate: "2026",
        founder: [
          { "@type": "Person", name: "Shivam", jobTitle: "Co-founder & CEO" },
          { "@type": "Person", name: "Om", jobTitle: "Co-founder & CTO" },
          { "@type": "Person", name: "Vishal", jobTitle: "Co-founder & CMO" },
          { "@type": "Person", name: "Shlok", jobTitle: "Co-founder & CFO" },
          { "@type": "Person", name: "Pratham", jobTitle: "Co-founder & CRO" },
        ],
        areaServed: "Worldwide",
        // 🚩 This is the ONE canonical Organization node. /about used to emit a
        // second one under the same `@id` with a conflicting legalName and a
        // richer address, which is a merge conflict for any consumer rather
        // than extra detail. The richer facts were folded in here instead, do
        // not re-add a per-page Organization node.
        address: {
          "@type": "PostalAddress",
          streetAddress: "First Floor, Shreeji General Store, Sultanpura Naka Laheri Pura New Road",
          addressLocality: "Vadodara",
          postalCode: "390001",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        foundingLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
          },
        },
        // 🚩 Do NOT re-add a makesOffer pointing at the #software node.
        // It was broken twice over. First, it dangled: this Organization node
        // renders from layout.tsx on every page, but #software is only emitted
        // by <SoftwareApplicationJsonLd />, which appears on 11 of the 30
        // sitemap URLs, so on the other 19 the reference pointed at a node
        // that does not exist in the graph. Second, schema.org's range for
        // makesOffer is Offer, not SoftwareApplication, so it was the wrong
        // type even on the 11 pages where it did resolve. An absent optional
        // property is strictly better than a dangling, mistyped one. The
        // Organization→SoftwareApplication link is already stated in the
        // correct direction by #software's own `publisher` reference back to
        // this node.
        sameAs: [
          siteConfig.social.twitter,
          siteConfig.social.instagram,
          siteConfig.social.linkedin,
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: siteConfig.contact.email,
          availableLanguage: "English",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; item: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.name,
          item: entry.item,
        })),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: siteConfig.brand.name,
        url: SITE_URL,
        description:
          "Instagram auto DM tool with auto comment reply, comment-to-DM, and story reply automation.",
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
        // 🚩 Do NOT re-add a SearchAction here. The removed one advertised
        // `/blog?q={search_term_string}`, and that endpoint does not exist:
        // /blog is a static page that reads no searchParams at all, and its
        // only filter UI is BlogPostGrid's client-side category tabs. Anything
        // that followed the template, Google's sitelinks searchbox, or an AI
        // agent told the site is searchable, got the full unfiltered post list
        // back and no error, which is worse than having no search advertised.
        // A SearchAction belongs here only once a route actually reads the
        // query parameter it names.
      }}
    />
  );
}

/**
 * The price ladder, one row per tier, priced in BOTH currencies.
 *
 * /pricing and the homepage cards IP-detect and render ₹ pricing for Indian
 * visitors, so a USD-only offers array described a page a large share of
 * visitors never see. Both ladders are now emitted as parallel Offers:
 * schema.org and Google both accept multiple Offers that differ only by
 * `priceCurrency`.
 *
 * 🚩 Do NOT swap the emitted currency by IP and do NOT take a region argument.
 * Serving different structured data to Googlebot than to a visitor is
 * cloaking-adjacent, and reading the region would force every page that renders
 * this component into a dynamic render. Emitting both is the honest, static
 * answer.
 *
 * 🚩 Both currency ladders are generated from THIS array, so they cannot drift
 * apart. Add or reprice a tier here, never in the offers array below.
 */
const OFFER_LADDER: {
  name: string;
  /**
   * Omitted for the four buyable tiers: schema.org treats an Offer with no
   * availability as purchasable, which is correct for them.
   */
  availability?: string;
  usd: { price: string; monthly: string; annualPerMonth: string | null };
  inr: { price: string; monthly: string; annualPerMonth: string | null };
  describe: (monthly: string, annualPerMonth: string | null) => string;
}[] = [
  {
    name: "Free",
    usd: { price: "0", monthly: "$0", annualPerMonth: null },
    inr: { price: "0", monthly: "₹0", annualPerMonth: null },
    describe: () => "Free plan. No credit card required.",
  },
  {
    name: "Starter",
    usd: { price: "9.00", monthly: "$9", annualPerMonth: "$7.50" },
    inr: { price: "499", monthly: "₹499", annualPerMonth: "₹417" },
    describe: (monthly, annualPerMonth) =>
      `Starter plan. ${monthly}/month, or ${annualPerMonth}/month billed annually. Flat rate: unlimited DMs and contacts.`,
  },
  {
    // 🚩 Growth IS purchasable now: the card ships a live "Start Growth" CTA
    // and a `?plan=GROWTH` signup link, so this Offer carries no availability
    // qualifier, exactly like the other buyable tiers.
    //
    // It used to be qualified `OutOfStock` and its description ended "announced
    // but not yet available for purchase", because the card was a dead "Coming
    // soon" pill. Both are gone together: this markup renders on 11 URLs, and
    // an OutOfStock price for a plan the page sells is as wrong in the other
    // direction as a bare price for one nobody could buy.
    //
    // If Growth is ever pulled from checkout again, restore BOTH: add
    // 'Growth' to `NOT_BUYABLE` in marketing-plans.server.ts (which drives the
    // card, the FAQ answer and the AI price sentence) and put the
    // `availability` line and the closing sentence back here. This array is
    // hand-maintained and does NOT derive from `provisional`.
    name: "Growth",
    usd: { price: "29.00", monthly: "$29", annualPerMonth: "$24.17" },
    inr: { price: "1499", monthly: "₹1,499", annualPerMonth: "₹1,250" },
    describe: (monthly, annualPerMonth) =>
      `Growth plan. ${monthly}/month, or ${annualPerMonth}/month billed annually. Post, video and profile analytics with bulk upload.`,
  },
  {
    name: "Business",
    usd: { price: "59.00", monthly: "$59", annualPerMonth: "$49.17" },
    inr: { price: "2499", monthly: "₹2,499", annualPerMonth: "₹2,084" },
    describe: (monthly, annualPerMonth) =>
      `Business plan. ${monthly}/month, or ${annualPerMonth}/month billed annually. Flat rate: unlimited DMs and contacts.`,
  },
  {
    // 🚩 Agency is NOT white-label and does NOT include unlimited workspaces:
    // all seven agency:* capabilities are granted to no package, and the limit
    // is a fixed 20 workspaces. What ships is 20 full Business workspaces on a
    // single subscription. Describe that, and nothing more.
    name: "Agency",
    usd: { price: "549.00", monthly: "$549", annualPerMonth: "$457.50" },
    inr: { price: "22999", monthly: "₹22,999", annualPerMonth: "₹19,167" },
    describe: (monthly, annualPerMonth) =>
      `Agency plan. ${monthly}/month, or ${annualPerMonth}/month billed annually. 20 workspaces, each a full Business workspace: 150 automations, 15 seats and unlimited automated DMs per workspace, on one subscription, one invoice and one renewal date.`,
  },
];

const OFFER_CURRENCIES = [
  { code: "USD", key: "usd" },
  { code: "INR", key: "inr" },
] as const;

function pricingOffers() {
  return OFFER_CURRENCIES.flatMap(({ code, key }) =>
    OFFER_LADDER.map((tier) => {
      const money = tier[key];
      return {
        "@type": "Offer",
        name: tier.name,
        price: money.price,
        priceCurrency: code,
        ...(tier.availability ? { availability: tier.availability } : {}),
        description: tier.describe(money.monthly, money.annualPerMonth),
        url: `${SITE_URL}/pricing`,
      };
    }),
  );
}

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: siteConfig.brand.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        description:
          "Liffio is an Instagram DM automation tool. It sends automatic replies to comments, story mentions, and DMs using keyword triggers. It connects through Instagram's official OAuth API, with no password or third-party login required.",
        offers: pricingOffers(),
        featureList: [
          "Comment-to-DM automation",
          "Story reply automation",
          "DM reply automation",
          "Ask Follow (follow gating)",
          "Follow-up DM sequences",
          "Collect Data (lead capture)",
          ...(FEATURE_WELCOME_DM ? ["Welcome New Followers"] : []),
        ],
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  /**
   * The post's own `updatedAt`. Pass it verbatim and it is always emitted as
   * `dateModified`, including when it equals `publishedAt`, that is not a
   * claimed revision, it is the true statement that the last modification was
   * the publication itself. Every current post is in exactly that state.
   */
  updatedAt: string;
  /**
   * The post's byline, from `BlogPost.author`. Every current post sets this to
   * "Liffio Team", a group, not a named individual.
   */
  author: string;
  imageUrl?: string;
}) {
  const pageUrl = `${SITE_URL}/blog/${slug}`;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        // 🚩 The byline the page itself prints, not the publisher wearing an
        // author hat. This used to hardcode the Organization node, so every
        // post was authored by the same @id as its own publisher, which tells
        // a reader (and an AI summariser) nothing about who wrote it. The
        // distinct, un-@id'd node keeps that separation.
        //
        // 🚩 Organization, NOT Person. Every post's `author` is "Liffio Team",
        // which is a group name: typing it as a Person asserts that a human
        // being goes by it. schema.org allows author to be either, so use the
        // one that matches the value. If a post ever carries a real individual
        // byline, that post needs a Person node, not this one relabelled.
        author: { "@type": "Organization", name: author },
        publisher: { "@id": `${SITE_URL}/#organization` },
        datePublished: publishedAt,
        // 🚩 Emitted unconditionally. A previous pass guarded this on
        // `updatedAt !== publishedAt`, which sounds like an edge case but is
        // in fact every post: all six set updatedAt === publishedAt, so the
        // guard stripped dateModified from 100% of the blog. Google lists
        // dateModified as a recommended Article property and uses it as the
        // freshness signal; equal dates are a legitimate, accurate answer
        // ("last modified at publication"), so emitting them beats emitting
        // nothing and letting Google guess from the raw HTML.
        dateModified: updatedAt,
        image: {
          "@type": "ImageObject",
          url: imageUrl ?? `${SITE_URL}${siteConfig.meta.ogImagePath}`,
          width: 1200,
          height: 630,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        url: pageUrl,
        inLanguage: "en",
      }}
    />
  );
}

export function FaqPageJsonLd({ categories }: { categories: FaqCategory[] }) {
  const mainEntity = categories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  );

  if (mainEntity.length === 0) return null;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity,
      }}
    />
  );
}
