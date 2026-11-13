import type { Metadata } from "next";
import { FEATURE_WELCOME_DM } from "@/config/feature-flags";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { FaqCategory } from "@/config/faq.config";

export const metadata: Metadata = buildPageMetadata({
  // "(2026)" was dropped from the title to get back under 60 characters after
  // the description was rewritten. Google appends the site name anyway.
  title: "Chatfuel Alternative for Instagram DM Automation | Liffio",
  description:
    // The old description named "$49 AI PRO", a plan Chatfuel no longer sells.
    // Replaced with the entry Business S tier read from chatfuel.com/pricing on
    // 2026-11-13. See the verification block above `competitorPricing` below.
    "Compare Liffio vs Chatfuel for Instagram DM automation. Chatfuel has no free plan and starts at $18/mo plus usage credits, as of November 2026.",
  pathname: "/chatfuel-alternative",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "chatfuel-alt",
    label: "Chatfuel alternative FAQ",
    items: [
        {
          id: "is-it-safe",
          question: "Is it safe to connect my Instagram account?",
          answer:
            "Liffio connects through the official Instagram API using Instagram Login: you approve the permissions on Instagram's own consent screen, no password is shared, and you can revoke access from Instagram at any time. Liffio's business is Meta-verified as a Tech Provider and its Instagram permissions passed Meta's App Review. Any tool running on the official API needs both, so treat this as the baseline to check for rather than a point of difference. The question worth asking about any Instagram tool is whether it uses the official API at all, or signs in as you and drives the app in a browser.",
        },
      {
        id: "liffio-vs-chatfuel",
        question: "How does Liffio compare to Chatfuel for Instagram?",
        answer:
          "Chatfuel is a multi-platform chatbot builder that supports Instagram, Facebook Messenger, WhatsApp, and Telegram. Liffio is built specifically for Instagram. Chatfuel does cover the Instagram triggers you would expect: its pricing page lists comment-to-DM from a keyword in a comment, from a story reply, or from any comment, and says Reels are covered. The real difference is the shape of the bill. As of November 2026, chatfuel.com/pricing has no free plan, only a free trial, and its cheapest tier is Business S at US$18/month billed yearly or US$20/month billed monthly, for one business, with usage credits metered on top for AI replies, WhatsApp templates and lead events. Liffio's paid plans start at $9/month flat, with unlimited automated DMs on every plan, Free included, and the free plan is a plan rather than a trial.",
      },
      {
        id: "chatfuel-instagram-dms",
        question: "Does Chatfuel handle Instagram comment-to-DM automation?",
        answer:
          "Yes. As of November 2026, chatfuel.com states comment-to-DM for Instagram explicitly: the trigger can be a keyword in a comment, a story reply, or any comment, and Reels are covered. Chatfuel also says it connects to Instagram through Meta's official Graph API and that a professional Instagram account is required. Those are Chatfuel's own claims, read from its site, not something Liffio has independently tested. The difference is the surface you build on. Chatfuel's builder is designed for multi-platform chatbot logic, so a plain keyword-to-DM rule goes through a flow builder. Liffio's setup for a comment-to-DM automation on a Reel takes about five minutes: select the post, set the keyword, write the message, choose the delay. When you do want a full conversation, Liffio's chatbots are a separate module, with 2 live chatbots on the free plan.",
      },
      {
        id: "chatfuel-pricing-2026",
        question: "How does Chatfuel's pricing work in 2026?",
        answer:
          "As of November 2026, chatfuel.com/pricing prices per bot and then meters usage on top. There are two ladders. Business covers one business and runs from US$18/month billed yearly (US$216 for the year) or US$20/month billed monthly, through US$40.50, US$81 and US$153 yearly per month, to US$366.67. Agency starts at US$90/month billed yearly (US$1,080 for the year) or US$100 monthly and covers 3 companies, with Agency M and above covering unlimited companies. Each tier includes a usage balance, from US$20 of credits on Business S to US$500 on Business XXL, and Chatfuel states that unused credits do not roll over. AI replies, WhatsApp templates and lead events reported to Meta all draw down that balance, Meta's own WhatsApp fees are billed separately from the same wallet, and setup through Coworker is a one-time US$10. No contact cap is stated. Liffio's paid plans start at $9/month flat with unlimited automated DMs on every plan, Free included, and no metered credits to top up.",
      },
      {
        id: "chatfuel-free-plan",
        question: "Does Chatfuel have a free plan for Instagram?",
        answer:
          "No. As of November 2026, chatfuel.com/pricing offers a free trial, not a free plan. The pricing page's button reads Start free trial and states no trial length, and its FAQ says only that the trial comes with a starting balance to test the bot, without naming the balance. A separate Chatfuel page, chatfuel.com/instagram, states a 7-day free trial. Chatfuel's cheapest ongoing plan is Business S at US$18/month billed yearly, or US$20/month billed monthly. Liffio's free plan is a plan: it runs real automations in production (comment keyword triggers on posts and Reels, public comment replies, 2 live chatbots, a bio link page at bio.liffio.com, and overview analytics, with unlimited DMs) with no credit card and no countdown.",
      },
      {
        id: "switch-from-chatfuel",
        question: "How hard is it to switch from Chatfuel to Liffio?",
        answer:
          "Switching is straightforward for most Instagram automations. Chatfuel flows cannot be exported and imported directly into Liffio, so migration is manual. The practical steps are: identify your active Chatfuel automations for Instagram (keyword triggers, DM templates, story reply flows), create a Liffio account, connect your Instagram account through Instagram Login, and recreate each automation in Liffio. Simple comment-to-DM flows take five to ten minutes each. If you have multi-step chatbot sequences in Chatfuel, rebuild them in Liffio's chatbot module and plan for those to take longer: questions and conditions come with Starter, chain bots and templates with Growth, and lead capture and the webhook step with Business. Run both tools in parallel for a short period before fully cutting over.",
      },
    ],
  },
];

