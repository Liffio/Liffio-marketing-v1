import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { SITE_URL } from "@/config/site.config";
import { getAllComparisonSlugs } from "@/config/comparisons.config";

/**
 * ⚠️ EVERY `lastModified` BELOW IS HAND-MAINTAINED. BUMP IT WHEN THE PAGE'S
 * CONTENT ACTUALLY CHANGES, and only then.
 *
 * This file used to compute `new Date()` once per build and stamp it on all 30
 * URLs, so every page claimed to have changed every time anything deployed.
 * Google's documented response to a lastmod that moves without the content
 * moving is to stop trusting the field for the whole site, which is what left
 * the V4 pricing redesign (2026-09-10) with no way to signal itself to a
 * crawler that last fetched /pricing on 2026-08-13.
 *
 * Rules:
 *   • ISO `YYYY-MM-DD` strings only. Never `new Date()` / `Date.now()`: a
 *     build-time clock is exactly the defect this replaced.
 *   • Editing a page's OWN content means editing its date here in the same
 *     change. "Own content" is the copy the route exists to serve, or the
 *     structured data describing that route, whether it lives in the page
 *     file or in a config the page renders from.
 *   • A block that repeats across many routes is NOT any one route's own
 *     content. Editing the nav, the footer, or the site-wide FAQ that
 *     `LegalPage` appends under the policy text moves the dates of the routes
 *     that block is primary content for (/help, /pricing), not the date of
 *     every route that happens to render it. The seven policy routes also
 *     print their own "Last updated: <month> 2026" in the body; a lastmod that
 *     disagrees with the date on the page is worse than a stale one.
 *   • Blog URLs are NOT listed here: they read each post's own `updatedAt`
 *     from src/lib/blog/posts.ts, so a post's date is maintained with the post.
 *
 * Dates below are the last change to each route's own content. 2026-09-11 is
 * the site-wide copy correction that removed the unlimited-Instagram-accounts,
 * free-tier-unlimited-DM and agency-white-label claims (docs/decisions/0002,
 * 0004); it legitimately touches most routes because those claims were spread
 * across the shared marketing configs every marketing route renders from.
 * 2026-09-25 is the plan update (docs/decisions/0005): the plan cards, matrix,
 * FAQs and "unlimited DMs on every plan, Free included" copy moved on every
 * route dated that day, and on all five /vs pages through the shared rows().
 */

type SitemapEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  /** ISO `YYYY-MM-DD`. Hand-maintained, see the note above. */
  lastModified: string;
};

