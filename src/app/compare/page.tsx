import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import { COMPARISONS, ALTERNATIVE_PAGES } from "@/config/comparisons.config";
import RoundupTable from "./RoundupTable";
import { ROUNDUP_TOOLS } from "./tools";

/**
 * /compare is a MULTI-VENDOR ROUNDUP, not a Liffio sales page.
 *
 * It was 147 words of card grid, which made it a thin hub: it linked the
 * comparison cluster without being a document in its own right. It is now the
 * page type the SERP for these queries actually rewards, a survey of the whole
 * field, and it keeps parenting the /vs/ cluster from the same URL.
 *
 * 🚩 Liffio does not win here. It is one entry of thirteen, it is not ranked
 * first on merit, its own entry states plainly what it cannot do, and several
 * rivals are named as the better answer for a named reader. If a future edit
 * crowns Liffio, adds a "best overall" badge, or deletes a rival's advantage,
 * the page stops being the thing that ranks and goes back to being a landing
 * page that does not.
 *
 * 🚩 Every competitor figure, its source URL and its verification date live in
 * ./tools.ts, with the rules for changing them at the top of that file. Read
 * them before touching a price here.
 */

export const metadata: Metadata = buildPageMetadata({
  // 49 chars, under the 60-char limit. Leads on the roundup intent ("tools
  // compared") rather than "How Liffio compares", which described a
  // single-vendor page and competed for nothing the SERP was serving.
  // 🚩 The count here must match ROUNDUP_TOOLS.length in ./tools.ts.
  title: "Instagram DM Automation Tools: 13 Compared (2026)",
  // 150 chars.
  description:
    "Thirteen Instagram comment to DM tools compared on price, DM limits and chatbots, with November 2026 pricing and an honest read on who each one suits.",
  pathname: "/compare",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const brandGradient = "[background:linear-gradient(135deg,#f5184c,#b20d8f)]";

/**
 * ItemList for the roundup.
 *
 * Composed inline rather than added to lib/seo/json-ld.tsx: nothing there fits
 * an ItemList, and the shape is specific to this page (a surveyed set of
 * third-party SoftwareApplications), so it would be an exported component with
 * exactly one caller.
 *
 * 🚩 itemListOrder is Unordered on purpose. ItemListOrderDescending would
 * assert that position 1 is the best tool, which this page explicitly does not
 * claim, and Liffio sits at position 1 in the array.
 */
function roundupItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Instagram DM automation tools compared",
    description:
      "Thirteen Instagram comment-to-DM and DM automation tools compared on free plan, entry price, pricing model, automated DM volume and chatbot availability. Pricing read from each vendor pricing page in November 2026.",
    url: `${SITE_URL}/compare`,
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: ROUNDUP_TOOLS.length,
    itemListElement: ROUNDUP_TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: tool.pricingUrl.startsWith("http") ? tool.pricingUrl : `${SITE_URL}${tool.pricingUrl}`,
        description: tool.bestFor,
      },
    })),
  };
}

const PRICING_MODELS = [
  {
    title: "Flat rate",
    body: "One price per month, and volume does not change it. Liffio, Zorcha, CreatorFlow and LinkDM price this way. The only model where a post doing ten times your usual numbers costs nothing extra.",
  },
  {
    title: "Per contact",
    body: "You pay for how many people interacted with your automations, as on ManyChat and Inro. The model that reacts hardest when one post travels, because every new commenter joins the meter and stays.",
  },
  {
    title: "Monthly DM cap",
    body: "A stated number of DMs per tier, as on ReplyRush and in LinkDM's allowances. Predictable until the month you exceed it, when the automation stops being the thing you relied on.",
  },
  {
    title: "Metered credits",
    body: "A plan plus credits spent on the expensive operations: Chatfuel meters AI replies and WhatsApp templates, Zorcha meters AI. Chatfuel credits do not roll over, so a busy month can run dry.",
  },
  {
    title: "Add-on per execution",
    body: "Automation as a separate line item on a suite subscription, like Metricool's Flows add-on at $12 per month for 2,500 executions.",
  },
];

