import type { PricingPlan } from "@/config/pricing.config";

/**
 * One line on who each plan is for, from the V4 design.
 *
 * Keyed by tier and rendered only for tiers actually present in `plans`, so it
 * cannot describe a tier the page does not show — the same derivation that
 * turned "Four tiers" into a count instead of a literal.
 *
 * Every claim here is checked against the packages catalogue:
 *   Free      one account            — workspacesIncluded 1
 *   Business  approval step, seats   — Approval workflow module, teamMembers 15
 *   Agency    twenty workspaces      — workspacesIncluded 20
 *   Agency    cheaper than Growth    — $549/20 = $27.45 against Growth's $29
 */
const POSITIONING: Record<string, { headline: string; body: string }> = {
  Free: {
    headline: "Prove it on your account.",
    body: "One real automation, end to end, on one Instagram account.",
  },
  Starter: {
    headline: "One account, on autopilot.",
    body: "Everything a solo creator needs to turn one account into a repeatable acquisition channel.",
  },
  Growth: {
    headline: "See what's actually working.",
    body: "Post-level analytics, content templates and deeper automation, for the creator still working alone.",
  },
  Business: {
    headline: "One account, run by a team.",
    body: "Seats with real permissions, an approval step before anything publishes, and attribution that names the winner.",
  },
  Agency: {
    headline: "Twenty accounts, one bill.",
    body: "Twenty complete Business workspaces, each costing less than a single Growth subscription.",
  },
};

export default function PositioningStrip({ plans }: { plans: PricingPlan[] }) {
  const entries = plans
    .map((plan) => ({ name: plan.name, copy: POSITIONING[plan.name] }))
    .filter((entry): entry is { name: string; copy: { headline: string; body: string } } =>
      Boolean(entry.copy),
    );

  if (entries.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#0a0a0a] sm:text-3xl">
          Who each plan is for, in one line.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.name}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{entry.name}</p>
            <p className="mt-2 text-base font-bold text-[#0a0a0a]">{entry.copy.headline}</p>
            <p className="mt-1.5 text-sm leading-snug text-gray-600">{entry.copy.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
