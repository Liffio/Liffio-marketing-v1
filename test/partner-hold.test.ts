import assert from "node:assert/strict";
import test from "node:test";

// No browser sessionStorage in this runner: a minimal in-memory stand-in.
class FakeStorage {
  #data = new Map<string, string>();
  getItem(key: string) {
    return this.#data.has(key) ? this.#data.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.#data.set(key, value);
  }
  removeItem(key: string) {
    this.#data.delete(key);
  }
  clear() {
    this.#data.clear();
  }
}
(globalThis as { sessionStorage?: unknown }).sessionStorage = new FakeStorage();

import {
  handoffRedirect,
  holdFromSearch,
  partnerClaimPath,
  pendingHold,
  rememberPendingHold,
  takeHandoffRedirect,
} from "@/lib/partner-claim";
import { nextSignupStep } from "@/lib/auth/signup-steps";

/*
  partner-codes v2 §2: a hold must survive email signup, verification, Google signup, login and
  onboarding. Each step below is one hop of that chain.
*/

const HOLD = "3f2b8c1e-9a4d-4b7e-8c21-0d5e6f7a8b9c";
const claimPath = partnerClaimPath(HOLD);
const handoffTarget = (url: string) => new URL(url, "https://app.liffio.com").searchParams.get("redirect");
const reset = () => (sessionStorage as unknown as FakeStorage).clear();

test("the hold is read from ?hold= and from a ?redirect= that points at the attach route", () => {
  assert.equal(holdFromSearch(new URLSearchParams(`hold=${HOLD}`)), HOLD);
  assert.equal(holdFromSearch(new URLSearchParams({ redirect: claimPath })), HOLD);
  assert.equal(holdFromSearch(new URLSearchParams({ redirect: "/dashboard" })), null);
  assert.equal(holdFromSearch(new URLSearchParams({ redirect: "/checkout?hold=" + HOLD })), null);
  assert.equal(holdFromSearch(new URLSearchParams("hold=not-a-uuid")), null);
});

test("step 1, /register?hold=: first sight stores it", () => {
  reset();
  rememberPendingHold(new URLSearchParams(`hold=${HOLD}`));
  assert.equal(pendingHold(), HOLD);
});

test("step 1b, /login?redirect=/partner-claim?hold=: first sight stores it", () => {
  reset();
  rememberPendingHold(new URLSearchParams({ redirect: claimPath }));
  assert.equal(pendingHold(), HOLD);
});

test("step 2, a new account after verification goes to onboarding, with the hold still stored", () => {
  reset();
  rememberPendingHold(new URLSearchParams(`hold=${HOLD}`));
  const next = nextSignupStep({ termsAccepted: true, emailVerified: true, isOnboarded: false }, "tok", claimPath);
  assert.deepEqual(next, { kind: "site", path: "/onboarding" });
  assert.equal(pendingHold(), HOLD, "inspecting the next step must not spend the hold");
});

test("step 3, onboarding's handoff to the app lands on the attach route and clears this tab's copy", () => {
  reset();
  rememberPendingHold(new URLSearchParams(`hold=${HOLD}`));
  assert.equal(takeHandoffRedirect("/dashboard"), claimPath);
  assert.equal(pendingHold(), null);
  assert.equal(takeHandoffRedirect("/dashboard"), "/dashboard", "spent: back to the dashboard");
});

test("Google signup: the callback's default redirect becomes the attach route", () => {
  reset();
  rememberPendingHold(new URLSearchParams(`hold=${HOLD}`));
  const next = nextSignupStep({ termsAccepted: true, emailVerified: true, isOnboarded: true }, "tok", "/dashboard");
  assert.equal(next.kind, "app");
  assert.equal(handoffTarget((next as { url: string }).url), claimPath);
});

test("an existing user's login keeps the explicit redirect", () => {
  reset();
  const next = nextSignupStep({ termsAccepted: true, emailVerified: true, isOnboarded: true }, "tok", claimPath);
  assert.equal(handoffTarget((next as { url: string }).url), claimPath);
});

test("an unrelated explicit redirect is kept, and so is the stored hold", () => {
  reset();
  rememberPendingHold(new URLSearchParams(`hold=${HOLD}`));
  assert.equal(takeHandoffRedirect("/settings/billing"), "/settings/billing");
  assert.equal(pendingHold(), HOLD);
});

test("no hold: every handoff is unchanged", () => {
  reset();
  assert.equal(handoffRedirect("/dashboard"), "/dashboard");
  assert.equal(takeHandoffRedirect("/checkout?plan=GROWTH"), "/checkout?plan=GROWTH");
});
