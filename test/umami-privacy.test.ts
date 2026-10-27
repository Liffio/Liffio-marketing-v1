import assert from "node:assert/strict";
import test from "node:test";

import { UMAMI_BEFORE_SEND, umamiPrivacyScript } from "@/lib/analytics/umamiPrivacy";

/*
  Login tokens kept out of Umami (10-SPEC-autonomous-fixes.md §5, stopgap).

  Runs the inline script as the browser would, against a stand-in window, and
  drives the hook the way Umami's script.js does: window[data-before-send](type,
  payload) before every send. Also checked end to end in headless Chrome
  against the real script.js on 27 Oct 2026.
*/

const run = (href: string) => {
  const location = new URL(href);
  const appended: Array<{ src: string; attrs: Record<string, string> }> = [];
  const document = {
    createElement: () => {
      const el = { src: "", defer: false, attrs: {} as Record<string, string>, setAttribute(k: string, v: string) { el.attrs[k] = v; } };
      return el;
    },
    head: { appendChild: (el: { src: string; attrs: Record<string, string> }) => appended.push(el) },
  };
  const window: Record<string, unknown> = {};
  new Function("window", "location", "document", umamiPrivacyScript("site-1"))(window, location, document);
  const hook = window[UMAMI_BEFORE_SEND] as (type: string, payload: Record<string, unknown>) => Record<string, unknown>;
  return { hook, appended };
};

test("the Google sign-in pageview loses its token", () => {
  const { hook } = run("https://liffio.com/auth/google/complete?token=eyJ.secret&redirect=%2Fdashboard");
  const out = hook("event", { url: "https://liffio.com/auth/google/complete?token=eyJ.secret&redirect=%2Fdashboard", referrer: "" });
  assert.equal(out.url, "https://liffio.com/auth/google/complete");
});

test("so does the next page's referrer", () => {
  const { hook } = run("https://liffio.com/onboarding");
  assert.equal(hook("event", { url: "https://liffio.com/onboarding", referrer: "/auth/google/complete?token=eyJ.x" }).referrer, "/auth/google/complete");
});

test("every other URL keeps its query string, UTM included", () => {
  const { hook } = run("https://liffio.com/pricing?utm_source=ig");
  const payload = { url: "https://liffio.com/pricing?utm_source=ig", referrer: "https://www.google.com/search?q=liffio" };
  assert.deepEqual(hook("event", { ...payload }), payload);
  assert.equal(hook("event", { url: "https://liffio.com/authors?x=1" }).url, "https://liffio.com/authors?x=1");
});

test("the session recorder is not loaded on /auth or /oauth, and is everywhere else", () => {
  assert.equal(run("https://liffio.com/auth/google/complete?token=x").appended.length, 0);
  assert.equal(run("https://liffio.com/oauth/x?code=1").appended.length, 0);
  const { appended } = run("https://liffio.com/");
  assert.equal(appended.length, 1);
  assert.match(appended[0].src, /\/recorder\.js$/);
  assert.equal(appended[0].attrs["data-website-id"], "site-1");
});
