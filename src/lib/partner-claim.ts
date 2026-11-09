/**
 * The partner claim page's pure pieces (liffio.com/redeem, /claim and /claim/:slug): the API calls
 * and the small rules and copy the page shows. No React here, so the rules are tested directly.
 */

export type ProgramState = 'active' | 'not_started' | 'ended' | 'paused' | 'cap_reached' | 'unknown';
/**
 * `already_paid` is never sent by /check or /lookup today: whether someone already pays Liffio is
 * only known after they sign in, so the app's attach route shows it. The page still renders it if
 * an answer ever carries it.
 */
export type CheckState = 'invalid' | 'ended' | 'expired' | 'already_claimed' | 'valid' | 'already_paid';
export type LookupState = 'found' | 'invalid' | 'already_claimed' | 'ended' | 'expired' | 'already_paid';
export type DurationUnit = 'days' | 'months';
export type ClaimMethod = 'signed' | 'unique' | 'shared';

export type PublicOffer = {
  /** "Starter, 1 month free" | "Starter, 20% off the first payment" | "Starter, 1 month free, then 20% off the first payment" */
  label: string;
  offerType: 'free' | 'discount' | 'both';
  plan: { key: string; name: string; monthlyPriceInrPaise: number | null; monthlyPriceUsdCents: number };
  /** Null for a discount-only offer. */
  duration: { value: number; unit: DurationUnit } | null;
  discount: {
    kind: 'percent' | 'amount';
    percentBps: number | null;
    amountMinor: number | null;
    currency: 'INR' | 'USD' | null;
  } | null;
};

/** What the page brands itself with: from GET /:slug, or from a code lookup. */
export type PartnerBranding = {
  slug: string;
  name: string;
  logoUrl: string | null;
  brandColor: string | null;
  customHeadline: string | null;
  website: string | null;
  methods: ClaimMethod[];
  codePrefix: string | null;
  linkExpiryDays: number;
};

export type PublicPartner = PartnerBranding & {
  /** The partner's default offer. A link or code can carry another one: show what /check or /lookup returns. */
  offer: PublicOffer;
  programState: ProgramState;
};

/** `reason: 'code_limit'` comes with `ended` for a shared code whose uses are all taken. */
export type CheckResult = {
  state: CheckState;
  holdId?: string;
  holdExpiresAt?: string;
  reason?: 'code_limit';
  offer?: PublicOffer;
};

/** `partner`, `offer` and `code` come with `found` and with every state that names the code's partner. */
export type LookupResult = {
  state: LookupState;
  reason?: 'code_limit';
  partner?: PartnerBranding;
  offer?: PublicOffer;
  code?: string;
};

const V1 = '/api/v1/public/partner-claims';

/** `null` for an unknown slug (404), so the page shows "We couldn't find this offer". */
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

/**
 * Any partner's code, no slug (SPEC 9.4). Read-only: no hold is made. Shares /check's rate limit
 * (30 per 15 minutes per IP), so a 429 here is "too many tries" too.
 */
export async function lookupCode(apiBase: string, code: string): Promise<LookupResult> {
  const res = await fetch(`${apiBase}${V1}/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
    cache: 'no-store',
  });
  if (res.status === 429) throw new Error('rate_limited');
  if (!res.ok) throw new Error(`lookup failed: ${res.status}`);
  return (await res.json()) as LookupResult;
}

/** The code box is shown when unique or shared codes are on; `#t=` is read only when signed links are. */
export const takesCodes = (methods: readonly ClaimMethod[]): boolean => methods.includes('unique') || methods.includes('shared');
export const takesLinks = (methods: readonly ClaimMethod[]): boolean => methods.includes('signed');

/** `#t=<jwt>` → the token, or null. Only the fragment is read; `?t=` is not a supported link. */
export function tokenFromHash(hash: string): string | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const t = new URLSearchParams(raw).get('t');
  return t && t.length > 0 ? t : null;
}

/**
 * `#code=<code>` → the code, or null (partner-codes v2 §8). Read the same way as `#t=`: the
 * fragment only, never `?code=`, so a code in a link never reaches a server log or a Referer.
 */
export function codeFromHash(hash: string): string | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const c = new URLSearchParams(raw).get('code');
  return c && c.trim().length > 0 ? c.trim().slice(0, 64) : null;
}

