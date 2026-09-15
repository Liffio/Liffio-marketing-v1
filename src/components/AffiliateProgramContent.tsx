import { TechBadge } from "@/components/TechBadge";
import { siteConfig } from "@/config/site.config";
import {
  ATTRIBUTION_WINDOW_DAYS,
  COMMISSION_RATE,
  GRACE_PERIOD_DAYS,
  HOLD_PERIOD_DAYS,
  MINIMUM_WITHDRAWAL_USD,
  NET_REVENUE_BASIS_NOTE,
  PAYOUT_PROCESSING_DAYS,
  PROJECTION_DISCLAIMER,
  REFERRED_USER_FIRST_PAYMENT_DISCOUNT,
} from "@/config/affiliate.config";
import {
  currencySymbolOf,
  formatMoneyPrecise,
  isZeroPrice,
  parseDisplayAmount,
  type PricingPlan,
} from "@/config/pricing.config";

const RATE_LABEL = `${Math.round(COMMISSION_RATE * 100)}%`;
const DISCOUNT_LABEL = `${Math.round(REFERRED_USER_FIRST_PAYMENT_DISCOUNT * 100)}%`;

/*
  🔴 The commission model is the policy's: Section 2.1 pays 50% of Net Revenue
  on EVERY payment a referred workspace makes, for as long as its subscription
  runs unbroken. This block used to draw a 25% / 10% / 10% taper that stopped at
  month three and a "Month 4+ / No further commission" row, none of which the
  policy has ever said. The rate is the same on every row now, because that is
  the product: what changes down the column is only the discount on the referred
  user's first payment, which Section 2.3 grants and Section 2.2 then takes out
  of Net Revenue before commission is worked out.
*/
const COMMISSION_MONTHS = [
  {
    month: "First payment",
    rate: RATE_LABEL,
    desc: `Of Net Revenue, after their ${DISCOUNT_LABEL} first-payment discount`,
    color: "#ff7c49",
    width: "90%",
  },
  {
    month: "Month 2",
    rate: RATE_LABEL,
    desc: "Of Net Revenue on the full price",
    color: "#f5184c",
    width: "100%",
  },
  {
    month: "Month 3",
    rate: RATE_LABEL,
    desc: "Of Net Revenue on the full price",
    color: "#2ea957",
    width: "100%",
  },
  {
    month: "Month 4 onwards",
    rate: RATE_LABEL,
    desc: "Unchanged, for the life of the subscription",
    color: "#b20d8f",
    width: "100%",
  },
];

const KEY_STATS = [
  { value: RATE_LABEL, label: "Lifetime recurring commission", accent: "#ff7c49" },
  { value: `${ATTRIBUTION_WINDOW_DAYS}d`, label: "Attribution window", accent: "#f5184c" },
  { value: `${MINIMUM_WITHDRAWAL_USD}`, label: "Minimum withdrawal", accent: "#b20d8f" },
  { value: String(HOLD_PERIOD_DAYS), label: "Day hold before payout", accent: "#2ea957" },
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
    desc: `When someone signs up through your link and subscribes within ${ATTRIBUTION_WINDOW_DAYS} days, you earn on every payment they make.`,
  },
  {
    num: "04",
    title: "Withdraw on demand",
    desc: `Request a payout once cleared balance hits ${MINIMUM_WITHDRAWAL_USD}. No fixed monthly payout schedule.`,
  },
];

// Section 6.4 of the policy live at /affiliate-policy, which lists exactly
// these five. The unpublished Markdown revision adds a sixth, "Scheduled", for
// annual-plan instalments; it is deliberately NOT drawn here, because the
// published policy pays an annual referral as a single commission event and
// this page must not describe a payout stage the live document does not have.
const PAYOUT_STAGES = [
  { stage: "Pending", desc: `Within ${HOLD_PERIOD_DAYS}-day hold`, active: false },
  { stage: "Available", desc: "Ready to withdraw", active: true },
  { stage: "Requested", desc: "You submitted payout", active: false },
  { stage: "Approved", desc: "Being processed", active: false },
  { stage: "Paid", desc: "Funds sent", active: false },
];

const ATTRIBUTION_RULES = [
  {
    title: `${ATTRIBUTION_WINDOW_DAYS}-day window`,
    desc: `Earn on any workspace subscription purchased within ${ATTRIBUTION_WINDOW_DAYS} days of the referred user's signup.`,
  },
  {
    title: "First click wins",
    desc: "Credit goes to the first affiliate link clicked - later clicks from other affiliates don't override.",
  },
  {
    // Section 2.4: per workspace, independently, and a lapse on one leaves the
    // others alone. Not a "3-month commission cycle", which nothing grants.
    title: "Per workspace",
    desc: "Each workspace earns its own commission stream, independently, for as long as that workspace stays subscribed.",
  },
];

