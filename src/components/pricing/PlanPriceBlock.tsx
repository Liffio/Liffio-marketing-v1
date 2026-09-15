import { isZeroPrice, type PricingPlan } from "@/config/pricing.config";
import { taxNoteForPrice } from "@/config/tax-copy";

type PlanPriceBlockProps = {
  plan: PricingPlan;
  annual: boolean;
  highlight?: boolean;
  compact?: boolean;
  align?: "left" | "right";
};

export function PlanPriceBlock({
  plan,
  annual,
  highlight = false,
  compact = false,
  align = "left",
}: PlanPriceBlockProps) {
  const price = annual ? plan.annual : plan.monthly;
  const showIntro = Boolean(plan.introPrice);
  const followUpPrice = annual ? plan.annual : plan.monthly;
  const heroSize = compact ? "1.75rem" : isZeroPrice(price) && !showIntro ? "2.5rem" : "2.75rem";
  const regularSize = compact ? "1.35rem" : "2.25rem";

  const heroClass = highlight ? "text-white" : "text-[#0a0a0a]";
  const mutedClass = highlight ? "text-white/60" : "text-gray-400";
  const accentClass = highlight ? "text-emerald-200" : "text-emerald-600";
  const thenClass = highlight ? "text-white/75" : "text-gray-500";

  const alignClass = align === "right" ? "text-right" : "text-left";
  const badgeAlignClass = align === "right" ? "ml-auto" : "";
  // Terms 7.3: rupee figures are GST-inclusive and say so under the price.
  const taxNote = taxNoteForPrice(price);
  const taxNoteClass = `mt-1 text-[11px] font-medium ${highlight ? "text-white/70" : "text-gray-500"}`;

  if (showIntro) {
    return (
      <div className={alignClass}>
        <span
          className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeAlignClass} ${
            highlight
              ? "bg-white/15 text-emerald-200 ring-1 ring-white/20"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          }`}
        >
          Intro offer
        </span>
        <div className={`flex items-end gap-1 ${align === "right" ? "justify-end" : ""}`}>
          <span
            className={`font-extrabold tracking-tight leading-none ${heroClass}`}
            style={{ fontSize: heroSize, fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            {plan.introPrice}
          </span>
          <span className={`pb-1.5 text-sm font-semibold ${mutedClass}`}>/mo</span>
        </div>
        {plan.introPriceLabel ? (
          <p className={`mt-1 text-xs font-bold ${accentClass}`}>{plan.introPriceLabel}</p>
        ) : null}
        <p className={`mt-2.5 text-sm font-medium ${thenClass}`}>
          then{" "}
          <span className={`font-bold ${highlight ? "text-white" : "text-[#0a0a0a]"}`}>
            {followUpPrice}
          </span>
          /mo
          {annual && plan.annualTotal ? (
            <span
              className={`mt-0.5 block text-[10px] font-bold ${highlight ? "text-white/50" : "text-gray-400"}`}
            >
              billed {plan.annualTotal} annually
            </span>
          ) : null}
        </p>
        {taxNote ? <p className={taxNoteClass}>{taxNote}</p> : null}
      </div>
    );
  }

  const showPerMonth = !isZeroPrice(plan.monthly);

  return (
    <div className={alignClass}>
    <div className={`flex items-end gap-1 ${align === "right" ? "justify-end" : ""}`}>
      <span
        className={`font-extrabold leading-none tracking-tight ${heroClass}`}
        style={{
          fontSize: showPerMonth ? regularSize : heroSize,
          fontFamily: "var(--font-outfit,sans-serif)",
        }}
      >
        {price}
      </span>
      {showPerMonth ? (
        <span className={`pb-1.5 text-sm ${mutedClass}`}>
          /mo
          {annual && plan.annualTotal && !isZeroPrice(plan.monthly) ? (
            <span className={`block text-[10px] font-bold ${highlight ? "text-white/50" : "text-gray-300"}`}>
              billed {plan.annualTotal} annually
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
    {taxNote ? <p className={taxNoteClass}>{taxNote}</p> : null}
    </div>
  );
}
