"use client";

import { useEffect, useRef } from "react";
import { trackSignupStep } from "./analytics";

/** Fires signup_step('landing') once on homepage mount — the funnel's entry point. */
export function LandingStepTracker() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackSignupStep("landing");
  }, []);
  return null;
}