const PROHIBITED = [
  "Self-referrals or your own devices",
  "Paying others to sign up via your link",
  "Fake accounts or cookie stuffing",
  "Misleading ads or branded keyword bidding without permission",
  "Auto-inserting links in bulk DMs or emails",
];

export default function AffiliateProgramContent({ plans }: { plans: PricingPlan[] }) {
  const brand = siteConfig.brand.name;
  const appLogin = siteConfig.urls.appLogin;

  /*
    🚩 Both the eligibility list and the worked example are DERIVED from the
    catalogue the pricing cards render, never written down. The hardcoded list
    here omitted Growth for as long as Growth was unsellable and then stayed
    wrong after it went on sale, and the worked example quoted a taper that the
    policy does not grant. Deriving both means a repricing or a new tier moves
    this page on its own, and `npm run check:prices` covers it.
  */
  const paidPlans = plans.filter((plan) => !isZeroPrice(plan.monthly));
  const eligiblePlans = [
    ...plans.map((plan) => ({
      name: plan.name,
      earns: !isZeroPrice(plan.monthly),
      note: isZeroPrice(plan.monthly) ? "No payment, no commission" : undefined,
    })),
    { name: "Creators Program", earns: false, note: "No payment" },
  ];

  // Section 2.7 works its example on the tier a referrer is likeliest to quote.
  // Both the cheapest paid tier and the mid tier are shown, because "50% of
  // Net Revenue" means nothing until it is a number someone can check.
  const cheapest = paidPlans[0];
  const example = paidPlans.find((plan) => plan.name === "Business") ?? paidPlans.at(-1);
  const commissionOn = (plan: PricingPlan | undefined) => {
    if (!plan) return null;
    const amount = parseDisplayAmount(plan.monthly);
    if (amount === null) return null;
    return formatMoneyPrecise(amount * COMMISSION_RATE, currencySymbolOf(plan.monthly));
  };
  const cheapestCommission = commissionOn(cheapest);
  const exampleCommission = commissionOn(example);

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
            Share {brand}, refer paying workspaces, and earn {RATE_LABEL} of Net Revenue on every payment they
            make, for as long as their subscription stays active. Reliable tracking, on-demand payouts,
            and {DISCOUNT_LABEL} off their first payment for the person you refer.
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
              {RATE_LABEL} of Net Revenue, for the life of the subscription
            </h2>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Commission applies per referred workspace, independently, and never expires while that
              workspace keeps an unbroken paid subscription.
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
            {/*
              🔴 Both figures are computed from the live catalogue price at
              {RATE_LABEL}. The line this replaces read "$59/mo Business plan →
              ~$14.75 month 1, ~$5.90 months 2 & 3", which was the old taper
              applied to a tier the policy pays 50% on, every month, for as long
              as the workspace stays subscribed.
            */}
            <div className="border-t border-brand-100 pt-4 text-center">
              {cheapest && cheapestCommission ? (
                <p className="text-xs text-gray-500">
                  Example: one {cheapest.name} referral at {cheapest.monthly}/month earns you{" "}
                  <b className="text-[#0a0a0a]">{cheapestCommission}</b> a month
                  {example && exampleCommission && example.name !== cheapest.name ? (
                    <>
                      , and one {example.name} referral at {example.monthly}/month earns{" "}
                      <b className="text-[#0a0a0a]">{exampleCommission}</b> a month
                    </>
                  ) : null}
                  , for as long as that workspace stays subscribed.
                </p>
              ) : null}
              <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                {NET_REVENUE_BASIS_NOTE} A workspace that lapses for more than{" "}
                {GRACE_PERIOD_DAYS} days ends its commission permanently.{" "}
                {PROJECTION_DISCLAIMER}
              </p>
            </div>
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
              <p className="text-lg font-bold text-[#0a0a0a]">{HOLD_PERIOD_DAYS} days</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Min. withdrawal</p>
              <p className="text-lg font-bold text-[#0a0a0a]">${MINIMUM_WITHDRAWAL_USD}</p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Processing</p>
              <p className="text-lg font-bold text-[#0a0a0a]">{PAYOUT_PROCESSING_DAYS}</p>
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
            {eligiblePlans.map((plan) => (
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
