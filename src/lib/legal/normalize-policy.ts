import { siteConfig } from "@/config/site.config";

const BRAND = siteConfig.brand.name;
/** The Instagram handle, read from the social link so the two cannot drift. */
const INSTAGRAM_HANDLE = siteConfig.social.instagram.split("/").pop() ?? "getliffio";
const SUPPORT_EMAIL = "support@liffio.com";
const SITE_HOST = "liffio.com";

/** Rebrand Reactova marketing policy text for Liffio. */
export function normalizePolicyContent(raw: string): string {
  return (
    raw
      .replace(/Reactova/g, BRAND)
      .replace(/reactova\.com/gi, SITE_HOST)
      .replace(/support@reactova\.com/gi, SUPPORT_EMAIL)
      .replace(/hi@reactova\.com/gi, SUPPORT_EMAIL)
      // "Powered by @Liffio" is NOT rewritten. It is the product's own text:
      // the bio link badge prints it verbatim (Frontend public-bio-link.tsx),
      // so the policy has to quote it verbatim. A rule here used to turn it into
      // "@getliffio", which put words in the policy the product never shows.
      // @getliffio stays the handle for disclosures (Section 6.3), below.
      .replace(/@Reactova/g, `@${INSTAGRAM_HANDLE}`)
      .replace(new RegExp(`${SITE_HOST}/terms(?!-)`, "g"), `${SITE_HOST}/terms-of-service`)
      .replace(new RegExp(`${SITE_HOST}/privacy(?!-)`, "g"), `${SITE_HOST}/privacy-policy`)
      .replace(new RegExp(`${SITE_HOST}/acceptable-use(?!-)`, "g"), `${SITE_HOST}/acceptable-use-policy`)
      .replace(new RegExp(`${SITE_HOST}/refunds?\\b`, "g"), `${SITE_HOST}/refund-policy`)
  );
}
