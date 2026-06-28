import AppLink from "@/components/AppLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingPlansGrid, { PricingBottomCta } from "@/components/PricingPlansGrid";
import PricingComparisonSection from "@/components/pricing/PricingComparisonSection";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { getFaqCategories } from "@/config/faq.config";
import { getPricingContext } from "@/lib/pricing-region.server";
import {
  fetchMarketingPlansContext,
  buildCreatorsProgramFaqAnswer,
  buildFreePlanFaqAnswer,
  buildPlansOfferedFaqAnswer,
} from "@/lib/marketing-plans.server";
import { siteConfig } from "@/config/site.config";
import { metaCopy } from "@/config/meta-copy";
import { pageSeo } from "@/config/seo.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE_URL } from "@/config/site.config";

export const metadata = pageSeo.pricing;

export default async function PricingPage() {
  const { region, countryCode } = await getPricingContext();
  const { plans, businessPlanValue } = await fetchMarketingPlansContext(region);
  const faqCategories = getFaqCategories(region, {
    freePlanFaqAnswer: buildFreePlanFaqAnswer(region, plans),
    plansOfferedFaqAnswer: buildPlansOfferedFaqAnswer(region, plans),
    creatorsProgramFaqAnswer: buildCreatorsProgramFaqAnswer(businessPlanValue),
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Pricing", item: `${SITE_URL}/pricing` },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <Breadcrumb
              className="justify-center mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Pricing", href: "/pricing" },
              ]}
            />
            <span className="text-sm font-semibold text-[#4259f0] uppercase tracking-wider">Pricing</span>
            <h1
              className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Instagram DM Automation Pricing
            </h1>
            <h2
              className="mt-2 text-xl sm:text-2xl font-semibold text-gray-500"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Plans That Grow With You
            </h2>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              From free comment-to-DM automation to full agency white-label. {metaCopy.pricingHeroApis}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Pre-launch offer:{" "}
              <AppLink href={siteConfig.urls.preregister} className="text-[#7c5af3] font-semibold hover:underline">
                Pre-register for 50% off your first purchase →
              </AppLink>
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingPlansGrid plans={plans} region={region} countryCode={countryCode} />
          </div>
        </section>

        {/* Platform overview */}
        <section className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7c5af3] mb-2">Full platform</p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a]"
                style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
              >
                More than DM automation
              </h2>
              <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                Liffio is a complete Instagram growth toolkit - comment-to-DM engine, post scheduler, bio links,
                short links, lead capture, analytics, and team collaboration in one workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: "💬",
                  title: "Comment-to-DM Engine",
                  desc: "Keyword triggers send rapid automated DMs with a custom 10–60s delay from comment. Public auto-replies, follow-ups, and multi-step flows included on paid plans.",
                },
                {
                  icon: "📅",
                  title: "Post Scheduler",
                  desc: "Schedule Instagram feed posts from a calendar UI with caption templates and publish tracking.",
                },
                {
                  icon: "🔗",
                  title: "Bio Link & Short Links",
                  desc: "Public pages at bio.liffio.com and branded redirects at go.liffio.com with click and referrer analytics.",
                },
                {
                  icon: "📊",
                  title: "Lead Capture & Analytics",
                  desc: "Track comment → DM → click → sale. Capture leads from automations and link clicks, workspace-scoped.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-6"
                  style={{ border: "1px solid rgba(124,90,243,0.1)", boxShadow: "0 2px 12px rgba(124,90,243,0.05)" }}
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-base font-bold text-[#0a0a0a] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature comparison */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
              >
                Compare plans in detail
              </h2>
              <p className="mt-3 text-gray-500">See exactly what&apos;s included at every tier.</p>
            </div>

            <PricingComparisonSection />
          </div>
        </section>

        <SiteFaqSection
          categories={faqCategories}
          subtitle="Pricing and plan details match what you see above - updated for your region."
          defaultOpenId="starter-free"
        />

        {/* Bottom CTA */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
            Ready to Grow Your Instagram?
          </h2>
          <p className="text-gray-600 mb-8">
            Create your free account at app.liffio.com - setup takes under 2 minutes.
          </p>
          <PricingBottomCta />
        </section>
      </main>
      <Footer />
    </>
  );
}
