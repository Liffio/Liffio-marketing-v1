
---

# Addendum — 2026-08-23, after Steps 1–5

## Step 6 (design's 87-row matrix) — CANCELLED, not deferred

The existing matrix is already correct and already sanitized: today's
corrections went through it, and the Growth column landed with correct values.

The design's 87 rows carry four D4/D8 violations — the `API` group (2 rows),
`API keys 10`, and `API requests per day 5,000` — plus a feature vocabulary that
predates today's corrections. Adopting it would require a row-by-row audit of
the kind its 35 card bullets needed, nine of which turned out to be false.

And 87 rows is more complete without being more useful. Someone comparing tiers
wants the boundary; 87 rows buries it.

Revisit only if the existing matrix is found to omit a boundary customers
actually ask about — not to adopt the design's version wholesale.

## Stage M3 — expose package limits so quota blocks can ship (Backend)

The design's best idea is the per-tier quota block — `Automations 3 ·
Follow-ups 0 · Seats 1` — which replaces vague claims with numbers. Those
numbers are currently correct: they match `package_limits` exactly
(`workflows` 3/25/75/150/150, `teamMembers` 1/3/5/15/15, `dmFollowUps`
0/2/5/5/5).

🔴 **They cannot be verified from this repo.** `/billing/packages` serves only
ids, names, sort order, badge and the four price fields. `/marketing/plans`
serves no limits either. So shipping quota blocks would put new static numbers
on the page with no production source to compare against — which is exactly what
produced `$299` and `$120`.

**Stage:** expose `package_limits` on a public endpoint (extend
`/billing/packages`, or add `/billing/packages/limits`). Then the drift check
compares quota blocks the way it already compares prices, and the blocks ship.

Value is real. It should ship once the numbers can be checked, not before.

### 🚩 Two rows that must never ship, even then

- **Free "500 DMs/month"** — unenforced. No DM key in `package_limits`, every
  `dmsSent*` reference in the Backend is analytics, and V4 itself calls it
  blocker 25.3, "entirely new code". PR #5 dropped this claim for this reason;
  re-adding it as a quota would reinstate it in a new place.
- **AI token figures** (1,000 / 10,000 / 30,000 / 75,000, "rollover up to
  25,000") — never verified against `ai_token_plan_configs`. Unknown, not known-
  correct.

## Stage M4 — add GROWTH to PAID_PLANS (Marketing, gated)

`src/app/(auth)/confirm-email/page.tsx:17` — `const PAID_PLANS = ['BUSINESS',
'AGENCY']`. Because GROWTH is absent, `?plan=GROWTH` is dropped after signup
(`localStorage.removeItem('pending_plan')`) and the visitor lands in onboarding
with no subscription and no explanation. That is why Growth's CTA is inert.

⚠️ Earlier notes placed this in the Frontend repo. It is **not** — Frontend has
no `PAID_PLANS` occurrence. It is here, and in scope.

Adding `GROWTH` **alone is safe**. The Phase 1 warning against widening this
list was specific to `STARTER`: the Free card's CTA is `?plan=STARTER`, so
adding that would route every Free signup to checkout. `GROWTH` does not touch
it.

**Gate: live Razorpay keys.** Against test-mode SKUs, checkout fails at payment
rather than at the start — better, but still a broken purchase. Enable this and
drop `provisional` from the Growth card in the same change, so a highlighted
card never carries a button that cannot complete.
