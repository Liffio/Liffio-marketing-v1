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
        <section aria-label="About Liffio" className="bg-[#faf8ff] border-y border-[#ede9fd] py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-[#ede9fd] bg-white px-6 py-7 sm:px-8 sm:py-8 shadow-sm space-y-4 text-gray-600 leading-relaxed text-base">
              <p>
                Liffio is an Instagram DM automation tool built for creators, coaches, and agencies
                who want to respond to audience interactions without doing it manually. When someone
                comments on a post, replies to a story, sends a DM containing a specific keyword,
                or follows an account, Liffio sends a pre-written direct message automatically within
                10 to 60 seconds.
              </p>
              <p>
                The tool connects through Instagram&apos;s official OAuth API — no account password is
                stored or shared. All automations run inside Meta&apos;s permitted use guidelines. Liffio
                supports eight workflow types: comment-to-DM, story reply, live reply, DM reply,
                follow gating, re-engagement, data collection, and welcome messages. Pricing starts
                at $0 and scales to $299 per month for agencies managing multiple accounts. Liffio
                is built in Vadodara, India, and used by more than 2,000 creators across 40+ countries.
              </p>
            </div>
          </div>
        </section>
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
