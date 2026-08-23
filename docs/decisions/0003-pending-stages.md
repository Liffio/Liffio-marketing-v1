# 3. Pending stages and the consolidated open list

Date: 2026-08-23
Status: **Recorded, not built**

Three stages specified in enough detail to implement later, then everything
outstanding across all four surfaces in one place.

---

## Stage B1 — 🔴 the annual column (Backend, priority)

**Live and wrong right now**, on every paid tier, in both currencies.

| Tier | Site advertises | Catalogue charges | Effective monthly |
| --- | --- | --- | --- |
| Starter | **$7**/mo | $90/yr | $7.50 |
| Business | **$47**/mo | $590/yr | $49.17 |
| Agency | **$439**/mo | $5,490/yr | $457.50 |
| Starter | **₹399**/mo | ₹4,999/yr | ₹417 |
| Business | **₹1,999**/mo | ₹24,999/yr | ₹2,084 |
| Agency | **₹18,399**/mo | ₹2,29,999/yr | ₹19,167 |

### ⚠️ Two corrections to the working diagnosis

The brief for this stage described it as *"plan_catalog holds the right annual
totals; the division floors."* Neither half is true, and the difference changes
the fix.

**1. It is not a floored division. It is a 20% discount applied to the monthly
price.** `marketingPlansService.ANNUAL_DISCOUNT = 0.8`, applied to
`monthly_price_*` and floored:

```
Starter    9 x 0.8 = 7.2   -> $7     (live)      90/12 = 7.5   -> $7    (floored division)
Business  59 x 0.8 = 47.2  -> $47    (live)     590/12 = 49.17 -> $49   (floored division)
Agency   549 x 0.8 = 439.2 -> $439   (live)    5490/12 = 457.5 -> $457  (floored division)
```

The live values are **$7 / $47 / $439**, which only the first column produces.
Fixing the rounding would leave the 20% multiplier in place and still under-quote
by ~2.4%.

**2. `plan_catalog` has no annual column at all.** Its price columns are
`monthly_price_usd_cents`, `monthly_price_inr_paise`, `intro_price_inr_paise`,
`intro_price_label`. There is no yearly total in that table to divide.

### The fix

The real annual totals live on the **package** side —
`packages.yearly_price_usd_cents` / `yearly_price_inr_paise` — so this crosses
the plan/package split. Two routes:

- **(a) Read yearly from `packages`** in `marketingPlansService`, joining on the
  package key. Correct immediately, no migration, but couples the marketing
  endpoint to the package side.
- **(b) Add `yearly_price_usd_cents` / `yearly_price_inr_paise` to
  `plan_catalog`** and seed them from the same source. Keeps the endpoint on one
  table, costs a migration plus a seed change.

Either way: **delete `ANNUAL_DISCOUNT`**, and compute the advertised per-month
figure as `ceil(yearlyTotal / 12)` — rounded **up**, so we never under-quote. USD
yearly is exactly `monthly x 10`; every INR yearly is charm-priced ₹9 above that,
which is why deriving from monthly is wrong in INR regardless of the multiplier
(see 0001).

### Interaction with the drift check

`rendered:annual:*` is currently **waived until 2026-09-06**. When this ships,
delete the waiver rather than extending it. If it does not ship by then, the
check starts failing — which is the intended behaviour, not a regression.

---

## Stage M1 — extend the drift check to the served payload

**Accepted recommendation 1.** Compare `/marketing/plans` against production
`/billing/packages` as a first-class comparison, not only as a waived secondary.

The check already fetches both. What changes is weight and reporting:

1. **Split the exit semantics.** `sheet:*` findings fail. `rendered:*` findings
   that match a live waiver print as **WARN** with days remaining, and the
   summary reads `PASS — 7 waived, oldest expires in N days` instead of a bare
   `PASS`. Today a green line hides a live defect.
2. **Promote `rendered` to primary.** The served payload is what a customer sees;
   the static sheet only matters during an outage. They currently carry equal
   weight in the output, which inverts their importance.

### 🚩 The Growth exemption, and why it must expire

A naive static-vs-API comparison fails on Growth — and **correctly so from the
API's side**: the static sheet includes Growth by design (it is the fallback and
must be complete), while `/marketing/plans` hides it because
`show_on_marketing_site = false`. That is an *expected* difference, not drift.

So encode it as an **expected divergence**, not a waiver: assert that the sheet
is a **superset** of the served payload, and that the only permitted extra tier
is Growth.

**The exemption must lift the moment D2 part 2 ships.** Once Growth is on the
site, an exemption for Growth means the check goes quiet on the newest tier —
the one most likely to drift, and the only one that has never been verified
against the catalogue in production. Tie the exemption to the same condition
that unblocks the tier, and make it fail loudly when Growth appears in the
served payload while the exemption is still in place.

