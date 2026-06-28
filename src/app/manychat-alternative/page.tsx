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
  title: "Best ManyChat Alternative for Instagram (2026) — Liffio",
  description:
    "Compare Liffio vs ManyChat, SendDM, LinkDM, and SuperProfile. Feature table, pricing comparison, migration guide, and FAQ. Free plan, no per-contact fees.",
  pathname: "/manychat-alternative",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "manychat-alt",
    label: "ManyChat alternative FAQ",
    items: [
      {
        id: "is-liffio-better",
        question: "Is Liffio better than ManyChat for Instagram?",
        answer:
          "For Instagram-only DM automation, Liffio is the better choice for most creators and small agencies. Liffio is built specifically for Instagram and includes unlimited automated DMs on every plan — including the free tier — with no per-contact pricing. ManyChat is a strong choice if you need multi-channel automation across Facebook Messenger, WhatsApp, and Instagram simultaneously. If Instagram is your only channel, you end up paying for infrastructure you don't use. Liffio also includes post scheduling, bio links (bio.liffio.com), and short links (go.liffio.com) in the same workspace, which replaces two or three separate tools most creators pay for.",
      },
      {
        id: "does-liffio-work-with-reels",
        question: "Does Liffio work with Instagram Reels?",
        answer:
          "Yes. Comment-to-DM automation works on both feed posts and Reels. When someone comments a keyword on your Reel, Liffio sends the automated DM after your chosen delay — whether that Reel gets 50 comments or 50,000. Story reply automation works when someone replies to a Story you have published, including Stories that promote a Reel. Live reply automation works during active Instagram Live sessions. All three are available on paid plans. Comment-to-DM on feed posts and Reels is available on the free plan.",
      },
      {
        id: "run-both",
        question: "Can I run both Liffio and ManyChat at the same time?",
        answer:
          "Yes, technically — both tools can be connected to the same Instagram account simultaneously because they both use the official Instagram API. Running both in parallel for a short migration window (five to seven days) is the recommended approach before you cut over entirely. During that period, run your main comment-to-DM flow only in Liffio and keep ManyChat for any automations you have not yet recreated. The risk of running both permanently is duplicate DMs: if the same trigger fires in both tools at the same time, the same person gets two identical messages. That is worth avoiding once migration is complete.",
      },
      {
        id: "free-trial",
        question: "Does Liffio have a free trial?",
        answer:
          "Liffio has a free plan, not a time-limited free trial. There is no credit card required and no trial period that expires. The free plan includes unlimited Instagram accounts, unlimited automated DMs, comment keyword triggers on posts and Reels, public comment auto-replies, a bio link page at bio.liffio.com, and basic analytics. It is intended to run in production — not as a demo that locks you out after 14 days. If you outgrow the free plan's single flow and 3 message templates, paid plans start at $9/month.",
      },
      {
        id: "manychat-flows-switch",
        question: "What happens to my ManyChat flows if I switch to Liffio?",
        answer:
          "ManyChat does not offer a flow export that Liffio can import directly. Migration is manual: screenshot or document each active ManyChat automation (trigger keyword, delay setting, DM text, public comment reply text), then recreate each one in Liffio. For a typical creator with three to five active automations, this takes one to two hours. Agencies with ten or more flows should budget a half day. Start with your highest-revenue automation — usually the comment-to-DM flow on your most recent or most active Reel. Run both tools in parallel for a short period on a smaller post before migrating the big campaigns.",
      },
    ],
  },
];

const competitorPricing = [
  { name: "Liffio", free: true, startingPrice: "$0/month", paidFrom: "$9/month", perContact: false, instagramOnly: true },
  { name: "ManyChat", free: true, startingPrice: "Free tier limited", paidFrom: "$15/month", perContact: true, instagramOnly: false },
  { name: "SendDM", free: false, startingPrice: "No free plan", paidFrom: "Pricing on request", perContact: false, instagramOnly: true },
  { name: "LinkDM", free: false, startingPrice: "No free plan", paidFrom: "From ~$19/month", perContact: false, instagramOnly: true },
  { name: "SuperProfile", free: true, startingPrice: "Free tier available", paidFrom: "From ~$15/month", perContact: false, instagramOnly: false },
];

