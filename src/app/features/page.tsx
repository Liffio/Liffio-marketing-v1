import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesPageContent from "@/components/features/FeaturesPageContent";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: `Features — ${siteConfig.brand.name}`,
  description:
    "Eight Instagram DM automations in one dashboard: comment reply, story reply, live reply, DM flows, follow gates, re-engage, lead capture, and welcome messages.",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <FeaturesPageContent />
      </main>
      <Footer />
    </>
  );
}
