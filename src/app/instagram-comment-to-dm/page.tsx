import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
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
 * 2026-11-13: expanded from a ~1,800 word overview to a full walkthrough. The
 * page sat at average position 7.1 on 10 impressions, which is the signal of a
 * page Google is willing to rank and users are not willing to click. The SERP
 * for these queries is procedural how-to content, so the page now TEACHES the
 * mechanism (webhook -> keyword match -> delay -> DM), the two platform rules
 * that every tool lives under, and the setup in order, with a hub of internal
 * links for the comment-to-DM cluster in body copy rather than a link block.
 *
 * 🔴 EVERY CAPABILITY CLAIM BELOW IS ALREADY LIVE SOMEWHERE ELSE ON THE SITE.
 * Nothing here is a new promise, which is the explicit constraint on this work:
 * the feature set is what it is, and these pages exist to be found, not to
 * extend the offer. Sources, so a reviewer can check rather than trust:
 *   - trigger and reply features: the "Comment to DM automation" group in
 *     src/config/pricing-v4.config.ts
 *   - "Unlimited" automated DMs on every plan: the "DMs" group, same file
 *   - automation workflow counts (3 / 50 / unlimited from Growth up): the
 *     "Limits: per workspace, never pooled" group, same file
 *   - follow before DM and follow-up sequences are STARTER AND UP, not Free:
 *     Free's "DM follow-ups" limit is 0 and "Follow before DM" is listed in
 *     Starter's includes. Never describe either as a free-plan feature.
 *   - 2 live chatbots on Free: the "Live chatbots" limit, same file
 *   - the 10 to 60 second delay: STATS in src/components/OfficialApiSection.tsx
 *   - prices: src/config/pricing.config.ts, never retyped from memory
 *   - analytics chain is comment -> DM -> click. There is no sale or revenue
 *     tracking: see FEATURE_SALE_TRACKING in src/config/feature-flags.ts.
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
 *
 * 🚩 NOT ON THIS PAGE, each one flag-gated off in src/config/feature-flags.ts:
 * story emoji reactions, welcome DMs / new-follower triggers, comment and
 * caption @mention triggers, branching or conditional logic, DM flows that ASK
 * for an email or phone number, CRM or Zapier integrations and outbound
 * webhooks, and revenue tracking. Story REPLIES and story MENTIONS do ship and
 * are safe to name.
 *
 * 🔵 The two platform rules in "What happens between the comment and the DM"
 * are Instagram's, not Liffio's: one private reply per comment, inside a 7 day
 * window, and DMs to non-followers landing in message requests. They apply to
 * every tool on the official API. Keep them attributed to the platform.
 */

