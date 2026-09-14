import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Acceptable Use Policy - Liffio",
  description: "Guidelines for acceptable and prohibited use of Liffio's Instagram DM automation platform.",
  pathname: "/acceptable-use-policy",
  ogImagePath: "/og/homepage.png",
});

export default function AcceptableUsePolicyPage() {
  return (
    <LegalPage
      title="Acceptable Use Policy"
      lastUpdated={policyPublicationDate("acceptable-use-policy")}
      content={loadPolicy("acceptable-use-policy")}
    />
  );
}
