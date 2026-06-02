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
  const envOverride = process.env.PRICING_REGION?.toLowerCase();
  if (envOverride === "india" || envOverride === "in") {
    return { region: "india", countryCode: "IN" };
  }
  if (envOverride === "global" || envOverride === "us") {
    return { region: "global", countryCode: "US" };
  }

  const headerStore = await headers();
  const countryCode = getCountryCodeFromHeaders(headerStore);
  return {
    region: resolvePricingRegion(countryCode),
    countryCode,
  };
}

/** @deprecated Use getPricingContext() */
export async function getPricingRegion(): Promise<PricingRegion> {
  const { region } = await getPricingContext();
  return region;
}
