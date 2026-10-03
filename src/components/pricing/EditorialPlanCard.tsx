import type { ReactNode } from "react";
import {
  currencySymbolOf,
  formatMoneyPrecise,
  isZeroPrice,
  parseDisplayAmount,
  planWorkspacesIncluded,
  type PricingPlan,
} from "@/config/pricing.config";
import { V4_PLAN_CONTENT } from "@/config/pricing-v4.config";
import { taxNoteForPrice } from "@/config/tax-copy";

/**
 * The V4 plan card: flat paper-and-rule, monospaced numerals, a limits panel.
 *
 * This is deliberately a SEPARATE component from `PricingPlanCard` rather than a
 * variant of it. The homepage card is a different design - gradient highlight,
 * rounded-3xl - and it still renders there. Only the visual treatment differs
 * now: `applyV4Content` puts the same V4 bullets on `plan.features`, so the two
 * pages cannot describe a tier differently.
 *
 * 🔴 Bullets, audience line and limits come from `pricing-v4.config.ts`, the
 * plans live on production (docs/decisions/0006). Only the PRICE is live from
 * the API: it comes from `plan`, so a repricing still moves the card, and
 * `npm run check:prices` still guards it.
 */

const BRAND_GRADIENT = "linear-gradient(100deg,#FF7C49 0%,#F5184C 52%,#B20D8F 100%)";

/**
 * The Beta pill.
 *
 * Deliberately quiet - a hairline outline in the brand ink, not a filled brand
 * chip. It qualifies a feature the tier really includes; it is not a second
 * flag competing with "The new step" for the eye.
 */
function BetaPill() {
  return (
    <span
      className="ml-1 inline-flex translate-y-[-1px] items-center rounded-[4px] border border-[#F5184C]/35 bg-[#F5184C]/[0.07] px-[5px] py-[1px] align-middle text-[9px] font-bold uppercase tracking-[0.08em] text-[#F5184C]"
      style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
    >
      Beta
    </span>
  );
}

