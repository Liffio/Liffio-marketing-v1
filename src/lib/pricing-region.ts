export type PricingRegion = "global" | "india";

export const PRICING_REGION_COOKIE = "pricing-region";

export function resolvePricingRegion(countryCode: string | null | undefined): PricingRegion {
  if (countryCode?.toUpperCase() === "IN") return "india";
  return "global";
}

export function getCountryCodeFromHeaders(headerStore: Headers): string | null {
  return (
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry") ??
    headerStore.get("x-country-code")
  );
}

export function getPricingRegionLabel(region: PricingRegion): string {
  return region === "india" ? "India pricing (INR)" : "Global pricing (USD)";
}
