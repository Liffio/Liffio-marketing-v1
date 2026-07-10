import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  COMPARISONS,
  getComparison,
  getAllComparisonSlugs,
  liffioPricingRow,
} from "@/config/comparisons.config";
import type { FaqCategory } from "@/config/faq.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cmp = getComparison(slug);
  if (!cmp) return { title: "Comparison not found" };
  return buildPageMetadata({
    title: cmp.metaTitle,
    description: cmp.metaDescription,
    pathname: `/vs/${slug}`,
    ogImagePath: siteConfig.meta.ogImagePath,
    ogImageAlt: siteConfig.meta.ogImageAlt,
  });
}

const brandGradient = "[background:linear-gradient(135deg,#f5184c,#b20d8f)]";

export default async function VsPage({ params }: Props) {
  const { slug } = await params;
  const cmp = getComparison(slug);
  if (!cmp) notFound();

  const pageUrl = `${SITE_URL}/vs/${slug}`;
  const liffio = liffioPricingRow();
  const pricingRows = [liffio, cmp.pricing];
  const otherComparisons = COMPARISONS.filter((c) => c.slug !== slug).slice(0, 4);

  const faqCategories: FaqCategory[] = [
    {
      id: `vs-${slug}`,
      label: `Liffio vs ${cmp.competitor} FAQ`,
      items: cmp.faq.map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer })),
    },
  ];

  const migrationSteps = [
    {
      step: "1",
      title: `Document your active ${cmp.competitor} automations`,
      body: `Screenshot or note every active automation: trigger keyword, delay, DM text, and any public comment reply. This takes 15–30 minutes and makes recreation far faster than working from memory.`,
    },
    {
      step: "2",
      title: "Connect Instagram to Liffio",
      body: "Create a Liffio account and connect your Instagram through Meta's official OAuth flow — about two minutes. Connect every handle you manage now; all plans include unlimited accounts at no extra cost.",
    },
    {
      step: "3",
      title: "Recreate your automations",
      body: "Start with your highest-revenue flow — usually comment-to-DM on your most active Reel. Select the post, enter the keyword, write the DM, set the delay. Most automations take five to ten minutes each.",
    },
    {
      step: "4",
      title: "Run both tools in parallel for a week",
      body: `Keep ${cmp.competitor} running on a smaller post for five to seven days while you confirm Liffio delivers correctly. Watch for duplicate DMs if the same trigger fires in both tools at once.`,
    },
    {
      step: "5",
      title: `Cut over and revoke ${cmp.competitor} access`,
      body: `Once Liffio is reliable, disable your ${cmp.competitor} automations, then revoke its access token in Instagram Settings → Apps and Websites, and cancel the subscription.`,
    },
  ];

  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Compare", item: `${SITE_URL}/compare` },
          { name: `Liffio vs ${cmp.competitor}`, item: pageUrl },
        ]}
      />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <Breadcrumb
              className="justify-center mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Compare", href: "/compare" },
                { label: `vs ${cmp.competitor}`, href: `/vs/${slug}` },
              ]}
            />
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Liffio vs {cmp.competitor}
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">{cmp.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={siteConfig.urls.appSignup}
                className={`inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg ${brandGradient}`}
              >
                Get Started Free
              </a>
              <a
                href="#comparison"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
              >
                See full comparison ↓
              </a>
            </div>
          </div>
        </section>

        {/* Why switch */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Liffio vs {cmp.competitor}: where they differ
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {cmp.whyIntro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <ul className="mt-4 space-y-2 list-none">
                {cmp.whyPoints.map((pt) => (
                  <li key={pt.title} className="flex gap-3">
                    <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                    <span>
                      <strong className="text-gray-900">{pt.title}:</strong> {pt.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section id="comparison" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Liffio vs {cmp.competitor} — feature comparison
            </h2>
            <p className="text-gray-600 mb-8">
              Compare comment-to-DM, automation types, account limits, and pricing model side by side.
            </p>
            <ComparisonTable
              competitorName={cmp.competitor}
              rows={cmp.tableRows.map((r) => ({
                name: r.feature,
                liffio: r.liffio,
                competitor: r.competitor,
              }))}
            />
          </div>
        </section>

        {/* Pricing comparison */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Pricing: Liffio vs {cmp.competitor}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tool</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Free plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid from</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Per-contact fees</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Instagram-only</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((tool, i) => (
                    <tr key={tool.name} className={`border-b border-gray-100 ${i === 0 ? "bg-[#fff7f7]" : ""}`}>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {i === 0 ? <span className="text-[#f5184c]">{tool.name} ★</span> : tool.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {tool.free === true ? "✓ Yes" : tool.free === false ? "✗ No" : String(tool.free)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tool.paidFrom}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {tool.perContact ? "Yes — scales with contacts" : "No — flat pricing"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {tool.instagramOnly ? "Yes" : "No — multi-purpose"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed">{cmp.pricingNote}</p>
            <p className="mt-3 text-xs text-gray-400">
              Competitor pricing and features are summarized as of publication and may change — check{" "}
              {cmp.competitor}&apos;s site for current details.
            </p>
          </div>
        </section>

        {/* Safety */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Is Liffio safe for your Instagram account?
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Yes. Liffio connects through Meta&apos;s official OAuth flow — the same authorization method
                used by major social tools. You approve permissions on a standard Meta screen and Meta
                issues an access token directly to Liffio. Your Instagram password is never entered into
                Liffio.
              </p>
              <p>
                Liffio requests only the messaging permissions Meta requires for automation and adds a
                configurable 10–60 second delay between trigger and send, so DM volume distributes naturally
                and stays within Meta&apos;s permitted use guidelines — even during a viral Reel with thousands
                of comments.
              </p>
            </div>
          </div>
        </section>

        {/* Migration */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              How to switch from {cmp.competitor} to Liffio (about 2 hours)
            </h2>
            <div className="space-y-6">
              {migrationSteps.map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f5184c] text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Liffio vs {cmp.competitor}: frequently asked questions
            </h2>
            <div className="space-y-6">
              {cmp.faq.map((f) => (
                <div key={f.question}>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other comparisons + CTA */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Compare Liffio with other tools
            </h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {otherComparisons.map((c) => (
                <a
                  key={c.slug}
                  href={`/vs/${c.slug}`}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
                >
                  Liffio vs {c.competitor}
                </a>
              ))}
              <a
                href="/compare"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-[#b20d8f] hover:border-[#f5184c] transition-colors"
              >
                See all comparisons →
              </a>
            </div>

            <div className={`rounded-2xl px-8 py-12 text-center ${brandGradient}`}>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                Try Liffio free
              </h2>
              <p className="mt-2 text-white/90">
                Free plan, no credit card. Connect Instagram and set up your first automation in minutes.
              </p>
              <a
                href={siteConfig.urls.appSignup}
                className="mt-6 inline-flex rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#b20d8f] shadow-lg hover:bg-gray-50 transition-colors"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
