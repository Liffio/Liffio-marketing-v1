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
  title: "Best SendDM Alternative for Instagram (2026) — Liffio",
  description:
    "Compare Liffio vs SendDM for Instagram DM automation. Free plan, flat pricing, unlimited DMs, and no pricing-on-request. Switch in under 2 hours.",
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
        id: "liffio-vs-senddm",
        question: "How does Liffio compare to SendDM?",
        answer:
          "Both tools handle comment-to-DM automation on Instagram. The practical differences come down to pricing transparency and what's included. SendDM does not publish pricing publicly — you have to contact their sales team to get a number, which makes budget planning difficult, especially if you are managing client accounts or on a fixed monthly budget. Liffio publishes every price on its pricing page, has a free plan that runs real automations in production, and bundles bio link pages and post scheduling into the same workspace. For creators and small agencies who want predictable costs and a tool that covers more than just DMs, Liffio is the more straightforward choice.",
      },
      {
        id: "senddm-free-plan",
        question: "Does SendDM have a free plan?",
        answer:
          "SendDM does not offer a free plan. Access requires a paid subscription, and pricing details are not listed publicly on their website — you need to request a quote. Liffio's free plan includes comment-to-DM automation on posts and Reels, unlimited automated DMs, a bio link page at bio.liffio.com, and basic analytics. No credit card is required and there is no trial period that expires. The free plan is designed for actual production use, not just for testing.",
      },
      {
        id: "switch-from-senddm",
        question: "How long does it take to switch from SendDM to Liffio?",
        answer:
          "Most creators switch in under two hours. The process is: document your active SendDM automations (trigger keywords, DM copy, which posts they are attached to), create a Liffio account, connect Instagram through the Meta OAuth flow, and recreate each automation in Liffio's flow builder. Liffio's comment-to-DM setup takes five to ten minutes per automation. Once your automations are running in Liffio, run both tools in parallel for a short period to verify delivery before disabling SendDM and revoking its Instagram access.",
      },
      {
        id: "senddm-instagram-api",
        question: "Does Liffio use official Instagram APIs like SendDM?",
        answer:
          "Yes. Liffio connects to Instagram through Meta's official OAuth flow and uses the same Instagram Messaging API that compliant tools are required to use. Your Instagram password is never entered into Liffio at any point. Liffio went through Meta's App Review process to receive the required permissions — instagram_manage_messages, pages_messaging, and the standard read permissions for comments and stories. The send behavior also follows Instagram's guidelines: Liffio introduces a 10–60 second configurable delay between trigger and send, which avoids the burst-send patterns that trigger spam detection.",
      },
      {
        id: "senddm-agency",
        question: "Can I use Liffio for multiple client Instagram accounts?",
        answer:
          "Yes — unlimited Instagram accounts are included at every Liffio plan tier, including the free plan. The Agency plan adds white-label workspaces and client sub-workspaces with restricted CLIENT role access, so each client sees only their own account and automations. There is no per-account surcharge. For agencies that have been paying per-seat or per-account fees with SendDM or other tools, switching to Liffio's Agency plan at a flat rate typically reduces the monthly cost as the account count grows.",
      },
    ],
  },
];

const sendDmRows = [
  { name: "Comment-to-DM", liffio: true, competitor: true },
  { name: "Story auto reply", liffio: true, competitor: true },
  { name: "Live stream DMs", liffio: true, competitor: false },
  { name: "Unlimited DMs", liffio: true, competitor: false },
  { name: "Free plan", liffio: true, competitor: false },
  { name: "Unlimited accounts", liffio: true, competitor: false },
  { name: "Agency white-label", liffio: true, competitor: false },
  { name: "Bio link pages", liffio: true, competitor: false },
  { name: "Post scheduler", liffio: true, competitor: false },
  { name: "Lead capture", liffio: true, competitor: true },
  { name: "External API", liffio: true, competitor: false },
  { name: "Razorpay / INR billing", liffio: true, competitor: false },
  { name: "Public pricing page", liffio: true, competitor: false },
];

