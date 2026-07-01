import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SiteFaqSection } from "@/components/faq/SiteFaqSection";
import HelpContactForm from "@/components/HelpContactForm";
import { getWhatsAppUrl, siteConfig } from "@/config/site.config";
import { pageSeo } from "@/config/seo.config";
import { getHelpFaqCategories } from "@/config/faq.config";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/config/site.config";
import { getPricingContext } from "@/lib/pricing-region.server";

export const metadata = pageSeo.help;

export default async function HelpPage() {
  const { region } = await getPricingContext();
  const faqCategories = getHelpFaqCategories(region);
  const whatsappUrl = getWhatsAppUrl();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Help", item: `${SITE_URL}/help` },
        ]}
      />
      <FaqPageJsonLd categories={faqCategories} />
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              How can we help you?
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Find answers to common questions or reach out to our support team.
            </p>
            {/* Contact cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: "✉️",
                  label: "Email Us",
                  value: siteConfig.contact.email,
                  href: `mailto:${siteConfig.contact.email}`,
                },
                ...(whatsappUrl
                  ? [{ icon: "💬", label: "WhatsApp", value: "Chat with us", href: whatsappUrl }]
                  : []),
                { icon: "⏱️", label: "Response Time", value: "Under 24 hours", href: null },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-[#b20d8f] hover:underline mt-1 block">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-gray-700 mt-1">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <SiteFaqSection
          categories={faqCategories}
          variant="plain"
          subtitle="Answers reflect pricing for your region, including Free, Starter, Business, and Agency."
        />

        {/* Contact form */}
        <section id="contact" className="py-20 bg-gray-50 scroll-mt-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <HelpContactForm />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
            Ready to get started?
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href={siteConfig.urls.appSignup} id="help-cta" className="rounded-xl px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]">
              Get Started Free
            </a>
            <a href="/pricing" className="rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              View Pricing
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
