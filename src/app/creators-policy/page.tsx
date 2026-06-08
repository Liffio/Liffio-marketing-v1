import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadCreatorsPolicyContent } from "@/lib/legal/load-creators-policy";
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
      lastUpdated="June 2026"
      content={loadCreatorsPolicyContent()}
    />
  );
}
