import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site.config";
import { loadCreatorsPolicyContent } from "@/lib/legal/load-creators-policy";

export const metadata: Metadata = {
  title: `Creators Program Policy — ${siteConfig.brand.name}`,
  description: `Rules, eligibility, and obligations for the ${siteConfig.brand.name} Creators Program.`,
};

export default function CreatorsProgramPolicyPage() {
  return (
    <LegalPage
      title="Creators Program Policy"
      lastUpdated="April 2026"
      content={loadCreatorsPolicyContent()}
    />
  );
}
