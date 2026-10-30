/**
 * The partner claim page's pure pieces (liffio.com/claim/:slug): the API calls and the small
 * formatting rules the page shows. No React here, so the rules are tested directly.
 */

import { formatMoney, formatMoneyPrecise } from '@/config/pricing.config';
import type { PricingRegion } from '@/lib/pricing-region';

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

/** `reason: 'code_limit'` comes with `ended` for a shared code whose uses are all taken. */
export type CheckResult = { state: CheckState; holdId?: string; holdExpiresAt?: string; reason?: 'code_limit' };

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

/**
 * `#code=<code>` → the code, or null (partner-codes v2 §8). Read the same way as `#t=`: the
 * fragment only, never `?code=`, so a code in a link never reaches a server log, a Referer or an
 * analytics hit before the page strips it.
 */
export function codeFromHash(hash: string): string | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const c = new URLSearchParams(raw).get('code');
  return c && c.trim().length > 0 ? c.trim().slice(0, 64) : null;
}

/** A custom shared code: 6 to 24 characters of letters, numbers and dashes. */
export const CUSTOM_CODE_MIN = 6;
export const CUSTOM_CODE_MAX = 24;

export type CodeEntry = {
  /** What the input shows. */
  display: string;
  /** What is sent to /check. The server normalises it, so dashes and case don't matter. */
  submit: string;
  /** Whether Redeem can be pressed. */
  complete: boolean;
  kind: 'generated' | 'custom';
};

/**
 * The code input's model. Anything that is (or is on its way to being) this partner's `LF-<prefix>-`
 * shape is auto-formatted as before. Anything else is a custom shared code, kept as typed:
 * uppercased, letters, numbers and dashes only, up to 24, ready at 6 letters or numbers.
 */
export function codeEntry(value: string, prefix: string): CodeEntry {
  const lead = `LF${prefix.toUpperCase()}`;
  const plain = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (plain.length === 0 || lead.startsWith(plain) || plain.startsWith(lead)) {
    const clean = cleanCode(value, prefix);
    return { display: formatCode(clean, prefix), submit: clean, complete: codeComplete(clean, prefix), kind: 'generated' };
  }
  const display = value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, CUSTOM_CODE_MAX);
  const letters = display.replace(/-/g, '').length;
  return { display, submit: display, complete: letters >= CUSTOM_CODE_MIN, kind: 'custom' };
}

/** The hint under the code box: both shapes are fine. Replaces the old "Codes start with LF-XX" error. */
export const codeHint = (prefix: string): string =>
  `Codes look like LF-${prefix}-XXXX-XXXX, or a word code from a post or newsletter.`;

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

export const durationLabel = (d: { value: number; unit: DurationUnit }): string =>
  `${d.value} ${d.unit === 'days' ? (d.value === 1 ? 'day' : 'days') : d.value === 1 ? 'month' : 'months'}`;

/** What the perk is worth at the plan's monthly INR price (days pro-rated on 30), in rupees. */
export const perkWorthInr = (p: Pick<PublicPartner, 'plan' | 'duration'>): number | null =>
  p.plan.monthlyPriceInrPaise == null
    ? null
    : Math.round((p.plan.monthlyPriceInrPaise / 100) * (p.duration.unit === 'months' ? p.duration.value : p.duration.value / 30));

/** Same formatting as /pricing: whole rupees, en-IN grouping. */
export const inr = (rupees: number): string => formatMoney(rupees, '₹');

/** What the perk is worth at the plan's monthly USD price (days pro-rated on 30), in dollars to the cent. */
export const perkWorthUsd = (p: Pick<PublicPartner, 'plan' | 'duration'>): number =>
  Math.round(p.plan.monthlyPriceUsdCents * (p.duration.unit === 'months' ? p.duration.value : p.duration.value / 30)) / 100;

/** `9` → `$9`, `4.2` → `$4.20`: the /pricing formatters, with cents only when it isn't a whole dollar. */
export const usd = (dollars: number): string =>
  Math.round(dollars * 100) % 100 === 0 ? formatMoney(dollars, '$') : formatMoneyPrecise(dollars, '$');

export type PriceDisplay = { monthly: number | null; worth: number | null; format: (amount: number) => string };

/**
 * The one place the page picks a currency: INR for India, USD for everyone else. An Indian visitor
 * on a plan with no INR price gets USD rather than no price at all.
 */
export function priceDisplay(p: Pick<PublicPartner, 'plan' | 'duration'>, region: PricingRegion): PriceDisplay {
  if (region === 'india' && p.plan.monthlyPriceInrPaise != null) {
    return { monthly: p.plan.monthlyPriceInrPaise / 100, worth: perkWorthInr(p), format: inr };
  }
  return { monthly: p.plan.monthlyPriceUsdCents / 100, worth: perkWorthUsd(p), format: usd };
}

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

/*
  The hold this tab is carrying through signup (partner-codes v2 SPEC §2).

  Register puts it in `?redirect=`, but a new account then goes through confirm-email and
  onboarding, which hand off to the app's dashboard, and the Meta OAuth full-page return to
  /onboarding drops every query param. So the hold is also kept in sessionStorage from the first
  page that sees it, and the handoff to the app sends it to the attach route instead of the
  dashboard. sessionStorage: it lasts 30 minutes and belongs to this tab's signup only.
*/
const PENDING_HOLD_KEY = 'liffio:pending-partner-hold';

/** `?hold=<id>`, or `?redirect=/partner-claim?hold=<id>`. Null when neither carries a uuid. */
export function holdFromSearch(params: URLSearchParams): string | null {
  const direct = params.get('hold');
  if (isHoldId(direct)) return direct;
  const redirect = params.get('redirect');
  if (!redirect || !redirect.startsWith('/partner-claim')) return null;
  const q = redirect.indexOf('?');
  if (q < 0) return null;
  const nested = new URLSearchParams(redirect.slice(q + 1)).get('hold');
  return isHoldId(nested) ? nested : null;
}

export function rememberPendingHold(params: URLSearchParams): void {
  const hold = holdFromSearch(params);
  if (!hold) return;
  try {
    sessionStorage.setItem(PENDING_HOLD_KEY, hold);
  } catch {
    /* storage blocked: the ?redirect= still carries it where query strings survive */
  }
}

export function pendingHold(): string | null {
  try {
    const v = sessionStorage.getItem(PENDING_HOLD_KEY);
    return isHoldId(v) ? v : null;
  } catch {
    return null;
  }
}

/**
 * Where the handoff to the app should land. A pending hold replaces the plain dashboard default;
 * an explicit other redirect is kept. Read-only, so it is safe in `nextSignupStep`, whose result
 * some callers only inspect.
 */
export function handoffRedirect(redirectPath: string): string {
  const hold = pendingHold();
  if (!hold) return redirectPath;
  const isDefault = redirectPath === '/dashboard' || redirectPath === '' || redirectPath === '/';
  return isDefault ? partnerClaimPath(hold) : redirectPath;
}

/**
 * `handoffRedirect`, for the moment the browser actually leaves for the app: once the hold is in
 * the handoff the app owns it (and keeps its own copy), so this tab's copy is cleared.
 */
export function takeHandoffRedirect(redirectPath: string): string {
  const hold = pendingHold();
  const target = handoffRedirect(redirectPath);
  if (hold && target.includes(hold)) {
    try {
      sessionStorage.removeItem(PENDING_HOLD_KEY);
    } catch {
      /* nothing to clear */
    }
  }
  return target;
}

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
