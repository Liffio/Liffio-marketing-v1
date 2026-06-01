import Link from "next/link";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { TechBadge } from "@/components/TechBadge";
import { homeFaqCategories } from "@/config/faq.config";
import { siteConfig } from "@/config/site.config";

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-brand-100/60 bg-gradient-to-b from-[#faf9ff] to-white section-py"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(124,90,243,0.1) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <TechBadge label="FAQ" variant="section" className="mb-4" />
            <h2
              className="text-2xl font-extrabold leading-tight text-[#0a0a0a] sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Questions?{" "}
              <span className="gradient-text">We&apos;ve got answers.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Everything you need to know about automating Instagram DMs with Liffio — from setup to billing.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
              <a href={siteConfig.urls.appSignup} className="btn-primary inline-flex justify-center text-center">
                Get Started Free
              </a>
              <Link
                href="/help"
                className="inline-flex justify-center rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50/50"
              >
                Visit help center
              </Link>
            </div>
          </div>

          <FAQAccordion categories={homeFaqCategories} defaultOpenId="connect-instagram" />
        </div>
      </div>
    </section>
  );
}