/** Public, indexable marketing routes only (matches src/app route pages). */
export const SITEMAP_ENTRIES: readonly SitemapEntry[] = [
  // Hero, How-it-works, Features and SEO sections all had plan claims rewritten.
  { path: "", changeFrequency: "weekly", priority: 1, lastModified: "2026-09-25" },
  { path: "/features", changeFrequency: "weekly", priority: 0.9, lastModified: "2026-09-25" },
  // Plan cards, the plans FAQ and the derived plan answers all changed.
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9, lastModified: "2026-09-25" },
  // The index renders each post's title and excerpt only, so it moves when those
  // move (2026-08-09). The 2026-09-11 edit to posts.ts rewrote body copy inside
  // /blog/manychat-alternatives: that belongs on the post's own `updatedAt`,
  // not here, and nothing the index renders changed.
  { path: "/blog", changeFrequency: "weekly", priority: 0.8, lastModified: "2026-08-09" },
  // Hub renders hubBlurb/ALTERNATIVE_PAGES out of comparisons.config.ts; three
  // hubBlurbs were rewritten on 2026-09-11.
  { path: "/compare", changeFrequency: "weekly", priority: 0.85, lastModified: "2026-09-25" },
  // All three: page copy plus ComparisonTable's DEFAULT_ROWS were corrected.
  { path: "/manychat-alternative", changeFrequency: "monthly", priority: 0.85, lastModified: "2026-09-25" },
  { path: "/senddm-alternative", changeFrequency: "monthly", priority: 0.85, lastModified: "2026-09-25" },
  { path: "/chatfuel-alternative", changeFrequency: "monthly", priority: 0.85, lastModified: "2026-09-25" },
  // No visible copy changed here, but the page stopped emitting its duplicate
  // Organization node, a structured-data change worth a re-crawl.
  { path: "/about", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-09-11" },
  // The FAQ set is what /help exists to serve, and answers were corrected in
  // five of its categories (geo-compliance, discovery, plans, safety, support).
  { path: "/help", changeFrequency: "weekly", priority: 0.7, lastModified: "2026-09-25" },
  { path: "/creators-program", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-09-25" },
  // Bumped from 2026-06-07: AffiliateCalculator's Business/Agency prices were
  // corrected ($79→$59, $299→$549), which changes what this page renders.
  { path: "/affiliate", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-09-11" },
  // /terms-of-service and /creators-policy moved to 2026-09-25 with the plan
  // update (docs/decisions/0005); their printed dates in load-policy.ts match.
  // 2026-09-15 is the policy pack: these seven routes were rewritten wholesale
  // from src/content/legal/*.md and each now prints "Last updated:
  // 15 September 2026" in its own body, so the lastmod and the page agree -
  // which is the third rule above.
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-25" },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-15" },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-15" },
  { path: "/acceptable-use-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-15" },
  { path: "/creators-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-25" },
  { path: "/shipping-delivery-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-15" },
  // Privacy joined the pack once its Grievance Officer name was supplied. This
  // one is a content CORRECTION as well as a rewrite: the old text named Stripe
  // as the processor receiving customer data, and Stripe left the backend on
  // 11 September.
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-09-15" },
  // 🚩 KEEPS its old date because it still serves its old text. The replacement
  // is final and carries no placeholder, but publishing it starts a 30-day
  // notice obligation to existing affiliates, so it is held pending that
  // decision. Move this date in the same change that switches the route.
  { path: "/affiliate-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-08-09" },
] as const;

/**
 * `/vs/<slug>` dates, keyed by slug. Also hand-maintained.
 *
 * They are listed per slug rather than shared so that editing ONE competitor's
 * copy bumps only that URL. All five read 2026-09-11 because the correction
 * pass rewrote per-competitor copy in every one of the five COMPARISONS entries
 * (heroSubtitle, whyPoints, pricingNote and/or faq), on top of the shared
 * `rows()` helper and ComparisonTable that all five render.
 */
const COMPARISON_LAST_MODIFIED: Record<string, string> = {
  replyrush: "2026-09-25",
  linkdm: "2026-09-25",
  superprofile: "2026-09-25",
  zorcha: "2026-09-25",
  instachamp: "2026-09-25",
};

/**
 * Used when a comparison is added to comparisons.config.ts and nobody adds it
 * above. Deliberately left at an older date rather than tracking the newest
 * entry: an unmaintained URL should look stale, not freshly edited, so this
 * constant is not bumped when the dates above are.
 */
const COMPARISON_LAST_MODIFIED_FALLBACK = "2026-08-08";

export function buildSitemap(): MetadataRoute.Sitemap {
  const staticUrls = SITEMAP_ENTRIES.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: path ? SITE_URL + path : SITE_URL,
    lastModified,
    changeFrequency,
    priority,
  }));

  const comparisonUrls = getAllComparisonSlugs().map((slug) => ({
    url: `${SITE_URL}/vs/${slug}`,
    lastModified: COMPARISON_LAST_MODIFIED[slug] ?? COMPARISON_LAST_MODIFIED_FALLBACK,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // A post's date lives with the post. `updatedAt` is already an ISO date string
  // and is required on BlogPost, so there is nothing to fall back to.
  const blogUrls = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...comparisonUrls, ...blogUrls];
}