/**
 * Whether the page strips the fragment on load. A `#t=` or `#code=` link is kept exactly as it
 * is (both together keep the whole fragment), because in-app browsers (Instagram, Telegram) hand
 * the current URL to "Open in browser" and the token or code would be lost with it. Only a
 * fragment carrying neither is cleaned.
 */
export function stripHashOnLoad(hash: string): boolean {
  if (!hash || hash === '#') return false;
  return tokenFromHash(hash) === null && codeFromHash(hash) === null;
}

/** The fragment for a code: `#code=<value>`, or '' for an empty one. */
export function codeHash(value: string): string {
  const v = value.trim();
  return v ? `#code=${encodeURIComponent(v)}` : '';
}

/** Where a found code puts the address bar (history.replaceState, no reload): `/claim/<slug>#code=<CODE>`. */
export const claimUrlFor = (slug: string, code: string): string => `/claim/${encodeURIComponent(slug)}${codeHash(code)}`;

/*
  One code rule for every partner (the server's normalizeCode + isWellFormedCode): uppercase,
  dashes and spaces ignored, 4 to 24 letters and numbers. Random codes are LF-XXXX-XXXX-XXXX or
  LF-<PREFIX>-XXXX-XXXX; custom shared codes are a word such as BOOST30. The box no longer formats
  to one partner's prefix: any partner's code is welcome on any claim page.
*/
export const CODE_MIN = 4;
export const CODE_MAX = 24;
/** Room for the dashes of the longest code people may paste. */
export const CODE_INPUT_MAX = 32;

/** What the code box shows: uppercase, letters, numbers and dashes only. */
export const codeInput = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, CODE_INPUT_MAX);

/** What the server compares: uppercase letters and numbers only. */
export const normalizeCode = (value: string): string => value.toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Whether Check code can be pressed: 4 to 24 letters or numbers once dashes are dropped. */
export const codeReady = (value: string): boolean => {
  const n = normalizeCode(value).length;
  return n >= CODE_MIN && n <= CODE_MAX;
};

export const durationLabel = (d: { value: number; unit: DurationUnit }): string =>
  `${d.value} ${d.unit === 'days' ? (d.value === 1 ? 'day' : 'days') : d.value === 1 ? 'month' : 'months'}`;

