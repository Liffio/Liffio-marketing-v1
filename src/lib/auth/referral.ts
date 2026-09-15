const REF_KEY = '_ref';
const REF_TS_KEY = '_ref_ts';
const REF_CLIENT_KEY = '_ref_client';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

const isBrowser = typeof window !== 'undefined';
const isValidCode = (code: string) => /^[a-zA-Z0-9]{3,20}$/.test(code.trim());

function setWithTs(storage: Storage, code: string) {
  storage.setItem(REF_KEY, code);
  storage.setItem(REF_TS_KEY, Date.now().toString());
}

function getIfFresh(storage: Storage): string | null {
  const code = storage.getItem(REF_KEY);
  const ts = storage.getItem(REF_TS_KEY);
  if (!code || !ts) return null;
  if (Date.now() - Number(ts) > TTL_MS) {
    storage.removeItem(REF_KEY);
    storage.removeItem(REF_TS_KEY);
    return null;
  }
  return code;
}

function getClientCookieRef(): string | null {
  if (!isBrowser) return null;
  const match = document.cookie.match(new RegExp(`${REF_CLIENT_KEY}=([^;]+)`));
  if (!match?.[1]) return null;
  try { return decodeURIComponent(match[1]); } catch { return match[1]; }
}

/**
 * The `?ref=` code in a query string, validated, WITHOUT storing anything.
 *
 * 🔴 The read half of `captureReferralFromUrl`, split out so a caller can hold
 * a referral in memory while the visitor decides. Cookie Policy 2.2 only lets
 * an EU or UK visitor's referral cookie be set after they agree, and the code
 * has to survive from landing until they press a button, without touching
 * storage in between. See CookieConsent.
 */
export function readReferralCodeFromSearch(search: string): string | null {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const ref = params.get('ref')?.trim();
  if (!ref || !isValidCode(ref)) return null;
  return ref;
}

/**
 * Store a referral code in the cookie, localStorage and sessionStorage.
 *
 * 🔴 CONSENT IS THE CALLER'S JOB, and there is one caller that may decide it:
 * `CookieConsent`. It writes only when the visitor is outside the EU, EEA and
 * UK, or when a visitor inside them has pressed Accept. Do not call this from
 * a bare `useEffect` on mount, which is what `ReferralCapture` used to do, and
 * which set the cookie for every visitor before anything had been asked.
 */
export function captureReferralFromUrl(search: string): string | null {
  if (!isBrowser) return null;
  const ref = readReferralCodeFromSearch(search);
  if (!ref) return null;
  try {
    setWithTs(sessionStorage, ref);
    setWithTs(localStorage, ref);
    document.cookie = `${REF_CLIENT_KEY}=${encodeURIComponent(ref)}; max-age=${Math.floor(TTL_MS / 1000)}; path=/; SameSite=Lax`;
  } catch { /* storage blocked */ }
  return ref;
}

export function getStoredReferralCode(): string | null {
  if (!isBrowser) return null;
  try { return getIfFresh(sessionStorage) ?? getIfFresh(localStorage) ?? getClientCookieRef(); }
  catch { return getClientCookieRef(); }
}

export function getReferralPayloadForRegister() {
  if (!isBrowser) return {};
  const sessionRef = getIfFresh(sessionStorage);
  const localRef = getIfFresh(localStorage);
  const clientRef = getClientCookieRef();
  const code = sessionRef ?? localRef ?? clientRef ?? undefined;
  return { referralCode: code, clientRef: clientRef ?? undefined, sessionRef: sessionRef ?? undefined, localRef: localRef ?? undefined };
}

export function clearStoredReferralCode() {
  if (!isBrowser) return;
  try {
    sessionStorage.removeItem(REF_KEY);
    sessionStorage.removeItem(REF_TS_KEY);
    localStorage.removeItem(REF_KEY);
    localStorage.removeItem(REF_TS_KEY);
    document.cookie = `${REF_CLIENT_KEY}=; max-age=0; path=/`;
  } catch { /* ignore */ }
}
