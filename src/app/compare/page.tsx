import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import { COMPARISONS, ALTERNATIVE_PAGES } from "@/config/comparisons.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare Liffio — Instagram DM Automation Tool Comparisons | Liffio",
  description:
    "See how Liffio compares to ManyChat, ReplyRush, LinkDM, SuperProfile, Zorcha, InstaChamp, and more. Feature and pricing comparisons for Instagram DM automation.",
  pathname: "/compare",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const brandGradient = "[background:linear-gradient(135deg,#f5184c,#b20d8f)]";

function CompareCard({ title, href, blurb }: { title: string; href: string; blurb: string }) {
  return (
    <a
      href={href}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#f5184c] hover:shadow-md"
    >
      <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
        {title}
      </div>
      <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">{blurb}</p>
      <span className="mt-4 text-sm font-semibold text-[#b20d8f] group-hover:underline">
        Read comparison →
      </span>
    </a>
  );
}

export default function ComparePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Compare", item: `${SITE_URL}/compare` },
        ]}
      />
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="hero-gradient py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <Breadcrumb
              className="justify-center mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Compare", href: "/compare" },
              ]}
            />
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              How Liffio compares
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Side-by-side comparisons with the most common Instagram DM automation tools — features,
              pricing model, account limits, and how to switch.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Liffio vs alternatives
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {COMPARISONS.map((c) => (
                <CompareCard
                  key={c.slug}
                  title={`Liffio vs ${c.competitor}`}
                  href={`/vs/${c.slug}`}
                  blurb={c.hubBlurb}
                />
              ))}
              {ALTERNATIVE_PAGES.map((a) => (
                <CompareCard
                  key={a.href}
                  title={`${a.name} alternative`}
                  href={a.href}
                  blurb={a.blurb}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl px-8 py-12 text-center ${brandGradient}`}>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                Try Liffio free
              </h2>
              <p className="mt-2 text-white/90">
                Free plan, no credit card. Unlimited automated DMs and unlimited Instagram accounts on every plan.
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
