'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { API_BASE } from './api';

/**
 * Is this visitor already signed in to app.liffio.com?
 *
 * ## The contract
 *
 *     GET https://api.liffio.com/api/v1/auth/session   (credentials: 'include')
 *
 *     200 {"authenticated": true, "user": {"id","name","email"}}
 *     200 {"authenticated": false}
 *
 * The endpoint ALWAYS answers 200, so this module branches on the BODY, never
 * on the status. It only answers https://liffio.com and https://app.liffio.com;
 * any other origin gets no CORS headers, which surfaces here as a rejected
 * fetch and therefore the signed-out header. That includes localhost, so this
 * cannot be exercised end to end from a dev machine against the real API - see
 * "Verifying" at the bottom.
 *
 * ## The three rules this module exists to keep
 *
 * 1. 🔴 **`credentials: 'include'` is mandatory.** The session is an httpOnly
 *    cookie on `.liffio.com`. Without this option the browser does not attach
 *    it and the endpoint correctly answers `authenticated: false` forever. It
 *    is the single most common way to get this wrong, and it fails silently.
 *
 * 2. 🔴 **Nothing auth-related is ever stored on this site.** No token is
 *    returned and none is wanted. Nothing goes in localStorage, sessionStorage
 *    or a JS-readable cookie, and the answer is NOT memoised across page loads:
 *    every document load asks again. An earlier draft of this file cached the
 *    answer in sessionStorage to skip the loading state on repeat page views;
 *    that is exactly what rule 2 forbids, and it is gone. The cost is that the
 *    CTA slot shows its placeholder on each load until the answer lands, which
 *    is the accepted trade and why the slot reserves its space.
 *
 * 3. 🔴 **This is a UI hint, not authorization.** It decides which button is in
 *    the header and nothing else. It can be stale the instant it is read - the
 *    visitor may have signed out in another tab - so it must never gate content,
 *    copy, pricing or any action. Real authorization happens when they reach the
 *    app, against the cookie, on the server.
 *
 * ## Verifying
 *
 * Sign in at app.liffio.com, load liffio.com: the header shows "Go to
 * Dashboard". Sign out, reload: it reverts. In DevTools the request carries the
 * `liffio_rt` cookie and the response is `{"authenticated":true}`.
 *
 * If it always answers false, check the BACKEND before the client: it needs
 * `SESSION_SHARE_ORIGINS` and `COOKIE_DOMAIN` set in production. With those
 * missing the endpoint correctly refuses everyone and no frontend change helps.
 */
export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

/** Only ever held in memory, for the current page. Never persisted. (rule 2) */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type SessionState = {
  status: SessionStatus;
  user: SessionUser | null;
};

/**
 * On by default; `NEXT_PUBLIC_SESSION_CHECK=false` is the kill switch, so the
 * call can be turned off in an incident without shipping a revert. NEXT_PUBLIC_
 * vars inline at BUILD time, so setting it takes effect on the next deploy.
 */
export const SESSION_CHECK_ENABLED = process.env.NEXT_PUBLIC_SESSION_CHECK !== 'false';

/** Overridable only to point at a staging API. Default is the documented route. */
export const SESSION_ENDPOINT =
  process.env.NEXT_PUBLIC_SESSION_ENDPOINT || `${API_BASE}/api/v1/auth/session`;

/**
 * Throttle for RE-checks inside one page load, not a cache. (rule 2)
 *
 * Every document load starts with an empty store and asks the endpoint once.
 * This only stops a burst of tab focus events from firing a request each; the
 * answer is never carried across a page load or read back from storage.
 */
const REFOCUS_THROTTLE_MS = 30_000;

/**
 * How long to wait after a FAILED check before trying again.
 *
 * Longer than the refocus throttle, deliberately. If the API is down, the thing
 * that must not happen is every open marketing tab re-asking constantly and
 * adding load to something already in trouble. The visitor sees the signed-out
 * header either way, so there is nothing to gain by asking again quickly.
 */
const ERROR_BACKOFF_MS = 300_000;

/** The marketing site must never wait on a slow app. */
const TIMEOUT_MS = 4_000;

/**
 * Read one response as a state, branching on the BODY as the contract requires.
 *
 * Pure, and exported for the tests. Only a literal `true` is signed in and only
 * a literal `false` is signed out; anything else (a non-2xx, HTML from a proxy,
 * a body with no `authenticated` key, a truthy string) is 'error', which the
 * header renders as signed out. Guessing is what would put a real visitor in
 * front of the wrong button.
 */
export function interpretSessionResponse(httpStatus: number, body: unknown): SessionStatus {
  if (httpStatus < 200 || httpStatus > 299) return 'error';
  const authenticated = (body as { authenticated?: unknown } | null | undefined)?.authenticated;
  if (authenticated === true) return 'authenticated';
  if (authenticated === false) return 'unauthenticated';
  return 'error';
}

/**
 * Pull the user out of a signed-in response, pure and exported for the tests.
 *
 * Every field is shape-checked rather than trusted. A half-populated `user` is
 * `null` instead of a header greeting reading "Hi undefined", and `null` is a
 * perfectly good answer: the signed-in CTA does not depend on having a name.
 */
