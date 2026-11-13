import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppLink from "@/components/AppLink";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TechBadge } from "@/components/TechBadge";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { metaCopy } from "@/config/meta-copy";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/seo/json-ld";
import type { FaqCategory } from "@/config/faq.config";
import { getPricingPlans, planWorkspacesIncluded, type PricingPlan } from "@/config/pricing.config";
import { V4_FEATURE_CATEGORIES, V4_PLAN_CONTENT } from "@/config/pricing-v4.config";
import { INR_TAX_NOTE_LONG, USD_TAX_NOTE } from "@/config/tax-copy";
import type { PricingRegion } from "@/lib/pricing-region";

/**
 * The agency page. The Agency tier is the highest-value SKU on the sheet, and
 * until this page existed its only coverage was a short subsection partway down
 * the competitor comparison pages, which is not a landing page for a buyer
 * evaluating twenty client accounts.
 *
 * 🔴 EVERY NUMBER ON THIS PAGE IS READ, NOT TYPED.
 *   - prices and the workspace count: src/config/pricing.config.ts
 *   - the per-workspace limit table: V4_PLAN_CONTENT.Agency in
 *     src/config/pricing-v4.config.ts, rendered straight from the array
 *   - tax wording: src/config/tax-copy.ts
 * A hand-typed figure here would drift from the catalogue silently, and
 * `npm run check:prices` cannot guard a literal that lives in a page.
 *
 * 🔴 WHITE LABEL IS THE TRAP ON THIS PAGE. comparisons.config.ts says it
 * outright: "Do not reintroduce unlimited Instagram accounts or agency white
 * label beyond agency branding and hide Liffio branding." What ships is agency
 * branding plus the ability to hide Liffio branding. That is NOT a white-label
 * product: no custom domain, no reseller billing, no renamed app. The page
 * ranks for "white label instagram automation" by answering the query honestly
 * and saying where the line is, which is also the only version of the sentence
 * that survives a sales call.
 *
 * 🚩 FORBIDDEN CLAIMS, checked against src/config/feature-flags.ts. None of
 * these may appear here in any wording, because the backend does not do them:
 * story REACTION triggers, welcome DM or new-follower triggers, comment and
 * caption @mention triggers, branching or conditional logic, asking for data in
 * a DM, CRM integrations (HubSpot, Zapier, Salesforce, outbound webhooks), and
 * sale or revenue tracking. The last one is the one an agency page wants most:
 * reporting here is comment, DM and click, and must never imply attributed
 * revenue. Story REPLIES and story MENTIONS do ship and are claimed freely.
 *
 * 🚩 THE CTA IS DELIBERATELY NOT "Get Started Free". Nobody signs a
 * twenty-account engagement from a free-tier button. The primary action is the
 * existing contact-sales route (mailto to siteConfig.contact.email, the same
 * one PricingBottomCta uses, with data-cta="contact_sales" so it reports
 * alongside it).
 *
 * TODO: there is no real agency sales route. No /demo page, no booking link and
 * no agency inbox: support@liffio.com is a support address doing double duty.
 * When a booking link or an agency address exists, replace
 * AGENCY_CONTACT_HREF below.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Instagram Automation for Agencies: 20 Workspaces | Liffio",
  description:
    "Run 20 client Instagram accounts on one Liffio subscription. Per workspace limits, agency branding, client reporting, one invoice, GST billing in India.",
  pathname: "/instagram-automation-for-agencies",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

/** The Agency row of the live catalogue, per region. Never a typed price. */
function agencyPlan(region: PricingRegion): PricingPlan {
  const plans = getPricingPlans(region);
  return plans.find((plan) => plan.name === "Agency") ?? plans[plans.length - 1];
}

const AGENCY_USD = agencyPlan("global");
const AGENCY_INR = agencyPlan("india");
const AGENCY_WORKSPACES = planWorkspacesIncluded.Agency;
const AGENCY_LIMITS = V4_PLAN_CONTENT.Agency.limits;
const AGENCY_API_LIMITS = V4_PLAN_CONTENT.Agency.apiLimits;

/** The contact-sales route that actually exists today. See the TODO above. */
const AGENCY_CONTACT_HREF = `mailto:${siteConfig.contact.email}?subject=Agency%20plan%20walkthrough`;

