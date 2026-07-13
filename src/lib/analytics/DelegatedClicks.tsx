"use client";

import { useEffect } from "react";
import { trackCtaClick, trackNavigationClick, trackSignupStep } from "./analytics";
import { CTA_BUTTONS, NAV_ITEMS, type CtaButton, type NavItem } from "./events";

function isCtaButton(value: string): value is CtaButton {
  return (CTA_BUTTONS as readonly string[]).includes(value);
}

function isNavItem(value: string): value is NavItem {
  return (NAV_ITEMS as readonly string[]).includes(value);
}

/**
 * Mounted once in the root layout. One delegated click listener covers every
 * data-cta / data-nav element site-wide instead of per-button handlers.
 */
export function DelegatedClicks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const ctaEl = target.closest<HTMLElement>("[data-cta]");
      if (ctaEl) {
        const value = ctaEl.dataset.cta ?? "";
        if (isCtaButton(value)) {
          trackCtaClick(value);
          if (ctaEl.dataset.signupCta === "true") {
            trackSignupStep("cta_clicked");
          }
        }
      }

      const navEl = target.closest<HTMLElement>("[data-nav]");
      if (navEl) {
        const value = navEl.dataset.nav ?? "";
        if (isNavItem(value)) {
          trackNavigationClick(value);
        }
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
