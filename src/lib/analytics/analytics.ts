import {
  EVENTS,
  type CtaButton,
  type FormName,
  type NavItem,
  type ScrollDepth,
  type Section,
  type SignupStep,
} from "./events";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      identify: (uniqueIdOrData: string | Record<string, unknown>, data?: Record<string, unknown>) => void;
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
type QueuedCall = { kind: "track"; event: string; data?: Record<string, unknown> } | { kind: "identify"; uniqueId: string };
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
          if (call.kind === "track") window.umami.track(call.event, call.data);
          else window.umami.identify(call.uniqueId);
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
      queue.push({ kind: "track", event, data });
      flushWhenReady();
    }
  } catch {
    // Analytics must never block user interaction.
  }
}

function safeIdentify(uniqueId: string) {
  if (isDevSuppressed) return;
  try {
    if (window.umami?.identify) {
      window.umami.identify(uniqueId);
    } else {
      queue.push({ kind: "identify", uniqueId });
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

/** Call once, as early as possible after account_created, to stitch pre- and post-account sessions together. */
export function identifyUser(userId: string) {
  safeIdentify(userId);
}
