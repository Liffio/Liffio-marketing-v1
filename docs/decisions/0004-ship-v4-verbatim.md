# 4. Ship the V4 pricing design verbatim

Date: 2026-09-10
Status: **Accepted** — applied to `/pricing` and the homepage cards

## Context

`/pricing` was restyled to the V4 design. The first pass withheld three parts of
it, on the reasoning recorded in ADR 0002 and 0003:

- the per-tier **Limits** panels (stage M3 — `package_limits` is not on any
  public endpoint, so `npm run check:prices` cannot see those numbers drift)
- the **founding-price** mechanic and its panel (no checkout path implements it)
- the design's **87-row matrix** (four D4/D8 violations; step 6 was cancelled)

The owner reviewed that list and directed that the design ship as drawn.

## Decision

The pricing page renders `src/config/pricing-v4.config.ts` — card copy, bullets,
Limits panels and all 87 matrix rows — in place of the sanitized
`/marketing/plans` payload.

**The homepage follows.** `applyV4Content()` in `marketing-plans.server.ts` runs
last in the fetch pipeline and puts the same bullets and audience line on
`plan.features` / `plan.description`, so `/` and `/pricing` cannot describe a
tier differently — the defect PR #5 found, one page contradicting itself on
Business seats. Only the visual treatment differs between them now.

**Prices remain live everywhere.** Only content comes from the sheet; amounts
still come from `plans`, so a repricing still moves both pages and
`check:prices` still guards every figure the site renders.

**No launch/standard mechanic.** The design's founding-price panel, its
`Launch price / Standard` control and Starter's post-window price ($15 / ₹799)
were all dropped on instruction. There is one price per tier — today's
catalogue price — so the page never promises a price change nothing implements,
and repricing is a catalogue change and nothing else. `Monthly / Yearly` is the
only price control left.

## 🔴 What the page now claims that production does not grant

| Claim | Where | Reality |
| --- | --- | --- |
| `API keys 10`, `API requests/day 5,000`, the whole `API` group | matrix, Business card | `maxApiCredentials` 0, `apiRequestsPerDay` 0, no API module (D4) |
| Free `500 DMs/month` | matrix ×2, Free card Limits | nothing meters DMs; V4 line 1351 marks it blocker 25.3, "entirely new code" |
| AI tokens 1,000 / 10,000 / 30,000 / 75,000, rollover 25,000 | matrix ×2, every card | never verified against `ai_token_plan_configs` |
| `Lead storage — Unlimited` | matrix | no lead-storage key in `package_limits` |
| Agency white-label / client sub-workspaces | positioning, cards | all seven `agency:*` capabilities granted to no package (B6) |

⚠️ `sanitizeFeatures()` no longer protects anything the site renders. It still
runs on the `/marketing/plans` payload, but `applyV4Content()` replaces its
output on both pages. Its rules are kept — they document what the catalogue
serves and why it is wrong — but the claims it removed are now stated
deliberately, in one file, pinned by the tests below.

## What still guards this

`test/pricing.test.ts` gained `KNOWN_DIVERGENT_CELLS` and the test *the matrix's
unverified claims are exactly the recorded ones*. It is the inverse of the guard
it replaced: rather than forbidding unverified claims, it pins the set of them.

- a **new** unverified claim (any new "Unlimited" cell outside the list) fails
- a claim **fixed at source** and removed from the matrix fails its row

Either direction sends the next person back to this file. That is the point: the
divergences are deliberate, but they must not grow quietly, and they must not
outlive the fix.

The derivation guards are untouched. The break-even calculator and the ladder
still hardcode nothing, and `npm test` still proves it.

## What was NOT adopted from the design

- **The currency switcher.** Region is detected server-side by
  `getPricingContext()` and only that region's prices are fetched. A client-side
  USD/INR toggle would have to render the other currency from the static sheet —
  the one path that can drift without `check:prices` seeing it.
- **The V4 header and footer.** The live site's `Navbar` and `Footer` are kept,
  by instruction.
- **The launch/standard price mechanic.** See above.
- **A live CTA on Growth.** `PAID_PLANS` in `confirm-email` omits `GROWTH`, so
  `?plan=GROWTH` is dropped after signup and the visitor lands in onboarding with
  no subscription and no explanation. That is a broken checkout, not a copy
  decision, so the inert CTA stays until stage M4 (0003) lands.
- **Stripe.** The design bills global via Stripe; by instruction every billing
  reference on the pricing surface now names **Razorpay**. `privacy-policy` and
  `terms-of-service` still name Stripe as a processor and were left alone —
  removing a named processor from a legal disclosure is not a copy change.

## Exit condition

Each row in the table above closes when its backend stage ships: D4 for the API
group, blocker 25.3 for DM metering, B6 for `agency:*`, and M3 for limits
verification. When one closes, delete its row here, its entry in
`KNOWN_DIVERGENT_CELLS`, and the warning in `pricing-v4.config.ts`.

## Also fixed here

**The outage path could sell a tier that is not on sale.** ADR 0002 records it
under "an API outage would surface Growth". Two separate causes, both closed:

1. `fetchMarketingPlansContext`'s `catch` branch returned `sanitizeFallback()`
   with neither `applyEmphasis` nor `mergeWithheldTiers`, so an outage put the
   "Most Popular" badge back on Starter. Both branches now run the same
   pipeline.
2. `mergeWithheldTiers` only marks Growth provisional when it *inserts* it —
   and the static sheet already contains Growth, with a working checkout href,
   so the merge skipped it and the fallback served a live "Get Growth" button.
   `sanitizeFallback` now applies `asProvisional()` to every tier in
   `WITHHELD_TIERS`, and both paths share that one helper.