const WHO_SHOULD_PICK = [
  { reader: "You automate Instagram, Messenger and WhatsApp together", pick: "ManyChat, or Chatfuel if you want an AI agent doing the talking. Nothing Instagram-only here replaces either." },
  { reader: "You already schedule and report for five brands", pick: "Metricool plus the Flows add-on, because you were buying the suite anyway." },
  { reader: "Your deliverable is link delivery across up to ten accounts", pick: "LinkDM. At roughly $10 per account per month it is the best multi-account value here." },
  { reader: "Your audience comments in Hinglish or misspells the keyword", pick: "SuperProfile, the only tool here advertising intent matching for typos and Hinglish." },
  { reader: "You want uncapped automated DMs on a free plan", pick: "Zorcha or Liffio. Both leave DMs unlimited on every tier, Free included, so try both." },
  { reader: "Your volume is flat most months and spikes on launches", pick: "CreatorFlow, whose $5 per 1,000 DM packs beat a permanent tier upgrade." },
  { reader: "You have budget but no time to configure anything", pick: "Inro's Managed service from €249 per month. No other tool here sells the labour." },
  { reader: "You want a flow builder and AI agent cheap, and can pay yearly", pick: "InstantDM, whose monthly prices are not published at all." },
  { reader: "You run Instagram only and bill in rupees", pick: "SendDM at ₹399, Liffio at ₹499 or ReplyRush at ₹900. SendDM is cheapest, Liffio adds chatbots and a GST invoice, ReplyRush is simpler and capped." },
];

const VERIFY_BEFORE_PAYING = [
  "Does the free plan include comment-to-DM at all? Metricool has a free plan and it is not on it.",
  "Is the headline price monthly or yearly? InstantDM publishes only yearly figures.",
  "Introductory or standing price? SuperProfile is ₹99 for the first month, then ₹499.",
  "What is metered: DMs, contacts, credits or executions? That decides what a viral post costs you.",
  "Do credits or allowances roll over? Chatfuel states its credits do not.",
  "Can you be billed in your own currency? Chatfuel is USD only, Inro is EUR, and six here publish rupee prices. Check on an Indian connection: these pages geo-localize.",
  "Does the vendor state it uses an official Meta API, and will support confirm it in writing?",
];

