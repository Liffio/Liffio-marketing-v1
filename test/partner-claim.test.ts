import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanCode,
  codeComplete,
  codeShapeError,
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
  slug: "joinsecret",
  name: "JoinSecret",
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

test("a code for another partner is refused before any request", () => {
  assert.match(codeShapeError("LFAB7K2QM9XD", "JS", "JoinSecret") ?? "", /Codes start with LF-JS/);
  assert.equal(codeShapeError("LFJS7K2QM9XD", "JS", "JoinSecret"), null);
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
