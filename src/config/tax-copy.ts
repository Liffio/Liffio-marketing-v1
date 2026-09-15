import type { PricingRegion } from "@/lib/pricing-region";

/**
 * Tax wording for every surface that shows a price.
 *
 * Terms and Conditions 7.3 is the source of truth, verbatim:
 *
 *   "Prices are shown on our pricing page in Indian rupees or US dollars,
 *    based on the country on your account. **Prices shown in rupees include
 *    GST**, so the amount you see is the amount you pay. Sales billed in US
 *    dollars are treated as exports and are billed without Indian GST. You may
 *    owe tax in your own country on such a sale."
 *
 * So a rupee figure is tax-inclusive and must say so beside it, and a dollar
 * figure is an export sale that carries no Indian GST. The plan grid used to
 * state the exact opposite ("India prices are exclusive of GST"), which is the
 * defect this module exists to keep closed: one string, imported everywhere,
 * rather than the same sentence retyped per surface.
 *
 * The Affiliate Policy depends on the same fact. Net Revenue deducts GST
 * "because prices shown in rupees include GST, so the tax is inside the amount
 * charged", so a rupee price that claimed to be GST-exclusive would put the
 * affiliate commission basis out of step too.
 */

/** Sits beside or under a rupee figure. Short by design: it is a price suffix. */
export const INR_TAX_NOTE = "incl. GST";

/** One line under a dollar price surface. Not repeated per card. */
export const USD_TAX_NOTE = "Billed as an export. No Indian GST applies.";

/** The long form, for a FAQ answer or a billing footnote. */
export const INR_TAX_NOTE_LONG =
  "Rupee prices include GST, so the amount you see is the amount you pay.";

/** True when a rendered price string is denominated in rupees. */
export function isInrPrice(price: string): boolean {
  return price.trimStart().startsWith("₹");
}

/**
 * The suffix for one rendered price, or null when none is warranted.
 *
 * Returns null for dollar prices (they get the single `USD_TAX_NOTE` line, not
 * a per-card suffix) and for a zero price, where "incl. GST" on "₹0" is noise.
 */
export function taxNoteForPrice(price: string): string | null {
  if (!isInrPrice(price)) return null;
  if (/^₹0(?:[.,]0+)?$/.test(price.trim())) return null;
  return INR_TAX_NOTE;
}

/** The billing note for a whole price surface, keyed by the visitor's region. */
export function taxNoteForRegion(region: PricingRegion): string {
  return region === "india"
    ? `${INR_TAX_NOTE_LONG} Billed via Razorpay.`
    : `${USD_TAX_NOTE} Billed via Razorpay.`;
}