/** `**bold**` -> <b> and `{beta}` -> the pill, as the design's own markup does. */
function emphasize(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\{beta\})/g).map((part, index) => {
    if (part === "{beta}") return <BetaPill key={index} />;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <b key={index} className="font-semibold text-[#17131A]">
          {part.slice(2, -2)}
        </b>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

/**
 * The bullet marker: a plain tick character in the brand pink, at the bullet's
 * own font size and line height so it sits on the first line of the text. No
 * box, no background, no icon component, matching liffio-pricing-cards.html.
 */
function FeatureMark() {
  return (
    <span className="flex-none font-bold text-[#F5184C]" aria-hidden>
      {"✓"}
    </span>
  );
}

/**
 * The line under the price, per the design.
 *
 * Derived from the plan's own figures in every case - nothing here is authored
 * per tier. Agency reads as a per-workspace rate because that is the only frame
 * in which its price is comparable to the rest: it is the one tier whose
 * subscription covers more than one workspace.
 */
function priceSubline(plan: PricingPlan, annual: boolean): ReactNode {
  if (isZeroPrice(plan.monthly)) return "Forever. One free workspace per login.";

  // With an intro price in the headline, the ONGOING price is the thing the
  // subline has to state, that is the number the buyer pays every month after
  // the first, and the headline is deliberately not it.
  if (!annual && plan.introPrice) {
    return plan.annualTotal
      ? `Then ${plan.monthly}/month · or ${plan.annualTotal}/year`
      : `Then ${plan.monthly}/month`;
  }

  const workspaces =
    planWorkspacesIncluded[plan.name as keyof typeof planWorkspacesIncluded] ?? 1;
  const shown = parseDisplayAmount(annual ? plan.annual : plan.monthly);

  if (workspaces > 1 && shown) {
    const perWorkspace = formatMoneyPrecise(shown / workspaces, currencySymbolOf(plan.monthly));
    return `${perWorkspace} per workspace per month`;
  }

  if (!plan.annualTotal) return null;
  // The headline number is already the per-month equivalent on annual, so the
  // subline states the figure it is NOT showing, the amount actually charged.
  // V4 could say "Effective $7.50/mo" because its headline was the yearly total.
  return annual
    ? `Billed ${plan.annualTotal}/year · 17% saving`
    : `Or ${plan.annualTotal}/year, a 17% saving`;
}

export default function EditorialPlanCard({
  plan,
  annual,
}: {
  plan: PricingPlan;
  annual: boolean;
}) {
  const content = V4_PLAN_CONTENT[plan.name];

  // One price per tier, straight from the catalogue. The design's
  // launch/standard mechanic was removed on instruction, so nothing here can
  // advertise a figure the catalogue does not carry.
  /*
    The intro price REPLACES the headline, on monthly billing only.

    🚩 Monthly only, and not by accident: it is a first-MONTH offer, so showing
    it against the yearly toggle would advertise ₹49 for a ₹4,999 commitment.
    `annual` gates it, and the yearly view is left exactly as it was.

    🚩 The unit next to the number changes with it - "first month", not
    "/month". That is what keeps the card honest at a glance: this card sits in
    a row beside Growth at ₹1,499, and a bare ₹49 under a "/month" suffix reads
    as the ongoing price. With the unit changed, the strike-through original and
    the "Then ₹499/month" subline, the offer is legible without overclaiming.
  */
  const intro = !annual && plan.introPrice ? plan.introPrice : null;
  const price = intro ?? (annual ? plan.annual : plan.monthly);
  const symbol = currencySymbolOf(price);
  const amount = price.slice(symbol.length);
  const showPer = !isZeroPrice(plan.monthly);
  const flag = content?.flag;
  // Terms 7.3: a rupee figure is GST-inclusive and says so beside itself. A
  // dollar figure is an export sale, and carries its note once under the grid
  // rather than five times down the row.
  const taxNote = taxNoteForPrice(price);

  // A tier with no V4 entry still renders its price and CTA rather than
  // vanishing - the same reason PositioningStrip filters instead of assuming.
  const features = content?.features ?? plan.features.filter((f) => f.included).map((f) => f.text);
  const limits = content?.limits ?? [];
  // Two groups, same treatment. API limits get their own heading so a buyer
  // cannot read an API figure as a cap on what the app itself does.
  const limitGroups = [
    { label: content?.limitsLabel, rows: limits },
    { label: content?.apiLimitsLabel, rows: content?.apiLimits ?? [] },
  ].filter((group) => group.rows.length > 0);

  return (
    /*
      🚩 The emphasis ring is a BORDER, not a `shadow-[0_0_0_2px]` ring, and it
      is the ONLY pink line on the card. A gradient cap used to be drawn across
      the top edge as well, which doubled the line under the badge and ran a
      second pink bar to its right. The badge now floats on the border alone.
    */
    <div
      className={`relative flex h-full flex-col rounded-2xl bg-white ${
        plan.highlight
          ? // 1px less padding absorbs the extra border, so every card has
            // the same 20px x 22px content inset and the baselines line up.
            "border-2 border-[#F5184C] px-[19px] py-[21px] shadow-[0_18px_40px_-22px_rgba(245,24,76,0.5)]"
          : "border border-[#EAE4DC] px-5 py-[22px]"
      }`}
    >
      {flag ? (
        <span
          className={`absolute z-10 whitespace-nowrap rounded-full px-[11px] py-[5px] text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white ${
            // A pill on every card (999px radius, 10px text, 5px x 11px), as in
            // liffio-pricing-cards.html; only the fill differs by tone.
            // 11px above the card's OUTER edge and 20px in from it, on every
            // card. Absolute offsets start inside the border, so the 2px
            // highlighted border needs 1px more than the 1px ones, or the
            // Growth badge sits lower and lands on its gradient border.
            plan.highlight ? "-top-[13px] left-[18px]" : "-top-[12px] left-[19px]"
          }`}
          style={{
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            background: flag.tone === "brand" ? BRAND_GRADIENT : "#17131A",
          }}
        >
          {flag.text}
        </span>
      ) : null}

      <h3
        className="mb-1 text-[19px] font-bold tracking-[-0.02em] text-[#17131A]"
        style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
      >
        {plan.name}
      </h3>
      <p className="mb-4 min-h-[3.25rem] text-[12.5px] leading-[1.42] text-[#8B8391]">
        {content?.audience ?? plan.description}
      </p>

      <div
        className="flex items-baseline gap-px font-bold tracking-[-0.03em] text-[#17131A]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        <span className="text-[19px] text-[#4A4350]">{symbol}</span>
        <span className="text-[37px] leading-none">{amount}</span>
        {showPer ? (
          <span
            className="ml-1 text-[12px] font-medium text-[#8B8391]"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            {intro ? plan.introPriceLabel : "/month"}
          </span>
        ) : null}
        {intro ? (
          <span
            className="ml-1.5 text-[15px] font-semibold text-[#B8B1BE] line-through decoration-[1.5px]"
            aria-label={`normally ${plan.monthly} per month`}
          >
            {plan.monthly}
          </span>
        ) : null}
      </div>
      {taxNote ? (
        <p
          className="mt-1.5 text-[11px] font-medium leading-none text-[#4A4350]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {taxNote}
        </p>
      ) : null}
      <p
        className="mt-2 min-h-[2rem] text-[11.5px] leading-[1.4] text-[#8B8391]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {priceSubline(plan, annual)}
      </p>

      {/*
        A provisional tier is NOT a link. `PAID_PLANS` in confirm-email omits
        GROWTH, so `?plan=GROWTH` is dropped after signup and the visitor lands
        in onboarding with no subscription and no explanation. That is a broken
        checkout, not a copy decision, so the guard stays even though the design
        draws a live button here. docs/decisions/0003 stage M4 removes it.
      */}
      {plan.provisional ? (
        <span
          id={`pricing-${plan.name.toLowerCase()}`}
          aria-disabled="true"
          className="my-[18px] block cursor-default rounded-[10px] border border-dashed border-[#D6CFC6] py-2.5 text-center text-[13.5px] font-semibold text-[#8B8391]"
        >
          {plan.cta}
        </span>
      ) : (
        <a
          href={content?.ctaAnchor ?? plan.href}
          id={`pricing-${plan.name.toLowerCase()}`}
          data-cta={plan.name === "Free" ? "pricing_start_free" : "pricing_upgrade"}
          data-signup-cta={content?.ctaAnchor ? undefined : "true"}
          className={`my-[18px] block rounded-[10px] py-2.5 text-center text-[13.5px] font-semibold transition-all duration-200 active:scale-[0.99] ${
            plan.highlight
              ? "border border-transparent text-white shadow-[0_8px_20px_-10px_rgba(245,24,76,0.8)] hover:brightness-[1.07]"
              : "border border-[#17131A] bg-white text-[#17131A] hover:bg-[#17131A] hover:text-white"
          }`}
          style={plan.highlight ? { background: BRAND_GRADIENT } : undefined}
        >
          {content?.cta ?? plan.cta}
        </a>
      )}

      <p
        className="mb-2.5 border-t border-[#F1ECE5] pt-3.5 text-[9.5px] font-medium uppercase tracking-[0.11em] text-[#8B8391]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {content?.includedLabel ?? "Included"}
      </p>
      {/*
        11px between bullets, 13.5px text at 1.5 line height. The bold lead-in
        and the rest of the sentence share one inline span, so the line wraps
        naturally with no break after the colon.
      */}
      <ul className="flex flex-col gap-[11px]">
        {features.map((feature) => (
          <li key={feature} className="flex gap-[9px] text-[13.5px] leading-[1.5] text-[#4A4350]">
            <FeatureMark />
            <span className="min-w-0">{emphasize(feature)}</span>
          </li>
        ))}
      </ul>

      {limitGroups.map((group, index) => (
        <div key={group.label ?? index} className={index === 0 ? "mt-auto pt-4" : "pt-3"}>
          <p
            className="mb-2 border-t border-[#F1ECE5] pt-3.5 text-[9.5px] font-medium uppercase tracking-[0.11em] text-[#8B8391]"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            {group.label}
          </p>
          <dl className="grid gap-1">
            {group.rows.map((limit) => (
              <div key={limit.label} className="flex justify-between gap-2 text-[11.5px]">
                <dt className="text-[#8B8391]">
                  {limit.label}
                  {limit.beta ? <BetaPill /> : null}
                </dt>
                <dd
                  className="m-0 text-right font-medium text-[#4A4350]"
                  style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                >
                  {limit.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
