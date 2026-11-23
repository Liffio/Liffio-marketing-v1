import assert from "node:assert/strict";
import test from "node:test";

import {
  ATTRIBUTION_COOKIE_NAME,
  attributionForSignup,
  captureFirstTouch,
  clearAttributionCookie,
  holdFirstTouchInMemory,
  persistFirstTouch,
  readAttributionCookie,
  resetHeldFirstTouch,
  sanitizeAttribution,
  type CookieJar,
} from "@/lib/attribution/first-touch";
import { emailErrorReason, serverErrorReason, FORM_ERROR_FIELDS, FORM_ERROR_REASONS } from "@/lib/analytics/form-errors";
import { signupEmailError } from "@/lib/auth/email-rules";

/*
  Signup attribution and form_error detail (automation v1.3, Sections 11-13).

  The backend's attribution schema is strict (unknown keys are a 400) and the analytics rule is
  absolute (nothing a visitor typed reaches Umami), so both shapes are pinned here.
*/

/** A tiny document.cookie: "name=value; attr..." sets, Max-Age=0 deletes, reads join all pairs. */
function cookieJar(): CookieJar & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    get cookie() {
      return [...store].map(([k, v]) => `${k}=${v}`).join("; ");
    },
    set cookie(line: string) {
      const [pair, ...attrs] = line.split(";").map((p) => p.trim());
      const eq = pair.indexOf("=");
      const name = pair.slice(0, eq);
      const value = pair.slice(eq + 1);
      if (attrs.some((a) => /^max-age=0$/i.test(a))) store.delete(name);
      else store.set(name, value);
    },
  };
}

const T0 = new Date("2026-11-23T10:00:00.000Z");

test("a ChatGPT link lands utm_source=chatgpt.com in utmSource, with landingPath '/'", () => {
  const touch = captureFirstTouch({ href: "https://liffio.com/?utm_source=chatgpt.com", referrer: "", now: T0 });
  assert.deepEqual(touch, { utmSource: "chatgpt.com", landingPath: "/", firstSeenAt: T0.toISOString() });
});

test("an Instagram bio link (utm_source=ig) works, with every utm_* mapped", () => {
  const touch = captureFirstTouch({
    href: "https://liffio.com/pricing?utm_source=ig&utm_medium=bio&utm_campaign=nov&utm_term=dm&utm_content=link1&x=1",
    now: T0,
  });
  assert.deepEqual(touch, {
    utmSource: "ig",
    utmMedium: "bio",
    utmCampaign: "nov",
    utmTerm: "dm",
    utmContent: "link1",
    landingPath: "/pricing",
    firstSeenAt: T0.toISOString(),
  });
});

test("referrer: external kept as origin + path only; our own sites ignored", () => {
  assert.equal(
    captureFirstTouch({ href: "https://liffio.com/", referrer: "https://www.google.com/search?q=secret", now: T0 }).referrer,
    "https://www.google.com/search",
  );
  for (const own of ["https://liffio.com/blog", "https://app.liffio.com/x", "https://www.liffio.com/"]) {
    assert.equal(captureFirstTouch({ href: "https://liffio.com/", referrer: own, now: T0 }).referrer, undefined, own);
  }
});

test("landingPath never carries the query string", () => {
  const touch = captureFirstTouch({ href: "https://liffio.com/register?email=a%40b.com&utm_source=x", now: T0 });
  assert.equal(touch.landingPath, "/register");
});

test("values are trimmed to 255, empties and unknown keys dropped (the backend 400s on unknown keys)", () => {
  const clean = sanitizeAttribution({ utmSource: "  " + "a".repeat(400), utmMedium: "   ", heardFrom: "friend", evil: "x", utmTerm: 5 });
  assert.deepEqual(Object.keys(clean), ["utmSource"]);
  assert.equal(clean.utmSource!.length, 255);
});

test("first touch wins: a second visit never overwrites the cookie", () => {
  const jar = cookieJar();
  assert.equal(persistFirstTouch(captureFirstTouch({ href: "https://liffio.com/?utm_source=chatgpt.com", now: T0 }), jar), true);
  assert.equal(persistFirstTouch(captureFirstTouch({ href: "https://liffio.com/blog?utm_source=ig", now: T0 }), jar), false);
  assert.equal(readAttributionCookie(jar)?.utmSource, "chatgpt.com");
  assert.equal(readAttributionCookie(jar)?.landingPath, "/");
});

