import SectionHead from "@/components/pricing/SectionHead";
import { planWorkspacesIncluded, type PricingPlan } from "@/config/pricing.config";

/**
 * One line on who each plan is for, from the V4 design.
 *
 * Keyed by tier and rendered only for tiers actually present in `plans`, so it
 * cannot describe a tier the page does not show - the same derivation that
 * turned "Four tiers" into a count instead of a literal.
 *
 * Every claim here is checked against the packages catalogue:
 *   Free      one account            - workspacesIncluded 1
 *   Business  approval step, seats   - Approval workflow module, teamMembers 15
 *   Agency    twenty workspaces      - workspacesIncluded 20
 *   Agency    cheaper than Growth    - $549/20 = $27.45 against Growth's $29
 */
const POSITIONING: Record<string, { headline: string; body: string; verb: string }> = {
  Free: {
    headline: "Prove it on your account.",
    body: "One real automation, end to end, on one Instagram account.",
    verb: "proves it",
  },
  Starter: {
    headline: "One account, on autopilot.",
    body: "Everything a solo creator needs to turn one account into a repeatable acquisition channel.",
    verb: "runs it",
  },
  Growth: {
    headline: "See what's actually working.",
    body: "Post-level analytics, content templates and deeper automation, for the creator still working alone.",
    verb: "measures it",
  },
  Business: {
    headline: "One account, run by a team.",
    body: "Seats with real permissions, an approval step before anything publishes, and attribution that names the winner.",
    verb: "delegates it",
  },
  Agency: {
    headline: "Twenty accounts, one bill.",
    body: "Twenty complete Business workspaces, each costing less than a single Growth subscription.",
    // The multiplier is the one number in this strip, so it is derived rather
    // than written - repricing Agency's workspace count moves it here too.
    verb: `multiplies it by ${planWorkspacesIncluded.Agency}`,
  },
};

export default function PositioningStrip({ plans }: { plans: PricingPlan[] }) {
  const entries = plans
    .map((plan) => ({ name: plan.name, copy: POSITIONING[plan.name] }))
    .filter((entry): entry is { name: string; copy: (typeof POSITIONING)[string] } =>
      Boolean(entry.copy),
    );

  if (entries.length === 0) return null;

  return (
    <>
      <SectionHead eyebrow="Positioning" title="Who each plan is for, in one line." />

      <div className="grid grid-cols-1 gap-[11px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {entries.map((entry) => (
          <div key={entry.name} className="rounded-[14px] border border-[#EAE4DC] bg-white p-5">
            <h3
              className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#F5184C]"
              style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
            >
              {entry.name}
            </h3>
            <p
              className="mb-2 text-[16px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#17131A]"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              {entry.copy.headline}
            </p>
            <p className="text-[12.5px] leading-snug text-[#4A4350]">{entry.copy.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border-y border-[#EAE4DC] py-9 text-center">
        <p
          className="mb-3.5 text-[clamp(1.2rem,2.4vw,1.6rem)] font-bold tracking-[-0.02em] text-[#17131A]"
          style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
        >
          1 workspace = 1 Instagram account = 1 subscription
        </p>
        <p
          className="flex flex-wrap justify-center gap-2.5 text-[13px] text-[#4A4350]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {entries.map((entry, index) => (
            <span key={entry.name} className="flex gap-2.5">
              {index > 0 ? <span aria-hidden>&middot;</span> : null}
              <span>
                <b className="text-[#F5184C]">{entry.name}</b> {entry.copy.verb}
              </span>
            </span>
          ))}
        </p>
      </div>
    </>
  );
}
