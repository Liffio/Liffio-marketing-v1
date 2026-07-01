import type { FaqCategory } from "@/config/faq.config";
import { SITE_URL, siteConfig } from "@/config/site.config";

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
        name: siteConfig.brand.name,
        url: SITE_URL,
        logo: `${SITE_URL}/logo/inline-transparent.webp`,
        foundingDate: "2026",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        sameAs: [
          siteConfig.social.twitter,
          siteConfig.social.instagram,
          siteConfig.social.linkedin,
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: siteConfig.contact.email,
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
        name: siteConfig.brand.name,
        url: SITE_URL,
        description:
          "Instagram auto DM tool with auto comment reply, comment-to-DM, and story reply automation.",
        inLanguage: "en",
      }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: siteConfig.brand.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description:
          "Liffio is an Instagram DM automation tool. It sends automatic replies to comments, story mentions, live messages, and DMs using keyword triggers. It connects through Instagram's official OAuth API — no password or third-party login required.",
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "USD",
            description: "Free plan. No credit card required.",
            url: `${SITE_URL}/pricing`,
          },
          {
            "@type": "Offer",
            name: "Starter",
            price: "9.00",
            priceCurrency: "USD",
            description: "Starter plan. $9/month, or $7/month billed annually.",
            url: `${SITE_URL}/pricing`,
          },
          {
            "@type": "Offer",
            name: "Business",
            price: "79.00",
            priceCurrency: "USD",
            description: "Business plan. $79/month, or $63/month billed annually.",
            url: `${SITE_URL}/pricing`,
          },
          {
            "@type": "Offer",
            name: "Agency",
            price: "299.00",
            priceCurrency: "USD",
            description: "Agency plan. $299/month, or $239/month billed annually.",
            url: `${SITE_URL}/pricing`,
          },
        ],
        featureList: [
          "Comment-to-DM automation",
          "Story reply automation",
          "Live reply automation",
          "DM reply automation",
          "Ask Follow (follow gating)",
          "Smart Re-engage (win-back sequences)",
          "Collect Data (lead capture)",
          "Welcome New Followers",
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
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
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
        author: { "@type": "Organization", name: siteConfig.brand.name, url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: siteConfig.brand.name,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/inline-transparent.webp` },
        },
        datePublished: publishedAt,
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