// Chatfuel cells verified 2026-11-13 on https://chatfuel.com/pricing (see the
// block above `competitorPricing` for the full reading). Every cell below is
// either a value that page states or a value it visibly withholds. A cell that
// Chatfuel's own pricing page does not address reads "Not on pricing page":
// never a dash, because an unsourced "-" is a negative claim about a named
// competitor, which is the defect this file's verification rule exists to stop.
// The four chatbot rows used to read "Check their plans", which is not an
// answer.
const chatfuelRows = [
  // Stated: comment-to-DM triggers are a keyword in a comment, a story reply,
  // or any comment, and Reels are covered. Story reply is an explicit trigger,
  // so the old "limited" on the story row was wrong.
  { name: "Comment-to-DM", liffio: true, competitor: true },
  { name: "Story auto reply", liffio: true, competitor: true },
  // Chatfuel never claims unlimited sending: AI replies, WhatsApp templates and
  // lead events draw down a metered credit balance that does not roll over.
  { name: "Unlimited DMs (every plan)", liffio: true, competitor: "Metered credits" },
  // 🔴 This row read `competitor: true` until 2026-11-13. There is NO Chatfuel
  // free plan, only a free trial. Do not flip it back without reading the page.
  { name: "Free plan (permanent)", liffio: true, competitor: false },
  // Business tiers cover 1 business; Agency S covers 3 companies; Agency M and
  // above are unlimited.
  { name: "Instagram accounts per subscription", liffio: "1 per workspace (Agency: 20)", competitor: "1 business (Agency: 3, then unlimited)" },
  { name: "Bio link pages", liffio: true, competitor: "Not on pricing page" },
  { name: "Post scheduler", liffio: true, competitor: "Not on pricing page" },
  // Stated: lead events reported to Meta are one of the metered usage types.
  { name: "Lead capture", liffio: true, competitor: true },
  // Stated: USD only, no currency selector, no INR option.
  { name: "Razorpay / INR billing", liffio: true, competitor: false },
  { name: "Instagram-only focus", liffio: true, competitor: false },
  { name: "Chatbots for full DM conversations", liffio: true, competitor: true },
  { name: "Chatbots separate from comment to DM", liffio: true, competitor: "Not on pricing page" },
  // There is no free plan to put chatbots on, which is a sourced answer.
  { name: "Live chatbots on the free plan", liffio: "2", competitor: "No free plan" },
  { name: "Chatbot questions, conditions and media", liffio: "Starter and up", competitor: "Not on pricing page" },
  // Story reply is a stated trigger; ice breakers are not mentioned.
  { name: "Ice breakers and story triggers", liffio: "Growth and up", competitor: "Story triggers yes" },
  // Lead events are a stated metered usage type; a webhook step is not mentioned.
  { name: "Chatbot lead capture and webhook step", liffio: "Business and Agency", competitor: "Lead events yes" },
];

