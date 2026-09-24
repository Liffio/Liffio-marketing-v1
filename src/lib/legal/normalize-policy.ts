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
      // Creators Policy 6.2 fixes the handle as @getliffio, not @Liffio. Both
      // rules below used to resolve to the bare brand name, which would have
      // rewritten a correct handle into a wrong one the moment the source text
      // carried "Powered by @Liffio".
      .replace(/Powered by @Liffio/g, `Powered by @${INSTAGRAM_HANDLE}`)
      .replace(/@Reactova/g, `@${INSTAGRAM_HANDLE}`)
      .replace(new RegExp(`${SITE_HOST}/terms(?!-)`, "g"), `${SITE_HOST}/terms-of-service`)
      .replace(new RegExp(`${SITE_HOST}/privacy(?!-)`, "g"), `${SITE_HOST}/privacy-policy`)
      .replace(new RegExp(`${SITE_HOST}/acceptable-use(?!-)`, "g"), `${SITE_HOST}/acceptable-use-policy`)
      .replace(new RegExp(`${SITE_HOST}/refunds?\\b`, "g"), `${SITE_HOST}/refund-policy`)
  );
}
