import assert from "node:assert/strict";
import test from "node:test";

// This Node test runner has no browser `localStorage` global (confirmed:
// `typeof localStorage` is `undefined` here even on Node 22). A minimal
// in-memory stand-in is enough to exercise the module's own try/catch paths.
class FakeStorage {
  #data = new Map<string, string>();
  getItem(key: string) {
    return this.#data.has(key) ? this.#data.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.#data.set(key, value);
  }
  clear() {
    this.#data.clear();
  }
}
(globalThis as { localStorage?: unknown }).localStorage = new FakeStorage();

import {
  markEmailAuthUsed,
  markGoogleAuthUsed,
  wasGoogleLastUsed,
} from "@/lib/auth/last-auth-method";

test("nothing recorded yet reads as not-google", () => {
  localStorage.clear();
  assert.equal(wasGoogleLastUsed(), false);
});

test("marking google makes the badge condition true", () => {
  localStorage.clear();
  markGoogleAuthUsed();
  assert.equal(wasGoogleLastUsed(), true);
});

test("a later email sign-in overrides an earlier google one", () => {
  localStorage.clear();
  markGoogleAuthUsed();
  markEmailAuthUsed();
  assert.equal(wasGoogleLastUsed(), false);
});

test("a blocked localStorage degrades to no badge instead of throwing", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("blocked");
    },
  });
  try {
    assert.doesNotThrow(() => markGoogleAuthUsed());
    assert.equal(wasGoogleLastUsed(), false);
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
  }
});