export const metadata: Metadata = buildPageMetadata({
  // 58 chars / ~530px at Arial 20px, inside the ~580px house target. The old
  // title led with "Free to Start", which reads as an ad in a SERP of how-to
  // guides; "Setup Guide" matches what the page now is and what wins the click.
  title: "Instagram Comment to DM Automation: Setup Guide | Liffio",
  description:
    "How Instagram comment to DM works, step by step: keyword triggers on posts and Reels, the one reply per comment rule, and unlimited DMs on every plan.",
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
          "Yes. Liffio's free plan includes comment keyword triggers on feed posts and Reels, public comment auto-replies, and unlimited automated DMs, with no credit card and no trial expiry. The free plan runs 3 automation workflows at a time, which covers one keyword each on three posts. Paid plans start at $9 a month (Rs.499 in India) and raise that to 50 workflows, then unlimited from Growth up.",
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
        id: "one-dm-per-comment",
        question: "Can one comment trigger more than one DM?",
        answer:
          "No, and this is a platform rule rather than a tool limit. Instagram's Private Replies API allows exactly one private reply per comment, and only within 7 days of that comment being posted. So a single comment gets a single automated DM, from any tool, Liffio included. Two separate comments from the same person are two comments, and each can receive its own reply, which is usually why somebody reports getting the message twice. Follow-ups are still possible, but only after the person replies to you, and they have to go out within 24 hours of that reply. That is how a follow-up sequence stays inside the rules. The 7 day window is also why you set the automation up before you promote the post: once a comment is older than a week, its private reply slot has closed for good.",
      },
      {
        id: "do-they-need-to-follow-me",
        question: "Does the person need to follow me to receive the DM?",
        answer:
          "No. Anyone who comments the keyword can receive the DM whether they follow you or not. What changes is where it lands: Instagram files messages from accounts you do not follow under message requests rather than in the main inbox. That is Instagram's behaviour and it applies to every tool on the official API. Two things help: say \"check your message requests\" in the video, and repeat it in the public comment reply.",
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
      {
        id: "why-did-nothing-send",
        question: "The keyword was commented and no DM arrived. What now?",
        answer:
          "Work through it in this order. Check the automation is switched on and pointed at the post you are actually promoting, since a duplicate draft is the most common cause. Check the keyword against what people really typed, because 'guide please' only matches GUIDE with contains matching on. Check message requests on the test account, not just the inbox. And check whether that comment already used its one private reply, which is what makes a repeat test look like a failure.",
      },
    ],
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

const TROUBLESHOOTING = [
  {
    title: "The DM is in message requests, not the inbox",
    body: "If the recipient does not follow you, Instagram files your message under requests. Nothing is broken and no tool can change it. Say so in the video and in the public reply, and a good share of the confused replies disappear.",
  },
  {
    title: "The keyword did not match what people typed",
    body: "People comment what they heard, with typos, emoji and extra words. Contains matching catches 'guide pls' and 'GUIDE!!' where exact matching does not. If a word is common enough to fire on ordinary conversation, keep it and add the offenders as excluded keywords rather than inventing a stranger keyword nobody remembers.",
  },
  {
    title: "The comment already used its one private reply",
    body: "One private reply per comment, within 7 days, is the platform rule. A comment that has already been answered cannot be answered again, so re-testing with the same comment looks like a failure when it is not. Use a fresh comment every time. Once the person replies to you, the conversation reopens and you can send follow-ups within 24 hours of their reply.",
  },
  {
    title: "The automation is on the wrong post",
    body: "Two drafts of the same automation, one pointed at the old version of the Reel, is the single most common setup mistake. Open the automation and confirm the post thumbnail is the one you are about to promote.",
  },
  {
    title: "The DM landed but nobody clicked",
    body: "That is a copy problem, not a delivery problem. Check the analytics chain: comments, DMs sent, then clicks. If DMs are high and clicks are low, the message is asking for too much, the link is buried, or the thing you promised in the video is not the thing in the DM.",
  },
];

function SetupStep({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg,#f5184c,#b20d8f)" }}
        aria-hidden
      >
        {num}
      </span>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="mt-1 space-y-2 text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </li>
  );
}

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
              <p>
                It is worth saying what this is not. Comment-to-DM is not mass messaging and it does
                not go looking for people: every DM is a reply to something a specific person did on
                your own post, seconds earlier, after you asked them to. That is why it keeps
                working. For the long version of that argument, including what genuinely does get
                accounts restricted, read{" "}
                <a href="/is-instagram-dm-automation-safe" className="text-[#b20d8f] font-semibold hover:underline">
                  whether Instagram DM automation is safe
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Mechanism: the part competitors do not explain */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What happens between the comment and the DM
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Four things, in order. Instagram notices a new comment on a post belonging to a
                connected account and pushes that event to the tool. The tool compares the comment
                text with your keyword. If it matches, the reply is queued. After the delay you set,
                between 10 and 60 seconds, the DM goes out through Instagram&apos;s own messaging
                endpoint, and the public comment reply posts if you turned one on.
              </p>
              <p>
                That is the whole loop, and knowing it saves a lot of guessing later. There is no
                browser pretending to be you, no scraping of your comment section, and nothing
                running on a schedule: the chain starts with an event Instagram sends.
              </p>
              <h3 className="text-lg font-bold text-gray-900 pt-2" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                Rule one: one private reply per comment, inside 7 days
              </h3>
              <p>
                Instagram&apos;s Private Replies API, which is the mechanism that lets a business DM
                somebody because they commented, allows exactly one private reply per comment, and
                only within 7 days of that comment being posted. Every tool on the official API
                lives under that rule, Liffio included, and no amount of settings changes it. Once
                that person replies to you, the conversation reopens and follow-ups can go out
                within 24 hours of their reply, which is the window follow-up sequences run in.
              </p>
              <p>
                Two practical consequences. A single comment produces a single automated DM, so
                re-testing with a comment you already used looks like a broken automation when
                nothing is wrong: use a fresh comment each time. And set the automation up before
                you promote the post, because a comment older than a week has lost its private reply
                slot permanently. That is why nobody can point an automation at last
                month&apos;s viral Reel and DM everyone in the thread.
              </p>
              <h3 className="text-lg font-bold text-gray-900 pt-2" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                Rule two: non-followers get it in message requests
              </h3>
              <p>
                When you message somebody who does not follow your account, Instagram puts that
                message in their message requests folder rather than their main inbox. This is
                Instagram behaviour, not a tool limitation, and it is the single most common reason
                a creator thinks the automation failed when it delivered fine.
              </p>
              <p>
                It bites hardest on exactly the posts you care about, since a Reel that travels
                beyond your followers is mostly commented on by people who do not follow you yet.
                Two habits fix it: say &quot;check your message requests&quot; out loud in the
                video, and put the same line in the public comment reply.
              </p>
            </div>
          </div>
        </section>

        {/* Setup walkthrough */}
        <section id="setup" className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              How to set up comment-to-DM, step by step
            </h2>
            <p className="text-gray-600 mb-8">
              About five minutes end to end, and the last step is the one people skip. If you have
              never built one before, the{" "}
              <a href="/blog/first-comment-keyword-trigger" className="text-[#b20d8f] font-semibold hover:underline">
                first keyword trigger walkthrough
              </a>{" "}
              covers the same ground at a slower pace, and{" "}
              <a href="/blog/how-to-turn-instagram-comments-into-dms" className="text-[#b20d8f] font-semibold hover:underline">
                the longer guide to turning comments into DMs
              </a>{" "}
              adds the campaign side.
            </p>
            <ol className="space-y-8">

              <SetupStep num="01" title="Connect your Instagram account">
                <p>
                  You authorise Liffio on Instagram&apos;s own consent screen through Instagram
                  Login. Instagram lists the permissions being requested, you approve them there,
                  and Liffio receives a token scoped to those permissions. No password is shared
                  with Liffio, and you can revoke access from your Instagram settings whenever you
                  want, without asking anyone.
                </p>
                <p>
                  Your account needs to be a professional account, business or creator, because the
                  messaging permissions only exist for those. Switching is free and takes a minute
                  in Instagram&apos;s own settings.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <Image
                    src="/screenshots/instagram-connection.png"
                    alt="Liffio Instagram connection settings showing the connected professional account marked healthy, its token expiry, reconnect and disconnect, and the DM send rate limit"
                    width={1015}
                    height={678}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              </SetupStep>

              <SetupStep num="02" title="Pick the post or Reel the automation watches">
                <p>
                  Create a new comment-to-DM automation and choose which post it listens to. Start
                  with one post and one keyword. It keeps the numbers readable while you learn what
                  your audience actually responds to, and a single automation is much easier to
                  debug than three overlapping ones.
                </p>
                <p>
                  Publish the Reel, build the automation against it, test it, and only then start
                  pushing the post. Because of the 7 day private reply window, every minute the post
                  is live without the automation running is comments you cannot go back and answer.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <Image
                    src="/screenshots/automation-choose-post.png"
                    alt="The first step of the Liffio automation builder, choosing between picking an existing post or auto-attaching to the next upload, with the selected post shown"
                    width={1015}
                    height={678}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              </SetupStep>

              <SetupStep num="03" title="Set the trigger word">
                <p>
                  Type the keyword exactly as you want it matched, and use the same word you said
                  out loud in the video. Most people use contains matching, so GUIDE also catches
                  &quot;guide please&quot; and &quot;GUIDE!!&quot;, which is how people really
                  comment. Short and obvious beats clever: LINK, GUIDE, PRICE, MENU, YES.
                </p>
                <p>
                  Add excluded keywords if your trigger word is common enough to fire on ordinary
                  conversation. If you would rather not ask for a word at all, the any-comment
                  trigger replies to everyone who comments on that post, which suits giveaways where
                  the comment itself is the entry.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <Image
                    src="/screenshots/automation-post-grid-keywords.png"
                    alt="The Liffio post grid with one Reel selected, above the keywords and response step showing GUIDE set as the trigger keyword"
                    width={1015}
                    height={678}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              </SetupStep>

              <SetupStep num="04" title="Write the DM">
                <p>
                  Two or three short lines. Name the thing they asked for in the first line so it is
                  obvious this is the message they expected, then give the link, either on its own
                  line or as a tappable DM button. Resist the urge to pitch in the same message: the
                  person raised their hand for one specific thing, and the fastest way to get
                  blocked is to be a disappointment.
                </p>
                <p>
                  Write it the way you talk. The DM arrives from your account, so a message that
                  sounds like a brochure undoes the goodwill the Reel earned. Worked examples are in
                  the{" "}
                  <a href="/blog/instagram-dm-scripts-that-convert" className="text-[#b20d8f] font-semibold hover:underline">
                    Instagram DM scripts guide
                  </a>
                  .
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <Image
                    src="/screenshots/automation-dm-composer.png"
                    alt="The Liffio DM composer showing the public comment reply, the DM message with its character count, and a button with a label and URL attached under the DM"
                    width={1015}
                    height={678}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              </SetupStep>

              <SetupStep num="05" title="Set the delay and the public reply">
                <p>
                  Pick a delay between 10 and 60 seconds. An instant reply reads as robotic, and
                  most creators sit somewhere between 15 and 45 seconds. Shorter for a time
                  sensitive drop, longer for an evergreen freebie.
                </p>
                <p>
                  Then turn on the public comment reply. One visible line, something as plain as
                  &quot;Sent, check your message requests&quot;, does two jobs: it tells the
                  commenter the automation worked so they stop commenting again, and it tells
                  everyone scrolling the comments that the thing is real. Add a few reply variants so
                  forty identical sentences do not stack up under the post.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <Image
                    src="/screenshots/automation-delivery-settings.png"
                    alt="Liffio automation settings showing ask to follow before DM, the Liffio branding toggle, hand off to a chatbot, and an empty follow-up sequence"
                    width={1015}
                    height={678}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              </SetupStep>

              <SetupStep num="06" title="Test it from a second account, then promote the post">
                <p>
                  Switch the automation on and comment the keyword from an account that is not
                  yours. Check three things: the DM arrives, the link opens properly on a phone, and
                  the public reply reads the way you meant it. Look in message requests on the test
                  account, not just the inbox, and remember that each test needs a brand new comment
                  because of the one reply per comment rule.
                </p>
                <p>
                  Once it works, push the post and watch the chain: comments, then DMs sent, then
                  link clicks. The gap between any two of those tells you what to fix. Lots of
                  comments and few DMs is usually a keyword mismatch; lots of DMs and few clicks is
                  the message copy.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <Image
                    src="/screenshots/analytics-overview.png"
                    alt="The Liffio analytics panel showing DMs sent, link clicks, leads captured and lead to click rate, with a daily activity chart for DMs, clicks and leads"
                    width={1015}
                    height={678}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              </SetupStep>

            </ol>
          </div>
        </section>

        {/* Triggers and replies */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What you can trigger and what the reply can carry
            </h2>
            <p className="text-gray-600 mb-8">
              Every item below is on every plan, free included.
            </p>
            <dl className="grid gap-5 sm:grid-cols-2">
              {TRIGGER_FEATURES.map((f) => (
                <div key={f.name} className="rounded-2xl border border-gray-100 bg-white p-5">
                  <dt className="font-semibold text-gray-900">{f.name}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              Paid plans add a multi-keyword trigger builder, a follow-before-DM gate, follow-up
              sequences for the people who do not reply the first time, and the option to turn
              Liffio branding off. Comments are not the only trigger: story replies and story
              mentions start the same kind of automation from a Story.{" "}
              <a href="/pricing" className="text-[#b20d8f] font-semibold hover:underline">
                See what each plan includes →
              </a>
            </p>
          </div>
        </section>

        {/* Use cases by audience */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-10" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What people actually use comment-to-DM for
            </h2>
            <div className="space-y-10">

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Creators
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The classic one: a Reel that teaches something small, ending with &quot;comment
                  GUIDE and I will send you the whole thing&quot;. The guide, template, playlist or
                  notion board goes out automatically, and the comment count that comes with it
                  pushes the Reel further than a bio link ever would. Three posts running at once is
                  plenty to learn from, which is exactly what the free plan&apos;s 3 automation
                  workflows cover.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  The part creators underrate is reusing the winner. A keyword automation on an
                  evergreen Reel keeps delivering for months with no further work, so rebuilding
                  your best performing post with a cleaner hook usually beats chasing a new idea. On
                  paid plans, the follow-before-DM gate turns the same post into follower growth,
                  and follow-up sequences give you a second line to the people who opened the first
                  message and did nothing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Online stores
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Launches and restocks, mostly. A post announcing the drop, a keyword, and the DM
                  carries the product link or a code. The automation catches people at the moment
                  they are looking at the product rather than hoping they come back through a bio
                  link later, and it handles the questions that otherwise eat your afternoon: sizing,
                  shipping, stock, price. One automation per repeat question is a reasonable way to
                  start.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Because DMs are unlimited on every plan, a post that outperforms does not turn into
                  a bill, which matters more for stores than for anyone: your best day should not be
                  your most expensive one. The analytics follow the chain from comment to DM to
                  click, so you can tell which posts produce intent rather than noise. Longer version
                  in{" "}
                  <a href="/blog/comment-to-dm-for-online-stores" className="text-[#b20d8f] font-semibold hover:underline">
                    comment-to-DM for online stores
                  </a>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Coaches and course sellers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Here the DM is the top of a longer conversation, so the thing you send matters more
                  than the speed. A webinar replay, a syllabus, a price list, an application form:
                  one keyword each, often on different posts, so you can tell which content pulls
                  buyers rather than browsers. PRICE is a good keyword to run deliberately, because
                  the people who comment it have told you something useful about themselves.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  If somebody shares their email in the DM thread it is stored with that lead, and
                  you can export the list as a CSV. Keep the first message to one job: sending the
                  replay, the application and a discount in one DM reliably gets you none of the
                  three, and follow-up sequences on paid plans exist so the second ask can arrive
                  later.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
                  Agencies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Agencies run the same three or four automation shapes across a lot of accounts, so
                  what decides the tool is the billing and the admin rather than the feature list.
                  One workspace connects one Instagram account, and the Agency plan bundles 20
                  workspaces into a single subscription with one invoice and one renewal date.
                  Branding comes off from Starter up, which matters when the client sees the DM.
                </p>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  The per-contact pricing used by the bigger multi-channel platforms is worth
                  modelling before you commit, because it turns a client&apos;s good month into your
                  bad one. That comparison is the whole point of the{" "}
                  <a href="/manychat-alternative" className="text-[#b20d8f] font-semibold hover:underline">
                    free ManyChat alternative breakdown
                  </a>
                  , and there are head to head pages for the Instagram-only tools too:{" "}
                  <a href="/vs/replyrush" className="text-[#b20d8f] font-semibold hover:underline">
                    Liffio versus ReplyRush
                  </a>{" "}
                  and{" "}
                  <a href="/vs/linkdm" className="text-[#b20d8f] font-semibold hover:underline">
                    Liffio versus LinkDM
                  </a>
                  .
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              When it does not work, it is usually one of these five things
            </h2>
            <p className="text-gray-600 mb-8">
              In rough order of how often each one turns out to be the answer.
            </p>
            <dl className="space-y-5">
              {TROUBLESHOOTING.map((t) => (
                <div key={t.title} className="rounded-2xl border border-[#ffe4e6] bg-white p-5">
                  <dt className="font-semibold text-gray-900">{t.title}</dt>
                  <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{t.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              The pattern behind most of them is promising one thing in the video and setting up
              another in the builder. There is a longer list of the ways this goes wrong in{" "}
              <a href="/blog/instagram-automation-mistakes" className="text-[#b20d8f] font-semibold hover:underline">
                common Instagram automation mistakes
              </a>
              .
            </p>
          </div>
        </section>

        {/* Cost */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
              What comment-to-DM costs
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The DMs themselves are not metered. Automated DMs are unlimited on every Liffio
                plan, free included, and there is no per-contact fee, so a Reel that outperforms
                does not produce a bill you did not plan for. What the plan decides is how many
                automation workflows you can have at once: 3 on Free and 50 on Starter. Unlimited
                automations from Growth up. Chatbots are counted separately, with 2 live chatbots on
                the free plan.
              </p>
              <p>
                Paid plans start at $9 a month, or Rs.499 with native INR billing and GST-friendly
                invoices through Razorpay. The free plan is not a trial: it has no expiry and asks
                for no card.
              </p>
              <p>
                Unlimited DMs on a free plan is unusual enough to be worth checking against whatever
                else you are considering, because the pricing model is the part you feel in six
                months.{" "}
                <a href="/unlimited-instagram-dms" className="text-[#b20d8f] font-semibold hover:underline">
                  What unlimited DMs means in practice →
                </a>
                {" · "}
                <a href="/compare" className="text-[#b20d8f] font-semibold hover:underline">
                  Compare Liffio with other comment-to-DM tools →
                </a>
                {" · "}
                <a href="/vs/instachamp" className="text-[#b20d8f] font-semibold hover:underline">
                  Liffio versus InstaChamp →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="py-16 bg-[#fff7f7] border-y border-[#ffe4e6]">
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
                It is also why the two rules higher up this page are worth knowing. One private
                reply per comment and a 7 day window are not somebody&apos;s product decision, they
                are the shape of the endpoint, and a tool that claims to get around either of them
                is telling you it is not using it.
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