export function extractSessionUser(body: unknown): SessionUser | null {
  const user = (body as { user?: unknown } | null | undefined)?.user;
  if (!user || typeof user !== 'object') return null;
  const { id, name, email } = user as Record<string, unknown>;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof email !== 'string') return null;
  if (!id) return null;
  return { id, name, email };
}

/**
 * May a re-check be skipped at `now`?
 *
 * `checkedAt === 0` is the "not asked yet on this page" sentinel and never
 * throttles, or the one request that matters would never be made.
 */
export function isThrottled(checkedAt: number, now: number, failed = false): boolean {
  return checkedAt !== 0 && now - checkedAt < (failed ? ERROR_BACKOFF_MS : REFOCUS_THROTTLE_MS);
}

// -- Store -----------------------------------------------------------------

/*
  🚩 With the kill switch off there is no 'loading' phase AT ALL, and that is
  the point. SESSION_CHECK_ENABLED is a build-time constant, so such a build
  starts and stays signed out: the static HTML carries the ordinary signed-out
  CTAs, fully painted, with no placeholder and no request. The neutral phase
  only exists in a build that can actually resolve it.
*/
const INITIAL_STATUS: SessionStatus = SESSION_CHECK_ENABLED ? 'loading' : 'unauthenticated';

let state: SessionState = { status: INITIAL_STATUS, user: null };
let checkedAt = 0;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(status: SessionStatus, user: SessionUser | null = null): void {
  if (state.status === status && state.user === user) return;
  // A new object every time the value changes, and the SAME object while it does
  // not: useSyncExternalStore compares snapshots by identity and would loop
  // forever on a fresh object per read.
  state = { status, user };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): SessionState {
  return state;
}

/**
 * What the statically generated HTML commits to.
 *
 * Every page here is prerendered and one HTML file is served to signed-in and
 * signed-out visitors alike, so 'loading' is the only honest answer - and
 * committing to either real state in the static HTML is the visible flip the
 * brief rules out. Must be a stable object, for the identity reason above.
 */
const SERVER_STATE: SessionState = { status: INITIAL_STATUS, user: null };

function getServerSnapshot(): SessionState {
  return SERVER_STATE;
}

/**
 * One failure line: no body, no status text, no headers, no cookie.
 *
 * A session endpoint's response body is the last thing that should reach a
 * browser console or a log drain, so only the numeric HTTP status is printed.
 * `warn`, not `error`: an unreachable app is not a marketing site fault and
 * must not be reported as one.
 */
function logSessionFailure(reason: string): void {
  console.warn(`[liffio] session check failed: ${reason}`);
}

async function runCheck(): Promise<void> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(SESSION_ENDPOINT, {
      method: 'GET',
      // 🔴 rule 1. Removing this does not break the build or throw; it just
      // makes every visitor look signed out forever.
      credentials: 'include',
      cache: 'no-store',
      // `Accept` is CORS-safelisted, so this GET never preflights. Note that
      // api.liffio.com's `allowedHeaders` allowlist does NOT contain `Accept`:
      // adding any non-safelisted header here would start a preflight the
      // backend rejects, and the request would never arrive at all.
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    const body = await res.json().catch(() => null);
    const next = interpretSessionResponse(res.status, body);
    if (next === 'error') logSessionFailure(`unexpected response (HTTP ${res.status})`);
    checkedAt = Date.now();
    setState(next, next === 'authenticated' ? extractSessionUser(body) : null);
  } catch {
    // Offline, DNS, TLS, a CORS refusal, or our own 4s abort. Fail safe, never
    // loud: the site keeps working and shows its ordinary signed-out header.
    checkedAt = Date.now();
    logSessionFailure('endpoint unreachable');
    setState('error');
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Ask the backend, at most once at a time.
 *
 * The single `inFlight` promise collapses concurrent callers into ONE request,
 * so any number of components may use the hook without multiplying traffic.
 * This is de-duplication within a page load, not caching across them. (rule 2)
 */
export function ensureSession(options: { force?: boolean } = {}): Promise<void> {
  if (!SESSION_CHECK_ENABLED) {
    setState('unauthenticated');
    return Promise.resolve();
  }
  if (inFlight) return inFlight;
  if (!options.force && isThrottled(checkedAt, Date.now(), state.status === 'error')) {
    return Promise.resolve();
  }
  inFlight = runCheck().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/**
 * The session state, plus the listeners that keep it current.
 *
 * Asks on mount, which is once per document load - and since every link in the
 * header is a plain `<a href>`, that is once per navigation too. `visibilitychange`
 * re-asks when the visitor returns to the tab, which is what catches a sign-in
 * or sign-out that happened over on the app; `pageshow` with `persisted` covers
 * the back button restoring a page from the bfcache, where no effect re-runs.
 */
export function useSession(): SessionState {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!SESSION_CHECK_ENABLED) {
      setState('unauthenticated');
      return;
    }

    void ensureSession();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void ensureSession();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void ensureSession({ force: true });
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return current;
}
