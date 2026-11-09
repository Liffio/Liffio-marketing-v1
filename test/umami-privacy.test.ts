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

/*
  ref, fbclid and b never reach Umami, on any path. Umami had stored real
  affiliate codes (ref=8v94HD2b) and Facebook click ids in recorded URLs.
*/
test("ref, fbclid and b are stripped from url and referrer; UTMs stay", () => {
  const { hook } = run("https://liffio.com/");
  const out = hook("event", {
    url: "https://liffio.com/?ref=8v94HD2b&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0",
    referrer: "/register?b=Ab12Cd&utm_campaign=launch",
  });
  assert.equal(out.url, "https://liffio.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio");
  assert.equal(out.referrer, "/register?utm_campaign=launch");
  const text = JSON.stringify(out);
  for (const leaked of ["8v94HD2b", "PAZXh0bgNhZW0", "Ab12Cd"]) assert.ok(!text.includes(leaked), leaked);
});

test("a URL that is only ref= keeps its path and loses the query entirely", () => {
  const { hook } = run("https://liffio.com/register?ref=SZZBjG9h");
  assert.equal(hook("event", { url: "https://liffio.com/register?ref=SZZBjG9h" }).url, "https://liffio.com/register");
});

test("URLs without those params are returned exactly as given", () => {
  const { hook } = run("https://liffio.com/pricing?utm_source=x");
  for (const url of ["https://liffio.com/pricing?utm_source=x", "/features", "https://liffio.com/?reference=keep&bb=1"]) {
    assert.equal(hook("event", { url }).url, url, url);
  }
});

test("/auth and /oauth still lose the whole query string and fragment", () => {
  const { hook } = run("https://liffio.com/auth/google/complete?token=eyJ.x&ref=abc");
  assert.equal(
    hook("event", { url: "https://liffio.com/auth/google/complete?token=eyJ.x&ref=abc#f" }).url,
    "https://liffio.com/auth/google/complete",
  );
});

test("the session recorder does not load on a landing carrying ref, fbclid or b, and does otherwise", () => {
  for (const href of ["https://liffio.com/?ref=8v94HD2b", "https://liffio.com/?fbclid=x", "https://liffio.com/register?b=Ab12Cd"]) {
    assert.equal(run(href).appended.length, 0, href);
  }
  assert.equal(run("https://liffio.com/?utm_source=ig&utm_medium=bio").appended.length, 1);
});

/*
  Partner claim links (/claim/<slug>#t=<jwt>) now keep the signed token in the
  address bar, so Umami must never see it: not in url, not in referrer, not
  in the query, and not through recorder.js.
*/
const JWT = "eyJhbGciOiJIUzI1NiJ9.eyJwIjoianMiLCJleHAiOjE4MDB9.c2lnbmF0dXJl";

test("the claim token is dropped from the fragment of url and referrer", () => {
  const href = `https://liffio.com/claim/js#t=${JWT}`;
  const { hook } = run(href);
  const out = hook("event", { url: href, referrer: `/claim/js#t=${JWT}` });
  assert.equal(out.url, "https://liffio.com/claim/js");
  assert.equal(out.referrer, "/claim/js");
  assert.ok(!JSON.stringify(out).includes(JWT));
});

test("with #t= and #code= together, both go", () => {
  const { hook } = run("https://liffio.com/claim/js");
  for (const hash of [`#code=boost-blog&t=${JWT}`, `#t=${JWT}&code=boost-blog`]) {
    const out = hook("event", { url: `https://liffio.com/claim/js?utm_source=ig${hash}` });
    assert.equal(out.url, "https://liffio.com/claim/js?utm_source=ig", hash);
  }
});

test("t= in the query is dropped too, on any path", () => {
  const { hook } = run("https://liffio.com/");
  assert.equal(hook("event", { url: `https://liffio.com/claim/js?t=${JWT}&utm_source=ig` }).url, "https://liffio.com/claim/js?utm_source=ig");
  assert.equal(hook("event", { url: `/pricing?t=${JWT}` }).url, "/pricing");
});

test("other fragments are untouched", () => {
  const { hook } = run("https://liffio.com/claim/js");
  for (const url of ["https://liffio.com/features#pricing", "/blog/post#top", "https://liffio.com/claim/js#x=1"]) {
    assert.equal(hook("event", { url }).url, url, url);
  }
});

test("the session recorder does not load on a landing carrying t= or code=", () => {
  assert.equal(run(`https://liffio.com/claim/js#t=${JWT}`).appended.length, 0);
  assert.equal(run(`https://liffio.com/claim/js#code=boost-blog&t=${JWT}`).appended.length, 0);
  assert.equal(run(`https://liffio.com/claim/js?t=${JWT}`).appended.length, 0);
  assert.equal(run("https://liffio.com/claim/js#code=boost-blog").appended.length, 0);
  assert.equal(run("https://liffio.com/claim/js?code=boost-blog").appended.length, 0);
});

test("the session recorder never loads on the claim pages, with or without a code", () => {
  for (const href of [
    "https://liffio.com/redeem",
    "https://liffio.com/redeem?utm_source=card",
    "https://liffio.com/claim",
    "https://liffio.com/claim/js",
    "https://liffio.com/claim/js/",
  ]) {
    assert.equal(run(href).appended.length, 0, href);
  }
  // Only those paths: a page whose name merely starts the same way still records.
  assert.equal(run("https://liffio.com/redeemable").appended.length, 1);
  assert.equal(run("https://liffio.com/claims-guide").appended.length, 1);
});

/*
  Redeem codes (#code=<code>, and ?code= for good measure) never reach Umami
  either: not in url, not in referrer, after ? or #.
*/
test("Umami never receives a code, in url or referrer, after ? or #", () => {
  const CODES = ["LF-JS-7K2Q-M9XD", "boost-blog"];
  const { hook } = run("https://liffio.com/claim/js#code=LF-JS-7K2Q-M9XD");
  const cases: Array<[string, string]> = [
    ["https://liffio.com/claim/js#code=LF-JS-7K2Q-M9XD", "https://liffio.com/claim/js"],
    ["https://liffio.com/claim/js?code=boost-blog", "https://liffio.com/claim/js"],
    ["https://liffio.com/claim/js?code=boost-blog&utm_source=ig#code=LF-JS-7K2Q-M9XD", "https://liffio.com/claim/js?utm_source=ig"],
    ["/claim/js#code=boost-blog", "/claim/js"],
  ];
  for (const [url, expected] of cases) {
    const out = hook("event", { url, referrer: url });
    assert.equal(out.url, expected, url);
    assert.equal(out.referrer, expected, url);
    const text = JSON.stringify(out);
    for (const code of CODES) assert.ok(!text.includes(code), `${code} leaked from ${url}`);
  }
});
