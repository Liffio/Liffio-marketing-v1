import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreatorsProgramContent from "@/components/CreatorsProgramContent";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { pageSeo } from "@/config/seo.config";
import { getCreatorsFaqCategories } from "@/config/faq.config";
import { FaqPageJsonLd } from "@/lib/seo/json-ld";
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
  const description = `Apply to the Liffio Creators Program and get our full Business plan (${value} value) at no cost - Instagram auto DM tool access for creators with 5K+ followers.`;
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
