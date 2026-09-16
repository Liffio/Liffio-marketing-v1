'use client';

import { useEffect, useRef } from 'react';
import { APP_BASE } from './api';
import { useSession } from './session';

/**
 * Where to send a visitor who is ALREADY signed in, resolved safely.
 *
 * 🔴 This is the open-redirect guard, and it is the reason this is a function
 * and not string concatenation. `?redirect=` is attacker-controllable: anyone
 * can send a customer a link to
 *
 *     https://liffio.com/login?redirect=//evil.example/harvest
 *
 * and a naive `APP_BASE + raw` would hand them a Liffio-branded bounce straight
 * off the domain. `//evil.example` starts with a slash, so a `startsWith('/')`
 * check passes it; only resolving the URL and comparing ORIGINS catches it,
 * along with the backslash and control-character tricks that get past
 * hand-rolled string checks in some browsers.
 *
 * Anything that does not resolve to an app-origin URL falls back to
 * `/dashboard`, which is where an already-signed-in visitor wanted to go anyway.
 *
 * Pure, and exported for the tests.
 */
export function safeAppUrl(raw: string | null | undefined, appBase: string = APP_BASE): string {
  const base = appBase.replace(/\/$/, '');
  const fallback = `${base}/dashboard`;
  try {
    const baseUrl = new URL(base);
    // Must be an absolute path on the app. A relative or scheme-bearing value
    // is rejected outright before it is ever resolved.
    if (!raw || !raw.startsWith('/')) return fallback;
    const resolved = new URL(raw, baseUrl);
    if (resolved.origin !== baseUrl.origin) return fallback;
    return resolved.toString();
  } catch {
    return fallback;
  }
}

/**
 * Did the app itself just send this visitor here?
 *
 * 🔴 This is the infinite-bounce guard, and the loop it prevents is real, not
 * theoretical. app.liffio.com redirects to liffio.com/login when it will not
 * let someone in - and "will not let someone in" is NOT the same as "has no
 * session". A user with a valid cookie but an unverified email, or one who has
 * not finished onboarding, is authenticated as far as /auth/session is
 * concerned while still being turned away by the app. Without this check the
 * two pages would volley that visitor between them forever, with no way out
 * but closing the tab.
 *
 * So: if the app sent them here, it had a reason. Show the page.
 *
 * The site's Referrer-Policy is `strict-origin-when-cross-origin`, so a
 * cross-origin referrer arrives as a bare origin, which is all this needs. An
 * absent referrer (direct navigation, a privacy setting) reads as "not from the
 * app", which is the right default: that is the ordinary case this feature is
 * for.
 *
 * Pure, and exported for the tests.
 */
export function cameFromApp(referrer: string, appBase: string = APP_BASE): boolean {
  try {
    return Boolean(referrer) && new URL(referrer).origin === new URL(appBase).origin;
  } catch {
    return false;
  }
}

/**
 * Bounce an already-signed-in visitor off the login and signup screens.
 *
 * The session cookie is on `.liffio.com` and the app reads it directly, so
 * there is nothing to hand over: no token is minted, fetched or passed in a
 * URL. This just gets out of the way, which is the whole point - asking a
 * customer who is already signed in to sign in again is the flow this exists
 * to prevent.
 *
 * Returns true once a redirect is under way, so the caller can stop rendering
 * a form the visitor is about to be moved away from.
 *
 * 🚩 `location.replace`, not `href`, and guarded by a ref so it fires ONCE.
 * `href` would push a history entry, and the back button would then land the
 * visitor on the login page that immediately bounces them forward again: a trap
 * they cannot reverse out of. The ref covers the same effect re-running (React
 * strict mode, a re-render mid-navigation) while the browser is still tearing
 * the page down.
 */
export function useRedirectWhenSignedIn(redirectPath: string | null | undefined): boolean {
  const session = useSession();
  const fired = useRef(false);
  // Read once, on the first render: a later render must not change the answer
  // and restart a bounce the guard already declined.
  const fromApp = useRef<boolean | null>(null);
  if (fromApp.current === null) {
    fromApp.current = typeof document !== 'undefined' && cameFromApp(document.referrer);
  }

  const shouldRedirect = session.status === 'authenticated' && !fromApp.current;

  useEffect(() => {
    if (!shouldRedirect || fired.current) return;
    fired.current = true;
    window.location.replace(safeAppUrl(redirectPath));
  }, [shouldRedirect, redirectPath]);

  return shouldRedirect;
}
