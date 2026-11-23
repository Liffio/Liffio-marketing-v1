import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SeoDiscoverabilitySection from "@/components/seo/SeoDiscoverabilitySection";
import { rootSeo } from "@/config/seo.config";
import { FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import OfficialApiSection from "@/components/OfficialApiSection";
import PartnerLogoWall from "@/components/PartnerLogoWall";
// Restore alongside the commented-out testimonials block below:
// import TestimonialsSection from "@/components/TestimonialsSection";
import CreatorUseCasesSection from "@/components/CreatorUseCasesSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { TrackSection } from "@/lib/analytics/TrackSection";
import { LandingStepTracker } from "@/lib/analytics/LandingStepTracker";
import { getHomepageFaqCategories } from "@/config/faq.config";
import { getPricingContext } from "@/lib/pricing-region.server";
import { fetchMarketingPlansContext } from "@/lib/marketing-plans.server";
import { FEATURE_WELCOME_DM } from "@/config/feature-flags";

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
        {/* Directly under the hero on purpose: this is a trust bar, and it does
            no work below the fold. It reinforces the hero's "Verified Meta Tech
            Provider" chip with the specifics (which API, which approvals). */}
        <OfficialApiSection />
        {/* Partner logos (SPEC 9.7). Renders nothing until an admin shows a partner on the site. */}
        <PartnerLogoWall />
        <TrackSection name="features">
          <FeaturesSection />
        </TrackSection>
        <TrackSection name="how_it_works">
          <HowItWorksSection />
        </TrackSection>
        <CreatorUseCasesSection />
        {/*
          COMMENTED OUT, not deleted - restore by uncommenting this block AND the
          TestimonialsSection import at the top of the file.

          These quotes are attributed to initials only, and git history shows the
          initials were produced by renaming real names in abf286e (2026-08-07):
          "Ryan Callahan" -> "R. C.", "Sophie Mercer" -> "S. M.", "Aisha Al-Farsi"
          -> "A. A.", "Lippi Patel" -> "L. P.", "Jake Thornton" -> "J. T.". Four
          others were deleted outright in the same pass. Initialising a name does
          not make the attribution verifiable - it only makes it unfalsifiable,
          which is the thing the compliance pass was meant to remove.

          Pull back ONLY the quotes from people who are not team members and who
          have agreed to be quoted. A first name plus a role a reader could check
          beats seven initials. Do not restore the full set wholesale.

        <TrackSection name="testimonials">
          <TestimonialsSection />
        </TrackSection>
        */}
        <TrackSection name="pricing">
          <PricingSection plans={plans} region={region} countryCode={countryCode} />
        </TrackSection>
        <SeoDiscoverabilitySection />
        <TrackSection name="faq">
          <FAQSection categories={faqCategories} />
        </TrackSection>
        <AboutSection />
        {/*
          This block carries the body-content links into the comparison cluster
          and the blog, so it is doing real work for internal linking. It used to
          render as an unlabelled wall of small grey prose directly under
          AboutSection, duplicating that section's own "About Liffio" label.

          Restyled 2026-11-23, patterned on how Mailchimp and GitBook present a
          links-only resources section: explanation on the left, grouped link
          columns on the right, arrow affordance and divider rules so each link
          reads as a destination rather than as running text.

          Every link target and every anchor label is unchanged from the prose
          version, deliberately: the anchors are what the internal-link work was
          for, and the Nov 13 SEO deploy is still being measured.
        */}
        <section
          aria-labelledby="more-on-dm-automation"
          className="bg-[#fff7f7] border-t border-[#ffe4e6] py-12 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#f5184c] mb-3">
                  More on Instagram DM automation
                </p>
                <h2
                  id="more-on-dm-automation"
                  className="text-2xl sm:text-3xl font-extrabold text-[#0a0a0a] mb-5"
                  style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                >
                  How it works, and where to read more
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-gray-600">
                  <p>
                    Liffio is an Instagram DM automation tool built for creators, coaches, and
                    agencies who want to respond to audience interactions without doing it
                    manually. When someone comments on a post, replies to a story, {FEATURE_WELCOME_DM ? "sends a DM containing a specific keyword, or follows an account" : "or sends a DM containing a specific keyword"}, Liffio
                    sends a pre-written direct message automatically within 10 to 60 seconds.
                  </p>
                  <p>
                    The tool connects through Instagram&apos;s official OAuth API, and no account
                    password is stored or shared. All automations run inside Meta&apos;s permitted
                    use guidelines. Pricing starts at $0 and scales to $549 per month for agencies
                    managing multiple accounts. Liffio is built in India and works with Instagram
                    accounts worldwide.
                  </p>
                  <p>
                    <a
                      href="/about"
                      className="inline-flex items-center gap-1 font-semibold text-[#f5184c] hover:gap-2 transition-all"
                    >
                      Learn more about Liffio
                      <span aria-hidden>&rarr;</span>
                    </a>
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid gap-6 sm:gap-10 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] mb-4">
                    Guides
                  </h3>
                  <ul className="space-y-0">
                    {[
                      { href: "/blog/how-to-turn-instagram-comments-into-dms", label: "turning Instagram comments into DMs" },
                      { href: "/blog/instagram-dm-scripts-that-convert", label: "DM scripts that convert" },
                      { href: "/blog/first-comment-keyword-trigger", label: "setting up your first keyword trigger" },
                      { href: "/blog/instagram-automation-mistakes", label: "common automation mistakes to avoid" },
                      { href: "/blog/instagram-story-automation-guide", label: "story automation guide" },
                    ].map((item) => (
                      <li key={item.href} className="border-b border-[#ffe4e6] last:border-0">
                        <a
                          href={item.href}
                          className="group flex items-center justify-between gap-3 py-2.5 sm:py-3 text-base text-gray-700 hover:text-[#f5184c] transition-colors"
                        >
                          <span>{item.label}</span>
                          <span aria-hidden className="text-[#f5184c] opacity-0 group-hover:opacity-100 transition-opacity">
                            &rarr;
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] mb-4">
                    Compare and decide
                  </h3>
                  <ul className="space-y-0">
                    {[
                      { href: "/compare", label: "Instagram DM automation tools comparison" },
                      { href: "/manychat-alternative", label: "ManyChat vs Liffio" },
                      { href: "/vs/linkdm", label: "Liffio vs LinkDM" },
                      { href: "/vs/zorcha", label: "Liffio vs Zorcha" },
                      { href: "/is-instagram-dm-automation-safe", label: "is Instagram DM automation safe" },
                      { href: "/instagram-automation-for-agencies", label: "Instagram automation for agencies" },
                      { href: "/instagram-comment-to-dm", label: "Instagram comment to DM guide" },
                    ].map((item) => (
                      <li key={item.href} className="border-b border-[#ffe4e6] last:border-0">
                        <a
                          href={item.href}
                          className="group flex items-center justify-between gap-3 py-2.5 sm:py-3 text-base text-gray-700 hover:text-[#f5184c] transition-colors"
                        >
                          <span>{item.label}</span>
                          <span aria-hidden className="text-[#f5184c] opacity-0 group-hover:opacity-100 transition-opacity">
                            &rarr;
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
