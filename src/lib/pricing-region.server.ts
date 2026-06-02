import "server-only";

import { headers } from "next/headers";
import {
  getCountryCodeFromHeaders,
  resolvePricingRegion,
  type PricingRegion,
} from "@/lib/pricing-region";

export async function getPricingRegion(): Promise<PricingRegion> {
  const envOverride = process.env.PRICING_REGION?.toLowerCase();
  if (envOverride === "india" || envOverride === "in") return "india";
  if (envOverride === "global" || envOverride === "us") return "global";

  const headerStore = await headers();
  return resolvePricingRegion(getCountryCodeFromHeaders(headerStore));
}
