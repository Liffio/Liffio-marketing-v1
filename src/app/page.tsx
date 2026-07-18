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
import { TrackSection } from "@/lib/analytics/TrackSection";
import { LandingStepTracker } from "@/lib/analytics/LandingStepTracker";
import { getHomepageFaqCategories } from "@/config/faq.config";
import { getPricingContext } from "@/lib/pricing-region.server";
import { fetchMarketingPlansContext } from "@/lib/marketing-plans.server";

export const metadata: Metadata = rootSeo;

export default async function Home() {
  const { region, countryCode } = await getPricingContext();
  const { plans } = await fetchMarketingPlansContext(region);
  const faqCategories = getHomepageFaqCategories();

  return (
    <>
      <SoftwareApplicationJsonLd />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <LandingStepTracker />
      <main id="main-content" className="flex-1">
        <TrackSection name="hero">
          <HeroSection />
        </TrackSection>
        <StatsSection />
        <TrackSection name="features">
          <FeaturesSection />
        </TrackSection>
        <TrackSection name="how_it_works">
          <HowItWorksSection />
        </TrackSection>
        <TrackSection name="testimonials">
          <TestimonialsSection />
        </TrackSection>
        <TrackSection name="pricing">
          <PricingSection plans={plans} region={region} countryCode={countryCode} />
        </TrackSection>
        <SeoDiscoverabilitySection />
        <TrackSection name="faq">
          <FAQSection categories={faqCategories} />
        </TrackSection>
        <AboutSection />
        <section aria-label="About Liffio" className="py-10 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
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
                is built in India and works with Instagram accounts worldwide.{' '}
                <a href="/about" className="underline underline-offset-2 hover:text-foreground transition-colors">Learn more about Liffio.</a>
              </p>
              <p>
                New to DM automation? Start with our guides on{' '}
                <a href="/blog/how-to-turn-instagram-comments-into-dms" className="underline underline-offset-2 hover:text-foreground transition-colors">turning Instagram comments into DMs</a>,{' '}
                <a href="/blog/instagram-dm-scripts-that-convert" className="underline underline-offset-2 hover:text-foreground transition-colors">DM scripts that convert</a>,{' '}
                <a href="/blog/first-comment-keyword-trigger" className="underline underline-offset-2 hover:text-foreground transition-colors">setting up your first keyword trigger</a>, and{' '}
                <a href="/blog/instagram-automation-mistakes" className="underline underline-offset-2 hover:text-foreground transition-colors">common automation mistakes to avoid</a>.
                Automating stories too? See the{' '}
                <a href="/blog/instagram-story-automation-guide" className="underline underline-offset-2 hover:text-foreground transition-colors">story automation guide</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
