/**
 * Keeps login tokens out of Umami. (10-SPEC-autonomous-fixes.md §5, stopgap)
 *
 * The API redirects a Google sign-in started here to liffio.com/auth/google/complete?token=<JWT>,
 * and Umami records the full URL of every pageview, so access tokens were landing in analytics —
 * at least one still valid when found. The real fix is to stop putting the token in the URL; until
 * that ships, this stops Umami from recording it. The app (Client-v2) carries the same script for
 * its own /auth/google/complete and /auth/handoff pages.
 *
 * Two parts, both keyed on the path starting `/auth/` or `/oauth/`:
 *
 *  - `liffioUmamiBeforeSend`, named on script.js's `data-before-send`, drops the query string and
 *    hash from `url` and `referrer` on every payload. `referrer` matters as much as `url`: the next
 *    client-side navigation reports the token page as its referrer.
 *  - recorder.js (session replay) has no such hook and records `location.href` itself, so it is
 *    simply not loaded when the page load starts on one of those paths. Such a session goes
 *    unrecorded until the next full page load, which is the price of the stopgap.
 *
 * Inline, before script.js, and run as the page is parsed: the hook must exist before the first
 * pageview is sent, and the recorder decision must be made before anything navigates away.
 */
const UMAMI_RECORDER_SRC = "https://umami-analytics-rkhr.srv1772252.hstgr.cloud/recorder.js";

export const UMAMI_BEFORE_SEND = "liffioUmamiBeforeSend";

export const umamiPrivacyScript = (websiteId: string) => `(function(){
  var SENSITIVE = /^\\/(auth|oauth)(\\/|$)/;
  // Never in analytics, on any path: \`ref\` is an affiliate's code and \`b\` a customer's branding
  // link code (both resolve to a person), \`fbclid\` is Facebook's per-click id. The page's own
  // URL is untouched, so the affiliate capture still reads \`ref\` from location.
  var DROP_PARAMS = ["ref", "fbclid", "b"];
  function scrub(value) {
    if (typeof value !== "string" || !value) return value;
    try {
      var url = new URL(value, location.origin);
      var changed = false;
      if (SENSITIVE.test(url.pathname)) {
        changed = Boolean(url.search || url.hash);
        url.search = "";
        url.hash = "";
      } else {
        for (var i = 0; i < DROP_PARAMS.length; i++) {
          if (url.searchParams.has(DROP_PARAMS[i])) {
            url.searchParams.delete(DROP_PARAMS[i]);
            changed = true;
          }
        }
      }
      if (!changed) return value;
      return /^[a-z][a-z0-9+.-]*:/i.test(value) ? url.toString() : url.pathname + url.search + url.hash;
    } catch (e) {
      return value;
    }
  }
  window.${UMAMI_BEFORE_SEND} = function (type, payload) {
    if (payload && typeof payload === "object") {
      payload.url = scrub(payload.url);
      payload.referrer = scrub(payload.referrer);
    }
    return payload;
  };
  // recorder.js has no hook and records location.href itself, so it stays off for a page load
  // carrying any of the dropped params, as it does on /auth and /oauth.
  var carriesDropped = false;
  try {
    var params = new URLSearchParams(location.search);
    for (var j = 0; j < DROP_PARAMS.length; j++) if (params.has(DROP_PARAMS[j])) carriesDropped = true;
  } catch (e) {
    carriesDropped = true;
  }
  if (!SENSITIVE.test(location.pathname) && !carriesDropped) {
    var s = document.createElement("script");
    s.defer = true;
    s.src = "${UMAMI_RECORDER_SRC}";
    s.setAttribute("data-website-id", "${websiteId}");
    document.head.appendChild(s);
  }
})();`;
