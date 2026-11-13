import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { FaqCategory } from "@/config/faq.config";

export const metadata: Metadata = buildPageMetadata({
  title: "SendDM Alternative: Flat Pricing, Unlimited DMs | Liffio",
  description:
    "Moving off SendDM? Liffio runs comment-to-DM with flat pricing, a free plan with no credit card, and unlimited automated DMs on every plan.",
  pathname: "/senddm-alternative",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "senddm-alt",
    label: "SendDM alternative FAQ",
    items: [
        {
          id: "is-it-safe",
          question: "Is it safe to connect my Instagram account?",
          answer:
            "Liffio connects through the official Instagram API using Instagram Login: you approve the permissions on Instagram's own consent screen, no password is shared, and you can revoke access from Instagram at any time. Liffio's business is Meta-verified as a Tech Provider and its Instagram permissions passed Meta's App Review. Any tool running on the official API needs both, so treat this as the baseline to check for rather than a point of difference. The question worth asking about any Instagram tool is whether it uses the official API at all, or signs in as you and drives the app in a browser.",
        },
      {
        id: "liffio-vs-senddm",
        question: "How does Liffio compare to SendDM?",
        answer:
          "Both tools handle comment-to-DM automation on Instagram, both publish prices in rupees and dollars, and both lift the DM cap on their paid plans. So the dividing line is scope and billing, not DM volume. As of November 2026, SendDM's pricing page (https://senddm.ai/pricing) shows Creator at ₹399/month in India, or $9/month internationally, both on annual billing; Growth at ₹719 or $16; Scale at ₹1,439 or $31. Liffio's Starter is ₹499/month in India, or $9/month internationally. Only SendDM's Free plan is capped, at 300 automated DMs a month; its paid tiers are unlimited, as are all of Liffio's including Free. What actually differs: Liffio runs chatbots as their own module for full DM conversations, bills from an Indian entity with a GST invoice, and gives each Instagram account its own workspace, with 20 workspaces bundled into the Agency plan on one flat subscription. If you want chatbots and a GST invoice alongside comment-to-DM, Liffio is the more straightforward choice; if you only need comment triggers, the two are closer than the price tags suggest.",
      },
      {
        id: "senddm-free-plan",
        question: "Does SendDM have a free plan?",
        answer:
          "Yes. As of November 2026, SendDM's free plan is ₹0 in India or $0 internationally, capped at 300 automated DMs a month, with 1 Instagram account, 3 message templates, basic keyword triggers, 1 conversation starter, 5 links in bio, 5 scheduled posts a month and 2 story mention replies (https://senddm.ai/pricing). Its cheapest paid tier is Creator at ₹399/month in India, or $9/month internationally, both on annual billing (₹499 or $11 month to month), and that tier lifts the DM cap entirely. Liffio's free plan includes comment-to-DM automation on posts and Reels, 2 live chatbots, a bio link page at bio.liffio.com and overview analytics. No credit card is required and there is no trial period that expires. The difference on the free tiers is the DM ceiling: Liffio sends unlimited automated DMs on every plan, Free included, so you can run a real automation on a real post before paying anything. Liffio's paid plans start at ₹499/month in India, or $9/month internationally.",
      },
      {
        id: "switch-from-senddm",
        question: "How long does it take to switch from SendDM to Liffio?",
        answer:
          "Most creators switch in under two hours. The process is: document your active SendDM automations (trigger keywords, DM copy, which posts they are attached to), create a Liffio account, connect Instagram through Instagram Login, and recreate each automation in Liffio. Liffio's comment-to-DM setup takes five to ten minutes per automation. Once your automations are running in Liffio, run both tools in parallel for a short period to verify delivery before disabling SendDM and revoking its Instagram access.",
      },
      {
        id: "senddm-instagram-api",
        question: "Does Liffio use official Instagram APIs like SendDM?",
        answer:
          "Yes. Liffio connects to Instagram through Instagram's official login flow and sends messages through Instagram's official API. Your Instagram password is never entered into Liffio at any point: you approve the permissions on Instagram's consent screen when you connect, and you can revoke access anytime from your Instagram settings. Liffio also spaces automated sends with a configurable 10 to 60 second delay, which keeps the reply pacing natural for the person receiving it.",
      },
      {
        id: "senddm-agency",
        question: "Can I use Liffio for multiple client Instagram accounts?",
        answer:
          "Yes, through workspaces. A Liffio workspace connects exactly one Instagram account, so several client accounts means several workspaces. The Agency plan includes 20 workspaces on a single subscription, each one a full Business workspace, billed on one invoice with one renewal date. There is no per-account surcharge within that allowance. Worth being straight about the comparison: SendDM bundles connected accounts into its tiers instead, with 5 on Creator, 10 on Growth and 20 on Scale as of November 2026 (https://senddm.ai/pricing), and on headline price alone that is the cheaper way to attach a lot of accounts. What a Liffio workspace gives you per account is isolation plus the full Business feature set, chatbots included, and a GST invoice from an Indian entity. Price the two against the features you actually bill clients for.",
      },
    ],
  },
];

