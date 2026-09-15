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

/** Section 2.1. Lifetime recurring, no sliding scale, no cap, no expiry. */
export const COMMISSION_RATE = 0.5;

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