// Competitor pricing below was read from each vendor's own live pricing page on
// 2026-11-13. Refresh it from these same URLs, never from memory and never from
// an article, and keep "as of November 2026" in the visible copy beside the
// table:
//   Chatfuel  https://chatfuel.com/pricing
//   ManyChat  https://manychat.com/pricing  (blocks automated fetching, see below)
//   SendDM    https://senddm.ai/pricing
//
// CHATFUEL, read from https://chatfuel.com/pricing on 2026-11-13:
//   🔴 NO FREE PLAN. Free TRIAL only. The page's button reads "Start free
//   trial" and states no trial length; its FAQ says only that the trial comes
//   with a starting balance to test the bot, without naming the balance. The
//   "7-day free trial" figure is on https://chatfuel.com/instagram, NOT on
//   /pricing, so attribute the 7 days to that page if you use it. This page
//   previously published a free "Chatfuel Light" plan and "AI PRO at
//   $49/month"; neither exists on the live pricing page.
//   Billing model: per bot PLUS metered usage credits. AI replies, WhatsApp
//   templates and lead events reported to Meta are all metered, and unused
//   credits do NOT roll over. No contact cap is stated anywhere on the page, so
//   describe contacts as unspecified, never as unlimited.
//   Ladder, with the yearly toggle on as the page default. Yearly per month,
//   then monthly:
//     Business  S $18 / $20 ($216 per year), M $40.50 / $45, L $81 / $90,
//               XL $153 / $170, XXL $366.67 / $410
//     Agency    S $90 / $100 ($1,080 per year), M $202.50 / $225,
//               L $396 / $440, XL $765 / $850, XXL $1,845 / $2,050
//   Included usage credits by tier: Business S $20, M $50, L $100, XL $200,
//   XXL $500. Bots: Business tiers cover 1 business, Agency S covers 3
//   companies, Agency M and above are unlimited. Costs outside the plan price:
//   setup via Coworker $10 once, and Meta's WhatsApp fees billed separately but
//   drawn from the same wallet. Currency: USD only, no selector, no INR, and
//   the page never addresses Indian billing, so say "page shows USD only" and
//   not "bills Indian users in USD".
//   🚩 Do NOT multiply a per-month figure by 12 to publish an annual price.
//   Only Business S ($216) and Agency S ($1,080) print annual totals, and
//   Business XXL's yearly figure is inconsistent with the stated 10% discount,
//   so it may be a page error.
//
// Liffio's own figures come from src/config/pricing.config.ts: Free $0 / ₹0,
// Starter $9 / ₹499, Growth $29 / ₹1,499, Business $59 / ₹2,499, Agency
// $549 / ₹22,999. Do not retype them from memory when they move.
const competitorPricing: {
  name: string;
  free: boolean | string;
  paidFrom: string;
  model: string;
  instagramOnly: boolean;
  source: string | null;
}[] = [
  { name: "Liffio", free: true, paidFrom: "$9/month", model: "Flat rate", instagramOnly: true, source: null },
  {
    name: "Chatfuel",
    free: false,
    paidFrom: "$18/month yearly, $20 monthly (Business S)",
    model: "Per bot plus metered usage credits",
    instagramOnly: false,
    source: "https://chatfuel.com/pricing",
  },
  // MANYCHAT, read from https://manychat.com/pricing, verified 2026-11-13 in a
  // real browser.
  // 🚩 manychat.com blocks automated fetching: a domain-wide Cloudflare bot
  // check returns HTTP 403 to curl, to WebFetch and to headless browser
  // engines. In a real signed-in Chrome the interstitial clears after about 8
  // seconds and the page reads normally. So refresh these figures in a REAL
  // browser, not with curl, and do not replace them with "not publicly listed"
  // because an automated fetch failed: the prices are published.
  // Monthly, then annual, then active-contact cap / channels / users:
  //   Free       $0                               25 / 2 / 1
  //   Essential  $14/mo   $168/yr   (18% off)    250 / 2 / 2
  //   Pro        $29/mo   $348/yr   (25% off)  2,500 / 3 / 3
  //   Business   $69/mo   $828/yr   (30% off)  7,500 / unlimited / 5
  //   Advanced   $139/mo  $1,668/yr           25,000 / unlimited / 10
  // Billing unit is the Active Contact: one real person interacted with during a
  // monthly billing period, counted once for that month. Over the cap,
  // automations keep running and ManyChat charges a small overage fee per extra
  // Active Contact; annual plans still count contacts monthly and bill overages
  // monthly. Free needs no card, carries Manychat branding and allows up to 4
  // live triggers; Essential and above remove the branding. 14-day free trial on
  // Essential or Pro. Prices exclude tax and depend on billing country.
  // ManyChat describes itself as an official Meta-approved partner and an
  // Official Meta Business Partner. That is its own claim, not verified here.
  // 🔴 USD only, no INR: /pricing?country=IN still rendered $29/mo with no rupee
  // symbol on the page. Say "the page shows USD only and publishes no rupee
  // price", never "bills Indian users in USD".
  {
    name: "ManyChat",
    free: "Yes, 25 contacts",
    paidFrom: "$14/month (Essential, 250 contacts)",
    model: "Per active contact",
    instagramOnly: false,
    source: "https://manychat.com/pricing",
  },
  // SENDDM, https://senddm.ai/pricing, verified 2026-11-13 in BOTH regional
  // views: curl for the international rate card, an India-geolocated browser for
  // the rupee rate card.
  // 🔴 The page GEO-LOCALIZES. A curl result shows the default or US view and is
  // NOT evidence about what an Indian customer sees. An earlier pass read it
  // with curl and wrote "USD only, no rupee pricing, no ₹399 tier" across this
  // file and two sibling pages. That was wrong: the original "₹399/month" was
  // correct, and it is Creator on annual billing.
  // Tier names match in both regions: Free, Creator, Growth, Scale, Custom.
  // Annual per month / monthly / billed yearly:
  //   India:         Free ₹0; Creator ₹399/₹499/₹4,790; Growth ₹719/₹899/₹8,630;
  //                  Scale ₹1,439/₹1,799/₹17,270; Custom quote
  //   International: Free $0;  Creator $9/$11/$105.60;   Growth $16/$20/$192;
  //                  Scale $31/$39/$374;                 Custom quote
  // Free caps, per month: 300 DMs, 1 Instagram account, 3 message templates,
  // basic keyword triggers, 1 conversation starter, 5 links in bio, 5 scheduled
  // posts, 2 story mention replies. Paid tiers carry UNLIMITED DMs and bundle
  // accounts: Creator 5, Growth 10, Scale 20.
  {
    name: "SendDM",
    free: true,
    paidFrom: "₹399/month in India, $9/month internationally (annual billing)",
    model: "Flat rate, INR and USD",
    instagramOnly: true,
    source: "https://senddm.ai/pricing",
  },
];

