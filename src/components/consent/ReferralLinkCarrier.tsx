"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site.config";
import { getStoredReferralCode, holdReferralCodeInMemory, readReferralCodeFromSearch } from "@/lib/auth/referral";

/**
 * Carries the referral code from the landing URL onto the signup link the
 * visitor actually clicks.
 *
 * 🔴 WHY THIS IS NOT OPTIONAL. Every marketing CTA is a plain `<a href="/register">`,
 * so clicking one is a FULL PAGE LOAD, not a client-side route change. Module
 * memory dies with it. So for a visitor who rejected the cookie banner, or who
 * never answered it, the in-memory hold in referral.ts survives right up to the
 * moment it stops mattering and not one step further. The code has to travel in
 * the URL or it does not travel at all.
 *
 * A query parameter is not storage on the visitor's device, so this needs no
 * consent anywhere, and `/register` already reads `?ref=` straight off its own
 * URL (register-form.tsx, `params.get('ref')`). This closes the gap between the
 * two.
 *
 * 🚩 Capture phase, and it rewrites the live `href` rather than calling
 * preventDefault and navigating itself. Rewriting is invisible to everything
 * else on the page: middle-click, ctrl-click, "open in new tab" and the
 * browser's own status bar all follow the amended href for free, which a
 * hand-rolled `location.assign` would break.
 *
 * 🚩 It does NOT touch a link that already carries `ref=`. An explicit code in a
 * hand-built URL always outranks the ambient one.
 *
 * Known limit: a Next `<Link>` reads its `href` prop, not the DOM attribute, so
 * this does not reach one. That is fine today because no signup CTA is a
 * `<Link>`; if one ever becomes one, give it the code as a prop instead.
 */
export function ReferralLinkCarrier() {
  useEffect(() => {
    // Belt and braces with CookieConsent, which also holds the code. Whichever
    // mounts first wins and the other is a no-op, so neither has to care.
    holdReferralCodeInMemory(readReferralCodeFromSearch(window.location.search));

    const signupPath = siteConfig.urls.appSignup;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== signupPath && !url.pathname.startsWith(`${signupPath}/`)) return;
      if (url.searchParams.has("ref")) return;

      const code = getStoredReferralCode();
      if (!code) return;

      url.searchParams.set("ref", code);
      anchor.href = url.toString();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