const money = (minor: number, currency: 'INR' | 'USD'): string =>
  currency === 'INR'
    ? `₹${(minor / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    : `$${(minor / 100).toFixed(2).replace(/\.00$/, '')}`;

/** "20% off", "₹500 off": the same words as the server's offer label. Empty when there's no discount. */
export function discountLabel(d: PublicOffer['discount']): string {
  if (!d) return '';
  if (d.kind === 'percent' && d.percentBps) return `${d.percentBps / 100}% off`;
  if (d.kind === 'amount' && d.amountMinor && d.currency) return `${money(d.amountMinor, d.currency)} off`;
  return '';
}

/** "free month", "2 free months", "14 free days": the hero's highlighted words. */
const freeSpan = (d: { value: number; unit: DurationUnit }): string =>
  d.value === 1 ? `free ${d.unit === 'days' ? 'day' : 'month'}` : `${d.value} free ${d.unit}`;

export type OfferCopy = {
  kind: PublicOffer['offerType'];
  /** The hero headline in three parts, the middle one highlighted. */
  headline: [string, string, string];
  lede: string;
  ticks: string[];
  /** Under the offer label in the card's coloured header. */
  cardNote: string;
  button: string;
};

/*
  The offer's words (SPEC 6.3, 9.4). Liffio has no "sign in with Instagram": Claim leads to sign
  up or log in by email, and the perk starts when the customer connects Instagram in the app. No
  card, and never a charge or a price after the free time: the perk just stops. A discount is on
  the first payment, only if they choose to pay.
*/
export function offerCopy(offer: PublicOffer, partnerName: string): OfferCopy {
  const plan = offer.plan.name;
  const off = discountLabel(offer.discount);
  const start = 'Sign up or log in, then connect your Instagram in the app to start it. No card needed.';
  if (offer.offerType === 'discount' || !offer.duration) {
    return {
      kind: 'discount',
      headline: ['', `${off}`, ' your first Liffio payment.'],
      lede: `${partnerName} is giving you ${off} your first payment for Liffio ${plan}. Sign up or log in, then connect your Instagram in the app to unlock it. No card needed now.`,
      ticks: ['No card needed to claim', 'Only if you choose to pay', 'One offer per Instagram account'],
      cardNote: 'No card needed now. It comes off your first payment, if you choose to pay.',
      button: `Claim ${off}`,
    };
  }
  const d = offer.duration;
  const len = durationLabel(d);
  const ends = d.value === 1 ? `When the ${d.unit === 'days' ? 'day' : 'month'} ends` : `When the ${len} end`;
  const plural = d.value !== 1;
  const headline: [string, string, string] = ['Your ', freeSpan(d), ` of Liffio ${plural ? 'are' : 'is'} ready.`];
  if (offer.offerType === 'both') {
    return {
      kind: 'both',
      headline,
      lede: `${partnerName} is giving you Liffio ${plan} free for ${len}, then ${off} the first payment if you choose to pay. ${start}`,
      ticks: [`No card, no charge when the ${plural ? 'free time' : d.unit === 'days' ? 'day' : 'month'} ends`, `${off} your first payment after it`, 'One offer per Instagram account'],
      cardNote: `No card needed. ${ends}, it just stops. Choose to pay after that and you get ${off} the first payment.`,
      button: `Claim ${len} free`,
    };
  }
  return {
    kind: 'free',
    headline,
    lede: `${partnerName} is giving you Liffio ${plan} free for ${len}. ${start}`,
    ticks: [`No card, no charge when the ${plural ? 'free time' : d.unit === 'days' ? 'day' : 'month'} ends`, 'One offer per Instagram account'],
    cardNote: `No card needed. ${ends}, it just stops.`,
    button: `Claim ${len} free`,
  };
}

/** A partner logo is shown only from an https URL (the R2 bucket); anything else gets initials. */
export const safeLogoUrl = (url: string | null | undefined): string | null =>
  typeof url === 'string' && /^https:\/\/[^\s"'<>]+$/i.test(url) ? url : null;

/** A `#rrggbb` brand colour, or null. */
export const safeBrandColor = (c: string | null | undefined): string | null =>
  typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? c : null;

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

/*
  What the page says. Two kinds of answer: a line under the code box (the box stays as it is,
  ready for another try), or a state card above it (the link or the offer itself can't be used).
*/
export const BOX_ERRORS = {
  invalid: "We couldn't find that code. Check the letters and try again.",
  used: 'This code has already been used. Each code works once. If it was you, sign in instead.',
  limit: 'This code has reached its limit. Try another code.',
  tooMany: 'Too many tries from this network. Please wait 15 minutes and try again.',
  failed: "We couldn't check that code right now. Try again in a moment.",
} as const;

export type NoticeKind = 'expired' | 'inactive' | 'not_started' | 'unknown' | 'bad_link' | 'claimed' | 'paid';
export type Notice = { kind: NoticeKind; title: string; body: string };

