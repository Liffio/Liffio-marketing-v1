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
 * The category page. "instagram comment to dm" and its variants are the head
 * term this whole site competes on, and until 2026-10-21 nothing on liffio.com
 * answered it directly: the query landed on the homepage, which sells the
 * product, or on /features, which lists modules. Neither defines the thing.
 *
 * 🔴 EVERY CAPABILITY CLAIM BELOW IS ALREADY LIVE SOMEWHERE ELSE ON THE SITE.
 * Nothing here is a new promise, which is the explicit constraint on this work:
 * the feature set is what it is, and these pages exist to be found, not to
 * extend the offer. Sources, so a reviewer can check rather than trust:
 *   - trigger and reply features: the "Comment to DM automation" group in
 *     src/config/pricing-v4.config.ts
 *   - "Unlimited" automated DMs on every plan: the "DMs" group, same file
 *   - automation workflow counts (3 / 25 / 100 / 250 / 250): the
 *     "Limits: per workspace, never pooled" group, same file
 *   - the 10 to 60 second delay: STATS in src/components/OfficialApiSection.tsx
 *   - prices: src/config/pricing.config.ts, never retyped from memory
 *
 * 🚩 DO NOT restate the Free plan's "500 DMs / month" figure here or anywhere
 * outside pricing-v4.config.ts. There is no enforced DM cap; that number ships
 * because ADR 0004 prints the V4 sheet verbatim, and a 2026-09-11 pass had to
 * undo eight places that had copied it outward. Describe Free by the limit that
 * is actually enforced: 3 automation workflows.
 *
 * 🚩 The credential is stated ONCE, in the hero badge, via metaCopy (which
 * returns null when the flag is off). The safety section below describes the
 * CONNECTION, which is true either way, and links to
 * /is-instagram-dm-automation-safe rather than restating it. See the
 * state-it-once note at the top of src/config/meta-copy.ts.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Instagram Comment to DM Automation, Free to Start | Liffio",
  description:
    "Turn Instagram comments into DMs automatically. Keyword triggers on posts and Reels, unlimited automated DMs on every plan, and a free plan. Official Instagram API.",
  pathname: "/instagram-comment-to-dm",
  ogImagePath: siteConfig.meta.ogImagePath,
  ogImageAlt: siteConfig.meta.ogImageAlt,
});

const faqCategories: FaqCategory[] = [
  {
    id: "comment-to-dm",
    label: "Comment-to-DM FAQ",
    items: [
      {
        id: "what-is-comment-to-dm",
        question: "What is Instagram comment-to-DM automation?",
        answer:
          "Comment-to-DM automation watches a chosen Instagram post or Reel for a keyword in the comments, then sends that commenter a direct message automatically. You tell people to comment a word such as LINK or PRICE, and whoever comments it receives the link, guide, price list or code in their DMs without you typing anything. It is the standard way creators and small shops answer the same question hundreds of times from one post.",
      },
      {
        id: "is-comment-to-dm-free",
        question: "Can I do comment-to-DM for free?",
        answer:
          "Yes. Liffio's free plan includes comment keyword triggers on feed posts and Reels, public comment auto-replies, and unlimited automated DMs, with no credit card and no trial expiry. The free plan runs 3 automation workflows at a time, which covers one keyword each on three posts. Paid plans start at $9 a month (Rs.499 in India) and raise that to 25 workflows, then 100, then 250.",
      },
      {
        id: "does-it-work-on-reels",
        question: "Does comment-to-DM work on Reels?",
        answer:
          "Yes, on both feed posts and Reels, and the behaviour is the same on each. Reels are where most comment-to-DM volume comes from, because a Reel reaches people who do not follow you yet and a comment is the lowest-effort thing they can do. If a Reel takes off, the automation keeps sending whether it draws 50 comments or 50,000, because automated DMs are not capped on any Liffio plan.",
      },
      {
        id: "how-fast-is-the-dm",
        question: "How quickly does the DM arrive?",
        answer:
          "You choose the delay, anywhere from 10 to 60 seconds. Instant replies can read as robotic and a short pause gives the message a conversational rhythm, so most creators sit around 15 to 45 seconds. The delay is set per automation, so a time-sensitive drop can run faster than an evergreen guide.",
      },
      {
        id: "same-person-comments-twice",
        question: "What if the same person comments the keyword twice?",
        answer:
          "Turn on the public reply. A visible comment back, something as plain as 'Sent you a DM with the link', tells the commenter the automation worked and stops them commenting five more times because they assumed it broke. Reply variants let you rotate the wording so a post's comment section does not read as the same sentence forty times over.",
      },
      {
        id: "keyword-choice",
        question: "Which keyword should I use?",
        answer:
          "Short, obvious, and the exact word you said out loud in the video. LINK, GUIDE, PRICE and YES work because they are easy to spell on a phone and easy to remember from a five-second hook. If the Reel says 'comment MENU', do not set the trigger to DOWNLOAD, because people comment what they heard. Excluded keywords are there for the cases where a common word would otherwise fire on unrelated comments.",
      },
    ],
  },
];

