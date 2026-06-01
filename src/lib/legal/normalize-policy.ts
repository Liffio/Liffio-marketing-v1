import { siteConfig } from "@/config/site.config";

const BRAND = siteConfig.brand.name;
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
      .replace(/Powered by @Liffio/g, `Powered by @${BRAND}`)
      .replace(/@Reactova/g, `@${BRAND}`)
      .replace(new RegExp(`${SITE_HOST}/terms(?!-)`, "g"), `${SITE_HOST}/terms-of-service`)
      .replace(new RegExp(`${SITE_HOST}/privacy(?!-)`, "g"), `${SITE_HOST}/privacy-policy`)
      .replace(new RegExp(`${SITE_HOST}/acceptable-use(?!-)`, "g"), `${SITE_HOST}/acceptable-use-policy`)
      .replace(new RegExp(`${SITE_HOST}/refunds?\\b`, "g"), `${SITE_HOST}/refund-policy`)
  );
}
