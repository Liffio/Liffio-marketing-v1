/**
 * First-touch signup attribution (automation v1.3, Section 11).
 *
 * Where a visitor first came from, captured on the page they land on and sent with their signup as
 * the `attribution` object POST /auth/register accepts (backend src/lib/signupAttribution.ts:
 * strict keys, every value at most 255 characters, unknown keys rejected with a 400).
 *
 *   utm_source / utm_medium / utm_campaign / utm_term / utm_content  -> utmSource ... utmContent
 *   document.referrer, only when it is another site                 -> referrer
 *   the landing page's path, no query string                         -> landingPath
 *   when                                                             -> firstSeenAt
 *
 * ChatGPT links arrive as ?utm_source=chatgpt.com and Instagram bio links as ?utm_source=ig; both
 * are kept verbatim in utmSource.
 *
 * 🔴 First touch wins: the `lf_attr` cookie is written once and never overwritten.
 *
 * 🔴 Consent: like the referral cookie (Cookie Policy 2.2), `lf_attr` is written only by
 * CookieConsent, once the visitor is outside the EU/EEA/UK or has pressed Accept. Until then the
 * touch is held in memory for this visit only, so a signup in the same visit still carries it.
 */

export const ATTRIBUTION_COOKIE_NAME = 'lf_attr';
const MAX_AGE_SECONDS = 90 * 24 * 60 * 60;
const MAX_VALUE_LENGTH = 255;

/** Exactly the keys the backend's strict schema allows (heardFrom is not collected here). */
export type SignupAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPath?: string;
  firstSeenAt?: string;
};

const KEYS: ReadonlyArray<keyof SignupAttribution> = [
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmTerm',
  'utmContent',
  'referrer',
  'landingPath',
  'firstSeenAt',
];

const UTM: ReadonlyArray<[string, keyof SignupAttribution]> = [
  ['utm_source', 'utmSource'],
  ['utm_medium', 'utmMedium'],
  ['utm_campaign', 'utmCampaign'],
  ['utm_term', 'utmTerm'],
  ['utm_content', 'utmContent'],
];

/** Anything with a `cookie` string like `document`. Injectable so tests need no DOM. */
export type CookieJar = { cookie: string };

const defaultJar = (): CookieJar | null => (typeof document !== 'undefined' ? document : null);

/** Trims, caps at 255, drops empty values and unknown keys. Safe on anything parsed from a cookie. */
export function sanitizeAttribution(input: unknown): SignupAttribution {
  const out: SignupAttribution = {};
  if (!input || typeof input !== 'object') return out;
  const source = input as Record<string, unknown>;
  for (const key of KEYS) {
    const value = source[key];
    if (typeof value !== 'string') continue;
    const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
    if (trimmed) out[key] = trimmed;
  }
  return out;
}

/** liffio.com and its subdomains are us, not a referrer. */
function isOwnHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'liffio.com' || host.endsWith('.liffio.com') || host === 'localhost' || host === '127.0.0.1';
}

/**
 * The touch for this page view, from its URL and `document.referrer`. Pure: reads nothing global.
 * `currentHost` is the page's own host, so a same-site referrer on a preview domain is also ignored.
 */
export function captureFirstTouch(input: {
  href: string;
  referrer?: string | null;
  now?: Date;
}): SignupAttribution {
  let url: URL;
  try {
    url = new URL(input.href);
  } catch {
    return {};
  }
  const touch: Record<string, string> = {};
  for (const [param, key] of UTM) {
    const value = url.searchParams.get(param);
    if (value) touch[key] = value;
  }
  if (input.referrer) {
    try {
      const ref = new URL(input.referrer);
      if (!isOwnHost(ref.hostname) && ref.hostname !== url.hostname) {
        // Origin and path only: a referrer's query string can carry someone else's tokens.
        touch.referrer = `${ref.origin}${ref.pathname}`;
      }
    } catch {
      // An unparseable referrer is no referrer.
    }
  }
  touch.landingPath = url.pathname || '/';
  touch.firstSeenAt = (input.now ?? new Date()).toISOString();
  return sanitizeAttribution(touch);
}

function readCookieValue(jar: CookieJar, name: string): string | null {
  const prefix = `${name}=`;
  for (const part of jar.cookie.split(';')) {
    const entry = part.trim();
    if (entry.startsWith(prefix)) return entry.slice(prefix.length);
  }
  return null;
}

/** The stored first touch, or null when there is none or it is unreadable. */
export function readAttributionCookie(jar: CookieJar | null = defaultJar()): SignupAttribution | null {
  if (!jar) return null;
  const raw = readCookieValue(jar, ATTRIBUTION_COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed = sanitizeAttribution(JSON.parse(decodeURIComponent(raw)));
    return Object.keys(parsed).length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Writes `lf_attr` for 90 days, first-party, SameSite=Lax, unless one already exists (first touch
 * wins). CONSENT IS THE CALLER'S JOB: only CookieConsent calls this. Returns whether it wrote.
 */
export function persistFirstTouch(touch: SignupAttribution, jar: CookieJar | null = defaultJar()): boolean {
  if (!jar) return false;
  if (readAttributionCookie(jar)) return false;
  const clean = sanitizeAttribution(touch);
  if (Object.keys(clean).length === 0) return false;
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  jar.cookie = `${ATTRIBUTION_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(clean))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  return true;
}

/** A rejected (or withdrawn) consent removes what an earlier accept wrote. */
export function clearAttributionCookie(jar: CookieJar | null = defaultJar()): void {
  if (!jar) return;
  jar.cookie = `${ATTRIBUTION_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/*
  This visit's touch, in memory. Not storage: it dies with the tab. It lets a visitor who has not
  answered the consent banner (or who rejected it) still have their own signup credited with how
  they arrived, without anything being written to their browser.
*/
let pendingTouch: SignupAttribution | null = null;

export function holdFirstTouchInMemory(touch: SignupAttribution): void {
  if (!pendingTouch && Object.keys(touch).length > 0) pendingTouch = touch;
}

export function heldFirstTouch(): SignupAttribution | null {
  return pendingTouch;
}

/** Test hook. */
export function resetHeldFirstTouch(): void {
  pendingTouch = null;
}

/**
 * What the signup sends as `attribution`: the stored first touch, else this visit's touch held in
 * memory, sanitized. Undefined when there is nothing, so the key is omitted from the request.
 */
export function attributionForSignup(jar: CookieJar | null = defaultJar()): SignupAttribution | undefined {
  const source = readAttributionCookie(jar) ?? heldFirstTouch();
  if (!source) return undefined;
  const clean = sanitizeAttribution(source);
  return Object.keys(clean).length > 0 ? clean : undefined;
}
