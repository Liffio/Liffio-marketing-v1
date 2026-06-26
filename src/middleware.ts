import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCountryCodeFromHeaders, resolvePricingRegion } from "@/lib/pricing-region";

export function middleware(request: NextRequest) {
  const country = getCountryCodeFromHeaders(request.headers);
  const region = resolvePricingRegion(country);
  const response = NextResponse.next();

  response.headers.set("x-pricing-region", region);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|ico)$).*)",
  ],
};
