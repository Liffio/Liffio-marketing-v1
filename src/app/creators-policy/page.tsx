import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Creators Program Policy - Liffio",
  description: "Rules, eligibility criteria, and obligations for the Liffio Creators Program.",
  pathname: "/creators-policy",
  ogImagePath: "/og/homepage.png",
});

export default function CreatorsProgramPolicyPage() {
  return (
    <LegalPage
      title="Creators Program Policy"
      lastUpdated={policyPublicationDate("creators-program-policy")}
      content={loadPolicy("creators-program-policy")}
    />
  );
}
