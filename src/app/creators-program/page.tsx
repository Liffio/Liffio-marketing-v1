import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreatorsProgramContent from "@/components/CreatorsProgramContent";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { pageSeo } from "@/config/seo.config";
import { getCreatorsFaqCategories } from "@/config/faq.config";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/config/site.config";
import { getPricingContext } from "@/lib/pricing-region.server";
import {
  fetchMarketingPlansContext,
  buildCreatorsProgramFaqAnswer,
  buildFreePlanFaqAnswer,
  buildPlansOfferedFaqAnswer,
} from "@/lib/marketing-plans.server";

export async function generateMetadata(): Promise<Metadata> {
  const { region } = await getPricingContext();
  const { businessPlanValue: value } = await fetchMarketingPlansContext(region);
  // `value` is "$59/mo" in USD and "₹2,499/mo" in INR. The trade (keeping Liffio
  // branding on) is part of the sentence, not a footnote, and both variants
  // stay under 155: 141 chars USD, 144 INR.
  const description = `Get every Liffio Business feature (${value} value) free, in exchange for keeping Liffio branding on. For Instagram creators with 5K+ followers.`;
  return {
    ...pageSeo.creatorsProgram,
    description,
    openGraph: { ...pageSeo.creatorsProgram.openGraph, description },
    twitter: { ...pageSeo.creatorsProgram.twitter, description },
  };
}

export default async function CreatorsProgramPage() {
  const { region } = await getPricingContext();
  const { plans, businessPlanValue: businessValue } = await fetchMarketingPlansContext(region);
  const faqCategories = getCreatorsFaqCategories(region, {
    freePlanFaqAnswer: buildFreePlanFaqAnswer(region, plans),
    plansOfferedFaqAnswer: buildPlansOfferedFaqAnswer(region, plans),
    creatorsProgramFaqAnswer: buildCreatorsProgramFaqAnswer(businessValue),
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Creators Program", item: `${SITE_URL}/creators-program` },
        ]}
      />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <CreatorsProgramContent businessPlanValue={businessValue} />
        <SiteFaqSection categories={faqCategories} defaultOpenId="creators-program" />
      </main>
      <Footer />
    </>
  );
}
