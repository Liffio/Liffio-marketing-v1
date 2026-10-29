import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanCode,
  codeComplete,
  codeEntry,
  codeFromHash,
  codeHint,
  durationLabel,
  formatCode,
  isHoldId,
  partnerClaimPath,
  perkWorthInr,
  tokenFromHash,
  viewFor,
  type PublicPartner,
} from "@/lib/partner-claim";

/*
  liffio.com/claim/:slug. The token must only ever come from the fragment, a
  typed code is formatted as it is typed, and the page picks the right one of
  its states from the program state and the check result.
*/

const partner = (over: Partial<PublicPartner> = {}): PublicPartner => ({
  slug: "example-partner",
  name: "Example Partner",
  logoUrl: null,
  brandColor: "#475569",
  method: "codes",
  codePrefix: "JS",
  plan: { key: "starter", name: "Starter", monthlyPriceInrPaise: 49900, monthlyPriceUsdCents: 900 },
  duration: { value: 14, unit: "days" },
  customHeadline: null,
  programState: "active",
  ...over,
});

test("the token is read from #t= only", () => {
  assert.equal(tokenFromHash("#t=abc.def.ghi"), "abc.def.ghi");
  assert.equal(tokenFromHash("#x=1&t=tok"), "tok");
  assert.equal(tokenFromHash(""), null);
  assert.equal(tokenFromHash("#t="), null);
});

test("codes are cleaned and grouped as typed, for any prefix length", () => {
  assert.equal(formatCode(cleanCode("lfjs7k2q", "JS"), "JS"), "LF-JS-7K2Q");
  assert.equal(formatCode(cleanCode("lf-js-7k2q-m9xd-extra", "JS"), "JS"), "LF-JS-7K2Q-M9XD");
  assert.equal(formatCode(cleanCode("LFABC1234ZZZZ", "ABC"), "ABC"), "LF-ABC-1234-ZZZZ");
  assert.equal(codeComplete(cleanCode("LF-JS-7K2Q-M9XD", "JS"), "JS"), true);
  assert.equal(codeComplete(cleanCode("LF-JS-7K2Q", "JS"), "JS"), false);
});

test("#code= is read from the fragment only, never from ?code=", () => {
  assert.equal(codeFromHash("#code=LF-JS-7K2Q-M9XD"), "LF-JS-7K2Q-M9XD");
  assert.equal(codeFromHash("#x=1&code=boost-blog"), "boost-blog");
  assert.equal(codeFromHash("#code="), null);
  assert.equal(codeFromHash(""), null);
  // The page only ever passes location.hash, which is empty for a ?code= link.
  assert.equal(codeFromHash(new URL("https://liffio.com/claim/js?code=LF-JS-7K2Q-M9XD").hash), null);
});

test("an LF- code is still auto-formatted as it is typed", () => {
  assert.deepEqual(codeEntry("lfjs7k2qm9xd", "JS"), {
    display: "LF-JS-7K2Q-M9XD",
    submit: "LFJS7K2QM9XD",
    complete: true,
    kind: "generated",
  });
  assert.equal(codeEntry("l", "JS").kind, "generated");
  assert.equal(codeEntry("LF-J", "JS").display, "LF-J");
  assert.equal(codeEntry("LF-JS-7K2Q", "JS").complete, false);
});

test("a custom shared code typed by hand is kept as typed", () => {
  assert.deepEqual(codeEntry("liffio-blog", "JS"), {
    display: "LIFFIO-BLOG",
    submit: "LIFFIO-BLOG",
    complete: true,
    kind: "custom",
  });
  assert.equal(codeEntry("blog 2026!", "JS").display, "BLOG2026");
  assert.equal(codeEntry("AB-12", "JS").complete, false, "under 6 letters or numbers");
  assert.equal(codeEntry("A-B-C-D-E-F", "JS").complete, true);
  assert.equal(codeEntry("X".repeat(30), "JS").display.length, 24);
  // Another partner's LF code is no longer refused in the page; the server answers invalid.
  assert.equal(codeEntry("LFAB7K2QM9XD", "JS").complete, true);
});

test("the hint allows both shapes", () => {
  assert.match(codeHint("JS"), /LF-JS-XXXX-XXXX/);
  assert.match(codeHint("JS"), /word code/);
});

test("the hold goes to the app's attach route, and only a uuid counts", () => {
  const id = "0b9d8e2a-4c1f-4e5b-9a7d-2f3c4b5a6e7d";
  assert.equal(partnerClaimPath(id), `/partner-claim?hold=${id}`);
  assert.equal(isHoldId(id), true);
  assert.equal(isHoldId("../../evil"), false);
  assert.equal(isHoldId(null), false);
});

test("copy helpers", () => {
  assert.equal(durationLabel({ value: 1, unit: "months" }), "1 month");
  assert.equal(durationLabel({ value: 14, unit: "days" }), "14 days");
  assert.equal(perkWorthInr(partner({ duration: { value: 2, unit: "months" }, plan: { key: "growth", name: "Growth", monthlyPriceInrPaise: 149900, monthlyPriceUsdCents: 2900 } })), 2998);
});

test("the page state: unknown slug is a bad link, a closed program has ended, then the check decides", () => {
  assert.equal(viewFor(null, null), "invalid");
  assert.equal(viewFor(partner({ programState: "paused" }), null), "ended");
  assert.equal(viewFor(partner({ programState: "cap_reached" }), "valid"), "ended");
  assert.equal(viewFor(partner(), null), "offer");
  assert.equal(viewFor(partner(), "valid"), "offer");
  assert.equal(viewFor(partner(), "expired"), "expired");
  assert.equal(viewFor(partner(), "already_claimed"), "claimed");
  assert.equal(viewFor(partner(), "invalid"), "invalid");
});