const SETUP_STEPS = [
  {
    num: "01",
    title: "Connect Instagram",
    body: "You authorise Liffio on Instagram's own consent screen through Instagram Login. No password is shared with Liffio, and you can revoke access from Instagram whenever you want.",
  },
  {
    num: "02",
    title: "Pick the post or Reel",
    body: "Choose the post the automation should watch. One post, one keyword is the right way to start, because it keeps the reporting readable while you learn what converts.",
  },
  {
    num: "03",
    title: "Set the trigger word",
    body: "Type the keyword exactly as you want it matched. Most people use contains matching so GUIDE also catches a comment reading 'guide please'. Add excluded keywords if the word is common enough to misfire.",
  },
  {
    num: "04",
    title: "Write the DM",
    body: "Two or three short lines. Name the thing they asked for, then give the link, on its own line or as a DM button. Set the delay between 10 and 60 seconds.",
  },
  {
    num: "05",
    title: "Test before you promote it",
    body: "Comment from a second account and check three things: the DM lands, the link opens on a phone, and the public reply reads the way you meant it. Then push the post.",
  },
];

const TRIGGER_FEATURES = [
  { name: "Keyword triggers", body: "The word a commenter types to start the automation." },
  { name: "Excluded keywords", body: "Words that stop an automation firing, for keywords common enough to catch unrelated comments." },
  { name: "Any comment trigger", body: "Fires on every comment on a post, for when you do not want to ask for a specific word." },
  { name: "Public replies", body: "A visible comment back under the original comment, so the commenter knows a DM is coming." },
  { name: "Reply variants", body: "Several versions of the public reply, rotated, so the comment section does not read as one repeated line." },
  { name: "DM button", body: "A tappable button in the DM instead of a bare URL." },
];