export default function ManyChatAlternativePage() {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "ManyChat Alternative", item: `${SITE_URL}/manychat-alternative` },
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
                { label: "ManyChat Alternative", href: "/manychat-alternative" },
              ]}
            />
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              The Best ManyChat Alternative for Instagram DM Automation
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              ManyChat popularised comment-to-DM — but growing creators need unlimited messages, simpler
              pricing, and tools built only for Instagram. Liffio delivers all three, with a free plan
              that actually works in production.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={siteConfig.urls.appSignup}
                className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
              >
                Get Started Free
              </a>
              <a
                href="#comparison"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#7c5af3] hover:text-[#7c5af3] transition-colors"
              >
                See full comparison ↓
              </a>
            </div>
          </div>
        </section>

        {/* Why creators leave ManyChat */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Why Instagram creators are leaving ManyChat
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                ManyChat is the most recognized name in comment-to-DM automation, and for good reason —
                they popularized the workflow and have a large template library. But the product is built
                for marketers running multi-channel campaigns across Instagram, Facebook Messenger, and
                WhatsApp simultaneously. If Instagram comments and DMs are ninety percent of your
                automation workflow, you end up paying for infrastructure you never open.
              </p>
              <p>
                The complaints we hear most often from creators switching away from ManyChat are not
                about missing features. They are about contact-based pricing that scales unexpectedly
                when a Reel goes viral, a flow builder that takes an afternoon to learn just for a
                simple comment trigger, and paying for multi-channel capabilities when all they need
                is reliable Instagram automation at a sane price.
              </p>
              <p>
                A creator running comment-to-DM on three Reels per week does not need a general
                chatbot platform. They need reliable keyword triggers, clean analytics, flat pricing,
                and the ability to connect as many Instagram accounts as they manage without an
                extra line item per account.
              </p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex gap-3">
                  <span className="text-[#7c5af3] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">Per-contact pricing:</strong> ManyChat charges based on your total contact count. A single viral Reel can push you into a higher tier before you have time to review the bill.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7c5af3] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">Multi-channel complexity:</strong> ManyChat's flow builder is optimized for Messenger bots. Instagram-only workflows require navigating features designed for different platforms.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7c5af3] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">No INR billing:</strong> Indian creators pay in USD via international processing fees. Liffio offers native INR billing through Razorpay with GST-friendly invoices.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section id="comparison" className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Liffio vs ManyChat — side-by-side comparison
            </h2>
            <p className="text-gray-600 mb-8">
              Compare comment-to-DM, pricing model, and platform extras.{" "}
              <a href="/blog/manychat-alternatives" className="text-[#4259f0] font-semibold hover:underline">
                Read the full alternatives guide →
              </a>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Also comparing:{" "}
              <a href="/senddm-alternative" className="text-[#4259f0] hover:underline">Liffio vs SendDM</a>
              {" · "}
              <a href="/chatfuel-alternative" className="text-[#4259f0] hover:underline">Liffio vs Chatfuel</a>
            </p>
            <ComparisonTable competitorName="ManyChat" />
          </div>
        </section>

        {/* Pricing comparison */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Pricing comparison: Liffio vs ManyChat vs alternatives
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tool</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Free plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid from</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Per-contact fees</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Instagram-only</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorPricing.map((tool, i) => (
                    <tr key={tool.name} className={`border-b border-gray-100 ${i === 0 ? "bg-[#faf8ff]" : ""}`}>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {i === 0 ? <span className="text-[#7c5af3]">{tool.name} ★</span> : tool.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tool.free ? "✓ Yes" : "✗ No"}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.paidFrom}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.perContact ? "Yes — scales with contacts" : "No — flat pricing"}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.instagramOnly ? "Yes" : "No — multi-channel"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                The structural difference between Liffio and ManyChat on pricing is not just the
                starting number — it is the pricing model. ManyChat charges based on your total contact
                count. At 1,000 contacts the price is manageable; at 10,000 contacts the bill is
                meaningfully higher, and you hit 10,000 contacts faster than you expect when
                comment-to-DM automation is running on active Reels.
              </p>
              <p>
                Liffio charges a flat monthly rate regardless of how many automated DMs you send or
                how many contacts you accumulate. The $9/month Starter plan covers unlimited DMs
                whether you are sending to 500 people or 50,000. That predictability matters when
                you are scaling a launch campaign and cannot afford a surprise overage charge.
              </p>
              <p>
                SendDM and LinkDM are simpler tools with focused feature sets. Neither has
                transparent public pricing at the time of writing. SuperProfile bundles a bio-link
                storefront with its automation product — useful if the link-in-bio is your primary
                need, but heavier than necessary if DM automation is the priority.
              </p>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-10" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Who uses Liffio as a ManyChat alternative
            </h2>
            <div className="space-y-10">

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Creators with 5K–100K followers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This is the core use case. A creator posts a Reel about a digital product, coaching
                  program, or giveaway and tells viewers to comment a keyword to get the link, discount
                  code, or guide. Liffio sends the DM automatically to every person who comments that
                  keyword — whether the post gets 30 comments or 3,000. The free plan handles
                  comment-to-DM on posts and Reels with unlimited DMs, which is enough for most
                  creators to test and prove out the workflow before paying anything.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Common automations in this segment: comment-to-DM for lead magnets and freebie
                  downloads, story reply sequences for limited-time offers, and welcome DMs for
                  new followers linked to an onboarding sequence.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  DTC and product brands
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Direct-to-consumer brands use comment-to-DM during product launches and
                  restocks. When a brand posts a new product announcement with a keyword
                  trigger, interested commenters receive a DM with a direct product link or
                  a limited-time discount code that expires in 24 hours. The automation
                  captures purchase intent at peak engagement — at the moment someone is watching
                  the post — rather than hoping they navigate to a bio link later.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Liffio's analytics track the full comment-to-DM-to-click chain, which gives
                  DTC teams a clear signal on which posts convert to link clicks and which posts
                  generate engagement without purchase intent. The Business plan adds
                  conversion analytics that ties comment volume to downstream actions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Social media agencies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Agencies managing multiple client Instagram accounts use Liffio's Agency plan,
                  which includes white-label workspaces and client sub-workspaces with restricted
                  CLIENT role access. Each client sees only their own account and automations.
                  The agency team manages everything from a single dashboard. There is no per-account
                  surcharge — unlimited Instagram accounts is included at every plan tier.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  For agencies coming from ManyChat, the migration path is straightforward: recreate
                  the active automations for your highest-value clients first, run both tools in
                  parallel for one campaign cycle, then cut over. Agencies with INR-billing clients
                  in India benefit from Liffio's native Razorpay integration and GST invoicing.
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
                Yes — and the reason is the connection method. Liffio connects to your Instagram
                account through Meta&apos;s official OAuth flow, the same authorization mechanism used by
                major social media management tools. You see a standard Meta login screen, you
                approve the requested permissions, and Meta issues an access token directly to
                Liffio. Your Instagram password is never entered into Liffio at any point.
              </p>
              <p>
                The permissions Liffio requests are the same ones Meta requires for messaging
                automation: <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">instagram_manage_messages</code>,{" "}
                <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">pages_messaging</code>, and the standard
                read permissions for comments and stories. Liffio went through Meta&apos;s App Review
                process to receive these permissions — the same process that every compliant
                Instagram automation tool must pass.
              </p>
              <p>
                The other safety factor is send behavior. Instagram&apos;s spam detection looks for
                patterns — identical messages sent at exactly the same timestamp, very high burst
                volume from a single account in a short window, and zero variation in send timing.
                Liffio introduces a configurable 10–60 second delay between trigger and send, which
                distributes DM volume naturally over time. At normal creator usage levels — even
                during a viral Reel with thousands of comments — the send pattern does not trigger
                spam detection.
              </p>
              <p>
                The contrast is with tools that use unofficial access methods: browser automation,
                session cookie hijacking, or apps that ask for your Instagram password directly.
                Those tools work outside Meta&apos;s permitted use guidelines and carry real account
                suspension risk. Liffio does not use any unofficial methods.
              </p>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to migrate from ManyChat to Liffio (about 2 hours)
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Document your active ManyChat automations",
                  body: "Before touching anything, screenshot or write down every active automation: the trigger keyword, the delay setting, the DM text, any public comment reply text, and which posts the automation is running on. This takes 15–30 minutes depending on how many active flows you have. Do not skip this step — recreating from memory is slower than recreating from notes.",
                },
                {
                  step: "2",
                  title: "Sign up for Liffio and connect Instagram",
                  body: "Create a Liffio account at app.liffio.com and connect your Instagram account through the Meta OAuth flow. The connection takes about two minutes. If you manage multiple Instagram accounts, connect them all at this stage — all plans include unlimited accounts at no extra cost.",
                },
                {
                  step: "3",
                  title: "Recreate your automations in Liffio",
                  body: "Start with your highest-revenue automation — usually the comment-to-DM flow on your most active Reel. Create a Comment automation, select the post, enter the trigger keyword, write the DM text, and set the delay. The flow builder is designed for simple keyword-to-DM workflows, so most comment automations can be recreated in five to ten minutes each.",
                },
                {
                  step: "4",
                  title: "Run both tools in parallel for one week",
                  body: "Do not disconnect ManyChat immediately. Run both tools on a smaller post for five to seven days while you verify that Liffio's automations are firing correctly. Check that DMs are being delivered, the delay is working, and public comment replies are posting. Watch for duplicate DMs during the overlap period — if the same trigger fires in both tools simultaneously, the same person can receive two messages.",
                },
                {
                  step: "5",
                  title: "Cut over and revoke ManyChat permissions",
                  body: "Once you have confirmed that Liffio is running reliably, disable your ManyChat automations. Then go to Instagram Settings → Apps and Websites and revoke ManyChat's access token. This ensures ManyChat no longer has permissions to send messages on your behalf. Cancel your ManyChat subscription from your billing settings.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7c5af3] text-white flex items-center justify-center text-sm font-bold">
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
              Estimated migration time: 1–2 hours for a typical creator setup with 3–5 active automations.
              Agencies with 10+ flows should budget a half day.
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
        <section className="py-16 bg-[#faf8ff] border-t border-[#ede9fd] text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Start free — no card required
            </h2>
            <p className="text-gray-600 mb-8">
              Set up comment-to-DM automation on your first Reel in under five minutes.
              The free plan includes unlimited automated DMs and works in production — not just as a demo.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="inline-flex rounded-xl px-10 py-4 text-base font-semibold text-white shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
            >
              Get Started Free
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Free plan includes unlimited DMs · No credit card required · Setup takes under 5 minutes
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