const competitorPricing = [
  { name: "Liffio", free: true, paidFrom: "$9/month", perContact: false, publicPricing: true },
  { name: "SendDM", free: false, paidFrom: "Pricing on request", perContact: false, publicPricing: false },
  { name: "ManyChat", free: true, paidFrom: "$15/month", perContact: true, publicPricing: true },
  { name: "LinkDM", free: false, paidFrom: "From ~$19/month", perContact: false, publicPricing: false },
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
              SendDM handles the basics, but hides its pricing and skips the free plan.
              Liffio gives you the same Instagram DM automation with transparent flat-rate
              pricing, a free tier that actually works, and bio links and scheduling included.
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

        {/* Why creators leave SendDM */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Why creators look for a SendDM alternative
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                SendDM does what it says — it automates Instagram DMs triggered by comments and
                story replies. For a tool that covers a specific workflow, it works. The friction
                starts when you try to figure out what it costs before signing up, or when
                you need the tool to do something beyond sending a DM.
              </p>
              <p>
                The biggest complaint from creators looking to switch is the pricing model.
                SendDM does not publish pricing publicly. You either sign up and find out, or
                you contact their team for a quote. That is a reasonable approach for enterprise
                software, but it creates a planning problem for individual creators and small
                agencies who need to know the monthly cost before committing. Liffio publishes
                every price on its pricing page — no sales calls required.
              </p>
              <p>
                The second issue is scope. SendDM is focused narrowly on DM sequences and comment
                triggers. If you also need a bio link page to replace Linktree, a post scheduler
                to plan your content calendar, or short links for tracking, you are paying for
                those separately. Liffio includes all of it in the same workspace — which
                simplifies the tool stack and reduces the total monthly spend.
              </p>
              <ul className="mt-4 space-y-2 list-none">
                <li className="flex gap-3">
                  <span className="text-[#7c5af3] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">No free plan:</strong> SendDM requires a paid subscription to access any features. Liffio's free plan runs real automations in production — unlimited DMs, comment triggers, and a bio link page — with no credit card required.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7c5af3] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">Opaque pricing:</strong> SendDM pricing is not listed publicly. You cannot compare costs or plan a budget without contacting their team first. Liffio's pricing page shows every plan, every price, in USD and INR.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#7c5af3] font-bold mt-0.5">→</span>
                  <span><strong className="text-gray-900">No INR billing:</strong> Indian creators and agencies pay in USD with international processing fees. Liffio offers native INR billing through Razorpay with GST-friendly invoices.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section id="comparison" className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Liffio vs SendDM — side-by-side comparison
            </h2>
            <p className="text-gray-600 mb-8">
              Feature-level comparison for Instagram DM automation.{" "}
              <a href="/blog/manychat-alternatives" className="text-[#4259f0] font-semibold hover:underline">
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
                    <tr key={tool.name} className={`border-b border-gray-100 ${i === 0 ? "bg-[#faf8ff]" : ""}`}>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {i === 0 ? <span className="text-[#7c5af3]">{tool.name} ★</span> : tool.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tool.free ? "✓ Yes" : "✗ No"}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.paidFrom}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.perContact ? "Yes — scales with contacts" : "No — flat pricing"}</td>
                      <td className="py-3 px-4 text-gray-600">{tool.publicPricing ? "✓ Yes" : "✗ No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                The core pricing difference between Liffio and SendDM is transparency.
                SendDM requires you to sign up or contact their sales team to find out
                what you will pay each month. That might be acceptable for a large agency
                with a procurement process, but for a creator managing their own tools
                it creates unnecessary friction.
              </p>
              <p>
                Liffio charges a flat monthly rate: $0 on the free plan, $9/month on Starter,
                $49/month on Business, $299/month on Agency. No per-contact charges. No
                usage-based tiers that kick in when a post goes viral and your DM volume
                spikes. The same flat rate whether you send 200 DMs in a month or 20,000.
              </p>
              <p>
                ManyChat is included in the comparison because it is the most common starting
                point for Instagram DM automation. It has a free tier but uses per-contact
                pricing on paid plans, which adds unpredictability as your audience grows.
                LinkDM focuses on comment-to-link automation specifically and also does not
                publish pricing publicly.
              </p>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
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
                  The most common reason creators move from SendDM to Liffio is the free plan.
                  SendDM requires a paid subscription before you can test a single automation.
                  Liffio's free plan runs comment-to-DM on posts and Reels with unlimited
                  automated DMs — you can set up a real automation on a real post and see it
                  work before entering a payment method. For creators who are new to DM
                  automation or who want to validate the workflow before committing to
                  monthly spend, that matters.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Indian creators and agencies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Creators and agencies based in India are paying USD subscription fees plus
                  international transaction charges when using SendDM. Liffio offers native
                  INR pricing through Razorpay — you see the INR equivalent on the pricing
                  page, pay in INR, and get a GST-compliant invoice. For agencies billing
                  clients in India, this also simplifies the paper trail.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Liffio's Starter plan starts at ₹799/month — that is roughly what the
                  USD conversion would cost, but paid through a local payment method without
                  the international processing fee markup. Business plan is ₹3,999/month
                  and includes conversion analytics and multi-step DM flows.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Agencies managing multiple client accounts
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Liffio's Agency plan is a flat ₹24,999/month (or $299/month) and includes
                  unlimited Instagram accounts, white-label workspaces, and client sub-accounts
                  with restricted access. There is no per-account surcharge. Agencies that
                  have been paying per seat or per account elsewhere — or who have been using
                  multiple SendDM accounts for different clients — typically find the Agency
                  plan cheaper once they are managing five or more client accounts.
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
                Yes — Liffio connects through Meta&apos;s official OAuth flow, the same mechanism
                used by every compliant Instagram tool. You see a standard Meta login screen,
                approve the permissions, and Meta issues an access token directly to Liffio.
                Your Instagram password is never shared with Liffio at any point.
              </p>
              <p>
                The permissions required are{" "}
                <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">instagram_manage_messages</code>,{" "}
                <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">pages_messaging</code>,
                and the standard read permissions for comments and stories. Liffio went through
                Meta&apos;s App Review process to receive these — the same process every legitimate
                Instagram automation tool must pass.
              </p>
              <p>
                On the send-behavior side, Liffio uses a configurable 10–60 second delay between
                trigger and send. This distributes automated DMs naturally over time and avoids
                the burst-send patterns that trigger Instagram&apos;s spam detection. At normal
                creator usage — even during a Reel with several thousand comments — the send
                pattern does not flag the account.
              </p>
              <p>
                The risk profile with unofficial tools — ones that use browser automation,
                session cookie hijacking, or that ask for your Instagram password directly —
                is meaningfully higher. Liffio does not use any unofficial access methods.
              </p>
            </div>
          </div>
        </section>

        {/* Migration guide */}
        <section className="py-16 bg-[#faf8ff] border-y border-[#ede9fd]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to migrate from SendDM to Liffio (under 2 hours)
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "List your active SendDM automations",
                  body: "Before making any changes, write down every active automation: the trigger keyword, the delay setting, the DM text, any public comment reply text, and which posts or story types the automation covers. For most creators this takes 15–20 minutes. Do this before touching anything — recreating from memory is slower and error-prone.",
                },
                {
                  step: "2",
                  title: "Create a Liffio account and connect Instagram",
                  body: "Sign up at app.liffio.com — no credit card required on the free plan. Connect your Instagram account through the Meta OAuth flow. The connection takes about two minutes. If you manage multiple Instagram accounts, connect them all at this stage — every plan tier includes unlimited accounts at no extra cost.",
                },
                {
                  step: "3",
                  title: "Recreate your automations in Liffio",
                  body: "Start with your highest-traffic automation — usually the comment-to-DM flow on your most active post or Reel. In Liffio, create a Comment automation, select the post, enter the trigger keyword, write the DM text, and set the delay. Most simple comment-to-DM automations take five to ten minutes each to set up.",
                },
                {
                  step: "4",
                  title: "Run both in parallel for a few days",
                  body: "Do not disable SendDM immediately. Run both tools on a lower-traffic post for three to five days to confirm that Liffio's automations fire correctly. Watch for duplicate DMs during the overlap — if both tools trigger simultaneously on the same comment, the same person could receive two messages. Once you have confirmed Liffio is working, move to the final step.",
                },
                {
                  step: "5",
                  title: "Disable SendDM and revoke its Instagram access",
                  body: "Turn off your SendDM automations. Then go to Instagram Settings → Apps and Websites and revoke SendDM's access token. This removes its ability to send messages on your behalf. Cancel your SendDM subscription from their billing settings.",
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
              Estimated migration time: 1–2 hours for a typical setup with 3–5 active automations.
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
              Start free — see for yourself
            </h2>
            <p className="text-gray-600 mb-8">
              Set up your first comment-to-DM automation in under five minutes.
              Free plan, no credit card, unlimited DMs.
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
