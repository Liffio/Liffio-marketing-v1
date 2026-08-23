"use client";

import { useState } from "react";
import {
  currencySymbolOf,
  parseDisplayAmount,
  planWorkspacesIncluded,
  type PricingPlan,
} from "@/config/pricing.config";
import { useSharedBillingInterval } from "@/components/pricing/BillingInterval";

/**
 * When does one Agency bill beat N individual Business subscriptions?
 *
 * 🔴 EVERY figure here is computed. Nothing about the crossover, the per-account
 * cost or the per-workspace rate is written down. The V4 design hardcoded seven
 * things — `parity = n === 9`, "until you reach 9 accounts", "leaves 11 slots
 * spare", `/20`, `bizUnit * 10`, "At ten accounts" and `/12/20` — and its parity
 * was wrong on its own numbers: at nine accounts Business is CHEAPER, by $18.
 *
 * Prices are parsed from the same strings the cards render, so this cannot argue
 * from a price the page does not show. If Business or Agency is repriced the
 * crossover moves on its own.
 */

const MAX_ACCOUNTS = planWorkspacesIncluded.Agency;

function formatMoney(amount: number, symbol: string, locale: string): string {
  return `${symbol}${Math.round(amount).toLocaleString(locale)}`;
}

/** Two decimals for USD, whole units for INR — as everywhere else on the page. */
function formatPrecise(amount: number, symbol: string, locale: string): string {
  return symbol === "₹"
    ? `${symbol}${Math.round(amount).toLocaleString(locale)}`
    : `${symbol}${amount.toFixed(2)}`;
}

