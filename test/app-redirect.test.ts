import assert from "node:assert/strict";
import test from "node:test";

import { cameFromApp, safeAppUrl } from "@/lib/auth/app-redirect";

const APP = "https://app.liffio.com";
const DASHBOARD = "https://app.liffio.com/dashboard";

/*
  The open-redirect guard, guarded.

  `?redirect=` is attacker-controllable. Anyone can mail a customer a link to
  liffio.com/login?redirect=<anything> and, if this function is too permissive,
  that customer gets bounced off a Liffio-branded page straight onto whatever
  host the sender chose. Every case below is a real bypass technique that beats
  a hand-rolled `startsWith('/')` check, which is exactly why this resolves the
  URL and compares origins instead.
*/

test("an ordinary app path is kept, with its query and hash", () => {
  assert.equal(safeAppUrl("/dashboard", APP), DASHBOARD);
  assert.equal(safeAppUrl("/automations/42", APP), "https://app.liffio.com/automations/42");
  assert.equal(safeAppUrl("/inbox?tab=unread", APP), "https://app.liffio.com/inbox?tab=unread");
  assert.equal(safeAppUrl("/settings#billing", APP), "https://app.liffio.com/settings#billing");
});

test("a protocol-relative URL cannot smuggle in another host", () => {
  // The headline bypass: it starts with "/" so a naive check waves it through,
  // but the browser reads it as a full URL on someone else's domain.
  assert.equal(safeAppUrl("//evil.example/harvest", APP), DASHBOARD);
  assert.equal(safeAppUrl("///evil.example", APP), DASHBOARD);
  assert.equal(safeAppUrl("//liffio.com.evil.example", APP), DASHBOARD);
});

test("backslashes are not a way around the slash check", () => {
  // Browsers normalise backslashes to slashes when parsing URLs, so these are
  // the same attack wearing a different hat.
  assert.equal(safeAppUrl("/\\evil.example", APP), DASHBOARD);
  assert.equal(safeAppUrl("\\\\evil.example", APP), DASHBOARD);
});

test("an absolute URL to anywhere else is refused", () => {
  for (const raw of [
    "https://evil.example",
    "http://evil.example/x",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "https://app.liffio.com.evil.example/x",
  ]) {
    assert.equal(safeAppUrl(raw, APP), DASHBOARD, raw);
  }
});

test("an absolute URL to the app itself is allowed through", () => {
  // Same origin, so nothing is being smuggled anywhere.
  assert.equal(safeAppUrl("https://app.liffio.com/dashboard", APP), DASHBOARD);
});

test("nothing, empty, or a relative path falls back to the dashboard", () => {
  for (const raw of [null, undefined, "", "dashboard", "../admin", "?next=/x"]) {
    assert.equal(safeAppUrl(raw, APP), DASHBOARD, JSON.stringify(raw));
  }
});

test("a trailing slash on the app base does not produce a double slash", () => {
  assert.equal(safeAppUrl("/dashboard", "https://app.liffio.com/"), DASHBOARD);
});

/*
  The infinite-bounce guard.

  The app redirects to liffio.com/login when it will not let someone in, and
  that is not the same as having no session: a valid cookie plus an unverified
  email is authenticated as far as /auth/session is concerned, and still turned
  away by the app. If /login bounced that visitor straight back, the two pages
  would volley them forever with no way out but closing the tab.
*/

test("a referrer from the app means the app sent them here on purpose", () => {
  for (const ref of [
    "https://app.liffio.com/",
    "https://app.liffio.com/dashboard",
    "https://app.liffio.com",
  ]) {
    assert.equal(cameFromApp(ref, APP), true, ref);
  }
});

test("any other referrer is an ordinary arrival", () => {
  for (const ref of [
    "",
    "https://liffio.com/pricing",
    "https://www.google.com/",
    "https://app.liffio.com.evil.example/x",
    "not a url",
  ]) {
    assert.equal(cameFromApp(ref, APP), false, JSON.stringify(ref));
  }
});
