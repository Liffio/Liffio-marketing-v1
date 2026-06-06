import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SeoDiscoverabilitySection from "@/components/seo/SeoDiscoverabilitySection";
import { rootSeo } from "@/config/seo.config";
import { FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { getFaqCategories } from "@/config/faq.config";
import { getPricingContext } from "@/lib/pricing-region.server";
import {
  fetchMarketingPlansContext,
  buildCreatorsProgramFaqAnswer,
  buildFreePlanFaqAnswer,
  buildPlansOfferedFaqAnswer,
} from "@/lib/marketing-plans.server";

export const metadata: Metadata = rootSeo;

export default async function Home() {
  const { region, countryCode } = await getPricingContext();
  const { plans, businessPlanValue } = await fetchMarketingPlansContext(region);
  const faqCategories = getFaqCategories(region, {
    freePlanFaqAnswer: buildFreePlanFaqAnswer(region, plans),
    plansOfferedFaqAnswer: buildPlansOfferedFaqAnswer(region, plans),
    creatorsProgramFaqAnswer: buildCreatorsProgramFaqAnswer(businessPlanValue),
  });

  return (
    <>
      <SoftwareApplicationJsonLd />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection plans={plans} region={region} countryCode={countryCode} />
        <SeoDiscoverabilitySection />
        <FAQSection categories={faqCategories} />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
