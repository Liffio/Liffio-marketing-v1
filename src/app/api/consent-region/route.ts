import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCountryCodeFromHeaders } from "@/lib/pricing-region";
import {
  resolveConsentRequirement,
  shouldAskForConsent,
  type ConsentRequirement,
} from "@/lib/consent/regions";
import { CONSENT_REQUIREMENT_HEADER } from "@/proxy";

/**
 * Does this visitor have to be asked before a referral cookie is set?
 *
 * 🚩 This exists so the ANSWER can come from the geo header without the whole
 * site going dynamic. The obvious alternative, reading the header in the root
 * layout, would put an `await headers()` above every route and cost the static
 * render of all of them. (The same trap is documented at the top of
 * faq.config.ts, where a region argument that reached no output was forcing
 * /features to render dynamically.) One small dynamic route is a much cheaper
 * way to buy the same answer.
 *
 * The middleware has already worked the requirement out and put it on the
 * request; reading the geo header directly is the fallback for a request that
 * somehow skipped the matcher.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const headerStore = await headers();

  const fromProxy = headerStore.get(CONSENT_REQUIREMENT_HEADER) as ConsentRequirement | null;
  const requirement: ConsentRequirement =
    fromProxy === "required" || fromProxy === "not-required" || fromProxy === "unknown"
      ? fromProxy
      : resolveConsentRequirement(getCountryCodeFromHeaders(headerStore));

  return NextResponse.json(
    { requirement, ask: shouldAskForConsent(requirement) },
    // Per visitor, and cheap to recompute. Caching it would hand one country's
    // answer to a visitor in another.
    { headers: { "Cache-Control": "no-store" } },
  );
}
