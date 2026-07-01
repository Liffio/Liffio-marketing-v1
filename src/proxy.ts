import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCountryCodeFromHeaders, resolvePricingRegion } from "@/lib/pricing-region";

export function proxy(request: NextRequest) {
  const country = getCountryCodeFromHeaders(request.headers);
  const region = resolvePricingRegion(country);

  // Pass pricing region to server components via request headers (not response cookies).
  // This keeps responses cacheable — no Set-Cookie means Vercel edge cache can serve them.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pricing-region", region);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|ico)$).*)",
  ],
};
