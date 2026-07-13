import { TechBadge } from "@/components/TechBadge";
import { siteConfig } from "@/config/site.config";

const COMMISSION_MONTHS = [
  { month: "Month 1", rate: "25%", desc: "First payment", color: "#ff7c49", width: "100%" },
  { month: "Month 2", rate: "10%", desc: "Second payment", color: "#f5184c", width: "72%" },
  { month: "Month 3", rate: "10%", desc: "Third payment", color: "#2ea957", width: "72%" },
  { month: "Month 4+", rate: "-", desc: "No further commission", color: "#e5e7eb", width: "24%" },
];

const KEY_STATS = [
  { value: "25%", label: "Month 1 commission", accent: "#ff7c49" },
  { value: "90d", label: "Attribution window", accent: "#f5184c" },
  { value: "$50", label: "Minimum withdrawal", accent: "#b20d8f" },
  { value: "20", label: "Day hold before payout", accent: "#2ea957" },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Create your account",
    desc: "Open to every Liffio user - including Free plan. No separate application.",
  },
  {
    num: "02",
    title: "Copy your affiliate link",
    desc: "Find your unique link in the dashboard. Share it anywhere you promote Liffio.",
  },
  {
    num: "03",
    title: "Refer paying customers",
    desc: "When someone signs up through your link and subscribes within 90 days, you earn.",
  },
  {
    num: "04",
    title: "Withdraw on demand",
    desc: "Request a payout once cleared balance hits $50. No fixed monthly payout schedule.",
  },
];

const PAYOUT_STAGES = [
  { stage: "Pending", desc: "Within 20-day hold", active: false },
  { stage: "Available", desc: "Ready to withdraw", active: true },
  { stage: "Requested", desc: "You submitted payout", active: false },
  { stage: "Approved", desc: "Being processed", active: false },
  { stage: "Paid", desc: "Funds sent", active: false },
];

const ATTRIBUTION_RULES = [
  {
    title: "90-day window",
    desc: "Earn on any workspace subscription purchased within 90 days of the referred user's signup.",
  },
  {
    title: "First click wins",
    desc: "Credit goes to the first affiliate link clicked - later clicks from other affiliates don't override.",
  },
  {
    title: "Per workspace",
    desc: "Each new workspace starts its own 3-month commission cycle inside the attribution window.",
  },
];

const ELIGIBLE_PLANS = [
  { name: "Free", earns: false, note: "No commission" },
  { name: "Starter", earns: true },
  { name: "Business", earns: true },
  { name: "Agency", earns: true },
  { name: "Creators Program", earns: false, note: "No payment" },
];

const PROHIBITED = [
  "Self-referrals or your own devices",
  "Paying others to sign up via your link",
  "Fake accounts or cookie stuffing",
  "Misleading ads or branded keyword bidding without permission",
  "Auto-inserting links in bulk DMs or emails",
];

