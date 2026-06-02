import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { getPricingPlans } from "@/config/pricing.config";
import { getPricingContext } from "@/lib/pricing-region.server";

export default async function Home() {
  const { region, countryCode } = await getPricingContext();
  const plans = getPricingPlans(region);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection plans={plans} region={region} countryCode={countryCode} />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