test("the cookie is 90 days, path=/, SameSite=Lax, first-party (no Domain)", () => {
  let written = "";
  const jar = { get cookie() { return ""; }, set cookie(v: string) { written = v; } };
  persistFirstTouch({ utmSource: "ig" }, jar);
  assert.match(written, new RegExp(`^${ATTRIBUTION_COOKIE_NAME}=`));
  assert.match(written, /Max-Age=7776000/);
  assert.match(written, /Path=\//);
  assert.match(written, /SameSite=Lax/);
  assert.doesNotMatch(written, /Domain=/i);
});

test("signup sends the stored first touch as attribution", () => {
  resetHeldFirstTouch();
  const jar = cookieJar();
  persistFirstTouch(captureFirstTouch({ href: "https://liffio.com/?utm_source=chatgpt.com", now: T0 }), jar);
  assert.deepEqual(attributionForSignup(jar), { utmSource: "chatgpt.com", landingPath: "/", firstSeenAt: T0.toISOString() });
});

test("no cookie and nothing held: attribution is omitted", () => {
  resetHeldFirstTouch();
  assert.equal(attributionForSignup(cookieJar()), undefined);
  // JSON.stringify drops an undefined key, so the request carries no `attribution` at all.
  assert.equal(JSON.stringify({ email: "x", attribution: attributionForSignup(cookieJar()) }), '{"email":"x"}');
});

test("before consent (nothing stored) the same visit's touch is still sent from memory", () => {
  resetHeldFirstTouch();
  holdFirstTouchInMemory(captureFirstTouch({ href: "https://liffio.com/?utm_source=ig", now: T0 }));
  holdFirstTouchInMemory(captureFirstTouch({ href: "https://liffio.com/later?utm_source=other", now: T0 }));
  assert.equal(attributionForSignup(cookieJar())?.utmSource, "ig");
  resetHeldFirstTouch();
});

test("reject clears the cookie", () => {
  const jar = cookieJar();
  persistFirstTouch({ utmSource: "ig" }, jar);
  clearAttributionCookie(jar);
  assert.equal(readAttributionCookie(jar), null);
});

test("a corrupted cookie reads as none, never throws", () => {
  const jar = cookieJar();
  jar.store.set(ATTRIBUTION_COOKIE_NAME, "%E0%A4%A");
  assert.equal(readAttributionCookie(jar), null);
});

test("the request body for /auth/register carries attribution.utmSource = chatgpt.com", async () => {
  resetHeldFirstTouch();
  const jar = cookieJar();
  persistFirstTouch(captureFirstTouch({ href: "https://liffio.com/?utm_source=chatgpt.com", now: T0 }), jar);
  const calls: Array<{ url: string; body: string }> = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init?: { body?: string }) => {
    calls.push({ url: String(url), body: String(init?.body ?? "") });
    return new Response(JSON.stringify({ accessToken: "t" }), { status: 201, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  try {
    const { register } = await import("@/lib/auth/api");
    await register({ email: "a@b.com", name: "A B", password: "x", attribution: attributionForSignup(jar) });
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/api\/v1\/auth\/register$/);
  const body = JSON.parse(calls[0].body);
  assert.equal(body.attribution.utmSource, "chatgpt.com");
  assert.equal(body.attribution.landingPath, "/");
});

// ── Section 12: form_error detail ───────────────────────────────────────────

test("email reasons follow the form's own rules", () => {
  assert.equal(emailErrorReason("not-an-email"), "email_invalid");
  assert.equal(emailErrorReason("a+x@outlook.com"), "email_plus_blocked");
  assert.equal(emailErrorReason("a.b@gmail.com"), null);
  assert.equal(emailErrorReason("a.b@company.com"), null);
  assert.equal(emailErrorReason("ab@gmail.com"), null);
});

test("API failures become server_<status>", () => {
  assert.equal(serverErrorReason(409), "server_409");
  assert.equal(serverErrorReason(400), "server_400");
  assert.equal(serverErrorReason(418), "server_other");
  assert.equal(serverErrorReason(null), "server_network");
});

test("form_error carries form, field, reason and nothing a visitor typed", async () => {
  const sent: Array<{ event: string; data?: Record<string, unknown> }> = [];
  const g = globalThis as unknown as { window?: unknown };
  const hadWindow = "window" in g;
  g.window = { umami: { track: (event: string, data?: Record<string, unknown>) => sent.push({ event, data }) } };
  try {
    const { trackFormError } = await import("@/lib/analytics/analytics");
    const typed = ["secret.person@gmail.com", "Hunter2!", "Jane Q Public"];
    trackFormError("register", { field: "email", reason: emailErrorReason("not-an-email")! });
    trackFormError("register", { field: "server", reason: serverErrorReason(409) });
    assert.deepEqual(sent, [
      { event: "form_error", data: { form: "register", field: "email", reason: "email_invalid" } },
      { event: "form_error", data: { form: "register", field: "server", reason: "server_409" } },
    ]);
    for (const { data } of sent) {
      for (const value of Object.values(data ?? {})) {
        const v = String(value);
        assert.ok(
          v === "register" || (FORM_ERROR_FIELDS as readonly string[]).includes(v) || (FORM_ERROR_REASONS as readonly string[]).includes(v),
          `unexpected value ${v}`,
        );
        for (const t of typed) assert.ok(!v.includes(t) && !t.includes(v) || v === "register", `leaked ${v}`);
      }
    }
  } finally {
    if (hadWindow) g.window = undefined;
    else delete g.window;
  }
});

// ── Section 13.3: the Gmail dot rule is gone; the API's 409 handles a second spelling ─

test("a.b@gmail.com submits without a client error; other domains' dots still fine; + still refused", () => {
  assert.equal(signupEmailError("a.b@gmail.com"), null);
  assert.equal(signupEmailError("a.b@googlemail.com"), null);
  assert.equal(signupEmailError("a.b@company.com"), null);
  assert.equal(signupEmailError("ab@gmail.com"), null);
  assert.match(signupEmailError("a+x@gmail.com") ?? "", /\+/);
});

test("the register form turns the API's 409 into 'already has an account, log in instead'", async () => {
  const { readFileSync } = await import("node:fs");
  const form = readFileSync("src/app/(auth-v2)/register/register-form.tsx", "utf8");
  assert.match(form, /status === 409\s*\?\s*'This email already has an account\. Log in instead\.'/);
});
