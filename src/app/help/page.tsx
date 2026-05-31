import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Help Center — Liffio",
  description: "Find answers to common questions about Liffio and get support from our team.",
};

const faqs = [
  {
    question: "How do I connect my Instagram account?",
    answer:
      "Go to your Liffio dashboard and click 'Connect Instagram'. You'll be redirected to the official Meta login page. Authorize the app and your account will be connected in seconds.",
  },
  {
    question: "Is Liffio safe to use?",
    answer:
      "Yes! Liffio is a verified Meta Business Partner and uses only official Instagram APIs. Your account is fully compliant with Instagram's terms of service.",
  },
  {
    question: "What are keyword triggers?",
    answer:
      "Keyword triggers are words or phrases that, when commented by a user, automatically send them a DM. For example, if someone comments 'LINK' on your post, they'll instantly receive your link in their DMs.",
  },
  {
    question: "How quickly are automated DMs sent?",
    answer:
      "DMs are sent instantly — typically within 1-2 seconds of the trigger event (comment, story reply, etc.). This real-time response is key to maximizing engagement.",
  },
  {
    question: "Can I use Liffio with multiple Instagram accounts?",
    answer:
      "Yes! On the Pro plan you can manage up to 5 Instagram accounts. On the Custom plan there's no limit.",
  },
  {
    question: "What happens when I reach my DM limit?",
    answer:
      "When you reach your monthly DM limit, automation will pause until your next billing cycle. You'll receive an email notification when you reach 80% and 100% of your limit.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel anytime from your account settings. There are no cancellation fees and your account remains active until the end of your billing period.",
  },
];

export default function HelpPage() {
  return (
    <>
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
                { icon: "✉️", label: "Email Us", value: "support@liffio.com", href: "mailto:support@liffio.com" },
                { icon: "💬", label: "WhatsApp", value: "Chat with us", href: "https://wa.me/1234567890" },
                { icon: "⏱️", label: "Response Time", value: "Under 24 hours", href: null },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-[#4259f0] hover:underline mt-1 block">
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

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2
              className="text-3xl font-extrabold text-gray-900 text-center mb-12"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
              >
                Still need help?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Send us a message and we&apos;ll get back to you within 24 hours.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="help-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      id="help-name"
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="help-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="help-email"
                      type="email"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="help-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    id="help-subject"
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent"
                    placeholder="What do you need help with?"
                  />
                </div>
                <div>
                  <label htmlFor="help-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="help-message"
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent resize-none"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <button
                  type="submit"
                  id="help-submit"
                  className="w-full rounded-xl px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-md [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
            Ready to get started?
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href={siteConfig.urls.appSignup} id="help-cta" className="rounded-xl px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]">
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
