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
        logo: `${SITE_URL}${siteConfig.brand.logoDark}`,
        description: siteConfig.brand.description,
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
        alternateName: [
          "Liffio Auto DM Tool",
          "Liffio Instagram Auto DM",
          "Liffio DM Automation",
        ],
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Social Media Automation",
        operatingSystem: "Web",
        url: SITE_URL,
        description:
          "Liffio is the best auto DM tool for Instagram. Send auto DMs from comments, stories, and messages with auto comment reply, keyword triggers, and DM automation — a modern ManyChat alternative.",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
          { "@type": "Offer", name: "Starter", price: "9", priceCurrency: "USD" },
          { "@type": "Offer", name: "Business", price: "79", priceCurrency: "USD" },
          { "@type": "Offer", name: "Agency", price: "299", priceCurrency: "USD" },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "124",
        },
        featureList: [
          "Auto DM tool",
          "Auto DMs for Instagram",
          "Instagram auto DM",
          "Auto comment reply",
          "Auto comment tool",
          "Comment-to-DM automation",
          "Story reply automation",
          "DM automation tool",
          "Keyword triggers",
          "DM automation flows",
          "Instagram auto reply",
          "ManyChat alternative",
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
        "@type": "Article",
        headline: title,
        description,
        author: { "@type": "Organization", name: siteConfig.brand.name, url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: siteConfig.brand.name,
          logo: { "@type": "ImageObject", url: `${SITE_URL}${siteConfig.brand.logoDark}` },
        },
        datePublished: publishedAt,
        dateModified: updatedAt,
        image: imageUrl ?? `${SITE_URL}${siteConfig.meta.ogImagePath}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
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