export default function InstagramCommentToDmPage() {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Instagram Comment to DM", item: `${SITE_URL}/instagram-comment-to-dm` },
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
                { label: "Instagram Comment to DM", href: "/instagram-comment-to-dm" },
              ]}
            />
            {metaCopy.heroBadge ? (
              <TechBadge label={metaCopy.heroBadge} variant="meta" format="label" className="mb-5" />
            ) : null}
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Instagram Comment to DM Automation
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Someone comments a word on your Reel. They get the link in their DMs seconds later,
              without you opening your inbox. Keyword triggers on posts and Reels, unlimited
              automated DMs on every plan, and a free plan that runs in production.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href={siteConfig.urls.appSignup}
                className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
              >
                Start free
              </a>
              <a
                href="#setup"
                className="inline-flex rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
              >
                See the setup
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              No credit card required · Setup takes about five minutes
            </p>
          </div>
        </section>

        {/* Definition */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What comment-to-DM actually does
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Comment-to-DM automation watches one Instagram post or Reel for a keyword in the
                comments and sends whoever typed it a direct message. You say &quot;comment LINK for
                the guide&quot; in the video, and the tool does the rest: it spots the comment,
                waits the delay you set, and delivers the thing you promised.
              </p>
              <p>
                The reason it works is that the two halves do different jobs. The comment is public,
                so it is social proof and it feeds the algorithm. The DM is private, so it is where
                the link, the price or the booking actually happens. Asking for a comment is also a
                far smaller request than asking someone to leave Instagram and find your bio link,
                which is why a Reel with a keyword prompt converts better than the same Reel saying
                &quot;link in bio&quot;.
              </p>
              <p>
                The work it removes is the dull part. One Reel that lands can pull four hundred
                people asking the same question, and answering them by hand means four hundred
                copy-pastes, with the ones who asked at 2am getting an answer at noon. The
                automation replies to all of them at the same speed.
              </p>
            </div>
          </div>
        </section>

        {/* Setup */}
        <section id="setup" className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to set up comment-to-DM in about five minutes
            </h2>
            <p className="text-gray-600 mb-8">
              Five steps, and the last one is the one people skip.{" "}
              <a href="/blog/how-to-turn-instagram-comments-into-dms" className="text-[#b20d8f] font-semibold hover:underline">
                Read the longer walkthrough →
              </a>
            </p>
            <ol className="space-y-5">
              {SETUP_STEPS.map((step) => (
                <li key={step.num} className="flex gap-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#f5184c,#b20d8f)" }}
                    aria-hidden
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Triggers and replies */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What you can trigger and what the reply can carry
            </h2>
            <p className="text-gray-600 mb-8">
              Every item below is on every plan, free included.
            </p>
            <dl className="grid gap-5 sm:grid-cols-2">
              {TRIGGER_FEATURES.map((f) => (
                <div key={f.name} className="rounded-2xl border border-gray-100 bg-[#faf9ff] p-5">
                  <dt className="font-semibold text-gray-900">{f.name}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              Paid plans add a multi-keyword trigger builder, a follow-before-DM gate, and the option
              to turn Liffio branding off.{" "}
              <a href="/pricing" className="text-[#b20d8f] font-semibold hover:underline">
                See what each plan includes →
              </a>
            </p>
          </div>
        </section>

        {/* Cost */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What comment-to-DM costs
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The DMs themselves are not metered. Automated DMs are unlimited on every Liffio
                plan, free included, and there is no per-contact fee, so a Reel that outperforms
                does not produce a bill you did not plan for. What the plan decides is how many
                automation workflows you can have running at once: 3 on Free, 25 on Starter, 100 on
                Growth, and 250 on Business and Agency.
              </p>
              <p>
                Paid plans start at $9 a month, or Rs.499 with native INR billing and GST-friendly
                invoices through Razorpay. The free plan is not a trial: it has no expiry and asks
                for no card.
              </p>
              <p>
                <a href="/unlimited-instagram-dms" className="text-[#b20d8f] font-semibold hover:underline">
                  What unlimited DMs means in practice →
                </a>
                {" · "}
                <a href="/compare" className="text-[#b20d8f] font-semibold hover:underline">
                  Compare Liffio with other comment-to-DM tools →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              It runs on the official Instagram API
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                You connect through Instagram Login, which means you approve the permissions on
                Instagram&apos;s own consent screen. Liffio never asks for, sees or stores your
                password, and you can revoke access from Instagram at any time without talking to
                anyone.
              </p>
              <p>
                That distinction matters more than any feature on this page. The tools that get
                accounts restricted are generally the ones that sign in as you and drive the app in
                a browser, because to Instagram that traffic is indistinguishable from a bot
                operating your account. An automation running on the documented API is doing
                something Instagram built an endpoint for.
              </p>
              <p>
                <a href="/is-instagram-dm-automation-safe" className="text-[#b20d8f] font-semibold hover:underline">
                  Is Instagram DM automation safe? The full answer →
                </a>
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
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              Set up your first keyword today
            </h2>
            <p className="text-gray-600 mb-8">
              Connect Instagram, pick a post, type a word. The free plan runs three automations with
              no card and no expiry.
            </p>
            <a
              href={siteConfig.urls.appSignup}
              className="inline-flex rounded-xl px-10 py-4 text-base font-semibold text-white shadow-lg [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
            >
              Start free
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Unlimited automated DMs on every plan · No per-contact fees · Official Instagram API
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