/** The state card for a partner's page or a code that names one. `via` is how the visitor came in. */
export function noticeFor(
  kind: NoticeKind,
  p: Pick<PartnerBranding, 'name' | 'linkExpiryDays'> | null,
  opts: { via?: 'link' | 'code'; programState?: ProgramState } = {},
): Notice {
  const name = p?.name ?? 'This partner';
  switch (kind) {
    case 'expired':
      return opts.via === 'code'
        ? { kind, title: 'This code has expired', body: `Codes from ${name} have an end date. Ask them for a new one, or try another code.` }
        : {
            kind,
            title: 'This link has expired',
            body: `Links from ${name} last up to ${p?.linkExpiryDays ?? 7} ${p?.linkExpiryDays === 1 ? 'day' : 'days'}. Ask them for a new one, or enter a code if you have one.`,
          };
    case 'inactive':
      if (opts.programState === 'cap_reached') {
        return { kind, title: 'This offer is no longer active', body: `Every ${name} offer has been claimed. You can still try another code or sign up normally.` };
      }
      if (opts.programState === 'paused') {
        return { kind, title: 'This offer is no longer active', body: `${name} has paused this offer. You can still try another code or sign up normally.` };
      }
      return {
        kind,
        title: opts.via === 'link' ? 'This offer link is no longer active' : 'This offer is no longer active',
        body: `${name} isn't running this offer right now. You can still try another code or sign up normally.`,
      };
    case 'not_started':
      return { kind, title: "This offer hasn't started yet", body: `${name}'s offer opens soon. Try again later, or enter another code.` };
    case 'unknown':
      return { kind, title: "We couldn't find this offer", body: "The link may have a typo. Enter your code below and we'll find the right offer." };
    case 'bad_link':
      return { kind, title: "This link isn't valid", body: `It may be cut off or changed. Open it again from ${name}, or enter a code if you have one.` };
    case 'claimed':
      return { kind, title: 'This offer was already claimed', body: `Each ${name} customer can claim it once. If that was you, sign in to see your plan.` };
    case 'paid':
      return { kind, title: "You're already on a paid Liffio plan", body: "So this offer isn't for you. Your plan keeps running as it is." };
  }
}

/** The notice for a signed link's /check answer, or null when the offer shows. */
export function linkNotice(r: CheckResult, p: PartnerBranding & { programState?: ProgramState }): Notice | null {
  switch (r.state) {
    case 'valid':
      return null;
    case 'invalid':
      return noticeFor('bad_link', p);
    case 'ended':
      return noticeFor('inactive', p, { via: 'link', programState: p.programState });
    case 'expired':
      return noticeFor('expired', p, { via: 'link' });
    case 'already_claimed':
      return noticeFor('claimed', p);
    case 'already_paid':
      return noticeFor('paid', p);
  }
}

/** What a code lookup (or a code /check) means for the page: switch to the offer, a box line, or a card. */
export type CodeOutcome =
  | { kind: 'found' }
  | { kind: 'box'; message: string }
  | { kind: 'notice'; notice: Notice };

export function codeOutcome(r: { state: LookupState | CheckState; reason?: 'code_limit' }, p: PartnerBranding | null): CodeOutcome {
  switch (r.state) {
    case 'found':
    case 'valid':
      return { kind: 'found' };
    case 'invalid':
      return { kind: 'box', message: BOX_ERRORS.invalid };
    case 'already_claimed':
      return { kind: 'box', message: BOX_ERRORS.used };
    case 'ended':
      return r.reason === 'code_limit' ? { kind: 'box', message: BOX_ERRORS.limit } : { kind: 'notice', notice: noticeFor('inactive', p, { via: 'code' }) };
    case 'expired':
      return { kind: 'notice', notice: noticeFor('expired', p, { via: 'code' }) };
    case 'already_paid':
      return { kind: 'notice', notice: noticeFor('paid', p) };
  }
}

/** The state card for a partner page opened with no link and no code: null when it's open. */
export function programNotice(p: PublicPartner | null): Notice | null {
  if (!p) return noticeFor('unknown', null);
  if (p.programState === 'active') return null;
  if (p.programState === 'not_started') return noticeFor('not_started', p);
  return noticeFor('inactive', p, { programState: p.programState });
}
