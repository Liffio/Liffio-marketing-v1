import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import type { FaqCategory } from "@/config/faq.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Best ManyChat Alternative - Liffio Instagram DM Automation",
  description:
    "Looking for a ManyChat alternative with unlimited auto DMs, no per-message fees, and a free plan? Liffio offers the same comment-to-DM automation for less.",
  pathname: "/manychat-alternative",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "manychat-alt",
    label: "ManyChat alternative FAQ",
    items: [
      {
        id: "why-switch",
        question: "Why do creators switch from ManyChat to Liffio?",
        answer:
          "Unlimited automated DMs on every plan, simpler Instagram-only pricing, a usable free tier, and built-in post scheduling and bio links - without per-contact fees.",
      },
      {
        id: "feature-parity",
        question: "Does Liffio have the same features as ManyChat?",
        answer:
          "Yes for core Instagram workflows: comment-to-DM, story replies, keyword triggers, multi-step flows, and live comment automation. Liffio adds unlimited DMs and INR billing via Razorpay.",
      },
      {
        id: "migrate",
        question: "How do I migrate from ManyChat?",
        answer:
          "Reconnect Instagram in Liffio, recreate your keyword triggers and DM copy, and run both tools in parallel for one week on active campaigns.",
      },
      {
        id: "pricing",
        question: "Is Liffio cheaper than ManyChat?",
        answer:
          "For high-volume Instagram DM automation, Liffio is typically lower cost because automated DMs are unlimited and the free plan is not contact-capped.",
      },
    ],
  },
];

export default function ManyChatAlternativePage() {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "ManyChat Alternative", item: `${SITE_URL}/manychat-alternative` },
        ]}
      />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              The Best ManyChat Alternative for Instagram DM Automation
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              ManyChat popularised comment-to-DM - but growing creators need unlimited messages, simpler pricing, and
              tools built only for Instagram. Liffio delivers all three.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="mt-8 inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
            >
              Get Started Free
            </a>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Liffio vs ManyChat - side-by-side comparison</h2>
            <p className="text-gray-600 mb-8">
              Compare comment-to-DM, pricing model, and platform extras.{" "}
              <a href="/blog/manychat-alternatives" className="text-[#4259f0] font-semibold hover:underline">
                Read the full alternatives guide →
              </a>
            </p>
            <ComparisonTable competitorName="ManyChat" />
          </div>
        </section>

        <section className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why creators are switching</h2>
            <ul className="space-y-4 text-gray-600">
              <li>
                <strong className="text-gray-900">Unlimited automated DMs</strong> on Free, Starter, Business, and Agency
                - no per-contact billing surprises.
              </li>
              <li>
                <strong className="text-gray-900">Instagram-first workspace</strong> with post scheduler, bio links, and
                short links included.
              </li>
              <li>
                <strong className="text-gray-900">INR pricing for India</strong> via Razorpay; global USD billing via
                Stripe.
              </li>
            </ul>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <dl className="space-y-6">
              {faqCategories[0].items.map((item) => (
                <div key={item.id}>
                  <dt className="font-semibold text-gray-900">{item.question}</dt>
                  <dd className="mt-2 text-gray-600 text-sm leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