---

## Stage M2 — assert the static sheet carries no unsupported claims

**Accepted recommendation 2.** A repo-local test asserting that
`pricing.config.ts` contains none of the `UNSUPPORTED_CLAIMS` strings.

Closes a real asymmetry: a bad claim added to `plan_catalog` is caught by
`sanitizeFeatures()`, but one added to the static config is not caught by
anything — it is merely *currently* correct because it was hand-edited in 0002.

### Shape

Export `UNSUPPORTED_CLAIMS` from `marketing-plans.server.ts`, then for every
region and every rule, assert no plan's bullets match a `drop` rule, and no
bullet still matches the pre-replacement text of a `replaceWith` rule. Runs in
the existing `node --test` suite; no new dependencies.

### Worth widening

The card bullets are the *narrow* version. The strings that survived 0002 are in
**prose** — `faq.config.ts`, the FAQ builders, `llms.txt`, and the competitor
pages — which no rule touches. A test that greps the **built output** for every
`UNSUPPORTED_CLAIMS` pattern across all rendered surfaces covers the whole class
for roughly the same effort, and would have caught the eight competitor-page
instances that had to be found by hand.

---

# Consolidated open list

## Marketing — open PRs

| PR | Branch | State |
| --- | --- | --- |
| **#4** | `fix/signup-country-required` | open, mergeable — signup 400s when the geo prefill lands blank |
| **#5** | `fix/unsupported-feature-claims` | open, mergeable — the feature-claim work; **not yet live** |

## Marketing — recorded, not built

- **M1** — drift check vs served payload, with the expiring Growth exemption (above)
- **M2** — static-sheet claim assertion (above)
- **"Unlimited Instagram accounts" on 8 competitor surfaces** — `chatfuel-alternative`,
  `senddm-alternative`, `manychat-alternative`, `compare`, `seo.config.ts`, and
  `comparisons.config.ts`, where `unlimitedAccounts` is scored as a *competitive
  differentiator* (Liffio true, rivals false). Needs a positioning decision, not
  a sanitize: the senddm page argues "no per-account surcharge… switching to
  Agency reduces cost as account count grows", which rests entirely on it.
- **Free's ✗ `Story & multi-step flows`** — implies Stories exist on a higher
  tier; after D8 none does. Multi-step flows *are* real on Starter, so the row
  needs splitting rather than deleting.
- **Starter's ✓ `All automation trigger types`** — now comment-only. Technically
  true, reads broader than it is.
- **`PAID_PLANS` in `confirm-email/page.tsx` omits GROWTH** — cannot be widened
  until the Free card stops signing up as `?plan=STARTER`, or every Free signup
  routes to checkout.
- **Branch protection is off on `master`** — CI now exists but is not *required*,
  so a red check does not block a merge.
- **Stale clone** — `Desktop/Liffio/SEO frontend/Liffio-marketing-v1` sits at
  `510803c` and still contains `usdMonthly(299)`. Delete it or pull it.

## Backend — out of scope this session

- **B1 🔴 annual column** — the $7/$47/$439 defect above. Highest priority; live.
- **B2 — `plan_catalog.marketing_features`** — the 10 claim rows in 0002. Note
  `ensureSeeded()` re-upserts on every boot, so the fix goes in the seed source.
- **B3 — `plan_catalog` stale limit columns** — flat defaults (`seats 1,
  workspaces 1, automations 3, api_creds 0`) on all six plans, disagreeing with
  `package_limits`. A wrong-but-plausible column in a table already read at
  runtime.
- **B4 — `GROWTH.show_on_marketing_site = false`** — D2 part 2, blocked on live
  Razorpay keys. Until then the comparison matrix shows a Growth column with no
  card, and an API outage would surface a Growth card that cannot be bought.
- **B5 — Google OAuth writes `country: null`** (`auth.ts:1473`; its own comment
  still cites the drifted `:1341`). 46 of 51 Google accounts have no country and
  are refused at checkout with `CHECKOUT_COUNTRY_REQUIRED`.

## Frontend — out of scope this session

- **F1 — G63, the post-signup country prompt.** `PATCH /auth/me/country` is
  built and `setAccountCountry()` is written in `lib/api/auth-api.ts:268`, but it
  has **no call sites**. This is the only legitimate route for the B5 accounts —
  D2 forbids inferring country from IP — so those users stay blocked until the
  UI exists.

## Deferred, with reasoning (see 0001)

- **Live wiring to `/billing/packages`** — deferred, not rejected. Prices are the
  stable half, features the volatile one, and that endpoint serves no feature
  copy. Revisit when packages are repriced often enough that per-change deploys
  bind, or when the plan/package split is unified.
- **Backend copy map keyed by capability (option A)** — the right answer for
  feature copy *when it is needed*, not now.
