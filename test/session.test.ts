import assert from "node:assert/strict";
import test from "node:test";

import {
  extractSessionUser,
  interpretSessionResponse,
  isThrottled,
} from "@/lib/auth/session";

/*
  The session check, guarded.

  The failure mode here is not a broken page, it is a header that tells a
  visitor the wrong thing about their own account: a paying customer sent to
  "Log in" when they are already signed in, or - far worse - a signed-out
  visitor pointed at a dashboard that will bounce them. Both come from the same
  place, reading the response more generously than it deserves, so that reading
  is pinned here.
*/

test("the contract's two answers are the only two ways to be sure", () => {
  assert.equal(interpretSessionResponse(200, { authenticated: true }), "authenticated");
  assert.equal(interpretSessionResponse(200, { authenticated: false }), "unauthenticated");
});

test("a 200 that does not actually answer the question is an error", () => {
  // An HTML login page, a CDN interstitial, or a renamed field all arrive as
  // 200 with a body that has no `authenticated` boolean. None of them is a yes.
  for (const body of [null, {}, { authed: true }, { user: { id: "1" } }, []]) {
    assert.equal(interpretSessionResponse(200, body), "error", JSON.stringify(body));
  }
});

test("truthiness is not an answer", () => {
  // The one bug this function exists to prevent: `if (body.authenticated)`
  // would read every one of these as signed in.
  for (const value of [1, "yes", "true", {}, [], "false"]) {
    assert.equal(
      interpretSessionResponse(200, { authenticated: value }),
      "error",
      String(value),
    );
  }
});

test("the endpoint always answers 200, so anything else is an error", () => {
  // Per the contract a non-2xx means something OTHER than the endpoint replied:
  // a proxy, a gateway, or the route not being deployed. It is never a yes, and
  // it is not a trustworthy no either.
  for (const code of [401, 403, 404, 500, 502]) {
    assert.equal(interpretSessionResponse(code, { authenticated: true }), "error", String(code));
  }
});

test("a complete user is carried through", () => {
  const user = { id: "u_1", name: "Asha", email: "asha@example.com" };
  assert.deepEqual(extractSessionUser({ authenticated: true, user }), user);
});

test("a half-populated user is null, not a header reading 'Hi undefined'", () => {
  const bodies = [
    { authenticated: true },
    { authenticated: true, user: null },
    { authenticated: true, user: {} },
    { authenticated: true, user: { id: "u_1", name: "Asha" } },
    { authenticated: true, user: { id: "u_1", name: 42, email: "a@b.c" } },
    { authenticated: true, user: { id: "", name: "Asha", email: "a@b.c" } },
    { authenticated: true, user: "Asha" },
  ];
  for (const body of bodies) {
    assert.equal(extractSessionUser(body), null, JSON.stringify(body));
  }
});

test("nothing is asked before the first request, or the check would never run", () => {
  // checkedAt === 0 is the "not asked yet on this page" sentinel.
  assert.equal(isThrottled(0, Date.now()), false);
  assert.equal(isThrottled(0, Date.now(), true), false);
});

test("a burst of tab focus events does not become a burst of requests", () => {
  const now = 1_000_000;
  assert.equal(isThrottled(now, now), true);
  assert.equal(isThrottled(now - 29_000, now), true);
  assert.equal(isThrottled(now - 30_000, now), false, "returning later re-asks");
  assert.equal(isThrottled(now - 600_000, now), false);
});

test("a failed check backs off longer, so an outage is not polled constantly", () => {
  // Every open marketing tab re-asking is load the API does not need while it
  // is already failing, and the visitor sees the same signed-out header anyway.
  const now = 10_000_000;
  assert.equal(isThrottled(now - 60_000, now, true), true, "still backing off at 60s");
  assert.equal(isThrottled(now - 299_000, now, true), true, "still backing off at 299s");
  assert.equal(isThrottled(now - 300_000, now, true), false, "backoff is over at 5min");
});
