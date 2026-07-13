"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { trackSectionView } from "./analytics";
import type { Section } from "./events";

/** Fires section_view once when ~50% of the target enters the viewport. Never refires on scroll-back-up. */
export function useSectionView(section: Section, ref: RefObject<Element | null>) {
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackSectionView(section);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [section, ref]);
}

/** Drop around a homepage section to instrument it without touching the section's internals. */
export function TrackSection({ name, children }: { name: Section; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionView(name, ref);
  return (
    <div ref={ref} data-section={name}>
      {children}
    </div>
  );
}
