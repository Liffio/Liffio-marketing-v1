import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { FEATURE_SALE_TRACKING } from "@/config/feature-flags";
import Footer from "@/components/Footer";
import { PricingBottomCta } from "@/components/PricingPlansGrid";
import EditorialPlansGrid from "@/components/pricing/EditorialPlansGrid";
import PricingLadder from "@/components/pricing/PricingLadder";
import PricingComparisonSection from "@/components/pricing/PricingComparisonSection";
import PositioningStrip from "@/components/pricing/PositioningStrip";
import AgencyBreakEven from "@/components/pricing/AgencyBreakEven";
import SectionHead from "@/components/pricing/SectionHead";
import { BillingIntervalProvider } from "@/components/pricing/BillingInterval";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { getPricingDetailedFaqCategories } from "@/config/faq.config";
import { getPricingContext } from "@/lib/pricing-region.server";
import {
  fetchMarketingPlansContext,
  buildCreatorsProgramFaqAnswer,
  buildFreePlanFaqAnswer,
  buildPlansOfferedFaqAnswer,
} from "@/lib/marketing-plans.server";
import { metaCopy } from "@/config/meta-copy";
import { pageSeo } from "@/config/seo.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TechBadge } from "@/components/TechBadge";
import { SITE_URL } from "@/config/site.config";

export const metadata = pageSeo.pricing;

/**
 * The V4 pricing page: one continuous paper document rather than a stack of
 * alternating colour bands. Every section is the same width, on the same
 * ground, headed the same way - which is what lets the ladder, the break-even
 * calculator and the matrix read as one argument instead of three widgets.
 */
function Section({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="pt-16 sm:pt-[76px]">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6">{children}</div>
    </section>
  );
}

const PLATFORM_PILLARS = [
  {
    title: "Comment-to-DM engine",
    desc: "Keyword triggers send rapid automated DMs with a custom 10-60s delay from comment. Public auto-replies, follow-ups, and multi-step flows included on paid plans.",
  },
  {
    title: "Post scheduler",
    desc: "Schedule Instagram feed posts from a calendar UI with caption templates and publish tracking.",
  },
  {
    title: "Bio link & short links",
    desc: "Public pages at bio.liffio.com and branded redirects at go.liffio.com with click and referrer analytics.",
  },
  {
    title: "Lead capture & analytics",
    desc: FEATURE_SALE_TRACKING
      ? "Track comment to DM to click to sale. Capture leads from automations and link clicks, workspace-scoped."
      : "Track comment to DM to click. Capture leads from automations and link clicks, workspace-scoped.",
  },
];

