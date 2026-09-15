"use client";

import { useState } from "react";
import {
  currencySymbolOf,
  formatMoney,
  formatMoneyPrecise,
  parseDisplayAmount,
  planWorkspacesIncluded,
  type PricingPlan,
} from "@/config/pricing.config";
import { useSharedBillingInterval } from "@/components/pricing/BillingInterval";
import SectionHead from "@/components/pricing/SectionHead";
import { INR_TAX_NOTE, USD_TAX_NOTE } from "@/config/tax-copy";

/**
 * When does one Agency bill beat N individual Business subscriptions?
 *
 * 🔴 EVERY figure here is computed. Nothing about the crossover, the per-account
 * cost or the per-workspace rate is written down. The V4 design hardcoded seven
 * things - `parity = n === 9`, "until you reach 9 accounts", "leaves 11 slots
 * spare", `/20`, `bizUnit * 10`, "At ten accounts" and `/12/20` - and its parity
 * was wrong on its own numbers: at nine accounts Business is CHEAPER, by $18.
 *
 * So this carries the design's dark treatment and its slider exactly, and its
 * arithmetic not at all. `npm test` asserts the derivations are still here.
 *
 * Prices are parsed from the same strings the cards render, so this cannot argue
 * from a price the page does not show. If Business or Agency is repriced the
 * crossover moves on its own.
 */

const MAX_ACCOUNTS = planWorkspacesIncluded.Agency;

const BRAND_GRADIENT = "linear-gradient(100deg,#FF7C49 0%,#F5184C 52%,#B20D8F 100%)";

/*
  🚩 `h-6` is load-bearing, not decoration.

  `appearance-none` collapses an `input[type=range]` to the height of its
  styled track, 5px here. The 22px thumb is then painted overflowing that box
  (that is what the negative margin-top does), so it LOOKS grabbable while the
  element's actual hit area is a 5px sliver: the slider reads as simply broken.
  Sizing the input to the thumb gives the pointer something to land on, and
  Chrome/Firefox both centre the track within the taller box.
*/
const SLIDER_CLASSES = [
  "mt-1 block h-6 w-full cursor-pointer appearance-none bg-transparent",
  "[&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:rounded-[6px] [&::-webkit-slider-runnable-track]:bg-[#332C3A]",
  "[&::-moz-range-track]:h-[5px] [&::-moz-range-track]:rounded-[6px] [&::-moz-range-track]:bg-[#332C3A]",
  "[&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:-mt-[8.5px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4",
  "[&::-webkit-slider-thumb]:border-[#F5184C] [&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:shadow-[0_3px_12px_rgba(0,0,0,0.5)]",
  "[&::-moz-range-thumb]:h-[22px] [&::-moz-range-thumb]:w-[22px] [&::-moz-range-thumb]:rounded-full",
  "[&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#F5184C] [&::-moz-range-thumb]:bg-white",
  "focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-white",
].join(" ");

