import assert from "node:assert/strict";
import test from "node:test";

import { cookieDomainAttribute } from "@/lib/cookie-scope";

/*
  Cookie scope, guarded.

  This one is worth pinning because every way of getting it wrong is SILENT. A
  browser handed a cookie whose domain does not cover the current page drops it
  without an error and without an exception to catch: the write looks like it
  worked and the value is simply never there afterwards. The referral code that
  goes missing that way is affiliate attribution, and attribution is money.
*/

const withHostname = <T>(hostname: string | null, run: () => T): T => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  if (hostname === null) {
    // Server render: there is no window at all.
    delete (globalThis as { window?: unknown }).window;
  } else {
    (globalThis as { window?: unknown }).window = { location: { hostname } };
  }
  try {
    return run();
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else delete (globalThis as { window?: unknown }).window;
  }
};

test("liffio.com and its subdomains share one cookie across the whole site", () => {
  for (const host of ["liffio.com", "www.liffio.com", "app.liffio.com", "api.liffio.com"]) {
    assert.equal(
      withHostname(host, cookieDomainAttribute),
      "; domain=.liffio.com",
      host,
    );
  }
});

test("a lookalike domain is not ours", () => {
  // The leading dot is what makes this a subdomain check rather than a suffix
  // check. Without it, "evilliffio.com" would be handed our cookie scope.
  for (const host of ["evilliffio.com", "liffio.com.evil.net", "notliffio.com"]) {
    assert.equal(withHostname(host, cookieDomainAttribute), "", host);
  }
});

test("other hosts get a host-only cookie instead of a dropped one", () => {
  // localhost, Vercel previews and anything else: hard-coding .liffio.com here
  // would mean the browser silently discards every cookie this site writes.
  for (const host of ["localhost", "127.0.0.1", "liffio-git-main.vercel.app"]) {
    assert.equal(withHostname(host, cookieDomainAttribute), "", host);
  }
});

test("a server render has no window and asks for no domain", () => {
  assert.equal(withHostname(null, cookieDomainAttribute), "");
});
