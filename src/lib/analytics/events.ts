// ── Umami event names + allowed property values ─────────────────────────────
// Single source of truth. Never call umami.track() with a hardcoded string
// elsewhere — import from here so a typo becomes a type error, not a
// silent data-quality bug.

export const EVENTS = {
  SECTION_VIEW: "section_view",
  SCROLL_DEPTH: "scroll_depth",
  CTA_CLICK: "cta_click",
  NAVIGATION_CLICK: "navigation_click",
  FAQ_OPEN: "faq_open",
  FORM_START: "form_start",
  FORM_ERROR: "form_error",
  FORM_SUBMIT: "form_submit",
  FORM_ABANDON: "form_abandon",
  SIGNUP_STEP: "signup_step",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// Sections instrumented with section_view. "benefits" is intentionally
// excluded — no homepage section currently maps to it.
export const SECTIONS = [
  "hero",
  "features",
  "how_it_works",
  "pricing",
  "testimonials",
  "faq",
] as const;
export type Section = (typeof SECTIONS)[number];

export const SCROLL_DEPTHS = [50, 100] as const;
export type ScrollDepth = (typeof SCROLL_DEPTHS)[number];

// CTA button values. footer_cta and creator_program-as-signup are excluded/
// scoped per the confirmed implementation plan — see analytics.ts callers.
export const CTA_BUTTONS = [
  "hero_start_free",
  "navbar_login",
  "navbar_signup",
  "pricing_start_free",
  "pricing_upgrade",
  "creator_program",
  "contact_sales",
] as const;
export type CtaButton = (typeof CTA_BUTTONS)[number];

// navigation_click is scoped to features/pricing only — faq has no navbar
// link, and login/signup are covered by cta_click alone to avoid double
// counting the same click (confirmed decision).
export const NAV_ITEMS = ["features", "pricing"] as const;
export type NavItem = (typeof NAV_ITEMS)[number];

export const FORMS = ["signup"] as const;
export type FormName = (typeof FORMS)[number];

export const SIGNUP_STEPS = [
  "landing",
  "cta_clicked",
  "signup_started",
  "account_created",
  "workspace_created",
  "instagram_connected",
  "subscription_purchased",
] as const;
export type SignupStep = (typeof SIGNUP_STEPS)[number];
