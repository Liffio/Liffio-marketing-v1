"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "./analytics";

/** Mounted once (in layout). Fires scroll_depth for 50 and 100 exactly once each per page visit. */
export function ScrollDepthTracker() {
  const firedRef = useRef({ 50: false, 100: false });
  const tickingRef = useRef(false);

  useEffect(() => {
    firedRef.current = { 50: false, 100: false };

    function checkDepth() {
      tickingRef.current = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = ((window.scrollY + doc.clientHeight) / doc.scrollHeight) * 100;

      if (!firedRef.current[50] && pct >= 50) {
        firedRef.current[50] = true;
        trackScrollDepth(50);
      }
      if (!firedRef.current[100] && pct >= 99.5) {
        firedRef.current[100] = true;
        trackScrollDepth(100);
      }
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(checkDepth);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
