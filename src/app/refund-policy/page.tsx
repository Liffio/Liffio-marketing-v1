import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund Policy - Liffio",
  description: "Understand Liffio's refund and cancellation policies for paid plans.",
  pathname: "/refund-policy",
  ogImagePath: "/og/homepage.png",
});

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated={policyPublicationDate("refund-policy")}
      content={loadPolicy("refund-policy")}
    />
  );
}
