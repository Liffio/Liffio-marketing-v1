import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesPageContent from "@/components/features/FeaturesPageContent";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { pageSeo } from "@/config/seo.config";
import { getFeaturesFaqCategories } from "@/config/faq.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/config/site.config";
import { getPricingContext } from "@/lib/pricing-region.server";

export const metadata = pageSeo.features;

export default async function FeaturesPage() {
  const { region } = await getPricingContext();
  const faqCategories = getFeaturesFaqCategories(region);

  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Features", item: `${SITE_URL}/features` },
        ]}
      />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <FeaturesPageContent />
        <SiteFaqSection categories={faqCategories} defaultOpenId="comment-to-dm-how" />
      </main>
      <Footer />
    </>
  );
}