export default function AffiliateProgramContent() {
  const brand = siteConfig.brand.name;
  const appLogin = siteConfig.urls.appLogin;

  return (
    <>
      {/* Hero */}
      <section
        className="px-4 py-14 text-center sm:py-20"
        style={{ background: "linear-gradient(155deg,#fff1f2 0%,#ffe4e6 50%,#fff4f2 100%)" }}
      >
        <div className="mx-auto max-w-3xl">
          <TechBadge label="Affiliate program" variant="section" className="mb-5" />
          <h1
            className="mb-5 font-extrabold leading-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-outfit,sans-serif)", fontSize: "clamp(2rem,5vw,3.5rem)" }}
          >
            Earn{" "}
            <span className="gradient-text">recurring commissions</span>
            <br className="hidden sm:block" /> for every referral
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Share {brand}, refer paying workspaces, and earn a hybrid commission across each customer&apos;s first three
            months - with reliable tracking and on-demand payouts.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={siteConfig.urls.appSignup} className="btn-primary inline-flex items-center gap-2">
              Join & get your link
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="/affiliate-policy"
              className="inline-flex rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
            >
              Full program policy
            </a>
          </div>
        </div>
      </section>

      {/* Key stats */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 lg:grid-cols-4">
          {KEY_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-8 text-center ${i < KEY_STATS.length - 1 ? "border-b border-brand-100/80 lg:border-b-0 lg:border-r" : ""}`}
            >
              <p
                className="text-3xl font-extrabold tabular-nums sm:text-4xl"
                style={{ fontFamily: "var(--font-outfit,sans-serif)", color: s.accent }}
              >
                {s.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission infographic */}
      <section className="section-py bg-white px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <TechBadge label="Commission structure" variant="chip" accent="#f5184c" className="mb-4" />
            <h2
              className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Hybrid model - first 3 months
            </h2>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Commission applies per referred workspace, independently.
            </p>
          </div>

          <div className="card-base space-y-4 p-6 sm:p-8">
            {COMMISSION_MONTHS.map((row) => (
              <div key={row.month} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-36 sm:flex-col sm:items-start">
                  <span className="text-sm font-bold text-[#0a0a0a]">{row.month}</span>
                  <span
                    className="text-lg font-extrabold tabular-nums"
                    style={{ fontFamily: "var(--font-outfit,sans-serif)", color: row.color === "#e5e7eb" ? "#9ca3af" : row.color }}
                  >
                    {row.rate}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-brand-50">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: row.width, background: row.color }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">{row.desc}</p>
                </div>
              </div>
            ))}
            <p className="border-t border-brand-100 pt-4 text-center text-xs text-gray-500">
              Example: $79/mo Business plan → ~$19.75 month 1, ~$7.90 months 2 & 3 per workspace
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="section-py px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg,#faf9ff 0%,#ffffff 100%)" }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-10 text-center text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="card-base relative p-5 sm:p-6">
                <span className="block text-[10px] font-black tracking-wider text-brand-500">{step.num}</span>
                <h3 className="mt-1 text-base font-bold text-[#0a0a0a]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attribution */}
      <section className="section-py bg-white px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2
              className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Attribution at a glance
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ATTRIBUTION_RULES.map((rule) => (
              <div
                key={rule.title}
                className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/50 to-white p-6 text-center"
              >
                <h3 className="mt-3 font-bold text-[#0a0a0a]">{rule.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{rule.desc}</p>
              </div>
            ))}
          </div>

          {/* Tracking links visual */}
          <div className="card-base mt-8 p-6 sm:p-8">
            <p className="mb-4 text-center text-sm font-semibold text-gray-700">Your tracking links</p>
            <div className="mx-auto flex max-w-lg flex-col gap-3">
              <div className="rounded-xl border border-brand-200 bg-[#0a0a0a] px-4 py-3 font-mono text-sm text-brand-100">
                <span className="text-brand-400">https://</span>liffio.com/?ref=<span className="text-white">yourusername</span>
              </div>
              <div className="rounded-xl border border-brand-200 bg-[#0a0a0a] px-4 py-3 font-mono text-sm text-brand-100">
                <span className="text-brand-400">https://</span>liffio.com/r/<span className="text-white">yourusername</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              Server-side cookie + URL param + session backup - attribution recorded on click
            </p>
            <p className="mt-3 text-center text-xs font-medium text-[#f5184c]">
              <a href={appLogin} className="hover:underline">
                Log in to see your personalised affiliate link →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Payout flow */}
      <section
        className="section-py px-4 sm:px-6"
        style={{ background: "linear-gradient(155deg,#fff1f2 0%,#ffffff 100%)" }}
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-3 text-center text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Payout journey
          </h2>
          <p className="mb-10 text-center text-sm text-gray-500">On-demand withdrawals - no fixed monthly schedule</p>

          <div className="overflow-x-auto pb-2">
            <div className="relative flex min-w-[640px] items-start justify-between px-2">
              <div
                className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100"
                aria-hidden
              />
              {PAYOUT_STAGES.map((item, i) => (
                <div key={item.stage} className="relative z-10 flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      item.active
                        ? "border-brand-500 bg-brand-500 text-white shadow-[0_4px_16px_rgba(245, 24, 76,0.35)]"
                        : "border-brand-200 bg-white text-brand-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p className="mt-2 text-center text-xs font-bold text-[#0a0a0a] sm:text-sm">{item.stage}</p>
                  <p className="mt-0.5 text-center text-[10px] text-gray-500 sm:text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-center">
            <div className="rounded-xl border border-brand-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hold period</p>
              <p className="text-lg font-bold text-[#0a0a0a]">20 days</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Min. withdrawal</p>
              <p className="text-lg font-bold text-[#0a0a0a]">$50</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Processing</p>
              <p className="text-lg font-bold text-[#0a0a0a]">5–10 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligible plans */}
      <section className="section-py bg-white px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-8 text-center text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Which plans earn commission?
          </h2>
          <div className="space-y-2">
            {ELIGIBLE_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex items-center justify-between rounded-xl border px-4 py-3.5 sm:px-5 ${
                  plan.earns ? "border-brand-200 bg-brand-50/30" : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <span className="font-semibold text-[#0a0a0a]">{plan.name}</span>
                <span
                  className={`text-sm font-semibold ${plan.earns ? "text-brand-600" : "text-gray-400"}`}
                >
                  {plan.earns ? "Commission eligible" : plan.note ?? "No commission"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="bg-[#faf9ff] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-6 text-center text-xl font-extrabold text-[#0a0a0a] sm:text-2xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Play fair - prohibited activity
          </h2>
          <ul className="space-y-2.5">
            {PROHIBITED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-red-100/80 bg-white px-4 py-3 text-sm text-gray-700"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs text-red-500" aria-hidden>
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-gray-500">
            Violations may result in forfeited commissions and account suspension.{" "}
            <a href="/affiliate-policy" className="font-semibold text-brand-600 hover:underline">
              Read full policy
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2
            className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Ready to start earning?
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Log in to your dashboard to copy your affiliate link and track referrals.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={appLogin} className="btn-primary w-full sm:w-auto">
              Open dashboard
            </a>
            <a
              href={siteConfig.urls.appSignup}
              className="w-full rounded-xl border border-brand-200 px-6 py-3.5 text-sm font-semibold text-gray-800 sm:w-auto hover:bg-brand-50/50"
            >
              Create free account
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