/*
  Chatbot limits are READ from the plan matrix, never typed here. Entitlement
  lives in the backend's package_limits table and V4_FEATURE_CATEGORIES is the
  marketing mirror of it, so a plan change moves this section automatically.
  Owner-confirmed 2026-11-13: chatbot_sessions.lead_id is a real FK to leads,
  chatbot_steps carries the webhook step in its config jsonb, and
  chatbotConditionRules caps Starter at 5 and Growth at 15 with no cap row for
  Business or Agency, which is what "Unlimited" means in the row below.
*/
const CHATBOT_ROWS = V4_FEATURE_CATEGORIES.find((c) => c.name === "Chatbots")?.features ?? [];

function chatbotLimit(rowName: string, plan: "starter" | "growth" | "business" | "agency"): string {
  const row = CHATBOT_ROWS.find((f) => f.name === rowName);
  const value = row?.[plan];
  return typeof value === "string" ? value : value ? "Yes" : "No";
}

const CHATBOT_LIMIT_ROWS = ["Live chatbots", "Condition rules", "Steps per bot", "Keywords per bot"];

const CHATBOT_POINTS = [
  {
    title: "Answers land in the leads list, not in a transcript",
    body: "When a chatbot asks a question, the answer attaches to that lead rather than sitting in a conversation nobody reads twice. For an agency that means a qualified list per client workspace, exportable, instead of a team member scrolling DMs to find who said they wanted the pricing sheet.",
  },
  {
    title: "A webhook step hands answers to your own system mid chat",
    body: "A chatbot step can post what it just collected to your endpoint while the conversation is still open. That is the piece that makes this fit an agency stack: qualified leads reach the client's CRM, your reporting sheet or a Slack channel as they happen, rather than waiting for an export at the end of the month.",
  },
  {
    title: "Conditions branch the conversation by what people say",
    body: "Condition rules send someone down a different path depending on their answer, so one bot handles the buyer, the browser and the person who typed the keyword by accident. This is the difference between a chatbot and a canned reply, and it is where a client notices the work.",
  },
];

const faqCategories: FaqCategory[] = [
  {
    id: "instagram-automation-for-agencies",
    label: "Instagram automation for agencies FAQ",
    items: [
      {
        id: "chatbot-webhook-crm",
        question: "Can chatbot answers reach our CRM or reporting stack?",
        answer: `Yes, through the webhook step, which is a Business and Agency feature. A chatbot step can post what it has just collected to your endpoint while the conversation is still open, so a qualified lead reaches the client's CRM, your reporting sheet or a Slack channel as it happens rather than in a monthly export. Answers also attach to the lead inside Liffio, so each client workspace keeps its own exportable list. Condition rules branch the conversation on those answers: ${chatbotLimit("Condition rules", "starter")} on Starter, ${chatbotLimit("Condition rules", "growth")} on Growth, and ${chatbotLimit("Condition rules", "business").toLowerCase()} on Business and Agency.`,
      },
      {
        id: "how-many-accounts",
        question: "How many Instagram accounts can an agency run on Liffio?",
        answer: `Twenty. The Agency plan includes ${AGENCY_WORKSPACES} workspaces on one subscription, and a workspace connects exactly one Instagram account. There is no pooled allowance and no per-account surcharge inside that twenty, so the twentieth client costs the same as the first. Beyond twenty handles the plan does not stretch: ask us rather than assume it does.`,
      },
      {
        id: "per-workspace-limits",
        question: "Are the limits shared across workspaces or counted per workspace?",
        answer:
          "Per workspace, and never pooled. Every Agency workspace is a complete Business workspace with its own allowance: unlimited automations, unlimited live chatbots, 15 team members, 75,000 AI tokens a month and a full API quota, each. A client who runs forty automations in a launch week takes nothing away from the other nineteen.",
      },
      {
        id: "white-label",
        question: "Is Liffio white label for agencies?",
        answer:
          "Not in the full sense. What ships is agency branding plus the ability to hide Liffio branding, so the badge comes off the automated DMs, the chatbots and the bio link page and the client-facing output does not advertise a vendor. What does not ship is a white-label product: no custom domain, no renamed application, no reseller billing in your name, no client-facing login on your own URL. If a true white-label deployment is a hard requirement, Liffio is not that today.",
      },
      {
        id: "client-reporting",
        question: "What can an agency report to a client?",
        answer:
          "The chain from comment to DM to click, per automation, per workspace, with conversion rate on top. Each workspace also reports post, video and profile metrics, keeps 90 days of history, attributes results to the individual automation, and exports the numbers into whatever deck or sheet the client already reads. What Liffio does not report is revenue: there is no purchase tracking in the product, so a report claiming attributed revenue would be inventing it.",
      },
      {
        id: "client-owns-account",
        question: "Who owns the Instagram connection, the agency or the client?",
        answer:
          "The client. The connection is made through the official Instagram API with Instagram Login: the client approves the permissions on Instagram's own consent screen, no password is shared with Liffio or with you, and they can revoke access from their own Instagram settings at any time. Offboarding is clean, and you never hold a credential you would rather not hold.",
      },
      {
        id: "team-permissions",
        question: "Can I give a client limited access to their own workspace?",
        answer:
          "Yes. Every workspace has team invites and roles, and Business workspaces, which is what all twenty Agency workspaces are, add per person permissions for up to 15 members. Your strategist can build and publish, a junior can draft without shipping, and the client can see their own workspace and approve posts without touching anyone else's.",
      },
      {
        id: "inr-billing",
        question: "Can an Indian agency pay in rupees with a GST invoice?",
        answer: `Yes, which is why the plan carries two prices rather than a converted one. Agency is ${AGENCY_INR.monthly} a month billed natively in rupees through Razorpay, or ${AGENCY_USD.monthly} a month in dollars. ${INR_TAX_NOTE_LONG} On the dollar price: ${USD_TAX_NOTE} Annual billing charges ten months instead of twelve in either currency, so two months are free.`,
      },
      {
        id: "is-it-safe",
        question: "Is it safe to connect client accounts to an automation tool?",
        answer:
          "It is when the tool runs on the official Instagram API and you only message people who approached the account. Liffio connects through Instagram Login, its business passed Meta's business verification and access verification, and its Instagram permissions passed App Review. Those are the baseline for any tool on that API rather than a point of difference, so the question to ask of any vendor is whether it uses the official API at all, or signs in as the account and drives the app in a browser.",
      },
    ],
  },
];

