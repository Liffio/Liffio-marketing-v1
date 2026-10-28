/**
 * The partner claim page's pure pieces (liffio.com/claim/:slug): the API calls and the small
 * formatting rules the page shows. No React here, so the rules are tested directly.
 */

export type ProgramState = 'active' | 'not_started' | 'ended' | 'paused' | 'cap_reached' | 'unknown';
export type CheckState = 'invalid' | 'ended' | 'expired' | 'already_claimed' | 'valid';
export type DurationUnit = 'days' | 'months';

export type PublicPartner = {
  slug: string;
  name: string;
  logoUrl: string | null;
  brandColor: string | null;
  method: 'signed' | 'codes';
  codePrefix: string | null;
  plan: { key: string; name: string; monthlyPriceInrPaise: number | null; monthlyPriceUsdCents: number };
  duration: { value: number; unit: DurationUnit };
  customHeadline: string | null;
  programState: ProgramState;
};

export type CheckResult = { state: CheckState; holdId?: string; holdExpiresAt?: string };

const V1 = '/api/v1/public/partner-claims';

/** `null` for an unknown slug (404), so the page shows the bad-link state. */
export async function fetchPartner(apiBase: string, slug: string): Promise<PublicPartner | null> {
  const res = await fetch(`${apiBase}${V1}/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`partner lookup failed: ${res.status}`);
  return (await res.json()) as PublicPartner;
}

/** The token travels in the body, never a URL, so it can't reach logs, a Referer or analytics. */
export async function checkClaim(
  apiBase: string,
  slug: string,
  body: { t: string } | { code: string },
): Promise<CheckResult> {
  const res = await fetch(`${apiBase}${V1}/${encodeURIComponent(slug)}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (res.status === 429) throw new Error('rate_limited');
  if (!res.ok) throw new Error(`check failed: ${res.status}`);
  return (await res.json()) as CheckResult;
}

/** `#t=<jwt>` → the token, or null. Only the fragment is read; `?t=` is not a supported link. */
export function tokenFromHash(hash: string): string | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const t = new URLSearchParams(raw).get('t');
  return t && t.length > 0 ? t : null;
}

/** Uppercase letters and digits only, capped at `LF` + prefix + 8. */
export function cleanCode(value: string, prefix: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 2 + prefix.length + 8);
}

/** `LFJS7K2QM9XD` → `LF-JS-7K2Q-M9XD`, grouping as the user types. */
export function formatCode(clean: string, prefix: string): string {
  const p = prefix.length;
  return [clean.slice(0, 2), clean.slice(2, 2 + p), clean.slice(2 + p, 6 + p), clean.slice(6 + p, 10 + p)]
    .filter(Boolean)
    .join('-');
}

export const codeComplete = (clean: string, prefix: string): boolean => clean.length === 2 + prefix.length + 8;

/** A plain-words reason before any request, or null when the code has the right shape. */
export function codeShapeError(clean: string, prefix: string, partnerName: string): string | null {
  if (!clean.startsWith(`LF${prefix}`)) {
    return `That doesn't look like a ${partnerName} code. Codes start with LF-${prefix}.`;
  }
  return null;
}

export const durationLabel = (d: { value: number; unit: DurationUnit }): string =>
  `${d.value} ${d.unit === 'days' ? (d.value === 1 ? 'day' : 'days') : d.value === 1 ? 'month' : 'months'}`;

/** What the perk is worth at the plan's monthly INR price (days pro-rated on 30), in rupees. */
export const perkWorthInr = (p: Pick<PublicPartner, 'plan' | 'duration'>): number | null =>
  p.plan.monthlyPriceInrPaise == null
    ? null
    : Math.round((p.plan.monthlyPriceInrPaise / 100) * (p.duration.unit === 'months' ? p.duration.value : p.duration.value / 30));

export const inr = (rupees: number): string => `₹${Math.round(rupees).toLocaleString('en-IN')}`;

export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

/** Where Claim goes: the app's attach route, carrying the hold and nothing else. */
export const partnerClaimPath = (holdId: string): string => `/partner-claim?hold=${encodeURIComponent(holdId)}`;

/** Holds are server-issued uuids; anything else in `?hold=` is ignored. */
export const isHoldId = (v: string | null | undefined): v is string =>
  typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** Page states, after the program state and the check result are combined. */
export type ClaimView = 'loading' | 'offer' | 'claimed' | 'expired' | 'invalid' | 'ended';

export function viewFor(partner: PublicPartner | null, check: CheckState | null): ClaimView {
  if (!partner) return 'invalid';
  if (partner.programState !== 'active') return 'ended';
  if (check === 'invalid') return 'invalid';
  if (check === 'ended') return 'ended';
  if (check === 'expired') return 'expired';
  if (check === 'already_claimed') return 'claimed';
  return 'offer';
}
