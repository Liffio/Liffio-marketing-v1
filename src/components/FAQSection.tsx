import AppLink from "@/components/AppLink";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { TechBadge } from "@/components/TechBadge";
import { homeFaqCategories } from "@/config/faq.config";
import { siteConfig } from "@/config/site.config";

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="section-py relative overflow-hidden border-t border-brand-100/60 bg-gradient-to-b from-[#faf9ff] to-white"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(124,90,243,0.1) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="card-base overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,300px)_1fr]">
            <div className="border-b border-brand-100/80 bg-gradient-to-br from-brand-50/40 to-white p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <TechBadge label="FAQ" variant="section" className="mb-4" />
              <h2
                className="text-2xl font-extrabold leading-tight text-[#0a0a0a] sm:text-3xl"
                style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
              >
                Questions?{" "}
                <span className="gradient-text">We&apos;ve got answers.</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Everything you need to know about automating Instagram DMs with Liffio — from setup to billing.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <a href={siteConfig.urls.appSignup} className="btn-primary inline-flex justify-center text-center">
                  Get Started Free
                </a>
                <AppLink
                  href="/help"
                  className="inline-flex justify-center rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
                >
                  Visit help center
                </AppLink>
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:p-8">
              <FAQAccordion categories={homeFaqCategories} defaultOpenId="connect-instagram" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
