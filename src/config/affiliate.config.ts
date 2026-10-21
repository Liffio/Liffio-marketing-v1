/**
 * The affiliate programme's numbers, in one place, from the Affiliate Program
 * Policy. Section numbers below are the Markdown revision's
 * (src/content/legal/affiliate-program-policy.md).
 *
 * 🔴 The policy is the source of truth, not this file and not the page. Every
 * value below cites the section it comes from, so a policy revision has one
 * obvious landing spot instead of five components to hunt through. The page
 * used to advertise a 25% / 10% / 10% hybrid over a referred customer's first
 * three months, which neither revision of the policy has ever described.
 *
 * 🚩 TWO REVISIONS EXIST AND THEY DISAGREE. /affiliate-policy currently renders
 * the LEGACY text in src/app/affiliate-policy/page.tsx; the Markdown revision
 * is written but deliberately unpublished (no entry in PUBLICATION_DATES,
 * because publishing starts a 30-day notice obligation to existing affiliates,
 * Section 12). Every value in this file is identical in both, EXCEPT:
 *
 *   - Commission basis. Legacy: "50% of every recurring payment". Markdown
 *     Section 2.2: 50% of Net Revenue, after tax, processing fees, discounts
 *     and refunds. Every figure this site derives is 50% of the plan price,
 *     which is exact under the legacy reading and an upper bound under the
 *     Markdown one, with NET_REVENUE_BASIS_NOTE beside it saying so.
 *   - Annual plans. Legacy Section 2.4: one commission event on the full
 *     annual payment. Markdown Section 2.5: twelve monthly instalments. The
 *     site states NEITHER, and the payout diagram draws the legacy revision's
 *     five stages rather than the Markdown revision's six.
 *
 * 🚩 COMMISSION_RATE applies to NET REVENUE, not to the sticker price.
 * Section 2.2 defines Net Revenue as what Liffio keeps from a payment after
 * deducting GST and other taxes, payment processing fees, discounts and
 * credits, and refunds and chargebacks. Neither the processing fee nor the
 * GST rate is published, so nothing on this site can compute an exact
 * commission. Every figure the site shows is therefore 50% of the plan price,
 * stated as an upper bound with `NET_REVENUE_BASIS_NOTE` beside it, never
 * presented as the amount that will land in a balance.
 */

/** Section 2.1. 50% of Net Revenue, no sliding scale, no cap. */
export const COMMISSION_RATE = 0.5;

/**
 * Section 2.1. How many MONTHS a referred workspace earns commission for.
 *
 * 🔴 CHANGED 2026-10-21 from lifetime recurring to a fixed six-month term, on
 * the owner's instruction that the programme has been updated. Every surface
 * reads this constant - never hardcode "6", and never write "lifetime" again.
 *
 * 🚩 IT IS A WINDOW, NOT A PAYMENT COUNT, and the distinction is the whole
 * rule. The term is six months measured from the workspace's FIRST payment, and
 * the affiliate earns 50% of every payment that lands inside it. The number of
 * commissions therefore depends on the billing cycle, not on the constant:
 *   - monthly  -> six payments, six commissions
 *   - quarterly -> two payments, two commissions
 *   - annual   -> ONE payment, ONE commission, on the full annual amount
 * A payment made after the six months earns nothing, so an annual referral's
 * next renewal (month 13) is outside the term and pays zero. An earlier version
 * of this file and of AffiliateProgramContent read the constant as a count of
 * six payments, which paid an annual referral six times over three years. It
 * does not.
 *
 * ✅ RESOLVED 2026-10-21 by the owner, in their words: "annual also counts as 1
 * it gets 50% of it ... its calculated by no of payment in 6 month".
 *
 * ✅ RESOLVED 2026-10-21 by the owner: Section 4's 15-day grace period stands
 * exactly as written. It was queried because it reads like protection for a
 * lifetime stream, and under a capped term a lapse after the term costs
 * nothing. The owner confirmed the logic is correct and intended: inside the
 * six months a lapse still forfeits the rest, so the clause does real work
 * where it matters. Do NOT rewrite Section 4 or GRACE_PERIOD_DAYS on the
 * theory that the cap made it redundant.
 *
 * ⚠️ ONE THING IS STILL UNRESOLVED, recorded here only - nothing on the public
 * policy page admits to an open question. Grandfathering: affiliates who joined
 * under "no expiry" are owed an answer, and this constant applies the new term
 * to everyone.
 */
export const COMMISSION_MONTHS_COUNT = 6;

/** Section 2.3. The referred user's FIRST payment only, applied automatically. */
export const REFERRED_USER_FIRST_PAYMENT_DISCOUNT = 0.1;

/** Section 3.1. Measured from the referred user's account creation. */
export const ATTRIBUTION_WINDOW_DAYS = 90;

/** Section 4.2. Renew inside it and the subscription counts as continuous. */
export const GRACE_PERIOD_DAYS = 15;

/** Section 6.1. Every commission waits this long before it can be withdrawn. */
export const HOLD_PERIOD_DAYS = 20;

/** Section 6.2 and 6.3, in US dollars, whatever currency the referral paid in. */
export const MINIMUM_WITHDRAWAL_USD = 50;

/** Section 6.5. Business days, after approval. */
export const PAYOUT_PROCESSING_DAYS = "5 to 10 business days";

/**
 * Says what the 50% is actually 50% of. Required next to any figure this site
 * derives from a plan price, because that figure is an upper bound.
 */
export const NET_REVENUE_BASIS_NOTE =
  "Commission is 50% of Net Revenue, which is what Liffio keeps after tax, payment processing fees and any discount, so your actual commission is a little lower than the figures above.";

/** Section 10, final bullet. Required wherever the site projects earnings. */
export const PROJECTION_DISCLAIMER = "Projection, not guaranteed.";