export default async function PricingPage() {
  const { region, countryCode } = await getPricingContext();
  const { plans, businessPlanValue } = await fetchMarketingPlansContext(region);
  const faqCategories = getPricingDetailedFaqCategories(region, {
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
      <BillingIntervalProvider>
        <main id="main-content" className="flex-1 bg-[#FBF9F5]">
          {/* Hero */}
          {/*
            Centred, not V4's left-aligned hero. A centred kicker over a
            left-aligned headline reads as a layout bug rather than a choice,
            and the rest of the site's hero blocks (Creators, Affiliate,
            Features) are centred too.
          */}
          <div className="mx-auto max-w-[1300px] px-4 pb-2 pt-10 text-center sm:px-6 sm:pt-16">
            <Breadcrumb
              className="mb-6 justify-center"
              items={[
                { label: "Home", href: "/" },
                { label: "Pricing", href: "/pricing" },
              ]}
            />
            {/*
              Derived, not written: an eyebrow reading "Five steps" while the
              catalogue serves four tiers is the same defect as a hardcoded
              "Four tiers" in the FAQ, which is already computed from the payload.
            */}
            <div className="mb-5 flex justify-center">
              <TechBadge label="pricing" variant="section" accent="#F5184C" />
            </div>
            <h1
              className="mx-auto max-w-[18ch] text-[clamp(2.25rem,5.6vw,3.6rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#17131A]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Pay for the Instagram account you&rsquo;re{" "}
              <em className="gradient-text not-italic">actually</em> running.
            </h1>
            {/*
              The keyword heading stays on the page. The display headline above
              is the V4 hero; this is the phrase the page is indexed on, and
              dropping it in a restyle would be a silent SEO regression.
            */}
            <h2 className="mt-4 text-[17px] font-semibold text-[#4A4350]">
              Instagram DM automation pricing - plans that grow with you.
            </h2>
            <p className="mx-auto mt-3 max-w-[60ch] text-[17px] leading-relaxed text-[#4A4350]">
              Each plan runs a single Instagram account. You move up when the work changes - when
              you start measuring, when someone else joins the account, when running each brand
              separately costs more than running them together. {metaCopy.pricingHeroApis}
            </p>

            <div className="mt-7 inline-flex flex-wrap overflow-hidden rounded-[13px] border border-[#EAE4DC] bg-white text-left">
              {["1 workspace", "=", "1 Instagram account", "=", "1 subscription"].map((part, index) => (
                <span
                  key={part + index}
                  className="border-r border-[#F1ECE5] px-3.5 py-2.5 text-[12px] text-[#4A4350] last:border-r-0 max-[600px]:w-full max-[600px]:border-b max-[600px]:border-r-0 max-[600px]:last:border-b-0"
                  style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                >
                  {part}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] text-[#8B8391]">
              Free plan included - no credit card required.
            </p>
          </div>

          {/* Plans */}
          <div className="mx-auto max-w-[1300px] px-4 pt-6 sm:px-6">
            <EditorialPlansGrid plans={plans} region={region} countryCode={countryCode} />
          </div>

          <Section>
            <PricingLadder plans={plans} />
          </Section>

          <Section>
            <SectionHead eyebrow="Full platform" title="More than DM automation.">
              Liffio is a complete Instagram growth toolkit - comment-to-DM engine, post scheduler,
              bio links, short links, lead capture, analytics, and team collaboration in one
              workspace.
            </SectionHead>
            <div className="grid grid-cols-1 gap-[11px] sm:grid-cols-2 xl:grid-cols-4">
              {PLATFORM_PILLARS.map((item) => (
                <div key={item.title} className="rounded-[14px] border border-[#EAE4DC] bg-white p-5">
                  <h3
                    className="mb-2 text-[15px] font-bold tracking-[-0.01em] text-[#17131A]"
                    style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] leading-relaxed text-[#4A4350]">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="agency-break-even">
            <AgencyBreakEven plans={plans} />
          </Section>

          <Section>
            <SectionHead eyebrow="Every capability, every plan" title="What is actually in each plan.">
              Limits are per workspace and never pooled. Agency mirrors Business exactly - twenty
              times over.
            </SectionHead>
            <PricingComparisonSection />
          </Section>

          <Section>
            <PositioningStrip plans={plans} />
          </Section>

          <Section>
            <SiteFaqSection
              categories={faqCategories}
              variant="paper"
              eyebrow="Questions"
              subtitle="Pricing and plan details match what you see above - updated for your region."
              defaultOpenId="starter-free"
            />
          </Section>

          {/* Bottom CTA */}
          <section className="pb-20 pt-16 sm:pt-[76px]">
            <div className="mx-auto max-w-[1300px] px-4 text-center sm:px-6">
              <h2
                className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.03em] text-[#17131A]"
                style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
              >
                Ready to grow your Instagram?
              </h2>
              <p className="mx-auto mt-3 max-w-[52ch] text-[15px] text-[#4A4350]">
                Create your free account at app.liffio.com - setup takes under 2 minutes.
              </p>
              <div className="mt-8">
                <PricingBottomCta />
              </div>
            </div>
          </section>
        </main>
      </BillingIntervalProvider>
      <Footer />
    </>
  );
}