export default function ComparePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roundupItemListJsonLd()) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Compare", item: `${SITE_URL}/compare` },
        ]}
      />
      <Navbar />
      <main id="main-content" className="flex-1">

        {/* Hero */}
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
              Instagram DM automation tools compared
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Thirteen comment-to-DM tools, every price read off the vendor&apos;s own pricing page
              in November 2026, and an honest read on who each one suits. Liffio is one of the
              thirteen and it is not the answer for everybody here.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="#summary"
                className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
              >
                Jump to the comparison table ↓
              </a>
              <a
                href="#who-should-pick"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
              >
                Which one fits you
              </a>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              How this comparison was put together
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Every figure here was read off the vendor&apos;s own pricing page on 13 November
                2026, and each tool links back to the page its numbers came from. Nothing is quoted
                from another comparison post, because a competitor price sourced from a
                competitor&apos;s blog is how wrong numbers spread through this category. Two tools
                publish no pricing publicly and say so in the table rather than carry a guess:
                ManyChat sits behind a bot wall that returns an error to automated requests, and
                InstaChamp&apos;s own domain now redirects to a parking page.
              </p>
              <p>
                Feature and API claims are the vendors&apos; claims, including Liffio&apos;s. Several
                state they run on an official Meta API; none of those statements was independently
                verified here, so confirm it with support before you route a launch through any of
                them. Liffio is written by Liffio, so its entry lists what it cannot do alongside
                what it can, and the table marks its row.
              </p>
            </div>
          </div>
        </section>

        {/* Summary table */}
        <section id="summary" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              The summary table: all thirteen tools
            </h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Row order is not a ranking. Prices are as of November 2026, and each tool name links
              to the page its figures came from.
            </p>
            <RoundupTable />
            <p className="mt-5 text-sm text-gray-500 max-w-3xl">
              Two footnotes: Metricool&apos;s $20 Starter does not include comment-to-DM without the
              Flows add-on, and SuperProfile&apos;s ₹99 and $4.99 are first-month rates that become
              ₹499 and $29.
            </p>
          </div>
        </section>

        {/* Per-tool assessments */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Every tool, one at a time
            </h2>
            <p className="text-gray-600 mb-10">
              What each is good at, who it suits, and where it runs out.
            </p>
            <div className="space-y-12">
              {ROUNDUP_TOOLS.map((tool) => (
                <div key={tool.name} id={tool.name.toLowerCase()}>
                  <h3
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    {tool.name}
                    {tool.isLiffio ? (
                      <span className="ml-3 align-middle rounded-full bg-[#fff1f2] px-3 py-1 text-xs font-semibold text-[#b20d8f]">
                        our product
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    Best for: <span className="font-normal text-gray-600">{tool.bestFor}</span>
                  </p>
                  <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
                    {tool.assessment.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    {tool.internalLink ? (
                      <p>
                        {tool.internalLink.lead}{" "}
                        <a
                          href={tool.internalLink.href}
                          className="text-[#b20d8f] font-semibold hover:underline"
                        >
                          {tool.internalLink.label}
                        </a>
                        {tool.internalLink.tail ? ` ${tool.internalLink.tail}` : "."}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Pricing checked {tool.verified}:{" "}
                    <a
                      href={tool.pricingUrl}
                      className="underline hover:text-[#b20d8f]"
                      {...(tool.pricingUrl.startsWith("http")
                        ? { target: "_blank", rel: "noopener nofollow" }
                        : {})}
                    >
                      {tool.pricingUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who should pick what */}
        <section id="who-should-pick" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Which tool fits which reader
            </h2>
            <p className="text-gray-600 mb-8">
              No tool here is best outright, only best for a job. Find the row that describes you.
            </p>
            <dl className="space-y-5">
              {WHO_SHOULD_PICK.map((item) => (
                <div key={item.reader} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <dt className="font-semibold text-gray-900">{item.reader}</dt>
                  <dd className="mt-1 text-gray-600 leading-relaxed">{item.pick}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Pricing models */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Five pricing models, and what each does when a post takes off
            </h2>
            <p className="text-gray-600 mb-8">
              Comparing entry prices here is mostly meaningless, because these thirteen tools
              charge in five different shapes, and the shape decides your bill in the month that
              matters.
            </p>
            <div className="space-y-6">
              {PRICING_MODELS.map((model) => (
                <div key={model.title} className="flex gap-4">
                  <span className="mt-1 text-[#f5184c] font-bold" aria-hidden="true">
                    →
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{model.title}</h3>
                    <p className="mt-1 text-gray-600 leading-relaxed">{model.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verify before paying */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Seven things to check before you pay for any of them
            </h2>
            <ul className="space-y-3 list-none">
              {VERIFY_BEFORE_PAYING.map((item) => (
                <li key={item} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-[#f5184c] font-bold mt-0.5" aria-hidden="true">
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The comparison cluster */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Head-to-head comparisons
            </h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Each of these goes feature by feature against Liffio, including migration steps.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {COMPARISONS.map((c) => (
                <a
                  key={c.slug}
                  href={`/vs/${c.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#f5184c] hover:shadow-md"
                >
                  <div
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    Liffio vs {c.competitor}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">{c.hubBlurb}</p>
                  <span className="mt-4 text-sm font-semibold text-[#b20d8f] group-hover:underline">
                    Read comparison →
                  </span>
                </a>
              ))}
              {ALTERNATIVE_PAGES.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#f5184c] hover:shadow-md"
                >
                  <div
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
                  >
                    {a.name} alternative
                  </div>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">{a.blurb}</p>
                  <span className="mt-4 text-sm font-semibold text-[#b20d8f] group-hover:underline">
                    Read comparison →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl px-8 py-12 text-center ${brandGradient}`}>
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
              >
                Want to try the Liffio entry on this list?
              </h2>
              <p className="mt-2 text-white/90 max-w-xl mx-auto">
                Free plan, no credit card: 3 automations, 2 live chatbots, and unlimited automated
                DMs. If one of the other eleven fits you better, the links above go straight to their
                pricing pages.
              </p>
              <a
                href={siteConfig.urls.appSignup}
                className="mt-6 inline-flex rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#b20d8f] shadow-lg hover:bg-gray-50 transition-colors"
              >
                Create a free account
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
