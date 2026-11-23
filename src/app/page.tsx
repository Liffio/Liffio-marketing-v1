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

          Restyled 2026-11-23: the copy flows in two text columns, and the blog
          links sit under it as a full-width row. An earlier pass that day put
          the copy left and the links right, which looked broken for a reason
          worth remembering: a side-by-side only works when both sides are
          roughly as tall, and five links are about 200px against 700px of
          prose. Short content goes under long content, not beside it.

          🔴 THE COMPARISON LINKS BELONG IN THE PROSE, NOT IN A LIST. The restyle
          first put them in a second column headed "Compare and decide". Six of
          those seven targets are also in the footer's COMPARE and PRODUCT
          columns, which render a few hundred pixels further down the same
          screen, so the page ended with two stacked lists of the same links. As
          running text nobody noticed; as a list it read as a footer rehearsal.

          They are back inline, which is also where they are worth more: a link
          inside a sentence carries context a repeated footer link does not. The
          targets did not change, only their wrapper, so nothing the Nov 13 SEO
          deploy is still being measured on moved.

          What stays on the right is the blog, which the footer links only as
          /blog. Those five deep links exist nowhere else on the page.
        */}
        <section
          aria-labelledby="more-on-dm-automation"
          className="bg-[#fff7f7] border-t border-[#ffe4e6] py-12 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f5184c] mb-3">
              More on Instagram DM automation
            </p>
            <h2
              id="more-on-dm-automation"
              className="max-w-2xl text-2xl sm:text-3xl font-extrabold text-[#0a0a0a] mb-6"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              How it works, and where to read more
            </h2>

            {/*
              🚩 CSS multi-column, not a grid. A grid would make each <p> a cell
              and leave ragged rows; `columns-2` flows the text itself and the
              browser balances the two columns by line, so they finish level
              whatever the copy length.

              🚩 No `break-inside-avoid`. It was tried first and it defeats the
              balancing: with three paragraphs it forces 1 and 2+3, which left
              the first column about 100px short at tablet width. Letting a
              paragraph run across the gutter is ordinary multi-column text and
              is what keeps the two sides level.
            */}
            <div className="space-y-4 text-base leading-relaxed text-gray-600 sm:columns-2 sm:gap-10 lg:gap-16">
              <p className="!mt-0">
                Liffio is an Instagram DM automation tool built for creators, coaches, and
                agencies who want to respond to audience interactions without doing it
                manually. When someone{" "}
                <a href="/instagram-comment-to-dm" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">
                  comments on a post
                </a>
                , replies to a story, {FEATURE_WELCOME_DM ? "sends a DM containing a specific keyword, or follows an account" : "or sends a DM containing a specific keyword"}, Liffio
                sends a pre-written direct message automatically within 10 to 60 seconds.
              </p>
              <p>
                The tool connects through Instagram&apos;s official OAuth API, and no account
                password is stored or shared. All automations run inside{" "}
                <a href="/is-instagram-dm-automation-safe" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">
                  Meta&apos;s permitted use guidelines
                </a>
                . Pricing starts at $0 and scales to $549 per month for{" "}
                <a href="/instagram-automation-for-agencies" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">
                  agencies managing multiple accounts
                </a>
                . Liffio is built in India and works with Instagram accounts worldwide.
              </p>
              <p>
                Weighing it against something else? There are dated side-by-side comparisons
                with{" "}
                <a href="/manychat-alternative" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">ManyChat</a>,{" "}
                <a href="/vs/linkdm" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">LinkDM</a> and{" "}
                <a href="/vs/zorcha" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">Zorcha</a>, and a{" "}
                <a href="/compare" className="font-semibold text-[#f5184c] underline decoration-[#ffc2cf] underline-offset-4 transition-colors hover:text-[#b20d8f] hover:decoration-[#f5184c]">roundup of every tool we have looked at</a>.{" "}
                <a
                  href="/about"
                  className="inline-flex items-center gap-1 font-semibold text-[#f5184c] hover:gap-2 transition-all"
                >
                  Learn more about Liffio
                  <span aria-hidden>&rarr;</span>
                </a>
              </p>
            </div>

            {/*
              The blog links sit UNDER the copy, full width, rather than beside
              it. They were a second column on 2026-11-23 and it read as broken:
              five links are about 200px tall against 700px of prose, so two
              thirds of the right half of the section was empty pink. Content
              that short does not get a column of its own.
            */}
            <div className="mt-10 border-t border-[#ffe4e6] pt-8 sm:mt-12 sm:pt-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a] mb-2 sm:mb-4">
                Guides
              </h3>
              <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { href: "/blog/how-to-turn-instagram-comments-into-dms", label: "turning Instagram comments into DMs" },
                  { href: "/blog/instagram-dm-scripts-that-convert", label: "DM scripts that convert" },
                  { href: "/blog/first-comment-keyword-trigger", label: "setting up your first keyword trigger" },
                  { href: "/blog/instagram-automation-mistakes", label: "common automation mistakes to avoid" },
                  { href: "/blog/instagram-story-automation-guide", label: "story automation guide" },
                ].map((item) => (
                  /*
                    Five items, so the bottom row is short and which cells sit
                    in it changes with the breakpoint: item 5 alone when stacked
                    or at sm (2 up), items 4 and 5 at lg (3 up). `last:` clears
                    the stacked and sm cases; the lg-scoped nth-last-child(2)
                    clears item 4 as well, but ONLY at lg, where it is genuinely
                    on the bottom row. Without it that row showed one rule and
                    one gap.
                  */
                  <li
                    key={item.href}
                    className="border-b border-[#ffe4e6] last:border-0 lg:[&:nth-last-child(2)]:border-0"
                  >
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
        </section>
      </main>
      <Footer />
    </>
  );
}