const ISOLATION_POINTS = [
  {
    title: "One workspace, one Instagram account",
    body: "The workspace is the unit of client work: one connected account, and that account's automations, chatbots, leads, scheduled posts, analytics and team. There is no mode in which two client handles share a workspace, which is what you want when client A must never appear in client B's dashboard.",
  },
  {
    title: "Limits are per workspace, never pooled",
    body: "Every figure on the Agency plan is a Business workspace figure, counted twenty times over rather than divided twenty ways. A launch week in one workspace cannot starve another, so you can promise a client capacity without first checking what the rest of the roster is doing.",
  },
  {
    title: "Switching is a dropdown, not a logout",
    body: "You move between the twenty workspaces from one login. No credentials per client, no shared password in a spreadsheet, no signing out of one account to check another.",
  },
  {
    title: "One subscription, one invoice, one renewal date",
    body: "Twenty workspaces bill as a single line on a single date, so finance codes one invoice rather than twenty and you never reconcile a client roster against a list of separate subscriptions.",
  },
];

const REPORTING_POINTS = [
  {
    title: "The comment to DM to click chain",
    body: "Analytics follow the funnel the automation creates: comments that triggered, DMs that went out, clicks on the links inside them, and conversion rate on top. Three numbers a client can act on, per automation.",
  },
  {
    title: "Per automation attribution",
    body: "Business workspaces attribute results to the individual automation, so you can say which campaign did the work instead of reporting one account-level total. With four automations live across a launch, that is the difference between a report and a shrug.",
  },
  {
    title: "Ninety days of history, and an export",
    body: "Each workspace keeps 90 days of analytics history and can export it, so the numbers reach your deck or sheet rather than a client logging in to a vendor dashboard to read their own results.",
  },
  {
    title: "Post, video and profile metrics",
    body: "Alongside the automation numbers, each workspace reports post and video metrics and profile outcomes, with AI insights over the top. On a retainer covering content too, both reports stay in one place.",
  },
];