// Rows reflect https://senddm.ai/pricing, verified 2026-11-13 in both regions
// (curl for the international view, an India-geolocated browser for the rupee
// view). SendDM publishes a rupee price list, carries links in bio and post
// scheduling on every tier including Free, and bundles connected accounts into
// its paid tiers. None of those may be marked as a competitor "false".
const sendDmRows = [
  { name: "Comment-to-DM", liffio: true, competitor: true },
  { name: "Story auto reply", liffio: true, competitor: true },
  // SendDM's PAID tiers have unlimited DMs. Only its Free plan is capped, at
  // 300 a month. Unlimited DMs is therefore NOT a Liffio-only advantage here:
  // the only gap is on the free tier.
  { name: "Unlimited DMs on paid plans", liffio: true, competitor: true },
  { name: "Unlimited DMs on the free plan", liffio: true, competitor: "300 DMs/month" },
  { name: "Free plan", liffio: true, competitor: true },
  { name: "Instagram accounts per subscription", liffio: "1 per workspace (Agency: 20)", competitor: "1 free, 5 / 10 / 20 on paid tiers" },
  { name: "Bio link pages", liffio: true, competitor: true },
  { name: "Post scheduler", liffio: true, competitor: true },
  { name: "Lead capture", liffio: true, competitor: true },
  // Both vendors publish a rupee price list, so this row is a true for both.
  // SendDM's payment rails and invoicing entity are not stated on its pricing
  // page, so the GST row below reads "Not stated", never a negative.
  { name: "Rupee price list for India", liffio: true, competitor: true },
  { name: "GST invoice from an Indian entity", liffio: true, competitor: "Not stated" },
  { name: "Public pricing page", liffio: true, competitor: true },
  { name: "Chatbots for full DM conversations", liffio: true, competitor: "Check their plans" },
  { name: "Chatbots separate from comment to DM", liffio: true, competitor: "Check their plans" },
  { name: "Live chatbots on the free plan", liffio: "2", competitor: "Check their plans" },
  { name: "Chatbot questions, conditions and media", liffio: "Starter and up", competitor: "Check their plans" },
  { name: "Ice breakers and story triggers", liffio: "Growth and up", competitor: "Check their plans" },
  { name: "Chatbot lead capture and webhook step", liffio: "Business and Agency", competitor: "Check their plans" },
];

