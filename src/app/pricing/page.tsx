import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingPlansGrid, { PricingBottomCta } from "@/components/PricingPlansGrid";
import { featureCategories, pricingFaqs } from "@/config/pricing.config";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Pricing — Liffio",
  description:
    "Simple, transparent pricing for Instagram DM automation. Starter (free), Pro, Business, and Agency plans. No hidden fees — scale as you grow.",
};

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-semibold text-gray-700">{value}</span>;
  }
  return value ? (
    <svg className="h-5 w-5 text-[#4259f0] mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ) : (
    <svg className="h-5 w-5 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <span className="text-sm font-semibold text-[#4259f0] uppercase tracking-wider">Pricing</span>
            <h1
              className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Plans That Grow With You
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              From free comment-to-DM automation to full agency white-label. Every plan runs on official Meta APIs
              with real-time webhook delivery.
            </p>
            <p className="mt-3 text-sm text-gray-500">
              Pre-launch offer:{" "}
              <Link href={siteConfig.urls.preregister} className="text-[#7c5af3] font-semibold hover:underline">
                Pre-register for 50% off your first purchase →
              </Link>
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingPlansGrid />
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
                Liffio is a complete Instagram growth toolkit — comment-to-DM engine, post scheduler, bio links,
                short links, lead capture, analytics, and team collaboration in one workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: "💬",
                  title: "Comment-to-DM Engine",
                  desc: "Keyword triggers send DMs in under 2 seconds. Public auto-replies, follow-ups, and multi-step flows included on paid plans.",
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

            <div className="space-y-12">
              {featureCategories.map((category) => (
                <div key={category.name}>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#0a0a0a]">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                    <table className="w-full min-w-[640px] text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-[40%]">
                            Feature
                          </th>
                          {["Starter", "Pro", "Business", "Agency"].map((plan) => (
                            <th
                              key={plan}
                              className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-center"
                            >
                              {plan}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {category.features.map((row, i) => (
                          <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                            <td className="px-5 py-3.5 text-sm text-gray-700">{row.name}</td>
                            <td className="px-4 py-3.5 text-center">
                              <CellValue value={row.starter} />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <CellValue value={row.pro} />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <CellValue value={row.business} />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <CellValue value={row.agency} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2
              className="text-3xl font-extrabold text-gray-900 text-center mb-12"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {pricingFaqs.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
            Ready to Grow Your Instagram?
          </h2>
          <p className="text-gray-600 mb-8">
            Create your free account at app.liffio.com — setup takes under 2 minutes.
          </p>
          <PricingBottomCta />
        </section>
      </main>
      <Footer />
    </>
  );
}
