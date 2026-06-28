import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/_next/",
        "/signup",
        "/login",
        "/register",
        "/dashboard",
        "/onboarding",
        "/confirm-email",
        "/forgot-password",
        "/auth/",
        "/oauth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