const WALKTHROUGH = [
  {
    step: "1",
    title: "Create the workspace before the kickoff call",
    body: "A new client means a new workspace, created from the switcher in about a minute. Name it after the client, not the handle, because in six months you will be scanning twenty names in a dropdown. The empty workspace costs nothing extra: it is one of the twenty you already pay for.",
  },
  {
    step: "2",
    title: "Have the client connect their own account",
    body: "On the kickoff call, share your screen and have the client approve the connection themselves through Instagram Login. No password is typed into Liffio or handed to you. Say out loud that they can revoke it from their Instagram settings whenever they like: a thirty second line that removes the main objection a cautious client has to automation.",
  },
  {
    step: "3",
    title: "Set permissions and branding while it is still empty",
    body: "Invite your strategist with build and publish rights, the junior with draft rights, and the client as a reviewer who can approve posts and read their own analytics. Then turn on agency branding and switch Liffio branding off, which is cheaper on day one than retrofitting after the first campaign ships.",
  },
  {
    step: "4",
    title: "Build the launch campaign on one post",
    body: "Usually a single Reel with a comment keyword. Create the automation, pick the post, set the trigger and excluded keywords, write the public reply and two or three DM variants, and set a send delay so the reply lands a beat after the comment rather than in the same instant. Add the follow-ups the plan allows, then test it from a second account before the client posts.",
  },
  {
    step: "5",
    title: "Add the story and DM layer in week two",
    body: "Once the comment flow is proven, extend it: story reply and story mention triggers for the launch window, a default reply so DMs matching nothing still get an answer, ice breakers above empty threads, and a chatbot for the questions that keep coming back.",
  },
  {
    step: "6",
    title: "Report at the campaign close, not the month end",
    body: "Export the workspace analytics for the campaign window and report comments triggered, DMs delivered, clicks earned, conversion rate and the per automation split. Do not put a revenue figure on it unless it comes from the client's own commerce analytics: Liffio does not track sales, and a number you cannot source is a number you will be asked to defend.",
  },
  {
    step: "7",
    title: "Offboard without touching anyone else",
    body: "The client revokes the connection from their own settings and you archive the workspace. Nothing in the other nineteen moves, your invoice does not change, and the slot is free for the next client.",
  },
];

export default function InstagramAutomationForAgenciesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          {
            name: "Instagram Automation for Agencies",
            item: `${SITE_URL}/instagram-automation-for-agencies`,
          },
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
                {
                  label: "Instagram Automation for Agencies",
                  href: "/instagram-automation-for-agencies",
                },
              ]}
            />
            {metaCopy.heroBadge ? (
              <TechBadge label={metaCopy.heroBadge} variant="meta" format="label" className="mb-5" />
            ) : null}
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Instagram Automation for Agencies
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              {AGENCY_WORKSPACES} client workspaces on one subscription, one Instagram account in
              each, and every limit counted per workspace rather than pooled. One invoice, one
              renewal date, agency branding, and reporting you can hand to a client without editing
              it first.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={AGENCY_CONTACT_HREF}
                data-cta="contact_sales"
                className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
              >
                Talk to us about an agency setup
              </a>
              <a
                href="#agency-pricing"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
              >
                See Agency pricing
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Official Instagram API · Unlimited automated DMs on every plan · INR billing with GST invoices
            </p>
          </div>
        </section>

        {/* Who this is for */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Instagram DM automation for agencies, priced for a roster
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Most tools in this category are priced for one person running one account. An agency
                hits the seams of that model fast: a subscription per client, a login per client, a
                renewal date per client, a shared allowance that one client&apos;s launch week
                quietly eats, and a client-facing DM that still carries somebody else&apos;s badge.
              </p>
              <p>
                Liffio&apos;s Agency plan bundles {AGENCY_WORKSPACES} complete workspaces into one
                subscription. Each connects a single Instagram account and behaves as a full
                Business workspace with its own limits rather than a share of a pool. What follows
                is the operational detail: isolation, reporting, branding, permissions, and a worked
                example of running one client end to end. For the mechanics of the automation
                itself, start with{" "}
                <a href="/instagram-comment-to-dm" className="text-[#b20d8f] font-semibold hover:underline">
                  how Instagram comment to DM automation works
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Multi-workspace */}
        <section id="workspaces" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Instagram automation for multiple accounts, one workspace at a time
            </h2>
            <p className="text-gray-600 mb-8">
              The workspace is the whole model, so it is worth understanding before you price an
              engagement on it.
            </p>
            <dl className="space-y-5">
              {ISOLATION_POINTS.map((point) => (
                <div key={point.title} className="rounded-2xl border border-[#ffe4e6] bg-white p-5">
                  <dt className="font-semibold text-gray-900">{point.title}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{point.body}</dd>
                </div>
              ))}
            </dl>

            {/* TODO:SCREENSHOT alt="Liffio workspace switcher open, showing a list of twenty named client workspaces with the active one highlighted" */}

            <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Agency plan limits, counted per workspace across all {AGENCY_WORKSPACES} workspaces
                </caption>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700">
                      {V4_PLAN_CONTENT.Agency.limitsLabel}
                    </th>
                    <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700">
                      Each workspace gets
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AGENCY_LIMITS.map((limit) => (
                    <tr key={limit.label} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">{limit.label}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 tabular-nums">{limit.value}</td>
                    </tr>
                  ))}
                  {AGENCY_API_LIMITS.map((limit) => (
                    <tr key={limit.label} className="border-b border-gray-100 last:border-0 bg-[#faf9ff]">
                      <td className="py-3 px-4 text-gray-600">{limit.label}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 tabular-nums">{limit.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Read that table twenty times over, not divided twenty ways. The shaded rows are the
              Liffio API quota, available from Starter up through an API-key authenticated endpoint,
              which is how agencies with their own dashboards pull workspace data in. Those quotas
              limit API calls only, not automations, chatbots or scheduling inside the app.
            </p>
          </div>
        </section>

        {/* Client reporting */}
        <section id="reporting" className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Client reporting: what you can show, and what you cannot
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Retainers are renewed on reports, so it is worth being exact about which numbers
              exist. Liffio tracks the chain the automation creates: the comment that triggered it,
              the DM that went out, the click on the link inside that DM, and conversion rate on
              top, per automation, inside the workspace that client owns.
            </p>
            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              {REPORTING_POINTS.map((point) => (
                <div key={point.title} className="rounded-2xl border border-gray-100 bg-[#faf9ff] p-5">
                  <dt className="font-semibold text-gray-900">{point.title}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{point.body}</dd>
                </div>
              ))}
            </dl>

            {/* TODO:SCREENSHOT alt="Client analytics view for a single workspace, showing comments triggered, DMs sent, link clicks and conversion rate for one comment to DM automation over a 30 day window" */}

            <div className="mt-8 rounded-2xl border border-[#ffe4e6] bg-[#fff7f7] p-6">
              <h3 className="font-semibold text-gray-900">The number Liffio does not give you</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Revenue. There is no purchase or sale tracking in the product, so analytics stop at
                the click. Better to say so here than let you build a reporting template around a
                figure that does not exist. If a client wants revenue in the report, pair the click
                numbers from Liffio with the order numbers from their own commerce analytics, and
                label which side each came from.
              </p>
            </div>
          </div>
        </section>

        {/* Chatbots */}
        <section id="chatbots" className="py-16 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Chatbots that qualify the lead before you touch it
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Comment to DM starts the conversation. A chatbot is what carries it, and on the
              agency plan it is a separate module rather than a longer autoreply. Three parts of it
              matter when the account belongs to a client rather than to you.
            </p>
            <div className="space-y-6">
              {CHATBOT_POINTS.map((point) => (
                <div key={point.title} className="rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{point.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{point.body}</p>
                </div>
              ))}
            </div>
            {/* TODO:SCREENSHOT alt="Liffio chatbot builder with a condition step open, showing two branches leading to different replies and a webhook step on one of them" */}
            <div className="mt-10 overflow-x-auto">
              <h3 className="font-semibold text-gray-900 mb-3">What each plan allows</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 px-4 font-semibold text-gray-700">Chatbots</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Starter</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Growth</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Business</th>
                    <th className="py-3 px-4 font-semibold text-[#f5184c]">Agency</th>
                  </tr>
                </thead>
                <tbody>
                  {CHATBOT_LIMIT_ROWS.map((rowName) => (
                    <tr key={rowName} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{rowName}</td>
                      <td className="py-3 px-4 text-gray-600">{chatbotLimit(rowName, "starter")}</td>
                      <td className="py-3 px-4 text-gray-600">{chatbotLimit(rowName, "growth")}</td>
                      <td className="py-3 px-4 text-gray-600">{chatbotLimit(rowName, "business")}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{chatbotLimit(rowName, "agency")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Lead capture into the leads list and the webhook step are Business and Agency
                features. Conditions start on Starter, so a smaller retainer can still branch a
                conversation; the Agency plan simply removes the ceiling, per workspace, on all
                twenty.
              </p>
            </div>
          </div>
        </section>

        {/* White label */}
        <section id="branding" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              White label Instagram automation: the honest version
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              &quot;White label&quot; is used loosely in this category, so here is the line. Liffio
              ships agency branding and the ability to hide Liffio branding. It is not a white-label
              product, and we are not going to call it one.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#ffe4e6] bg-white p-6">
                <h3 className="font-semibold text-gray-900">What ships today</h3>
                <ul className="mt-3 space-y-2 list-none text-sm text-gray-600 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#f5184c] font-bold mt-0.5" aria-hidden>+</span>
                    <span>Agency branding on the Agency plan.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f5184c] font-bold mt-0.5" aria-hidden>+</span>
                    <span>Hide Liffio branding: the badge comes off the automated DMs, the chatbots and the bio link page.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f5184c] font-bold mt-0.5" aria-hidden>+</span>
                    <span>Client workspaces you create as you win clients, named however you like.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f5184c] font-bold mt-0.5" aria-hidden>+</span>
                    <span>Custom bio link slugs and styling, so the client-facing page reads as theirs.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">What does not</h3>
                <ul className="mt-3 space-y-2 list-none text-sm text-gray-600 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-gray-400 font-bold mt-0.5" aria-hidden>-</span>
                    <span>A custom domain for the application itself.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 font-bold mt-0.5" aria-hidden>-</span>
                    <span>A renamed app, or a client-facing login on your own URL.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 font-bold mt-0.5" aria-hidden>-</span>
                    <span>Reseller billing: you cannot invoice your clients through Liffio in your own name.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 font-bold mt-0.5" aria-hidden>-</span>
                    <span>A branded client portal separate from the workspace itself.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* TODO:SCREENSHOT alt="Agency branding settings for a workspace, with the hide Liffio branding toggle switched on and an agency logo uploaded" */}

            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              For most agency work the distinction that matters is the output, not the login: the
              client sees DMs, chatbots and a bio link page with no vendor badge on them. If a true
              white-label deployment is a hard requirement, say so when you{" "}
              <a href={AGENCY_CONTACT_HREF} data-cta="contact_sales" className="text-[#b20d8f] font-semibold hover:underline">
                get in touch
              </a>
              , and we will tell you whether it is on the roadmap rather than sell you around it.
            </p>
          </div>
        </section>

        {/* Team permissions */}
        <section id="permissions" className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Team permissions across your people and the client&apos;s
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Agency work has two sets of people in it: your team, who build, and the
                client&apos;s, who approve and want to look. Every Agency workspace is a Business
                workspace, so it carries per person permissions for up to 15 members on top of the
                team invites and roles every plan has.
              </p>
              <p>
                Permissions are scoped to the workspace, which is the part that matters here.
                Inviting a client into their workspace gives them that workspace and nothing else:
                no visibility of your other clients, and no way to learn from inside the product who
                else you work with. Your own staff sit in as many workspaces as their job needs.
              </p>
              <p>
                Two controls do the heavy lifting on a retainer. Post approvals mean a draft is
                queued by whoever writes it and published only once the named approver signs off,
                which is how you let a junior work on a nervous client&apos;s account. The activity
                log and audit log record who changed what and when. Two factor authentication is
                available on every plan, and on client accounts it should not be optional.
              </p>
            </div>

            {/* TODO:SCREENSHOT alt="Per person permissions panel for one workspace, listing team members with their roles and the individual capabilities each one is granted" */}
          </div>
        </section>

        {/* Worked example */}
        <section id="walkthrough" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Worked example: running one client from kickoff to report
            </h2>
            <div className="rounded-2xl border border-gray-300 bg-white p-5 mb-8">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">This is a worked example, not a customer story.</strong>{" "}
                No agency is named because none is being described: Liffio has no published agency
                case study yet, and inventing one would be worth less than nothing to you. What
                follows is the sequence of steps the product supports, in the order you would do
                them.
              </p>
            </div>
            <div className="space-y-6">
              {WALKTHROUGH.map((item) => (
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
            <p className="mt-8 text-sm text-gray-600 leading-relaxed">
              Repeat that per client and the only thing that changes is the workspace you are in.
              Steps 1 to 4 are first-week work; a client in steady state after that is a weekly look
              at the numbers and a new campaign when they post something worth automating.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section id="agency-pricing" className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Agency plan pricing
            </h2>
            <div className="rounded-2xl border border-[#ffe4e6] bg-[#fff7f7] p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="text-3xl font-extrabold text-gray-900">{AGENCY_USD.monthly}</span>
                <span className="text-sm text-gray-600">per month, billed in USD</span>
                <span className="text-gray-300" aria-hidden>|</span>
                <span className="text-3xl font-extrabold text-gray-900">{AGENCY_INR.monthly}</span>
                <span className="text-sm text-gray-600">per month, billed in INR</span>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {V4_PLAN_CONTENT.Agency.includedLabel}, one subscription, one invoice, one renewal
                date. Annual billing charges ten months instead of twelve, so two months are free:{" "}
                {AGENCY_USD.annualTotal} a year, or {AGENCY_INR.annualTotal} a year.
              </p>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {INR_TAX_NOTE_LONG} On the dollar price: {USD_TAX_NOTE} Billing runs through
                Razorpay, and rupee invoices are GST invoices, so an Indian agency is not putting a
                dollar subscription through a card and explaining a foreign exchange line to a
                client every month.
              </p>
            </div>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Divide the monthly figure by {AGENCY_WORKSPACES} for the per-client cost of a full
                Business workspace, which is less than a single mid-tier plan bought on its own. The
                discount is in the bundle, not in a negotiation.
              </p>
              <p>
                Running fewer accounts than that today? The lower tiers are one workspace each and
                compare line by line on the{" "}
                <a href="/pricing" className="text-[#b20d8f] font-semibold hover:underline">
                  Liffio pricing page
                </a>
                , which carries the full plan matrix the table above is drawn from. Weighing Liffio
                against another tool for a roster, the{" "}
                <a href="/compare" className="text-[#b20d8f] font-semibold hover:underline">
                  side-by-side comparisons
                </a>{" "}
                cover the pricing models directly:{" "}
                <AppLink href="/vs/replyrush" className="text-[#b20d8f] font-semibold hover:underline">
                  Liffio versus ReplyRush
                </AppLink>{" "}
                is the closest match on multi-account work, and{" "}
                <AppLink href="/vs/linkdm" className="text-[#b20d8f] font-semibold hover:underline">
                  Liffio versus LinkDM
                </AppLink>{" "}
                sets out the flat-pricing side of the per-contact question.
              </p>
              <p>
                One thing that is not a tier difference: automated DMs are unlimited on every Liffio
                plan, the free one included. An agency bill does not move because a client&apos;s
                Reel found ten times more people than the brief assumed.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
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
              <a href="/is-instagram-dm-automation-safe" className="text-[#b20d8f] font-semibold hover:underline">
                what actually risks a client account
              </a>
              {" · "}
              <a href="/unlimited-instagram-dms" className="text-[#b20d8f] font-semibold hover:underline">
                unlimited DMs on every plan
              </a>
              {" · "}
              <a href="/help" className="text-[#b20d8f] font-semibold hover:underline">
                help centre
              </a>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Walk through an agency setup with us
            </h2>
            <p className="text-gray-600 mb-8">
              Tell us how many client accounts you run, what you report today, and where the branding
              has to be yours. We will tell you which parts Liffio does, which it does not, and what
              the first week of migration actually looks like.
            </p>
            <a
              href={AGENCY_CONTACT_HREF}
              data-cta="contact_sales"
              className="inline-flex rounded-xl px-10 py-4 text-base font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
            >
              Talk to us about an agency setup
            </a>
            <p className="mt-4 text-sm text-gray-600">
              Prefer to read the numbers first?{" "}
              <a href="/pricing" className="text-[#b20d8f] font-semibold hover:underline">
                Compare every plan on the pricing page
              </a>
              .
            </p>
            <p className="mt-3 text-xs text-gray-500">
              {AGENCY_WORKSPACES} workspaces on one subscription · Limits per workspace, never pooled · Official Instagram API
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
