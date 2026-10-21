import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TechBadge } from "@/components/TechBadge";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { metaCopy } from "@/config/meta-copy";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import type { FaqCategory } from "@/config/faq.config";

/**
 * The differentiator page. "Unlimited DMs on every plan, Free included" is the
 * one row in ComparisonTable where Liffio is ✓ and the default competitor is ✗,
 * and it is the answer to the query people actually type when a per-contact
 * bill has surprised them.
 *
 * 🔴 THIS PAGE EXISTS TO SURVIVE A SCEPTIC, so it states the limits that DO
 * exist in the same breath as the one that does not. "Unlimited" on a pricing
 * page is a word buyers have been burned by; a page that says "unlimited" eight
 * times and never names a cap reads as marketing and gets discounted. Naming
 * the real caps is what makes the uncapped claim credible, and all of them are
 * already published on /pricing:
 *   - automation workflows per workspace: 3 / 25 / 100 / 250 / 250
 *   - DM follow-ups per automation: 0 / 2 / 5 / 10 / 10
 *   - chatbot conversations a month: 500 on Free, unlimited on every paid plan
 *   - one Instagram account per workspace, 20 workspaces on Agency
 * Source for every one of them: src/config/pricing-v4.config.ts. Do not soften
 * or drop them to make the page read better.
 *
 * 🚩 DO NOT write the Free plan's "500 DMs / month" figure here. It is not
 * enforced, it ships only because ADR 0004 prints the V4 sheet verbatim, and
 * repeating it on this page in particular would contradict the page's own
 * headline claim. The 500 figure that IS correct to state here is chatbot
 * CONVERSATIONS, a different meter in a different module.
 *
 * 🚩 "Unlimited" means Liffio does not meter automated DMs. It does not and
 * cannot mean Instagram will deliver an unbounded number: the platform has its
 * own rate limits and they are Instagram's to change. The "What unlimited does
 * not mean" section says this outright. Never delete that section.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Unlimited Instagram DMs on Every Plan, Free Included | Liffio",
  description:
    "Liffio does not meter automated Instagram DMs on any plan, free included, and charges no per-contact fees. Here is exactly what is uncapped and what is not.",
  pathname: "/unlimited-instagram-dms",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "unlimited-dms",
    label: "Unlimited DMs FAQ",
    items: [
      {
        id: "really-unlimited",
        question: "Are Instagram DMs really unlimited on the free plan?",
        answer:
          "Automated DMs are not metered on any Liffio plan, and that includes the free one. There is no monthly DM allowance to run out of and no per-contact fee, so a Reel that reaches far more people than you expected does not change what you pay. What the free plan does limit is how many automation workflows you can run at once, which is 3. The DMs those three automations send are uncapped.",
      },
      {
        id: "what-is-capped",
        question: "What is capped, then?",
        answer:
          "Four things, all published on the pricing page. Automation workflows per workspace: 3 on Free, 25 on Starter, 100 on Growth, 250 on Business and Agency. DM follow-ups per automation: none on Free, then 2, 5 and 10. Chatbot conversations a month: 500 on Free, unlimited on every paid plan. And one Instagram account per workspace, with Agency providing 20 workspaces. None of those meters count DMs.",
      },
      {
        id: "per-contact",
        question: "What is per-contact pricing and why does it matter?",
        answer:
          "Per-contact pricing charges you by how many unique people your automations have talked to, usually counted monthly. It is the standard model in this category and it has one specific failure mode: the bill scales with reach rather than with revenue. A Reel that finds 20,000 new people is the best thing that can happen to a creator and the worst thing that can happen to a per-contact invoice. Liffio has no per-contact fee, so the two are not linked.",
      },
      {
        id: "viral-reel",
        question: "What happens if a Reel goes viral?",
        answer:
          "The automation keeps sending and the price stays the same. There is no tier you can be pushed into by volume, because volume is not what the plans are priced on. The practical limit in that situation is Instagram's own, not Liffio's: Instagram applies platform rate limits to messaging, and those are Instagram's to set and change.",
      },
      {
        id: "does-unlimited-mean-instagram",
        question: "Does unlimited mean Instagram will deliver every DM instantly?",
        answer:
          "No, and no tool can promise that. Unlimited describes Liffio's billing: we do not meter automated DMs. Delivery still happens through the official Instagram API, which has its own rate limits and its own messaging rules, so during an unusually large spike messages can queue. Any tool claiming to bypass Instagram's limits is describing something it should not be doing.",
      },
      {
        id: "upgrade-reason",
        question: "If DMs are unlimited on Free, why upgrade?",
        answer:
          "For the number of automations running at once, and for the chatbot module. Three workflows is enough to test the idea on three posts; a creator posting several times a week runs out of slots quickly, which is what Starter at $9 a month (Rs.499) and its 25 workflows is for. Paid plans also add DM follow-ups, the multi-keyword trigger builder, a follow-before-DM gate, and the ability to turn Liffio branding off.",
      },
    ],
  },
];

const UNCAPPED = [
  { name: "Automated DMs", body: "Not metered on any plan, free included. No monthly allowance, no overage." },
  { name: "Per-contact fees", body: "There are none. What you pay does not change with how many unique people you reach." },
  { name: "Comments handled", body: "An automation watching a post keeps firing whether the post draws 50 comments or 50,000." },
  { name: "Public replies", body: "The visible comment back is part of the same automation and is not separately metered." },
];

const CAPPED = [
  { name: "Automation workflows", values: "3 / 25 / 100 / 250 / 250", body: "Per workspace, by plan. This is the limit most people actually hit." },
  { name: "DM follow-ups per automation", values: "0 / 2 / 5 / 10 / 10", body: "Follow-up messages after the first DM, not the first DM itself." },
  { name: "Chatbot conversations a month", values: "500 on Free, unlimited on paid", body: "Chatbots are a separate module from comment-to-DM, with their own meter." },
  { name: "Instagram accounts", values: "1 per workspace, 20 workspaces on Agency", body: "One connected account per workspace on every tier." },
];

export default function UnlimitedInstagramDmsPage() {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Unlimited Instagram DMs", item: `${SITE_URL}/unlimited-instagram-dms` },
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
                { label: "Unlimited Instagram DMs", href: "/unlimited-instagram-dms" },
              ]}
            />
            {metaCopy.heroBadge ? (
              <TechBadge label={metaCopy.heroBadge} variant="meta" format="label" className="mb-5" />
            ) : null}
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Unlimited Instagram DMs on Every Plan
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Liffio does not meter automated DMs, on any plan, free included, and there are no
              per-contact fees. A Reel that reaches ten times more people than you planned for costs
              exactly the same to answer.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={siteConfig.urls.appSignup}
                className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
              >
                Start free
              </a>
              <a
                href="#limits"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
              >
                What is actually capped
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              No credit card required · No per-contact fees · Official Instagram API
            </p>
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Why DM limits and per-contact fees hurt
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Most tools in this category price on contacts: you pay by how many unique people
                your automations have messaged, counted monthly. It sounds fair until you notice
                what it is actually indexed to. Reach. The single best thing that can happen to a
                creator, a Reel finding twenty thousand people who have never heard of them, is the
                thing that moves the invoice.
              </p>
              <p>
                That produces a decision nobody should have to make. You post something that works,
                the comments start arriving, and instead of enjoying it you are doing arithmetic
                about which tier you are about to land in. Some people turn the automation off
                mid-campaign. Turning off the thing that answers your customers, because answering
                them costs money, is the wrong incentive to build a business on.
              </p>
              <p>
                Liffio prices on how much automation you are running, not on how many people it
                reaches. Automated DMs are uncapped on every plan, there is no per-contact fee, and
                the number on your invoice is the number you picked when you chose the plan.
              </p>
            </div>
          </div>
        </section>

        {/* Uncapped */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What is uncapped
            </h2>
            <dl className="grid gap-5 sm:grid-cols-2">
              {UNCAPPED.map((f) => (
                <div key={f.name} className="rounded-2xl border border-[#ffe4e6] bg-white p-5">
                  <dt className="font-semibold text-gray-900">{f.name}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Capped */}
        <section id="limits" className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What is capped, stated plainly
            </h2>
            <p className="text-gray-600 mb-8">
              Every figure here is on the pricing page too. Values run Free / Starter / Growth /
              Business / Agency.
            </p>
            <dl className="space-y-5">
              {CAPPED.map((f) => (
                <div key={f.name} className="rounded-2xl border border-gray-100 bg-[#faf9ff] p-5">
                  <dt className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-semibold text-gray-900">{f.name}</span>
                    <span className="text-sm font-bold text-[#b20d8f] tabular-nums">{f.values}</span>
                  </dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              <a href="/pricing" className="text-[#b20d8f] font-semibold hover:underline">
                See the full plan comparison →
              </a>
            </p>
          </div>
        </section>

        {/* What unlimited does not mean */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What unlimited does not mean
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Unlimited describes Liffio&apos;s billing, not Instagram&apos;s behaviour. Messages
                go out through the official Instagram API, and Instagram applies its own rate limits
                and its own messaging rules. During an unusually large spike, messages can queue.
                Nobody can promise otherwise, and a tool that claims to get around Instagram&apos;s
                limits is telling you something about how it operates that should worry you.
              </p>
              <p>
                It also does not mean you should send more. An automation that answers people who
                asked for something is welcome; the same automation pointed at people who did not
                ask is spam, and Instagram treats it accordingly. Uncapped DMs are there so that
                answering everyone who raised their hand is free, not so that the hand-raising
                becomes optional.
              </p>
              <p>
                <a href="/is-instagram-dm-automation-safe" className="text-[#b20d8f] font-semibold hover:underline">
                  What actually gets Instagram accounts restricted →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Frequently asked questions
            </h2>
            <dl className="space-y-8">
              {faqCategories[0].items.map((item) => (
                <div key={item.id}>
                  <dt className="font-semibold text-gray-900 mb-2">{item.question}</dt>
                  <dd className="text-gray-600 text-sm leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm text-gray-600">
              Also useful:{" "}
              <a href="/instagram-comment-to-dm" className="text-[#b20d8f] font-semibold hover:underline">
                how comment-to-DM works
              </a>
              {" · "}
              <a href="/manychat-alternative" className="text-[#b20d8f] font-semibold hover:underline">
                Liffio vs ManyChat
              </a>
              {" · "}
              <a href="/compare" className="text-[#b20d8f] font-semibold hover:underline">
                all comparisons
              </a>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#fff7f7] border-t border-[#ffe4e6] text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Answer everyone, pay the same
            </h2>
            <p className="text-gray-600 mb-8">
              Start on the free plan, run three automations, and send as many DMs as the posts
              earn. No card, no expiry, no per-contact fee.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="inline-flex rounded-xl px-10 py-4 text-base font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
            >
              Start free
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Paid plans from $9/month (Rs.499) · INR billing with GST-friendly invoices
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
