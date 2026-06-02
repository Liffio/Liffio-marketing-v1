import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getCountryCodeFromHeaders,
  PRICING_REGION_COOKIE,
  resolvePricingRegion,
} from "@/lib/pricing-region";

export function proxy(request: NextRequest) {
  const country = getCountryCodeFromHeaders(request.headers);
  const region = resolvePricingRegion(country);
  const response = NextResponse.next();

  response.cookies.set(PRICING_REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
