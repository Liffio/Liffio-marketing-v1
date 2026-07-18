import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/blog/posts";
import { SITE_URL } from "@/config/site.config";
import { getAllComparisonSlugs } from "@/config/comparisons.config";

type SitemapEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

/** Public, indexable marketing routes only (matches src/app route pages). */
export const SITEMAP_ENTRIES: readonly SitemapEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/features", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/compare", changeFrequency: "weekly", priority: 0.85 },
  { path: "/manychat-alternative", changeFrequency: "monthly", priority: 0.85 },
  { path: "/senddm-alternative", changeFrequency: "monthly", priority: 0.85 },
  { path: "/chatfuel-alternative", changeFrequency: "monthly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/help", changeFrequency: "weekly", priority: 0.7 },
  { path: "/creators-program", changeFrequency: "monthly", priority: 0.6 },
  { path: "/affiliate", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/acceptable-use-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/creators-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/affiliate-policy", changeFrequency: "yearly", priority: 0.3 },
] as const;

export function buildSitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticUrls = SITEMAP_ENTRIES.map(({ path, changeFrequency, priority }) => ({
    url: path ? SITE_URL + path : SITE_URL,
    lastModified,
    changeFrequency,
    priority,
  }));

  const comparisonUrls = getAllComparisonSlugs().map((slug) => ({
    url: `${SITE_URL}/vs/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogUrls = getAllPostSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...comparisonUrls, ...blogUrls];
}
