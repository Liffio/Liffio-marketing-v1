import { SEO_KEYWORDS, COMPETITORS } from "@/config/seo.config";

const CAPABILITIES = [
  {
    term: "Auto DM Tool",
    detail:
      "The best auto DM tool for Instagram - send automated DMs when someone comments, replies to a story, or messages you. Human-like delays (10-60 seconds) keep your account safe.",
  },
  {
    term: "Auto DMs for Instagram",
    detail:
      "Set up auto DMs that fire on keyword triggers. Whether someone comments 'LINK' or 'INFO', Liffio sends your pre-written DM automatically - 24/7, even while you sleep.",
  },
  {
    term: "Auto Comment Reply Tool",
    detail:
      "Public comment reply plus a private auto DM from the same keyword trigger. Every comment becomes a conversation with your auto comment tool.",
  },
  {
    term: "Comment-to-DM Automation",
    detail:
      "The signature workflow of ManyChat, SendDM, and LinkDM - now with unlimited auto DMs on every plan. Turn post and Reel comments into automated DM flows.",
  },
  {
    term: "DM Automation Software",
    detail:
      "Multi-step DM sequences, follow gates, re-engagement campaigns, and welcome messages for new followers - all in one DM automation tool dashboard.",
  },
  {
    term: "Instagram Auto Reply",
    detail:
      "Auto-reply to story mentions, reactions, live comments, and inbound DMs. Never miss a lead with Instagram auto reply automation.",
  },
] as const;

const USE_CASES = [
  {
    title: "For Creators & Influencers",
    description:
      "Use auto DM tools to deliver lead magnets, discount codes, and exclusive content to your followers. Comment 'LINK' workflows convert passive scrollers into email subscribers.",
  },
  {
    title: "For E-commerce & DTC Brands",
    description:
      "Auto DMs turn every Instagram comment into a sales opportunity. Send product links, promo codes, and cart recovery messages with DM automation.",
  },
  {
    title: "For Coaches & Course Creators",
    description:
      "Qualify leads inside Instagram DMs with auto reply flows. Collect emails, schedule calls, and nurture prospects - all on autopilot with auto DM software.",
  },
  {
    title: "For Agencies & Marketing Teams",
    description:
      "Manage multiple Instagram accounts with white-label DM automation. Scale auto comment reply and auto DM campaigns across all your client brands.",
  },
] as const;

/** Indexable, keyword-aligned copy for search - visible on the page, not hidden. */
export default function SeoDiscoverabilitySection() {
  return (
    <section
      aria-labelledby="seo-discoverability-heading"
      className="border-t border-brand-100/60 bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main heading with primary keywords */}
        <h2
          id="seo-discoverability-heading"
          className="max-w-4xl text-2xl font-extrabold leading-tight text-[#0a0a0a] sm:text-3xl lg:text-4xl"
          style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
        >
          The #1 Auto DM Tool for Instagram - Auto DMs, Auto Comment Reply & DM Automation
        </h2>
        
        {/* Keyword-rich intro paragraph */}
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
          Looking for an <strong className="font-semibold text-gray-800">auto DM tool</strong>? Liffio is the{" "}
          <strong className="font-semibold text-gray-800">Instagram auto DM</strong> software that automates your entire
          DM strategy. Whether you need <strong className="font-semibold text-gray-800">auto DMs</strong> from comments,{" "}
          <strong className="font-semibold text-gray-800">auto comment reply</strong> workflows, or full{" "}
          <strong className="font-semibold text-gray-800">DM automation</strong> - Liffio handles it all with unlimited
          automated messages on every plan.
        </p>
        
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
          If you've used{" "}
          {COMPETITORS.map((c, i) => (
            <span key={c}>
              <strong className="font-semibold text-gray-800">{c}</strong>
              {i < COMPETITORS.length - 1 ? ", " : ""}
            </span>
          ))}{" "}
          or similar <strong className="font-semibold text-gray-800">auto DM tools</strong>, you'll feel right at home.
          Same powerful comment-to-DM automation, keyword triggers, and story reply features - with simpler pricing and a
          generous free tier to get started.
        </p>

        {/* Capability cards */}
        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ term, detail }) => (
            <div key={term} className="rounded-2xl border border-brand-100/80 bg-[#faf9ff]/60 p-5">
              <dt className="text-sm font-bold text-[#0a0a0a]">{term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-600">{detail}</dd>
            </div>
          ))}
        </dl>

        {/* Use cases section */}
        <div className="mt-16">
          <h3
            className="text-xl font-extrabold text-[#0a0a0a] sm:text-2xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Who Uses Auto DM Tools?
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {USE_CASES.map(({ title, description }) => (
              <div key={title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold text-[#0a0a0a]">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Liffio section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#faf8ff] to-white p-6 sm:p-8">
          <h3
            className="text-xl font-extrabold text-[#0a0a0a] sm:text-2xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Why Choose Liffio as Your Auto DM Software?
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">✓</span>
              <span><strong className="font-semibold text-gray-800">Unlimited auto DMs</strong> on every plan - no message caps or throttling</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">✓</span>
              <span><strong className="font-semibold text-gray-800">Free auto DM tool tier</strong> - start automating without a credit card</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">✓</span>
              <span><strong className="font-semibold text-gray-800">Comment-to-DM + auto comment reply</strong> in one workflow</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">✓</span>
              <span><strong className="font-semibold text-gray-800">Human-like delays (10-60s)</strong> - keeps your Instagram account safe</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">✓</span>
              <span><strong className="font-semibold text-gray-800">ManyChat / SendDM alternative</strong> - same features, simpler pricing</span>
            </li>
          </ul>
        </div>

        {/* Popular searches footer */}
        <p className="mt-10 text-xs leading-relaxed text-gray-500">
          <strong className="font-semibold text-gray-600">Popular searches:</strong>{" "}
          {SEO_KEYWORDS.slice(0, 15).join(" · ")}.
        </p>
      </div>
    </section>
  );
}