export default function ChatfuelAlternativePage() {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Chatfuel Alternative", item: `${SITE_URL}/chatfuel-alternative` },
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
                { label: "Chatfuel Alternative", href: "/chatfuel-alternative" },
              ]}
            />
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              The Best Chatfuel Alternative for Instagram DM Automation
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Chatfuel is a multi-platform AI chatbot builder. If Instagram is your only
              channel, you are paying for Messenger and WhatsApp infrastructure you never use.
              It has no free plan, only a free trial, and its cheapest tier is{" "}
              <a
                href="https://chatfuel.com/pricing"
                target="_blank"
                rel="noopener nofollow"
                className="text-[#b20d8f] font-semibold hover:underline"
              >
                US$18/month billed yearly (US$20 monthly), as of November 2026
              </a>
              , with usage credits metered on top. Liffio is built for Instagram only, has a
              free plan rather than a trial, and paid plans start at $9/month flat.
            </p>
            <p className="mt-4 text-sm text-gray-500">Last updated: November 2026</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={siteConfig.urls.appSignup}
                className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
              >
                Get Started Free
              </a>
              <a
                href="#comparison"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
              >
                See full comparison ↓
              </a>
            </div>
          </div>
        </section>

        {/* Why creators leave Chatfuel */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Why Instagram creators look for a Chatfuel alternative
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Chatfuel started as a Facebook Messenger bot builder and expanded to cover
                Instagram, WhatsApp, and Telegram as those platforms opened their APIs.
                The product works, and it is a capable chatbot platform, but the architecture
                reflects its origins. The flow builder, the pricing model, and the feature
                set are all designed for a multi-platform use case.
              </p>
              <p>
                For creators who only care about Instagram, that multi-platform scope creates
                two problems. The interface is more complex than necessary: you navigate
                flows built around multi-channel logic when you just need a comment keyword
                to trigger a DM. And the bill has two moving parts rather than one. As of
                November 2026,{" "}
                <a
                  href="https://chatfuel.com/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  Chatfuel prices per bot and then meters usage on top
                </a>
                : AI replies, WhatsApp templates and lead events reported to Meta all draw
                down a credit balance, and Chatfuel states that unused credits do not roll
                over.
              </p>
              <p>
                The entry point is the most common trigger for switching. A creator who wants
                reliable comment-to-DM automation starts at{" "}
                <a
                  href="https://chatfuel.com/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  US$18/month on Chatfuel&apos;s Business S tier billed yearly, as of
                  November 2026
                </a>
                , or US$20/month billed monthly, with US$20 of usage credits included and
                more to buy once those run out. Liffio&apos;s
                Starter is $9/month flat, and Liffio&apos;s free plan covers real
                comment-to-DM automations before paying anything.
              </p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex gap-3">
                  <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">Metered usage on top of the plan:</strong> Chatfuel&apos;s plan price buys the bot, and AI replies, WhatsApp templates and lead events are metered against a credit balance that does not roll over, with Meta&apos;s WhatsApp fees billed separately from the same wallet (as of November 2026). Liffio starts at $9/month flat, with no per-DM, per-contact, or usage fees.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">Multi-platform overhead:</strong> Chatfuel&apos;s flow builder is designed for Messenger, WhatsApp, and Instagram simultaneously. If you are only automating Instagram, you are navigating a tool built for something broader than your actual use case.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">No free plan to start on:</strong> Chatfuel&apos;s pricing page offers a free trial, not a free plan, as of November 2026, and it does not state how long the trial runs or how much starting balance it includes. Liffio&apos;s free plan runs a real production automation (comment triggers, 2 live chatbots and a bio link page) with no expiry date and no credit card, and unlimited automated DMs come with every plan, Free included.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section id="comparison" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Liffio vs Chatfuel: side-by-side comparison
            </h2>
            <p className="text-gray-600 mb-8">
              Instagram-specific feature comparison.{" "}
              <a href="/blog/manychat-alternatives" className="text-[#b20d8f] font-semibold hover:underline">
                See the full Instagram automation alternatives guide →
              </a>
            </p>
            <ComparisonTable competitorName="Chatfuel" rows={chatfuelRows} />
          </div>
        </section>

        {/* Pricing comparison */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Pricing comparison: Liffio vs Chatfuel vs alternatives
            </h2>
            <p className="text-gray-600 mb-6">
              Competitor prices are as of November 2026, each read from the vendor&apos;s own
              pricing page. Tool names below link to the page the figure came from.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tool</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Free plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid from</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Pricing model</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Instagram only</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorPricing.map((tool, i) => (
                    <tr key={tool.name} className={`border-b border-gray-100 ${i === 0 ? "bg-[#fff7f7]" : ""}`}>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {i === 0 ? (
                          <span className="text-[#f5184c]">{tool.name} ★</span>
                        ) : tool.source ? (
                          <a
                            href={tool.source}
                            target="_blank"
                            rel="noopener nofollow"
                            className="text-[#b20d8f] hover:underline"
                          >
                            {tool.name}
                          </a>
                        ) : (
                          tool.name
                        )}
                      </td>
                      {/* Never gate a cell on truthiness: "Not listed" is a real value. */}
                      <td className="py-3 px-4 text-gray-600">
                        {tool.free === true ? "✓ Yes" : tool.free === false ? "✗ No" : tool.free}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tool.paidFrom}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.model}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.instagramOnly ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                The shape of the bill matters more here than any single number. As of
                November 2026,{" "}
                <a
                  href="https://chatfuel.com/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  Chatfuel&apos;s pricing page
                </a>{" "}
                runs two ladders with the yearly toggle on by default. Business covers one
                business: US$18/month yearly (US$216 for the year) or US$20/month monthly,
                then US$40.50, US$81, US$153 and US$366.67 per month on yearly billing.
                Agency starts at US$90/month yearly (US$1,080 for the year) or US$100 monthly
                and covers 3 companies, with Agency M and above covering unlimited companies.
                On top of the plan price, each tier includes a usage balance, US$20 of credits
                on Business S up to US$500 on Business XXL, and Chatfuel states that unused
                credits do not roll over. Setup through Coworker is a one-time US$10. No
                contact cap is stated on the page, and there is no free plan, only a free
                trial.
              </p>
              <p>
                Liffio&apos;s Starter plan is $9/month flat, with unlimited DMs, unlimited chatbot
                conversations, no quota, and 5 live chatbots with questions, conditions and media.
                Growth at $29/month adds ice breakers, story reply and story mention triggers, and
                15 live chatbots. Business at $59/month adds chatbot lead capture, the webhook step
                and unlimited live chatbots. Agency at $549/month bundles 20 workspaces, one
                Instagram account each, into a single subscription. All plans include INR pricing
                for Indian users through Razorpay.
              </p>
              <p>
                ManyChat bills per Active Contact, so its cost scales with audience size, and
                that is what makes the bill unpredictable when a Reel takes off.{" "}
                <a
                  href="https://manychat.com/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  ManyChat&apos;s pricing page, as of November 2026
                </a>
                , lists Free at $0 for 25 active contacts, Essential at $14/month for 250, Pro at
                $29/month for 2,500, Business at $69/month for 7,500, and Advanced at $139/month
                for 25,000, with annual billing at $168, $348, $828 and $1,668 for the year.
                Going over a cap does not stop your automations; ManyChat charges a small overage
                fee for each extra Active Contact, counted monthly even on an annual plan. The
                page shows US dollars only and publishes no rupee price.{" "}
                <a
                  href="https://senddm.ai/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  SendDM
                </a>{" "}
                prices flat and publishes two rate cards as of November 2026, because its page
                geo-localizes: a free plan capped at 300 DMs a month, then Creator at ₹399/month
                in India, or $9/month internationally, both on annual billing (₹499 or $11 month
                to month). Its paid tiers carry unlimited DMs. So in this table Chatfuel and
                ManyChat are the dollar-only options, while SendDM and Liffio both publish rupee
                prices. Liffio&apos;s rupee card runs Free ₹0, Starter ₹499/month, Growth
                ₹1,499/month, Business ₹2,499/month and Agency ₹22,999/month incl. GST, against
                $0, $9, $29, $59 and $549 internationally.
              </p>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-10" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Who uses Liffio as a Chatfuel alternative
            </h2>
            <div className="space-y-10">

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Creators running product launches and giveaways
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Creators who run comment-to-DM campaigns during product launches want two
                  things: unlimited sending during the spike, and a bill that does not move.
                  A launch Reel that picks up momentum can generate thousands of comments in
                  a single day. On Liffio, that campaign runs at the same flat monthly rate
                  regardless of volume, with no credits to top up. On{" "}
                  <a
                    href="https://chatfuel.com/pricing"
                    target="_blank"
                    rel="noopener nofollow"
                    className="text-[#b20d8f] font-semibold hover:underline"
                  >
                    Chatfuel, as of November 2026
                  </a>
                  , the Business S plan is US$18/month billed yearly and includes US$20 of
                  usage credits that do not roll over, so a spike in AI replies or lead
                  events is a spike in the bill as well as in the comments.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Instagram-only brands and creators
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  If your automation needs are entirely on Instagram (comment triggers on
                  Reels and feed posts, story reply flows{FEATURE_WELCOME_DM ? ", welcome DMs for new followers" : ""}),
                  there is no reason to pay for a multi-platform chatbot builder. Liffio
                  does exactly those things, built around Instagram&apos;s specific triggers and
                  message types, without the overhead of Messenger and WhatsApp infrastructure
                  you will never open.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  The onboarding path is faster too. Setting up comment-to-DM in a
                  multi-platform chatbot builder requires navigating flows designed for
                  general bot logic. In Liffio, the same setup takes five minutes: select
                  the post, enter the keyword, write the message, set the delay, activate.
                  Chatbots live in their own module, so you only open a flow builder when you
                  actually want a full conversation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Social media agencies with Indian clients
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Agencies managing Instagram accounts for clients in India run into two
                  things with Chatfuel.{" "}
                  <a
                    href="https://chatfuel.com/pricing"
                    target="_blank"
                    rel="noopener nofollow"
                    className="text-[#b20d8f] font-semibold hover:underline"
                  >
                    Its pricing page shows USD only, as of November 2026
                  </a>
                  , with no currency selector and no INR option, so an agency billing clients in
                  rupees is handling the conversion itself. And the agency ladder starts at
                  US$90/month billed yearly, US$100 monthly, covering 3 companies, with
                  unlimited companies from Agency M at US$202.50/month yearly.
                  Liffio&apos;s Agency plan, ₹22,999/month incl. GST in India or $549/month
                  internationally as of November 2026, includes 20 workspaces, one Instagram
                  account each, on a single subscription, with INR invoices via Razorpay from an
                  Indian entity. For agencies billing clients in INR who have been absorbing the
                  currency conversion cost on a dollar subscription, switching to Liffio removes
                  that overhead entirely.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Is Liffio safe */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Is Liffio safe for your Instagram account?
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Yes. Liffio uses Meta&apos;s official OAuth flow to connect to your Instagram account.
                You authorize through Instagram's own login screen, Meta issues an access token
                to Liffio, and your Instagram password is never shared with Liffio at any point.
              </p>
              <p>
                The permissions Liffio uses are the ones you approve on Meta&apos;s consent screen
                when you connect your account. OAuth consent through Meta is the correct
                connection path for any compliant Instagram automation tool, and you can revoke
                access at any time from your Instagram settings.
              </p>
              <p>
                Send timing is also handled carefully. Liffio sends automated DMs with a
                configurable 10 to 60 second delay after the trigger event. The pause creates a
                natural conversation pace for the person receiving the reply, even at high
                comment volumes during a viral Reel.
              </p>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to migrate from Chatfuel to Liffio
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Map your active Instagram automations in Chatfuel",
                  body: "List every active Chatfuel flow that touches your Instagram account: the trigger (comment keyword, story reply), the DM text, any flow logic, and any public comment replies. Multi-step sequences should be documented step by step. This takes 20 to 45 minutes depending on how many flows are running. Do not skip it: having a written list makes the Liffio setup much faster.",
                },
                {
                  step: "2",
                  title: "Create a Liffio account and connect Instagram",
                  body: "Sign up at app.liffio.com. No credit card is required on the free plan. Connect your Instagram account through Instagram Login, which takes about two minutes. If you manage multiple Instagram accounts, note that each one runs in its own workspace, and the Agency plan bundles 20 workspaces into a single subscription.",
                },
                {
                  step: "3",
                  title: "Recreate your comment-to-DM flows first",
                  body: "Start with your most active automation, typically the comment-to-DM trigger on your most recent or most promoted Reel. In Liffio, create a Comment automation, select the post, enter the keyword, write the message, and set the delay. A simple comment-to-DM flow takes five to ten minutes. Multi-step conversations go in the chatbot module and can be built after the basic automations are running.",
                },
                {
                  step: "4",
                  title: "Run both tools in parallel for one week",
                  body: "Keep Chatfuel running while you test Liffio on a lower-traffic post. Confirm that DMs are being sent, delays are working, and public comment replies are posting correctly. Watch for duplicate DMs during the parallel period: if both tools fire on the same comment simultaneously, the commenter can receive two messages. Once Liffio is confirmed working, move to the final step.",
                },
                {
                  step: "5",
                  title: "Disable Chatfuel's Instagram flows and revoke access",
                  body: "Pause your active Chatfuel Instagram flows. Then go to Instagram Settings → Apps and Websites and revoke Chatfuel's access token. Cancel your Chatfuel subscription from their billing settings. Keep the Chatfuel account for a short period if you have Facebook Messenger or WhatsApp automations you are not migrating, because Liffio is Instagram-only.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f5184c] text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Estimated migration time: 1 to 3 hours depending on the number of active Instagram flows.
              Creators with simple comment-to-DM setups will be done in under an hour.
            </p>
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
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#fff7f7] border-t border-[#ffe4e6] text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Start free, with no conversations to count
            </h2>
            <p className="text-gray-600 mb-8">
              Flat-rate Instagram DM automation with a free plan that runs in production.
              No credit card, no conversation quotas, no trial countdown.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="inline-flex rounded-xl px-10 py-4 text-base font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
            >
              Get Started Free
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Free plan, no expiry · No credit card required · Setup takes under 5 minutes
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
