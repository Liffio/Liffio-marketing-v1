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

export function getCountryFlagEmoji(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🌍";
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}

export function getCountryName(countryCode: string | null | undefined): string {
  if (!countryCode) return "International";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode.toUpperCase()) ?? countryCode;
  } catch {
    return countryCode;
  }
}

export function getPricingRegionLabel(region: PricingRegion): string {
  return region === "india" ? "India pricing (INR)" : "Global pricing (USD)";
}

export function getPricingLocationLabel(region: PricingRegion, countryCode: string | null): string {
  const flag = getCountryFlagEmoji(countryCode);
  const country = getCountryName(countryCode);
  const currency = region === "india" ? "INR" : "USD";
  return `${flag} ${country} · ${currency} pricing`;
}
