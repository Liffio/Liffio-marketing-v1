"use client";

import { openCookieSettings } from "@/lib/consent/consent";

/**
 * The "Cookie settings" control in the footer.
 *
 * Cookie Policy 4: "you can accept or reject non-essential cookies, and change
 * your choice at any time from the cookie settings on our website". The footer
 * renders on every page, so the promise is kept on every page.
 *
 * 🚩 A <button>, not an <a href="#">. It performs an action rather than
 * navigating, so it must be a button: that is what gives it Space as well as
 * Enter, the right role for a screen reader, and no history entry. It is
 * styled to match the links either side of it in the footer bar.
 *
 * 🚩 A client island, so Footer itself stays a server component. The click
 * dispatches a window event that CookieConsent listens for, which keeps the
 * two from needing a shared React context through server boundaries.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
