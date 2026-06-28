import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "About Liffio — Built in India, Made for Creators Worldwide",
  description:
    "Liffio is a small team from Vadodara, India building Instagram DM automation for creators, coaches, and agencies worldwide.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Liffio",
    description: "A small team from Vadodara, India building Instagram DM automation for creators worldwide.",
    url: `${SITE_URL}/about`,
    siteName: siteConfig.brand.name,
    images: [{ url: `${SITE_URL}${siteConfig.meta.ogImagePath}`, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Liffio",
    description: "A small team from Vadodara, India building Instagram DM automation for creators worldwide.",
    images: [`${SITE_URL}${siteConfig.meta.ogImagePath}`],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Liffio",
  url: SITE_URL,
  foundingDate: "2026",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "About", item: `${SITE_URL}/about` },
        ]}
      />
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <Breadcrumb
              className="justify-center mb-6"
              items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
            />
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              About Liffio
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Built in Vadodara, India. Made for creators worldwide.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 space-y-16">
          <section>
            <h2
              className="text-2xl font-extrabold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Why we built this
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Instagram creators were spending hours manually replying to the same comments and DMs every day.
                Someone posts a Reel, it gets 300 comments asking for the link, and they&apos;re stuck copy-pasting
                the same DM for two hours. That&apos;s not a sustainable way to run a business.
              </p>
              <p>
                We looked at the tools that existed — ManyChat, SendDM, LinkDM — and found that most were
                built for multi-channel marketing teams, not individual creators or small agencies managing a
                few Instagram accounts. The ones that were simple enough to use quickly got expensive as you
                scaled. None of them were Instagram-only and priced for it.
              </p>
              <p>
                We started building Liffio in early 2026 in Vadodara. The idea was straightforward: connect
                via Instagram&apos;s official OAuth API, build keyword triggers for comments, stories, and DMs,
                and price it flat — not per-contact. We launched in June 2026 and now have more than 2,000
                creators using it across 40+ countries.
              </p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl font-extrabold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              How Liffio works
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Liffio connects to Instagram through Meta&apos;s official OAuth flow — the same authorization
                method used by any official third-party app. You never share your password. Once connected,
                you set up keyword triggers: when someone comments a specific word on your post, replies to
                your story, or sends you a DM with a keyword, Liffio sends a pre-written reply automatically.
              </p>
              <p>
                Replies go out within 10 to 60 seconds — with a configurable human-like delay so it doesn&apos;t
                feel instant and robotic. The tool supports eight workflow types: comment-to-DM, story reply,
                live reply, DM reply, follow gating, re-engagement sequences, lead data collection, and
                welcome messages for new followers. It runs 24/7 without any action from you.
              </p>
              <p>
                Liffio is built specifically for Instagram. We don&apos;t support Facebook, WhatsApp, or email
                marketing — and that focus keeps the product simple and the pricing flat.
              </p>
            </div>
          </section>

          <section>
            <h2
              className="text-2xl font-extrabold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Where we are
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We&apos;re based in Vadodara, Gujarat, India. The team is small — we&apos;re building Liffio the way
                we wished existing tools were built: focused on one platform, easy to set up, priced honestly.
              </p>
              <p>
                2,000+ creators across 40+ countries have used Liffio since we launched. Most are creators
                with 5K–500K followers using comment-to-DM for lead magnets, digital products, and giveaways.
                A growing share are small agencies managing 3–10 Instagram accounts for clients.
              </p>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-12 text-center">
            <h2
              className="text-xl font-extrabold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Try Liffio free
            </h2>
            <p className="text-gray-600 mb-6">
              Free plan available. No credit card required. Setup takes under 5 minutes.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
            >
              Get Started Free
            </a>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
