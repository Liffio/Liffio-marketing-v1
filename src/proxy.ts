import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCountryCodeFromHeaders, resolvePricingRegion } from "@/lib/pricing-region";
import { resolveConsentRequirement } from "@/lib/consent/regions";

export const CONSENT_REQUIREMENT_HEADER = "x-consent-required";

export function proxy(request: NextRequest) {
  const country = getCountryCodeFromHeaders(request.headers);
  const region = resolvePricingRegion(country);

  // Pass pricing region to server components via request headers (not response cookies).
  // This keeps responses cacheable: no Set-Cookie means Vercel edge cache can serve them.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pricing-region", region);

  /*
    Whether this visitor has to be asked before a referral cookie is set.

    The host is Vercel (see vercel.json), so the geo header is
    `x-vercel-ip-country`, which Vercel sets on every plan.
    `getCountryCodeFromHeaders` reads that first and already falls back to
    `cf-ipcountry` and `x-country-code`, so a move behind Cloudflare or another
    proxy keeps working. With none of the three present the answer is
    "unknown", and the banner shows to everyone: a missing header means we
    cannot tell where the visitor is, and the safe reading of the Cookie
    Policy's "only after you agree" is to ask.

    🚩 Passed as a REQUEST header, never as a response cookie, for the same
    reason the pricing region is: a Set-Cookie here would make every response
    on the site uncacheable at the edge. Nothing server-rendered reads this
    header either; /api/consent-region does, so the banner can ask for the
    answer without forcing every page into a dynamic render.
  */
  requestHeaders.set(CONSENT_REQUIREMENT_HEADER, resolveConsentRequirement(country));

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|ico)$).*)",
  ],
};
