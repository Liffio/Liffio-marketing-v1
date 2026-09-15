"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent/consent";
import {
  captureReferralFromUrl,
  clearStoredReferralCode,
  readReferralCodeFromSearch,
} from "@/lib/auth/referral";

/**
 * The cookie banner, and the gate on the referral cookie behind it.
 *
 * 🔴 ONE COMPONENT OWNS BOTH, deliberately. Cookie Policy 2.2 says the
 * referral cookie is only set after an EU or UK visitor agrees, so "has this
 * visitor agreed?" and "may the referral be written?" are the same question.
 * Splitting them across two components in the root layout would race: whichever
 * effect ran first would decide, and the one that decided would be the referral
 * writer, because it has no reason to wait.
 *
 * This replaces `<ReferralCapture />`, which wrote the cookie, localStorage and
 * sessionStorage from a bare `useEffect` on every page load, for every visitor,
 * before anything had been asked.
 *
 * How a visit resolves:
 *
 *   1. The `?ref=` code is read out of the URL into memory. Memory only. It is
 *      not storage, it does not survive the tab, and it is what makes "accept
 *      later in the same visit" work: Section 4 of the brief, and the reason
 *      the code is held rather than dropped.
 *   2. A stored choice for the CURRENT policy version decides immediately.
 *      Accepted writes the referral; rejected clears anything already stored.
 *      Neither shows the banner.
 *   3. With no stored choice, /api/consent-region says whether to ask. Outside
 *      the EU, EEA and UK the answer is no, and the referral is written as it
 *      always was. Inside, or when the host reported no country at all, the
 *      banner opens and nothing is written until a button is pressed.
 *
 * 🚩 A failed region request is treated as "ask". The alternative is writing a
 * cookie for a visitor we could not place, which is the exact thing the policy
 * promises not to do.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  /*
    The current record, so reopening from the footer can show what was chosen.

    🚩 A lazy initialiser, not a setState inside the effect below. Setting it
    from an effect trips react-hooks/set-state-in-effect, and the rule is right:
    it is a second render for a value that was knowable at the first. Reading
    the cookie during hydration is safe here because `open` starts false, so
    this renders nothing either way and the server and client markup agree.
    `readConsent` returns null on the server, where there is no document.
  */
  const [choice, setChoice] = useState<ConsentChoice | null>(
    () => readConsent()?.choice ?? null,
  );

  /*
    The referral code, in memory, for this page view.

    🚩 A ref, not state. Nothing renders it, and putting it in state would
    re-render the banner every time a referred visitor landed for no benefit.
  */
  const pendingRef = useRef<string | null>(null);
  /** Guards the "accept writes the referral" path from running before step 1. */
  const resolvedRef = useRef(false);

  const persistReferral = useCallback(() => {
    const code = pendingRef.current;
    if (code) captureReferralFromUrl(`?ref=${encodeURIComponent(code)}`);
  }, []);

  useEffect(() => {
    let cancelled = false;

    pendingRef.current = readReferralCodeFromSearch(window.location.search);

    const stored = readConsent();
    if (stored) {
      // `choice` already holds this, from the initialiser above.
      if (stored.choice === "accepted") persistReferral();
      else clearStoredReferralCode();
      resolvedRef.current = true;
      return;
    }

    void (async () => {
      let ask = true;
      try {
        const response = await fetch("/api/consent-region", { cache: "no-store" });
        if (response.ok) {
          const data: unknown = await response.json();
          ask = (data as { ask?: boolean } | null)?.ask !== false;
        }
      } catch {
        // Network failure resolves to asking, never to writing.
      }
      if (cancelled) return;
      resolvedRef.current = true;
      if (ask) setOpen(true);
      else persistReferral();
    })();

    return () => {
      cancelled = true;
    };
  }, [persistReferral]);

  useEffect(() => {
    function onOpenSettings() {
      setOpen(true);
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
  }, []);

  const decide = useCallback(
    (next: ConsentChoice) => {
      writeConsent(next);
      setChoice(next);
      setOpen(false);
      if (next === "accepted") {
        // Section 4 of the brief: accepting later in the same visit still
        // credits the affiliate, from the code held in memory since step 1.
        if (resolvedRef.current) persistReferral();
      } else {
        // Changing an earlier "accept" to "reject" has to remove what that
        // "accept" wrote, not merely stop writing more.
        clearStoredReferralCode();
      }
    },
    [persistReferral],
  );

  if (!open) return null;

  return (
    /*
      🚩 `fixed` with `pointer-events-none` on the positioning layer and
      `pointer-events-auto` on the card: the banner must not block the page.
      No overlay, no scroll lock, nothing modal. A cookie notice that traps a
      reader is a dark pattern, and Cookie Policy 4 promises a choice that can
      be revisited, which only works if declining to answer is possible.

      🚩 It is fixed to the bottom rather than inserted in the flow, so it
      cannot shift layout when it appears. `pb-[env(safe-area-inset-bottom)]`
      keeps it clear of the iOS home indicator.
    */
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
      role="region"
      aria-labelledby="cookie-consent-heading"
    >
      <div className="pointer-events-auto w-full max-w-[560px] rounded-2xl border border-brand-100 bg-white p-4 shadow-[0_18px_40px_-20px_rgba(22,10,8,0.35)] sm:p-5">
        <h2
          id="cookie-consent-heading"
          className="text-sm font-bold text-[#0a0a0a]"
          style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
        >
          Cookies on liffio.com
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
          We use a referral cookie to credit the affiliate who sent you here. It is not needed for
          the site to work, so we only set it if you agree. Essential cookies stay on either way.{" "}
          <a
            href="/cookie-policy"
            className="font-semibold text-[#f5184c] underline underline-offset-2 hover:text-[#b20d8f]"
          >
            Cookie Policy
          </a>
        </p>

        {/*
          🚩 Accept and Reject are the SAME element, the same size, the same
          weight and the same contrast. Neither is a faded link, neither is
          pre-selected, and there is no checkbox to leave ticked. Order is
          Accept then Reject only because it reads naturally; nothing about
          the styling favours either one.
        */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("accepted")}
            aria-pressed={choice === "accepted"}
            className="flex-1 rounded-xl border border-[#0a0a0a] bg-[#0a0a0a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5184c]"
          >
            Accept referral cookies
          </button>
          <button
            type="button"
            onClick={() => decide("rejected")}
            aria-pressed={choice === "rejected"}
            className="flex-1 rounded-xl border border-[#0a0a0a] bg-white px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5184c]"
          >
            Reject referral cookies
          </button>
        </div>

        {choice ? (
          <p className="mt-3 text-[11px] text-gray-500">
            Your current choice is to {choice === "accepted" ? "accept" : "reject"} referral
            cookies. Choosing again replaces it.
          </p>
        ) : null}
      </div>
    </div>
  );
}
