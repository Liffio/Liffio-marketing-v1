import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy - Liffio",
  description: "Learn how Liffio uses cookies and tracking technologies to improve your experience.",
  pathname: "/cookie-policy",
  ogImagePath: "/og/homepage.png",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated={policyPublicationDate("cookie-policy")}
      content={loadPolicy("cookie-policy")}
    />
  );
}
