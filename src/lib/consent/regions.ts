/**
 * The countries whose visitors must consent before a non-essential cookie is set.
 *
 * Cookie Policy 2.2 and 5.1 of the Affiliate Program Policy both say the same
 * thing: "Where the law requires your consent for these (for example, if you
 * are in the EU or UK), we only set them after you agree."
 *
 * The list is the 27 EU member states, plus the three non-EU EEA states
 * (Iceland, Liechtenstein, Norway), plus the United Kingdom. The EEA states
 * are in because the GDPR and the ePrivacy Directive were incorporated into
 * the EEA Agreement; the UK is in because the UK GDPR and PECR survived its
 * exit unchanged on this point.
 *
 * 🚩 Not included, deliberately: Switzerland (revFADP has no cookie-consent
 * requirement of this shape), and the EU's overseas territories that carry
 * their own ISO codes. Add either only with a reason, not for tidiness.
 */
const EU_MEMBER_STATES = [
  "AT", // Austria
  "BE", // Belgium
  "BG", // Bulgaria
  "HR", // Croatia
  "CY", // Cyprus
  "CZ", // Czechia
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IE", // Ireland
  "IT", // Italy
  "LV", // Latvia
  "LT", // Lithuania
  "LU", // Luxembourg
  "MT", // Malta
  "NL", // Netherlands
  "PL", // Poland
  "PT", // Portugal
  "RO", // Romania
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
  "SE", // Sweden
] as const;

/** EEA members that are not in the EU. */
const EEA_NON_EU = ["IS", "LI", "NO"] as const;

const UK = ["GB"] as const;

export const CONSENT_REQUIRED_COUNTRIES: ReadonlySet<string> = new Set([
  ...EU_MEMBER_STATES,
  ...EEA_NON_EU,
  ...UK,
]);

/**
 * What the banner should do for a visitor, given the country the host reported.
 *
 * "unknown" is NOT "no". A missing geo header means we could not tell where
 * the visitor is, and the safe reading of "only after you agree" is to ask.
 * The caller shows the banner for both "required" and "unknown".
 */
export type ConsentRequirement = "required" | "not-required" | "unknown";

export function resolveConsentRequirement(
  countryCode: string | null | undefined,
): ConsentRequirement {
  if (!countryCode) return "unknown";
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "unknown";
  return CONSENT_REQUIRED_COUNTRIES.has(code) ? "required" : "not-required";
}

/** Shown the banner? True for a country in scope, and true when we cannot tell. */
export function shouldAskForConsent(requirement: ConsentRequirement): boolean {
  return requirement !== "not-required";
}
