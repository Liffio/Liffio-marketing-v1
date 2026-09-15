# 2. Feature claims the catalogue does not support

Date: 2026-08-23
Status: **Accepted**: marketing-side sanitize applied; Backend stage recorded, not applied

## Context

Measured against the live `packages` catalogue, the pricing page sold things
that are not true. Not stale numbers this time: capabilities the product does
not have.

These are **not feature flags**. A flag gates something that will ship, whose
copy becomes accurate the day it does. These are claims `packages` contradicts
today.

## Decision: sanitize here, fix at source later

`sanitizeFeatures()` in `src/lib/marketing-plans.server.ts` gained a final
`UNSUPPORTED_CLAIMS` stage. It runs **last**, after the existing flag rewrites,
because those rewrites turn the catalogue's `"Story, Live & welcome DM
automations"` into `"Story automations"`, the string the Starter rule matches.

| Claim | Tiers | Action | Evidence |
| --- | --- | --- | --- |
| Unlimited Instagram accounts | all | drop | `workspacesIncluded` = 1 everywhere except Agency (20); V4 models 1 workspace = 1 account = 1 subscription |
| Unlimited automated DMs | Free | drop | see below |
| 3 DM message templates | Free | drop | no template key exists among the 8 in `package_limits` |
| Story automations | Starter | drop | D8; all 15 `Automations` children are comment-based |
| Team members (up to 5 seats) | Business | → 15 seats | `package_limits.teamMembers` = 15 |
| External API keys (plan-gated) | Business | drop | D4; `maxApiCredentials` 0, `apiRequestsPerDay` 0, no API module |
| Full API access & webhooks | Agency | drop | same as Business |

Bullet counts: Free 10 → 7, Starter 11 → 9, Business 10 → 8, Agency 9 → 7.

### Why the Free DM claim was dropped rather than renumbered

V4 §10.2 gives Free 500 DMs/month. Nothing enforces it:

- no DM key among the 8 in `package_limits`
- every `dmsSent*` reference in the Backend is analytics, not a quota
- V4 line 667 says it outright (*"no DM volume metering exists at all"*) and
  line 1351 marks it **blocker 25.3, "entirely new code"**

`automationsPerDay` is enforced only in `externalApiUsage.ts` on the external-API
path, which is unusable at 0 credentials. The one genuinely enforced Free cap is
`workflows` = **3 automations** (`planEnforcement.ts:151`), which is not a DM
count. Restating "500/month" would have invented a limit; the claim was dropped.

It remains on the paid tiers, where it is accurate today.

## Also changed: the same claims outside the cards

`sanitizeFeatures()` only reaches card bullets. The identical claims rendered in
prose on the same screen, which would have left the page contradicting itself:

- `pricing.config.ts`: Free-plan FAQ answer, and both region variants of
  "Every plan includes unlimited Instagram accounts…"
- `marketing-plans.server.ts`: the same two strings in the derived FAQ builders
- `faq.config.ts`: seven answers, including three dedicated multi-account
  questions rewritten to state the real model (one account per workspace;
  only Agency includes more than one)
- `public/llms.txt`: the same sentence, a static asset no flag reaches
- **comparison matrix**: two rows removed rather than set false, since a row
  false on every tier is noise: `Story mention & reply triggers` (was true on
  four tiers, D8) and `External API keys` (was true on two, D4)

## 🔴 Backend stage: recorded, NOT applied

`plan_catalog.marketing_features` is JSONB; indices are 1-based as stored.

| Plan | idx | Current text | Action |
| --- | --: | --- | --- |
| FREE | 1 | Unlimited Instagram accounts | delete |
| FREE | 2 | Unlimited automated DMs | delete, or set a real cap once metering ships |
| FREE | 5 | 3 DM message templates | delete |
| STARTER | 1 | Unlimited Instagram accounts | delete |
| STARTER | 5 | Story, Live & welcome DM automations | delete |
| BUSINESS | 1 | Unlimited Instagram accounts | delete |
| BUSINESS | 6 | External API keys (plan-gated) | delete |
| BUSINESS | 7 | Team members (up to 5 seats) | → `Team members (up to 15 seats)` |
| AGENCY | 1 | Unlimited Instagram accounts | delete |
| AGENCY | 6 | Full API access & webhooks | delete |

**The fix goes in the seed source, not the row.** `planCatalogService.ensureSeeded()`
re-upserts `plan_catalog` on every API boot, so a direct SQL edit reverts on the
next restart, silently, and probably during an unrelated deploy.

Until that ships, the source stays wrong for every other consumer. This repo is
only sanitizing the symptom.

## 🔴 Separate finding: `plan_catalog`'s limit columns are stale defaults

Not copy. A live trap.

```
plan       on_site  api_enabled  api_creds  seats  workspaces  automations
FREE       true     false        0          1      1           3
STARTER    true     false        0          1      1           3
GROWTH     false    false        0          1      1           3
BUSINESS   true     false        0          1      1           3
AGENCY     true     false        0          1      1           3
PRO        false    false        0          1      1           3
```

Every plan carries identical values, Agency included. They disagree with
`package_limits`, which is authoritative: Business seats 15 (not 1), Agency
workspaces 20 (not 1), automations 3/25/75/150/150 (not a flat 3).

**Only the marketing strings in `plan_catalog` are meaningful. Nothing should
read its limits.** They are wrong, they look plausible, and they sit in a table
that is already read at runtime for other fields, which is exactly the shape of
a defect that surfaces as a mysterious entitlement bug much later. Worth either
dropping the columns or making them mirror `package_limits`.

## ⚠️ Fallback hazard: an outage would surface Growth

`fetchMarketingPlansContext` falls back to the static sheet in
`pricing.config.ts` when the plans API fails **or returns an empty array**. That
sheet contains **Growth**, which the API deliberately withholds
(`plan_catalog.GROWTH.show_on_marketing_site = false`) because **D2 part 2 is
blocked on live Razorpay keys**.

So an API outage does not merely serve stale prices: it puts a **Growth card on
the pricing page for a tier that cannot be bought**, with a working checkout CTA.
Nobody would predict that failure mode from reading either file alone.

Partly mitigated here: the empty-array branch previously returned the fallback
**unsanitized**, reinstating every claim the guard had just removed. Both
branches now route through `sanitizeFallback()`. The Growth exposure itself
remains, and is the reason this is recorded rather than closed.

## Known inconsistency: Growth column, no Growth card

The comparison matrix has a Growth column; the cards do not. Cause:
`show_on_marketing_site = false`. **Unblock condition: D2 part 2, live Razorpay
keys.** Until then the matrix describes a tier with no card above it.

## Residual, not addressed

- Free still shows ✗ `Story & multi-step flows`. The exclusion implies Stories
  exist on a higher tier; after D8 none does. Multi-step flows *are* real on
  Starter, so the row is half-right and needs splitting rather than deleting.
- Starter's ✓ `All automation trigger types` is now comment-only. Technically
  true (every trigger type that exists is comment-based) but it reads as
  broader than it is.
