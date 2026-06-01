import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AffiliateProgramContent from "@/components/AffiliateProgramContent";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Affiliate Program — ${siteConfig.brand.name}`,
  description: `Earn 25% / 10% / 10% commissions across 3 months per referral. 90-day attribution, on-demand payouts from $50.`,
};

export default function AffiliatePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <AffiliateProgramContent />
      </main>
      <Footer />
    </>
  );
}
