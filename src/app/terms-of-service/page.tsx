import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service - Liffio",
  description: "Read the terms and conditions for using Liffio's Instagram DM automation platform.",
  pathname: "/terms-of-service",
  ogImagePath: "/og/homepage.png",
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      lastUpdated={policyPublicationDate("terms-and-conditions")}
      content={loadPolicy("terms-and-conditions")}
    />
  );
}
