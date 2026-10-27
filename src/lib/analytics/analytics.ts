import {
  EVENTS,
  type CtaButton,
  type FormName,
  type NavItem,
  type ScrollDepth,
  type Section,
  type SignupStep,
} from "./events";

/*
  🔴 No `umami.identify`, anywhere. (16-SPEC-tracking.md hard constraint)

  This file used to identify every logged-in visitor by their user id, which
  stored raw user UUIDs in Umami's session table: every sampled one joined to
  a real user, the support account among them. An id that resolves to a
  person is exactly what analytics must never hold. A salted hash was the
  other option and was rejected: a stable pseudonym still links one person's
  sessions across time and devices, which is still personal data, and nothing
  we measure needs it now that acquisition source is stored on the user in
  our own database. So the method is not even declared here, and any new call
  to it will fail to type-check.
*/
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

// Analytics are silent in local dev unless explicitly opted into via
// NEXT_PUBLIC_ANALYTICS_DEBUG=true (used for manual testing). Production
// behavior is unaffected by this flag.
const isDevSuppressed =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ANALYTICS_DEBUG !== "true";

// The Umami <script> loads with `defer` from a third-party origin, so it can
// still be mid-fetch when the earliest events fire (landing, hero section_view
// on initial mount). Without buffering, those events hit `window.umami ===
// undefined` and are silently dropped. Queue and flush once it's ready; give
// up after ~5s so a permanently blocked/missing script doesn't retry forever.
type QueuedCall = { event: string; data?: Record<string, unknown> };
let queue: QueuedCall[] = [];
let flushing = false;

function flushWhenReady(attemptsLeft = 50) {
  if (flushing) return;
  flushing = true;
  const tryFlush = (remaining: number) => {
    if (window.umami?.track) {
      const pending = queue;
      queue = [];
      flushing = false;
      for (const call of pending) {
        try {
          window.umami.track(call.event, call.data);
        } catch {
          // Analytics must never block user interaction.
        }
      }
      return;
    }
    if (remaining <= 0) {
      queue = [];
      flushing = false;
      return;
    }
    setTimeout(() => tryFlush(remaining - 1), 100);
  };
  tryFlush(attemptsLeft);
}

function safeTrack(event: string, data?: Record<string, unknown>) {
  if (isDevSuppressed) return;
  try {
    if (window.umami?.track) {
      window.umami.track(event, data);
    } else {
      queue.push({ event, data });
      flushWhenReady();
    }
  } catch {
    // Analytics must never block user interaction.
  }
}

export function trackSectionView(section: Section) {
  safeTrack(EVENTS.SECTION_VIEW, { section });
}

export function trackScrollDepth(depth: ScrollDepth) {
  safeTrack(EVENTS.SCROLL_DEPTH, { depth });
}

export function trackCtaClick(button: CtaButton) {
  safeTrack(EVENTS.CTA_CLICK, { button });
}

export function trackNavigationClick(item: NavItem) {
  safeTrack(EVENTS.NAVIGATION_CLICK, { item });
}

export function trackFaqOpen(question: string) {
  safeTrack(EVENTS.FAQ_OPEN, { question });
}

export function trackFormStart(form: FormName) {
  safeTrack(EVENTS.FORM_START, { form });
}

export function trackFormError(form: FormName) {
  safeTrack(EVENTS.FORM_ERROR, { form });
}

export function trackFormSubmit(form: FormName) {
  safeTrack(EVENTS.FORM_SUBMIT, { form });
}

export function trackFormAbandon(form: FormName) {
  safeTrack(EVENTS.FORM_ABANDON, { form });
}

export function trackSignupStep(step: SignupStep) {
  safeTrack(EVENTS.SIGNUP_STEP, { step });
}

