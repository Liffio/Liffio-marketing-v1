import { isMetaVerified } from "@/lib/meta-verification";

/**
 * IS_META_VERIFIED means Meta ACCESS VERIFICATION passed — i.e. verified
 * Meta TECH PROVIDER status only. It does NOT mean Meta Business Partner:
 * that is a separate program with its own application and directory
 * listing. No string in the verified branches below may claim "Business
 * Partner" (or absolute compliance like "100% Meta-compliant") unless
 * Liffio is separately accepted into that program.
 *
 * 🚩 STATE THE CREDENTIAL ONCE PER PAGE. Every field below used to resolve to
 * the same "Verified Meta Tech Provider" string once the flag went true - the
 * homepage said it 6 times and /signup 9. It went unnoticed because the flag
 * had never been on. The badge slots (heroBadge, ctaBadge, signupBadge) carry
 * the credential; every other slot describes the CONNECTION and is true either
 * way, so it no longer branches on the flag at all. Do not re-add the branch.
 *
 * Evidence (App Dashboard, 2026-09-10): Business verification Verified;
 * Access verification Verified - "Your business was verified as a Tech
 * Provider"; App Review submission approved, with
 * instagram_business_manage_messages approved and _basic, _manage_comments,
 * _manage_insights, _content_publish renewed.
 *
 * [flag] This flag licenses TEXT ONLY. It does NOT license the Meta logo:
 * Meta's corporate brand routes certification badges through Brand Review with
 * a Meta counterpart. The Instagram glyph IS usable on the web without a
 * request, but only as the unmodified official asset, and never combined with
 * the Liffio name or in any lockup that implies partnership.
 */

export const metaCopy = {
  heroBadge: isMetaVerified ? "Verified Meta Tech Provider" : null,
  heroComplianceChip: "Secure Instagram OAuth",
  ctaBadge: isMetaVerified ? "Verified Meta Tech Provider" : null,
  signupBadge: isMetaVerified ? "Verified Meta Tech Provider" : null,
  signupCompliancePill: "Secure OAuth connection",
  signupTrustMeta: isMetaVerified ? "Meta-verified" : null,
  connectStepDetail: isMetaVerified
    ? "One-click OAuth via official Meta APIs. As a Verified Meta Tech Provider, every connection runs through Meta's consent flow and operates within Instagram's terms of service."
    : "One-click OAuth connects your Instagram account securely. Every connection is encrypted and designed to operate within Instagram's terms of service.",
  connectStepNote: "Secure OAuth connection",
  connectSimButton: "Continue with Instagram",
  connectSimLoginTitle: "Instagram secure login",
  connectSimConnected: "Secure connection · Connected",
  ctaCapabilityTitle: isMetaVerified ? "Meta-verified integration" : "Secure Instagram integration",
  ctaCapabilityDescription: isMetaVerified
    ? "Official Instagram Business APIs with secure webhooks, operating within Meta's platform terms."
    : "Instagram APIs with secure webhooks and platform-compliant automation.",
  pricingHeroApis: isMetaVerified
    ? "Every plan runs on official Meta APIs with real-time webhook delivery."
    : "Every plan runs on official Instagram APIs with real-time webhook delivery.",
  pricingCategoryApis: isMetaVerified
    ? "Real-time, webhook-driven Instagram automation built on official Meta APIs."
    : "Real-time, webhook-driven Instagram automation built on official Instagram APIs.",
  pricingFaqSafe: isMetaVerified
    ? "Yes. Liffio is a Verified Meta Tech Provider and uses only official Instagram APIs. All webhooks are HMAC-verified, and the integration operates within Meta's platform terms."
    : "Yes. Liffio uses official Instagram APIs with HMAC-verified webhooks, and is designed to operate within Instagram's terms of service.",
  helpConnectAnswer: isMetaVerified
    ? "Go to your Liffio dashboard and click 'Connect Instagram'. You'll be redirected to the official Meta login page. Authorize the app and your account will be connected in seconds."
    : "Go to your Liffio dashboard and click 'Connect Instagram'. You'll be redirected to sign in with Instagram. Authorize the app and your account will be connected in seconds.",
  helpSafeAnswer: isMetaVerified
    ? "Yes! Liffio is a Verified Meta Tech Provider and uses only official Instagram APIs, operating within Instagram's terms of service."
    : "Yes! Liffio uses official Instagram APIs and operates within Instagram's terms of service.",
  navbarMobileLead: isMetaVerified ? "Meta Tech Provider" : "Early access",
  navbarDesktopLead: isMetaVerified ? "Verified Meta Tech Provider" : "Early access launch",
} as const;

export function getSignupTrustRow(): string[] {
  return ["No credit card required", ...(metaCopy.signupTrustMeta ? [metaCopy.signupTrustMeta] : []), "Cancel anytime"];
}