export default function AgencyBreakEven({ plans }: { plans: PricingPlan[] }) {
  const [accounts, setAccounts] = useState(10);
  const shared = useSharedBillingInterval();
  const annual = shared?.annual ?? false;

  const business = plans.find((p) => p.name === "Business");
  const agency = plans.find((p) => p.name === "Agency");
  const growth = plans.find((p) => p.name === "Growth");

  // On yearly the design compares the real annual bills, not their twelfths.
  const businessUnit = parseDisplayAmount(annual ? business?.annualTotal : business?.monthly);
  const agencyPrice = parseDisplayAmount(annual ? agency?.annualTotal : agency?.monthly);
  const growthPrice = parseDisplayAmount(growth?.monthly);

  if (!business || !agency || !businessUnit || !agencyPrice) return null;

  const symbol = currencySymbolOf(agency.monthly);
  const money = (n: number) => formatMoney(n, symbol);
  const precise = (n: number) => formatMoneyPrecise(n, symbol);
  const per = annual ? "/yr" : "/mo";

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
  const perWorkspaceMonthly = annual ? perWorkspace / 12 : perWorkspace;

  /*
    Scale against the larger of the TWO BARS AT THIS POSITION, not against the
    widest either bar could ever be.

    Scaling to `businessUnit * MAX_ACCOUNTS` pinned Agency's bar at a constant
    width, correct, since Agency is a flat price, but it reads as a broken
    control: you drag the slider and one of the two bars never moves. Scaling to
    the current pair keeps the bigger bill at full width and shrinks the other
    against it, so both respond at every position and the crossover is the
    moment they swap which one is full.
  */
  const scale = Math.max(businessTotal, agencyPrice);

  const verdict = agencyWins
    ? "Agency wins"
    : accounts === lineBallCount
      ? "Line ball"
      : "Stay on Business";

  const verdictDetail = agencyWins
    ? `Save ${money(difference)}${per}${slotsLeft > 0 ? ` and get ${slotsLeft} more workspaces` : " on the same twenty accounts"}`
    : accounts === lineBallCount
      ? `Agency costs ${money(difference)} more, and leaves ${slotsLeft} workspaces spare`
      : `Agency costs ${money(difference)} more until you reach ${firstWinningCount} accounts`;

  return (
    <>
      <SectionHead
        eyebrow="The Agency question"
        title={`At ${firstWinningCount} accounts, Agency stops being an upgrade and becomes the cheaper option.`}
      >
        Agency is not a feature tier: it&rsquo;s {MAX_ACCOUNTS} Business workspaces bought
        together. Drag to the number of Instagram accounts you actually run.
      </SectionHead>

      <div className="relative overflow-hidden rounded-[22px] bg-[#151119] px-5 pb-8 pt-9 text-white sm:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 300px at 88% -10%,rgba(178,13,143,.35),transparent 60%),radial-gradient(500px 260px at 5% 110%,rgba(255,124,73,.22),transparent 60%)",
          }}
          aria-hidden
        />

        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-6">
          <div>
            <h3
              className="mb-1.5 text-[22px] font-bold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Individual Business subscriptions vs one Agency bill
            </h3>
            {/*
              True today, and true for a measurable reason: Agency and Business are
              identical on every limit in package_limits: workflows 150/150,
              schedulerPostsPerDay 200/200, teamMembers 15/15, dmFollowUps 5/5, and
              Agency holds every package_features child Business holds.

              ⚠️ It is ALSO true because all seven agency:* capabilities are granted
              to no package (stage B6). The day white-label is actually granted,
              this sentence becomes false and must change.
            */}
            <p className="m-0 max-w-[48ch] text-[13.5px] text-[#A9A1B0]">
              Identical features either way. The only variable is how many accounts
              you&rsquo;re paying for.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div
              className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold leading-[1.15] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              {agencyWins ? (
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  {verdict}
                </span>
              ) : (
                verdict
              )}
            </div>
            <div
              className="mt-1.5 text-[11.5px] text-[#A9A1B0]"
              style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
            >
              {verdictDetail}
            </div>
          </div>
        </div>

        <div className="relative z-[1] mb-1.5 mt-7">
          <label
            htmlFor="agency-accounts"
            className="mb-3.5 flex justify-between text-[11px] uppercase tracking-[0.12em] text-[#8E8695]"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            <span>Instagram accounts you run</span>
            <b className="text-[15px] tracking-normal text-white">
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
            className={SLIDER_CLASSES}
            aria-describedby="agency-breakeven-bars"
          />
          <div
            className="mt-2.5 flex justify-between text-[10px] text-[#6C6474]"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            <span>1</span>
            <span className="font-bold text-[#FF7C49]">
              {firstWinningCount} · Agency wins from here
            </span>
            <span>{MAX_ACCOUNTS}</span>
          </div>
        </div>

        <div className="relative z-[1] mt-7 grid gap-3" id="agency-breakeven-bars">
          <Bar
            label="Individual Business"
            sub={`${money(businessUnit)} × ${accounts}`}
            value={money(businessTotal)}
            width={(businessTotal / scale) * 100}
            fill="#4B4353"
          />
          <Bar
            label="One Agency subscription"
            sub={`${MAX_ACCOUNTS} workspaces, flat`}
            value={money(agencyPrice)}
            width={(agencyPrice / scale) * 100}
            fill={BRAND_GRADIENT}
          />
        </div>

        <dl className="relative z-[1] mt-6 grid grid-cols-2 gap-[18px] border-t border-[#2C2633] pt-5 sm:grid-cols-4">
          <Figure term="Cost per account run" value={`${precise(agencyPrice / accounts)}${per}`} />
          <Figure term="Difference" value={`${agencyWins ? "−" : "+"}${money(difference)}`} />
          <Figure term="Over a year" value={money(annual ? difference : difference * 12)} />
          <Figure term="Slots left" value={`${slotsLeft} of ${MAX_ACCOUNTS}`} />
        </dl>

        {/* Terms 7.3. Derived from the symbol the calculator is already using. */}
        <p
          className="relative z-[1] mt-4 text-[11px] text-[#7E7686]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {symbol === "₹" ? `Every figure above is ${INR_TAX_NOTE}.` : USD_TAX_NOTE}
        </p>

        {growthPrice && perWorkspaceMonthly < growthPrice ? (
          <p className="relative z-[1] mt-6 rounded-xl border border-[#2C2633] bg-white/[0.03] px-[18px] py-[15px] text-[14px] leading-relaxed text-[#D8D2DD]">
            At all {MAX_ACCOUNTS} slots, a full Business workspace inside Agency costs{" "}
            <b
              className="bg-clip-text font-bold text-transparent"
              style={{
                backgroundImage: BRAND_GRADIENT,
                fontFamily: "var(--font-mono, ui-monospace, monospace)",
              }}
            >
              {precise(perWorkspaceMonthly)}/month
            </b>, less than a single <b className="text-white">Growth</b> subscription at{" "}
            {money(growthPrice)}.
          </p>
        ) : null}
      </div>
    </>
  );
}

function Bar({
  label,
  sub,
  value,
  width,
  fill,
}: {
  label: string;
  sub: string;
  value: string;
  width: number;
  fill: string;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-1.5 sm:grid-cols-[160px_1fr_auto] sm:gap-4">
      <div className="text-[12.5px] text-[#C6BFCC]">
        {label}
        <small
          className="mt-0.5 block text-[10.5px] text-[#7E7686]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {sub}
        </small>
      </div>
      <div className="h-8 overflow-hidden rounded-[9px] bg-[#241F2B]">
        <div
          className="h-full rounded-[9px] transition-[width] duration-300 ease-out"
          style={{ width: `${Math.min(100, width)}%`, background: fill }}
        />
      </div>
      <div
        className="text-left text-[15.5px] font-bold sm:min-w-[118px] sm:text-right"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Figure({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt
        className="mb-1.5 text-[9.5px] uppercase tracking-[0.12em] text-[#7E7686]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {term}
      </dt>
      <dd
        className="m-0 text-[18px] font-bold"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {value}
      </dd>
    </div>
  );
}
