import "server-only";

import { headers } from "next/headers";
import {
  getCountryCodeFromHeaders,
  resolvePricingRegion,
  type PricingRegion,
} from "@/lib/pricing-region";

export type PricingContext = {
  region: PricingRegion;
  countryCode: string | null;
};

export async function getPricingContext(): Promise<PricingContext> {
  const envCountry = process.env.PRICING_COUNTRY?.trim().toUpperCase();
  if (envCountry && /^[A-Z]{2}$/.test(envCountry)) {
    return {
      region: resolvePricingRegion(envCountry),
      countryCode: envCountry,
    };
  }

  const envOverride = process.env.PRICING_REGION?.toLowerCase();
  if (envOverride === "india" || envOverride === "in") {
    return { region: "india", countryCode: "IN" };
  }
  if (envOverride === "global" || envOverride === "us") {
    return { region: "global", countryCode: "US" };
  }

  const headerStore = await headers();

  const middlewareRegion = headerStore.get("x-pricing-region") as PricingRegion | null;
  if (middlewareRegion === "india" || middlewareRegion === "global") {
    const countryCode = middlewareRegion === "india" ? "IN" : null;
    return { region: middlewareRegion, countryCode };
  }

  const countryCode = getCountryCodeFromHeaders(headerStore);
  const region = resolvePricingRegion(countryCode);

  return {
    region,
    countryCode: countryCode ?? (region === "india" ? "IN" : null),
  };
}

/** @deprecated Use getPricingContext() */
export async function getPricingRegion(): Promise<PricingRegion> {
  const { region } = await getPricingContext();
  return region;
}