// Competitor pricing below was read from each vendor's own live pricing page on
// 2026-11-13. Refresh it from these same URLs, never from memory or from an
// article, and keep the "as of November 2026" note in the visible copy:
//   SendDM    https://senddm.ai/pricing
//   ManyChat  https://manychat.com/pricing  (blocks automated fetching, see below)
//   LinkDM    https://www.linkdm.com/pricing
//
// 🔴 READ THIS BEFORE REFRESHING ANY FIGURE BELOW. Vendor pricing pages
// geo-localize. A curl result shows the vendor's DEFAULT or US view and is not
// evidence about what an Indian customer sees. Currency and regional claims
// must be read in a browser located in the relevant region. An earlier pass
// read senddm.ai/pricing with curl, saw dollars, and wrote "USD only, no rupee
// pricing" across this site. That was false and has been removed. Do not
// reintroduce it.
//
// SENDDM, https://senddm.ai/pricing, verified 2026-11-13 in BOTH views: curl
// for the international rate card, an India-geolocated browser for the rupee
// rate card. Tier names are identical in both regions.
//   India, annual per month / monthly / billed yearly:
//     Free     ₹0
//     Creator  ₹399   / ₹499   / ₹4,790
//     Growth   ₹719   / ₹899   / ₹8,630
//     Scale    ₹1,439 / ₹1,799 / ₹17,270
//     Custom   quote
//   International, annual per month / monthly / billed yearly:
//     Free     $0
//     Creator  $9  / $11 / $105.60
//     Growth   $16 / $20 / $192
//     Scale    $31 / $39 / $374
//     Custom   quote
//   Monthly/annual toggle, annual marked "20% off" with a yearly total shown.
//   Free limits, all per month: 300 DMs, 1 Instagram account, 3 message
//   templates, basic keyword triggers, 1 conversation starter, 5 links in bio,
//   5 scheduled posts, 2 story mention replies.
//   Creator: UNLIMITED DMs, 5 accounts, 2,000 AI credits/month, unlimited
//   templates, advanced triggers, Rewind, analytics.
//   Growth: 10 accounts, 10,000 AI credits, WhatsApp/Email redirect, priority
//   support. Scale: 20 accounts, 25,000 AI credits.
//   🔴 Every PAID tier has unlimited DMs. Only Free is capped at 300. Never
//   write or imply that unlimited DMs is a Liffio-only advantage over SendDM.
//   🔴 SendDM genuinely discounts India: ₹399 is roughly $4.75 against its own
//   $9 international price. That is a real, sourced observation. Keep it.
//   The page displays a "Verified Tech Provider" badge.
//   🚩 Payment rails and the invoicing entity are NOT stated on the page, so
//   describe GST invoicing as not stated, never as absent.
const competitorPricing = [
  { name: "Liffio", free: true, paidFrom: "₹499/month in India, $9/month internationally", perContact: false, publicPricing: true },
  { name: "SendDM", free: true, paidFrom: "₹399/month in India, $9/month internationally (annual billing; ₹499 or $11 monthly)", perContact: false, publicPricing: true },
  // MANYCHAT, read from https://manychat.com/pricing, verified 2026-11-13 in a
  // real browser.
  // 🚩 manychat.com blocks automated fetching: a domain-wide Cloudflare bot
  // check returns HTTP 403 to curl, to WebFetch and to headless engines, and the
  // interstitial clears after about 8 seconds in a real browser. Refresh these
  // figures in a real browser, never with curl, and do not swap them back for a
  // placeholder because an automated fetch failed. The prices ARE public.
  // Monthly, then annual, then active-contact cap / channels / users:
  //   Free       $0                               25 / 2 / 1
  //   Essential  $14/mo   $168/yr   (18% off)    250 / 2 / 2
  //   Pro        $29/mo   $348/yr   (25% off)  2,500 / 3 / 3
  //   Business   $69/mo   $828/yr   (30% off)  7,500 / unlimited / 5
  //   Advanced   $139/mo  $1,668/yr           25,000 / unlimited / 10
  // Billing unit is the Active Contact: one real person interacted with in a
  // monthly billing period, counted once for the month. Over the cap, automations
  // keep running and ManyChat charges a small overage fee per extra Active
  // Contact; annual plans still count contacts monthly and bill overages monthly.
  // Free needs no card, carries Manychat branding and allows up to 4 live
  // triggers. 14-day free trial on Essential or Pro. Prices exclude tax.
  // 🔴 USD only, no INR: /pricing?country=IN still showed $29/mo with no rupee
  // symbol. Say "its pricing page shows USD only", never "bills Indian users in
  // USD".
  { name: "ManyChat", free: true, paidFrom: "$14/month (Essential, 250 contacts)", perContact: true, publicPricing: true },
  // Verified 2026-11-13: Pro $19/month, or $182/year. Pricing IS public, which the
  // previous publicPricing:false contradicted while still printing a price.
  { name: "LinkDM", free: true, paidFrom: "$19/month (Pro)", perContact: false, publicPricing: true },
];

