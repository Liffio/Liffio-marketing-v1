import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AffiliateProgramContent from "@/components/AffiliateProgramContent";
import AffiliateCalculator from "@/components/AffiliateCalculator";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { pageSeo } from "@/config/seo.config";
import { getAffiliateFaqCategories } from "@/config/faq.config";
import { FaqPageJsonLd } from "@/lib/seo/json-ld";
import { getPricingContext } from "@/lib/pricing-region.server";
import { fetchMarketingPlansContext } from "@/lib/marketing-plans.server";

export const metadata = pageSeo.affiliate;

export default async function AffiliatePage() {
  const { region } = await getPricingContext();
  // The page quotes commission against real plan prices, so it reads them from
  // the same catalogue /pricing does rather than from literals of its own.
  const { plans } = await fetchMarketingPlansContext(region);
  const faqCategories = getAffiliateFaqCategories(region);

  return (
    <>
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <AffiliateProgramContent plans={plans} />
        <AffiliateCalculator plans={plans} />
        <SiteFaqSection
          categories={faqCategories}
          defaultOpenId="affiliate-commission"
          subtitle="Plan pricing in these answers matches our live pricing page for your region."
        />
      </main>
      <Footer />
    </>
  );
}
