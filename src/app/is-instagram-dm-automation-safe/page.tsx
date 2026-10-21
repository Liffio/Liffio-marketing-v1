import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TechBadge } from "@/components/TechBadge";
import { buildPageMetadata } from "@/config/seo.config";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { metaCopy } from "@/config/meta-copy";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/seo/json-ld";
import type { FaqCategory } from "@/config/faq.config";

/**
 * The safety question, answered as a question. "is instagram dm automation
 * safe" and "will I get banned for using a dm bot" are the highest-intent
 * objection queries in this category, and they are also the queries an AI
 * assistant is most likely to be asked and to answer by quoting somebody. The
 * page is therefore written to be quotable: a direct answer in the first
 * paragraph, then the reasoning, then a checklist.
 *
 * 🔴 NO SoftwareApplicationJsonLd ON THIS PAGE, deliberately. The other two
 * Batch 2 pages are product pages and emit it; this one answers a category
 * question and most of its traffic will arrive sceptical. Marking an
 * explainer up as a software listing invites the reading that the answer is an
 * ad, which is the one reading that would cost it the citation. Breadcrumb and
 * FAQPage only.
 *
 * 🔴 APP REVIEW AND TECH PROVIDER ARE A BASELINE, NOT A DIFFERENTIATOR, and
 * this was a correction the owner had to make twice. No tool can call the
 * Instagram messaging endpoints without passing App Review, so every compliant
 * competitor has them too. The page therefore frames them as what a buyer
 * should CHECK FOR in any tool, and the honest differentiator is stated as the
 * question "does it use the official API at all, or does it sign in as you".
 *
 * 🚩 FORBIDDEN CLAIMS, each of which someone has tried to add before:
 *   - "Meta Business Partner": a separate programme Liffio is not in.
 *   - "Instagram approved" / "Meta approved": not real statuses. App Review
 *     approves a submission of specific permissions, which is a different
 *     sentence.
 *   - "Meta Verified": a trademarked paid consumer badge product, unrelated.
 *   - Any promise that an account cannot be restricted. Liffio does not control
 *     Instagram's enforcement and must never imply it does.
 * The credential is stated ONCE, in the hero badge, from metaCopy. See the
 * note at the top of src/config/meta-copy.ts.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Is Instagram DM Automation Safe? What Actually Risks a Ban",
  description:
    "Automating Instagram DMs is safe when the tool uses the official Instagram API and you only message people who asked. Here is what actually gets accounts restricted.",
  pathname: "/is-instagram-dm-automation-safe",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "dm-automation-safety",
    label: "Instagram DM automation safety FAQ",
    items: [
      {
        id: "is-it-safe",
        question: "Is Instagram DM automation safe?",
        answer:
          "Yes, when two things are true: the tool runs on the official Instagram API, and you only message people who asked to hear from you. Instagram built and documents the messaging endpoints that comment-to-DM tools use, so the automation itself is a supported use of the platform. What is not safe is a tool that signs in with your username and password and drives the app in a browser, because to Instagram that traffic looks like a bot operating your account.",
      },
      {
        id: "will-i-get-banned",
        question: "Will my Instagram account get banned for using a DM automation tool?",
        answer:
          "Using a compliant tool to reply to people who commented on your post is not what gets accounts actioned. Accounts get restricted for behaviour: messaging people who never interacted with you, sending identical text at machine speed, using a tool that logs in as you, or buying followers and engagement alongside it. No tool can guarantee an account will never be restricted, and any tool that guarantees it is telling you something about its own honesty. What a tool can do is stay inside the API and the platform terms, which is the part you can actually check.",
      },
      {
        id: "official-api-check",
        question: "How do I tell whether a tool uses the official Instagram API?",
        answer:
          "Watch what happens when you connect it. A compliant tool sends you to Instagram's own consent screen, where Instagram tells you which permissions the app is asking for and you approve them there. You never type your password into the tool, and the connection appears in your Instagram settings where you can revoke it. If a tool asks for your Instagram username and password directly, it is not using the official API, whatever its marketing says.",
      },
      {
        id: "what-meta-requires",
        question: "What does Meta require of a tool before it can send Instagram DMs?",
        answer:
          "Three approvals, and they are prerequisites rather than distinctions. The business has to pass Meta's business verification. It has to pass access verification, which is what grants Tech Provider status for a platform handling other businesses' data. And the app has to pass App Review for each Instagram permission it uses, including the one that sends messages. Any tool legitimately on the official API has all three, so treat them as the floor you check for, not as a reason to pick one tool over another.",
      },
      {
        id: "liffio-safe",
        question: "Is Liffio safe to connect to my Instagram account?",
        answer:
          "Liffio connects through the official Instagram API using Instagram Login. You approve the permissions on Instagram's own consent screen, no password is shared with Liffio, and you can revoke access from Instagram at any time. Liffio's business passed Meta's business verification and access verification, and its Instagram permissions passed App Review. As above, those are the baseline for any tool on the official API, so the useful question to ask about any Instagram tool is whether it is on that API at all.",
      },
      {
        id: "how-many-dms",
        question: "How many automated DMs can I send before it looks like spam?",
        answer:
          "Volume is not the signal that matters; consent is. Ten thousand DMs to people who each commented a keyword on your post is a conversation you were invited into. Fifty DMs to people who never interacted with you is cold outreach, and Instagram's own spam reports come from recipients, not from counters. Keep the automation tied to an action the recipient took, write a message that reads like you, and put a short delay on it rather than replying in the same instant.",
      },
      {
        id: "revoke",
        question: "Can I disconnect the tool later?",
        answer:
          "Yes, and you do not need the tool's permission. Because the connection is an Instagram authorisation rather than a stored password, you can revoke it from inside Instagram, in the apps and websites settings, and the access ends there. This is a practical reason to prefer official-API tools: you keep the ability to end the connection yourself.",
      },
    ],
  },
];

const RISK_FACTORS = [
  {
    title: "Tools that log in as you",
    body: "If a tool wants your Instagram password, it is operating your account by remote control rather than through an API. Instagram sees automated browser activity on a normal login, which is the pattern enforcement is built to catch. This is the single biggest risk factor, and it is the one buyers most often overlook because such tools are often cheaper.",
  },
  {
    title: "Messaging people who did not ask",
    body: "Automation that replies to a comment, a story reply or a DM is responding to someone who approached you. Automation pointed at a scraped list, a hashtag or your follower list is cold outreach. Recipients report the second kind, and reports are what trigger action.",
  },
  {
    title: "Identical text at machine speed",
    body: "The same sentence, sent the same second, to everyone, looks like what it is. A short delay and a couple of message variants cost nothing and make the pattern ordinary.",
  },
  {
    title: "Bought followers and engagement",
    body: "Accounts that buy engagement tend to get looked at, and once an account is being looked at everything on it is in scope. Automation is rarely the reason such an account gets actioned, but it is often what the owner blames.",
  },
  {
    title: "Promising what the DM cannot deliver",
    body: "Asking people to comment for a free guide and then sending a sales pitch produces blocks and reports from the exact people you asked to raise their hand. The fastest way to look like spam is to be a disappointment.",
  },
];

const CHECKLIST = [
  "Connecting it sends you to Instagram's own consent screen, and you never type your password into the tool.",
  "The permissions Instagram shows you on that screen match what the tool claims to do.",
  "The connection appears in your Instagram settings, under apps and websites, where you can revoke it yourself.",
  "The company behind it is identifiable: a real business name, a real address, a published privacy policy.",
  "It does not promise that your account cannot be restricted, because nobody can promise that.",
  "It does not offer to get you followers, likes or views alongside the automation.",
];

export default function IsInstagramDmAutomationSafePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Is Instagram DM Automation Safe?", item: `${SITE_URL}/is-instagram-dm-automation-safe` },
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
                { label: "Is Instagram DM Automation Safe?", href: "/is-instagram-dm-automation-safe" },
              ]}
            />
            {metaCopy.heroBadge ? (
              <TechBadge label={metaCopy.heroBadge} variant="meta" format="label" className="mb-5" />
            ) : null}
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Is Instagram DM Automation Safe?
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Short answer: yes, if the tool runs on the official Instagram API and you only message
              people who asked to hear from you. The risk was never automation. It is how the tool
              connects, and who you point it at.
            </p>
          </div>
        </section>

        {/* Direct answer */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              The honest answer, with the reasoning
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Instagram built the messaging endpoints that comment-to-DM tools use, documents
                them, and requires every app that touches them to be reviewed first. Replying
                automatically to someone who commented a keyword on your Reel is a use of the
                platform that the platform designed for. That is why creators with large accounts
                can run it for years without incident.
              </p>
              <p>
                What people are actually remembering when they ask this question is the earlier
                generation of tools, which worked by taking your username and password, signing in
                as you, and clicking around the app faster than a human could. Those did get
                accounts restricted, often, and the reason is simple: from Instagram&apos;s side
                there is no way to tell that activity apart from a bot that has taken over the
                account. Some tools still work this way.
              </p>
              <p>
                So the question worth asking is not &quot;is DM automation safe&quot;. It is
                &quot;does this particular tool use the official API, and am I messaging people who
                asked me to&quot;. Both are things you can check in a couple of minutes, and the
                rest of this page is how.
              </p>
            </div>
          </div>
        </section>

        {/* The dividing line */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Official API versus logging in as you
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#ffe4e6] bg-white p-6">
                <h3 className="font-semibold text-gray-900">On the official API</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  You are sent to Instagram&apos;s own consent screen. Instagram lists the
                  permissions the app wants and you grant them there. The tool receives a token
                  scoped to those permissions, never your password. The connection shows up in your
                  Instagram settings and you can revoke it yourself, at any time, without asking
                  the tool.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">Signing in as you</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  You type your Instagram username and password into the tool. It then logs in and
                  operates the app on your behalf, usually in an automated browser. There is no
                  permission list, nothing in your Instagram settings to revoke, and the only way
                  to end access is to change your password. This is the pattern that gets accounts
                  restricted.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              The test is the connect screen, not the marketing. A tool can describe itself as safe,
              compliant and official on every page of its site and still ask for your password on
              the one screen that matters.
            </p>
          </div>
        </section>

        {/* What Meta requires */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What Meta requires before any tool can send Instagram DMs
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Three approvals stand between a company and the Instagram messaging endpoints.
                Business verification, where Meta confirms the company is a real registered
                business. Access verification, which is what grants Tech Provider status to a
                platform that handles other businesses&apos; data. And App Review, where Meta
                reviews each Instagram permission the app requests, including the one that sends
                messages.
              </p>
              <p>
                It is worth being clear about what that does and does not tell you. Every tool
                legitimately operating on the official Instagram API has all three, because without
                them the endpoints simply do not answer. They are the floor, not a feature. Treat
                them as a box to check rather than a reason to choose, and spend your attention on
                the question that genuinely separates tools: whether it is on that API at all.
              </p>
              <p>
                Liffio connects through Instagram Login on the official Instagram API. Its business
                passed business verification and access verification, and its Instagram permissions
                passed App Review. You can see what the connection looks like before committing:
                the free plan asks for no card.
              </p>
            </div>
          </div>
        </section>

        {/* Real risk factors */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What actually gets Instagram accounts restricted
            </h2>
            <dl className="space-y-5">
              {RISK_FACTORS.map((r) => (
                <div key={r.title} className="rounded-2xl border border-[#ffe4e6] bg-white p-5">
                  <dt className="font-semibold text-gray-900">{r.title}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{r.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to vet any Instagram automation tool
            </h2>
            <p className="text-gray-600 mb-8">
              Six checks, none of which require taking anyone&apos;s word for anything.
            </p>
            <ul className="space-y-3 list-none">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-[#f5184c] font-bold mt-0.5" aria-hidden>
                    →
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-gray-600">
              Related reading:{" "}
              <a href="/instagram-comment-to-dm" className="text-[#b20d8f] font-semibold hover:underline">
                how comment-to-DM works
              </a>
              {" · "}
              <a href="/blog/instagram-automation-mistakes" className="text-[#b20d8f] font-semibold hover:underline">
                common automation mistakes
              </a>
              {" · "}
              <a href="/help" className="text-[#b20d8f] font-semibold hover:underline">
                help centre
              </a>
            </p>
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
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              See the connection for yourself
            </h2>
            <p className="text-gray-600 mb-8">
              The fastest way to judge a tool is to start the connect flow and read the screen
              Instagram shows you. Liffio&apos;s free plan asks for no card, so you can get that
              far without committing to anything.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="inline-flex rounded-xl px-10 py-4 text-base font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
            >
              Start free
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Instagram Login · No password shared · Revoke access from Instagram anytime
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
