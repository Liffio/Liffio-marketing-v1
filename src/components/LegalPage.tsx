import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicyMarkdown from "@/components/legal/PolicyMarkdown";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import { getRegionFreeFaqCategories } from "@/config/faq.config";

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  /** Markdown. See PolicyMarkdown for the subset the policy pack uses. */
  content: string;
};

/*
  🚩 `isSectionHeading` is GONE. It guessed which lines were headings from their
  shape - numbered, or short and capitalised and unpunctuated - because the old
  content was one plain-text blob with no structure to read. The policy pack is
  Markdown, so headings are marked as headings and no longer have to be
  inferred. The heuristic also flattened every level to `h2`; the pack nests
  three deep, and `PolicyMarkdown` keeps that nesting.
*/

// Deliberately NOT async and does not read the pricing region: legal pages
// carry no region-specific pricing, so keeping them free of headers() lets
// all seven render statically (CDN-cacheable).
export default function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  const faqCategories = getRegionFreeFaqCategories();

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="hero-gradient py-14 sm:py-18">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1
              className="text-3xl font-extrabold text-[#0a0a0a] sm:text-4xl"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              {title}
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-wider text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="card-base p-6 sm:p-10">
              <PolicyMarkdown source={content} />
            </div>
          </div>
        </section>

        <SiteFaqSection categories={faqCategories} variant="plain" />
      </main>
      <Footer />
    </>
  );
}