export default function AgencyBreakEven({ plans }: { plans: PricingPlan[] }) {
  const [accounts, setAccounts] = useState(10);
  const shared = useSharedBillingInterval();

  const business = plans.find((p) => p.name === "Business");
  const agency = plans.find((p) => p.name === "Agency");
  const growth = plans.find((p) => p.name === "Growth");

  const businessUnit = parseDisplayAmount(business?.monthly);
  const agencyPrice = parseDisplayAmount(agency?.monthly);
  const growthPrice = parseDisplayAmount(growth?.monthly);

  // The argument is "how many accounts do you run". Adding "how are you billed"
  // makes it two variables for no gain — the crossover is 10 either way, and the
  // cards already carry the annual price for anyone who wants it.
  if (shared?.annual) return null;
  if (!business || !agency || !businessUnit || !agencyPrice) return null;

  const symbol = currencySymbolOf(agency.monthly);
  const locale = symbol === "₹" ? "en-IN" : "en-US";
  const money = (n: number) => formatMoney(n, symbol, locale);
  const precise = (n: number) => formatPrecise(n, symbol, locale);

  // Derived, not written down: at parity accounts the two bills are equal, so
  // Agency first wins at the next whole account.
  const parity = agencyPrice / businessUnit;
  const firstWinningCount = Math.floor(parity) + 1;
  const lineBallCount = Math.floor(parity);

  const businessTotal = businessUnit * accounts;
  const agencyWins = agencyPrice < businessTotal;
  const difference = Math.abs(businessTotal - agencyPrice);
  const slotsLeft = MAX_ACCOUNTS - accounts;
  const perWorkspace = agencyPrice / MAX_ACCOUNTS;

  // Scale bars against the widest thing either bar can be at any slider position.
  const scale = Math.max(businessUnit * MAX_ACCOUNTS, agencyPrice);

  const verdict = agencyWins
    ? "Agency wins"
    : accounts === lineBallCount
      ? "Line ball"
      : "Stay on Business";

  const verdictDetail = agencyWins
    ? `Save ${money(difference)}/month${slotsLeft > 0 ? ` with ${slotsLeft} workspaces still spare` : " across all twenty accounts"}`
    : accounts === lineBallCount
      ? `Agency costs ${money(difference)} more — and leaves ${slotsLeft} workspaces spare`
      : `Agency costs ${money(difference)} more until you reach ${firstWinningCount} accounts`;

  return (
    <section className="mt-16">
      <div className="mb-6 max-w-2xl">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5184C]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          The Agency question
        </span>
        <h2
          className="mt-3 text-2xl font-bold tracking-[-0.02em] text-[#17131A] sm:text-3xl"
          style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
        >
          At {firstWinningCount} accounts, Agency stops being an upgrade and becomes the cheaper option.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4A4350]">
          Agency is {MAX_ACCOUNTS} Business workspaces on one bill. Drag to the number of Instagram
          accounts you actually run.
        </p>
      </div>

      <div className="rounded-2xl border border-[#EAE4DC] bg-white p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#17131A]">
              Individual Business subscriptions vs one Agency bill
            </h3>
            {/*
              True today, and true for a measurable reason: Agency and Business are
              identical on every limit in package_limits — workflows 150/150,
              automationsPerDay 150/150, schedulerPostsPerDay 200/200, teamMembers
              15/15, dmFollowUps 5/5 — and Agency holds every package_features
              child Business holds.

              ⚠️ It is ALSO true because all seven agency:* capabilities are granted
              to no package (stage B6). The day white-label is actually granted,
              this sentence becomes false and must change.
            */}
            <p className="mt-1 text-[13px] text-[#8B8391]">
              Identical features and limits either way. The only variable is how many accounts
              you&rsquo;re paying for.
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-bold ${agencyWins ? "text-[#F5184C]" : "text-[#17131A]"}`}
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              {verdict}
            </div>
            <div className="mt-0.5 max-w-xs text-[12px] text-[#8B8391]">{verdictDetail}</div>
          </div>
        </div>

        <div className="mb-7">
          <label htmlFor="agency-accounts" className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-medium text-[#4A4350]">
              Instagram accounts you run
            </span>
            <b className="text-[13px] font-bold text-[#17131A]">
              {accounts} account{accounts === 1 ? "" : "s"}
            </b>
          </label>
          <input
            id="agency-accounts"
            type="range"
            min={1}
            max={MAX_ACCOUNTS}
            step={1}
            value={accounts}
            onChange={(event) => setAccounts(Number(event.target.value))}
            className="mt-2 w-full accent-[#F5184C]"
            aria-describedby="agency-breakeven-verdict"
          />
          <div className="mt-1 flex justify-between text-[10px] text-[#8B8391]">
            <span>1</span>
            <span className="font-bold text-[#F5184C]">
              {firstWinningCount} · Agency wins from here
            </span>
            <span>{MAX_ACCOUNTS}</span>
          </div>
        </div>

        <div className="space-y-3" id="agency-breakeven-verdict">
          <Bar
            label="Individual Business"
            sub={`${money(businessUnit)} × ${accounts}`}
            value={money(businessTotal)}
            width={(businessTotal / scale) * 100}
            tone="#8B8391"
          />
          <Bar
            label="One Agency subscription"
            sub={`${MAX_ACCOUNTS} workspaces, flat`}
            value={money(agencyPrice)}
            width={(agencyPrice / scale) * 100}
            tone="#F5184C"
          />
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-[#F1ECE5] pt-5 sm:grid-cols-4">
          <Figure term="Cost per account run" value={`${precise(agencyPrice / accounts)}/mo`} />
          <Figure
            term="Difference"
            value={`${agencyWins ? "−" : "+"}${money(difference)}`}
            accent={agencyWins}
          />
          <Figure term="Over a year" value={money(difference * 12)} />
          <Figure term="Slots left" value={`${slotsLeft} of ${MAX_ACCOUNTS}`} />
        </dl>

        {growthPrice && perWorkspace < growthPrice ? (
          <p className="mt-5 text-[13px] leading-relaxed text-[#4A4350]">
            At all {MAX_ACCOUNTS} slots, a full Business workspace inside Agency costs{" "}
            <b className="text-[#17131A]">{precise(perWorkspace)}/month</b> — less than a single
            Growth subscription at {money(growthPrice)}.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Bar({
  label,
  sub,
  value,
  width,
  tone,
}: {
  label: string;
  sub: string;
  value: string;
  width: number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-40 shrink-0">
        <div className="text-[13px] font-semibold text-[#17131A]">{label}</div>
        <div
          className="text-[11px] text-[#8B8391]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {sub}
        </div>
      </div>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F1ECE5]">
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${Math.min(100, width)}%`, background: tone }}
        />
      </div>
      <div
        className="w-24 shrink-0 text-right text-[14px] font-bold text-[#17131A]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Figure({ term, value, accent = false }: { term: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8391]">{term}</dt>
      <dd
        className={`mt-1 text-[15px] font-bold ${accent ? "text-[#F5184C]" : "text-[#17131A]"}`}
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {value}
      </dd>
    </div>
  );
}
