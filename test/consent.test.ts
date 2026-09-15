import assert from "node:assert/strict";
import test from "node:test";

import {
  CONSENT_REQUIRED_COUNTRIES,
  resolveConsentRequirement,
  shouldAskForConsent,
} from "@/lib/consent/regions";
import { CONSENT_COOKIE_NAME, CONSENT_POLICY_VERSION } from "@/lib/consent/consent";

/*
  The consent gate, guarded.

  Cookie Policy 2.2 makes one promise that can be got wrong silently: an EU or
  UK visitor's referral cookie is set only after they agree. The failure mode is
  not a broken page, it is a cookie written for someone who was never asked, so
  the country list and the "when in doubt, ask" default are worth pinning.
*/

test("every EU member state is in scope", () => {
  // The 27, spelled out rather than counted, so a deletion names itself.
  const eu = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE",
  ];
  assert.equal(eu.length, 27);
  for (const code of eu) {
    assert.equal(resolveConsentRequirement(code), "required", `${code} must be asked`);
  }
});

test("the three non-EU EEA states and the UK are in scope", () => {
  for (const code of ["IS", "LI", "NO", "GB"]) {
    assert.equal(resolveConsentRequirement(code), "required", `${code} must be asked`);
  }
});

test("the two biggest markets outside scope keep the old behaviour", () => {
  // Liffio prices in INR and USD, so these are the two that matter most.
  assert.equal(resolveConsentRequirement("IN"), "not-required");
  assert.equal(resolveConsentRequirement("US"), "not-required");
  assert.equal(shouldAskForConsent("not-required"), false);
});

test("Norway is not read as a boolean", () => {
  // 🚩 "NO" is the ISO code for Norway. A YAML or JSON round trip that coerces
  // it to `false`, or a `if (!country)` guard, silently drops an EEA state out
  // of scope. Pinned because the bug is invisible until a regulator finds it.
  assert.equal(CONSENT_REQUIRED_COUNTRIES.has("NO"), true);
  assert.equal(resolveConsentRequirement("NO"), "required");
});

test("an unknown country is asked, never assumed out of scope", () => {
  for (const value of [null, undefined, "", "   ", "XX1", "n", "!!"]) {
    assert.equal(
      resolveConsentRequirement(value),
      "unknown",
      `${JSON.stringify(value)} must resolve to unknown`,
    );
  }
  assert.equal(shouldAskForConsent("unknown"), true);
});

test("the country code is matched case-insensitively and trimmed", () => {
  assert.equal(resolveConsentRequirement("de"), "required");
  assert.equal(resolveConsentRequirement(" gb "), "required");
  assert.equal(resolveConsentRequirement("us"), "not-required");
});

test("an unlisted two-letter code is out of scope, not unknown", () => {
  // CH is deliberately absent: revFADP carries no cookie-consent requirement
  // of this shape. It must read as a definite "no", not as "we could not tell".
  assert.equal(resolveConsentRequirement("CH"), "not-required");
});

test("the consent cookie is the one the Cookie Policy names", () => {
  // Cookie Policy 2.1 lists "Your cookie choices" as essential, on liffio.com.
  assert.equal(CONSENT_COOKIE_NAME, "liffio_consent");
  // The version is the policy's publication date, so a re-publication asks
  // again. See the note on CONSENT_POLICY_VERSION.
  assert.match(CONSENT_POLICY_VERSION, /^\d{4}-\d{2}-\d{2}$/);
});
