/**
 * The `domain` attribute for cookies this site writes, so they are shared with
 * app.liffio.com instead of being trapped on liffio.com.
 *
 * The backend sets its own cookies on `.liffio.com` (COOKIE_DOMAIN), which is
 * what lets one session span liffio.com, app.liffio.com and api.liffio.com. A
 * cookie written by this site WITHOUT a domain attribute is host-only: it is
 * sent to liffio.com and to nothing else, so anything the app needs to read
 * later never reaches it. Matching the backend's scope is what keeps the two
 * halves of a visitor's journey joined up.
 *
 * 🚩 Derived from the CURRENT hostname rather than hard-coded, because a
 * browser silently DROPS a cookie whose domain does not cover the page setting
 * it. Hard-coding `.liffio.com` would mean every cookie written on localhost,
 * a Vercel preview URL or any other host is discarded with no error and no
 * exception to catch - the write appears to succeed and the value is simply
 * never there. On those hosts the answer is host-only, which is correct and
 * keeps local development working.
 *
 * The `.` prefix is what includes subdomains. `evil.liffio.com` matches and is
 * ours; `evilliffio.com` does not, because the check requires the dot.
 */
export function cookieDomainAttribute(): string {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (host === 'liffio.com' || host.endsWith('.liffio.com')) return '; domain=.liffio.com';
  return '';
}
