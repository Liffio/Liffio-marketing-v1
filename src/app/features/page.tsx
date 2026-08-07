import Navbar from "@/components/Navbar";
import { FEATURE_WELCOME_DM } from "@/config/feature-flags";
import Footer from "@/components/Footer";
import FeaturesPageContent from "@/components/features/FeaturesPageContent";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { pageSeo } from "@/config/seo.config";
import { getFeaturesFaqCategories } from "@/config/faq.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Features", href: "/features" }]} />
        </div>
        <FeaturesPageContent />
        <section aria-label="How Instagram DM automation works" className="bg-white border-y border-gray-100 py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-4 text-gray-600 leading-relaxed text-base">
            <p>
              Instagram DM automation works by connecting a tool to the Instagram Messaging API through
              Meta&apos;s official OAuth flow. Once connected, the tool listens for trigger events —
              a keyword comment, a story reply, an inbound DM{FEATURE_WELCOME_DM ? ", a new follower" : ""} — and sends a pre-written
              direct message to the person who triggered the event.
            </p>
            <p>
              Liffio&apos;s trigger types include comment-to-DM, story reply, DM keyword
              reply, follow gating, follow-up sequences, {FEATURE_WELCOME_DM ? "lead data collection, and welcome messages" : "and lead data collection"}. Each
              automation runs independently on its own schedule. DMs are sent after a 10–60 second
              delay — configurable per automation — so each reply reaches the recipient at a
              natural conversational pace. All sends go through Instagram&apos;s official
              API endpoints; no browser automation or password access is involved.
            </p>
            <p>
              The tool operates 24/7 without requiring the account owner to be logged in. Automations
              can be paused, edited, or deleted at any time from the dashboard. Analytics track trigger
              count, DM delivered count, and link click-through per automation.
            </p>
          </div>
        </section>
        <SiteFaqSection categories={faqCategories} defaultOpenId="comment-to-dm-how" />
      </main>
      <Footer />
    </>
  );
}