export default function SendDMAlternativePage() {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "SendDM Alternative", item: `${SITE_URL}/senddm-alternative` },
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
                { label: "SendDM Alternative", href: "/senddm-alternative" },
              ]}
            />
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              The Best SendDM Alternative for Instagram DM Automation
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              SendDM handles the basics well, and its free plan stops at 300 DMs a month.
              Liffio runs the same Instagram DM automation with no DM ceiling on any plan,
              Free included, chatbots as their own module, and a GST invoice from an Indian
              entity. Both tools publish rupee and dollar prices.
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

        {/* Why creators leave SendDM */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Why creators look for a SendDM alternative
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                SendDM does what it says: it automates Instagram DMs triggered by comments and
                story replies. For a tool that covers a specific workflow, it works, and it is
                priced properly for India. The friction starts on the free plan, or when you
                need full DM conversations rather than single-trigger replies.
              </p>
              <p>
                The complaint we hear most from creators looking to switch is the free-plan cap.{" "}
                <a
                  href="https://senddm.ai/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  SendDM&apos;s free plan, as of November 2026
                </a>
                , caps you at 300 automated DMs a month, along with 1 Instagram account, 3
                message templates, 1 conversation starter, 5 links in bio, 5 scheduled posts and
                2 story mention replies. A cap of 300 runs out on exactly the post you want it to
                work on, namely the one that takes off. Clearing it means moving to the Creator
                tier at ₹399/month in India, or $9/month internationally, both on annual billing
                (₹499 or $11 month to month). Be clear on what that buys: SendDM&apos;s paid
                tiers do have unlimited DMs, so the ceiling is a free-plan problem, not a SendDM
                problem. Liffio has no DM ceiling on any plan, Free included, which is why you
                can prove the workflow before paying.
              </p>
              <p>
                The second issue is what happens after the first message. SendDM covers
                single-trigger DM sequences and comment triggers, and it carries links in bio and
                post scheduling on every tier including Free. Its pricing page does not break out
                a chatbot tier, so check their plans if full back-and-forth DM conversations
                matter to you. Liffio keeps comment-to-DM simple and puts conversations in their
                own chatbot module, with 2 live chatbots on the free plan, so a simple automation
                never has to go through a flow builder.
              </p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex gap-3">
                  <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">300 DMs a month on the free plan:</strong> that is SendDM&apos;s free cap as of November 2026, alongside 1 Instagram account, 3 message templates and 1 conversation starter. Its paid tiers lift the cap entirely. Liffio&apos;s free plan runs real automations in production (comment triggers, 2 live chatbots and a bio link page) with no credit card required, and unlimited automated DMs come with every plan, Free included.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">GST invoicing is the India gap, not the currency:</strong> both tools publish rupee prices as of November 2026, and SendDM&apos;s rupee rate card is genuinely discounted rather than converted. SendDM&apos;s pricing page does not state who invoices you or on what rails. Liffio bills in INR through Razorpay from an Indian entity with a GST-compliant tax invoice, which is what a GST-registered business needs to claim input credit.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5184c] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">Conversations, not just triggers:</strong> SendDM covers DM sequences, comment triggers, links in bio and post scheduling. Liffio puts all of that in one workspace and adds chatbots as their own module for full DM conversations, with 2 live chatbots on the free plan.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section id="comparison" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Liffio vs SendDM: side-by-side comparison
            </h2>
            <p className="text-gray-600 mb-8">
              Feature-level comparison for Instagram DM automation.{" "}
              <a href="/blog/manychat-alternatives" className="text-[#b20d8f] font-semibold hover:underline">
                See the full Instagram automation alternatives guide →
              </a>
            </p>
            <ComparisonTable competitorName="SendDM" rows={sendDmRows} />
          </div>
        </section>

        {/* Pricing comparison */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Pricing comparison: Liffio vs SendDM vs alternatives
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tool</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Free plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid from</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Per-contact fees</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Public pricing</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorPricing.map((tool, i) => (
                    <tr key={tool.name} className={`border-b border-gray-100 ${i === 0 ? "bg-[#fff7f7]" : ""}`}>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {i === 0 ? <span className="text-[#f5184c]">{tool.name} ★</span> : tool.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tool.free ? "✓ Yes" : "✗ No"}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.paidFrom}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.perContact ? "Yes, scales with contacts" : "No, flat pricing"}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.publicPricing ? "✓ Yes" : "✗ No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Both tools publish two rate cards, one in rupees and one in dollars, so the
                comparison is like for like in either currency.{" "}
                <a
                  href="https://senddm.ai/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  SendDM&apos;s pricing page, as of November 2026
                </a>
                , geo-localizes and runs a monthly/annual toggle with annual marked 20% off. The
                tier names are the same in both regions. Free is ₹0 or $0. Creator is ₹399/month
                in India, or $9/month internationally, both on annual billing (₹4,790 or $105.60
                billed yearly), and ₹499 or $11 month to month. Growth is ₹719 or $16 annual,
                ₹899 or $20 monthly. Scale is ₹1,439 or $31 annual, ₹1,799 or $39 monthly. Above
                that is a Custom quote. Only the free plan is capped, at 300 automated DMs a
                month; every paid tier is unlimited. Connected accounts are bundled into the
                tiers: 1 on Free, then 5, 10 and 20.
              </p>
              <p>
                Worth saying plainly, because it cuts against us: SendDM&apos;s rupee card is a
                real India discount, not a conversion. ₹399 works out to roughly $4.75 against
                its own $9 international price.
              </p>
              <p>
                The two $9 figures are also not the same deal, and the difference is not DM
                limits, because both tools send unlimited DMs on paid plans. Liffio&apos;s Starter
                is $9/month, or ₹499/month in India, charged month to month. SendDM&apos;s $9 is
                the annual-billing rate on Creator, paid a year up front at $105.60; month to
                month that tier is $11. What the Liffio plan adds at that price is chatbots as a
                separate module, a workspace per Instagram account, and a GST invoice from an
                Indian entity. What the SendDM plan adds is 5 connected accounts and 2,000 AI
                credits a month.
              </p>
              <p>
                Liffio charges a flat monthly rate: Free at $0 or ₹0, Starter $9 or ₹499, Growth
                $29 or ₹1,499, Business $59 or ₹2,499, Agency $549 or ₹22,999, all as of November
                2026. No per-contact charges. No usage-based tiers that kick in when a post goes
                viral and your DM volume spikes. The same flat rate whether you send 200 DMs in a
                month or 20,000.
              </p>
              <p>
                ManyChat is in the comparison because it is the most common starting point for
                Instagram DM automation, and it prices on a different axis from either of the
                other two.{" "}
                <a
                  href="https://manychat.com/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  Its pricing page, as of November 2026
                </a>
                , bills by Active Contact: a free plan at $0 for 25 active contacts, then
                Essential at $14/month for 250 contacts, Pro at $29/month for 2,500, Business at
                $69/month for 7,500, and Advanced at $139/month for 25,000. Clear the cap and
                automations keep running, with a small overage fee per additional Active Contact.
                Those bottom two caps are the part to price honestly: 25 people on Free and 250 on
                the $14 plan go quickly when comment-to-DM is running on a Reel that works. The
                page shows US dollars only and publishes no rupee price.{" "}
                <a
                  href="https://www.linkdm.com/pricing"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-[#b20d8f] font-semibold hover:underline"
                >
                  LinkDM
                </a>{" "}
                is narrower, focused on comment-to-link automation, with Pro at $19/month as of
                November 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-10" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Who switches from SendDM to Liffio
            </h2>
            <div className="space-y-10">

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Creators who want to try before paying
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The most common reason creators move from SendDM to Liffio is what the free
                  plan lets you prove. Liffio&apos;s free plan runs comment-to-DM on posts and
                  Reels and 2 live chatbots, with unlimited automated DMs, so you can set up a
                  real automation on a real post and see it work before entering a payment
                  method. For creators who are new to DM automation or who want to
                  validate the workflow before committing to monthly spend, that matters.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Indian creators and agencies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Both tools have a rupee price, so currency is not the decision here.{" "}
                  <a
                    href="https://senddm.ai/pricing"
                    target="_blank"
                    rel="noopener nofollow"
                    className="text-[#b20d8f] font-semibold hover:underline"
                  >
                    SendDM&apos;s pricing page, as of November 2026
                  </a>
                  , geo-localizes: loaded in India it shows Creator at ₹399/month on annual
                  billing against $9/month internationally, which is a genuine India discount
                  rather than a straight conversion. Credit where it is due.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  What is left to compare is the invoice and the scope. SendDM&apos;s pricing page
                  does not state which entity bills you or on what rails. Liffio charges in INR
                  through Razorpay from an Indian entity and issues a GST-compliant tax invoice,
                  which is what you need to claim input credit rather than treating the
                  subscription as an import of service. Starter is ₹499/month incl. GST, or
                  $9/month internationally. Business is ₹2,499/month incl. GST, or $59/month,
                  and adds chatbot lead capture, the webhook step and unlimited live chatbots.
                  Every plan sends unlimited automated DMs, Free included.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Agencies managing multiple client accounts
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Liffio's Agency plan is a flat ₹22,999/month incl. GST in India, or $549/month
                  internationally, as of November 2026, and includes 20 workspaces on a single
                  subscription: one Instagram account each, every workspace a full Business
                  workspace, one invoice and one renewal date. There is no per-account surcharge
                  within that allowance. The honest comparison: SendDM&apos;s Scale tier also
                  covers 20 accounts, at ₹1,439/month in India or $31/month internationally on
                  annual billing, so if account count is all you are buying, SendDM is cheaper.
                  Liffio&apos;s Agency plan is priced for agencies that need each client isolated
                  in its own workspace with the full Business feature set, chatbots included, on
                  one GST invoice.
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
                Yes. Liffio connects through Meta&apos;s official OAuth flow, the same mechanism
                used by every compliant Instagram tool. You see Instagram's own login screen,
                approve the permissions, and Meta issues an access token directly to Liffio.
                Your Instagram password is never shared with Liffio at any point.
              </p>
              <p>
                The permissions Liffio uses are the ones you approve on Meta&apos;s consent screen
                when you connect. Every permission is visible before you approve, and you can
                revoke access at any time from your Instagram settings.
              </p>
              <p>
                On the send-behavior side, Liffio uses a configurable 10 to 60 second delay between
                trigger and send. The pause gives each automated reply a natural conversation
                pace for the recipient, whether a Reel gets fifty comments or several thousand.
              </p>
              <p>
                The risk profile with unofficial tools, ones that use browser automation,
                session cookie hijacking, or that ask for your Instagram password directly,
                is meaningfully higher. Liffio does not use any unofficial access methods.
              </p>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to migrate from SendDM to Liffio (under 2 hours)
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "List your active SendDM automations",
                  body: "Before making any changes, write down every active automation: the trigger keyword, the delay setting, the DM text, any public comment reply text, and which posts or story types the automation covers. For most creators this takes 15 to 20 minutes. Do this before touching anything, because recreating from memory is slower and error-prone.",
                },
                {
                  step: "2",
                  title: "Create a Liffio account and connect Instagram",
                  body: "Sign up at app.liffio.com. No credit card is required on the free plan. Connect your Instagram account through Instagram Login. The connection takes about two minutes. If you manage multiple Instagram accounts, note that each one runs in its own workspace, and the Agency plan bundles 20 workspaces into a single subscription.",
                },
                {
                  step: "3",
                  title: "Recreate your automations in Liffio",
                  body: "Start with your highest-traffic automation, usually the comment-to-DM flow on your most active post or Reel. In Liffio, create a Comment automation, select the post, enter the trigger keyword, write the DM text, and set the delay. Most simple comment-to-DM automations take five to ten minutes each to set up.",
                },
                {
                  step: "4",
                  title: "Run both in parallel for a few days",
                  body: "Do not disable SendDM immediately. Run both tools on a lower-traffic post for three to five days to confirm that Liffio's automations fire correctly. Watch for duplicate DMs during the overlap: if both tools trigger simultaneously on the same comment, the same person could receive two messages. Once you have confirmed Liffio is working, move to the final step.",
                },
                {
                  step: "5",
                  title: "Disable SendDM and revoke its Instagram access",
                  body: "Turn off your SendDM automations. Then go to Instagram Settings → Apps and Websites and revoke SendDM's access token. This removes its ability to send messages on your behalf. Cancel your SendDM subscription from their billing settings.",
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
              Estimated migration time: 1 to 2 hours for a typical setup with 3 to 5 active automations.
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
              Start free and see for yourself
            </h2>
            <p className="text-gray-600 mb-8">
              Set up your first comment-to-DM automation in under five minutes.
              Free plan, no credit card, no trial countdown.
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
