import { isMetaVerified } from "@/lib/meta-verification";

export const metaCopy = {
  heroBadge: isMetaVerified ? "Official Meta Tech Provider" : null,
  heroComplianceChip: isMetaVerified ? "100% Meta-compliant" : "Secure Instagram OAuth",
  ctaBadge: isMetaVerified ? "Official Meta Business Partner" : null,
  signupBadge: isMetaVerified ? "Official Meta Business Partner" : null,
  signupCompliancePill: isMetaVerified ? "Meta-verified & fully compliant" : "Secure & fully compliant",
  signupTrustMeta: isMetaVerified ? "Meta-verified" : null,
  connectStepDetail: isMetaVerified
    ? "One-click OAuth via official Meta APIs. As an Official Meta Tech Provider, every connected account stays 100% secure and fully compliant with Instagram's terms of service."
    : "One-click OAuth connects your Instagram account securely. Every connection is encrypted and stays fully compliant with Instagram's terms of service.",
  connectStepNote: isMetaVerified ? "Official Meta Tech Provider" : "Secure OAuth connection",
  connectSimButton: isMetaVerified ? "Connect with Meta" : "Connect Instagram",
  connectSimLoginTitle: isMetaVerified ? "Meta Secure Login" : "Secure login",
  connectSimConnected: isMetaVerified ? "100% Meta-compliant · Connected" : "Secure connection · Connected",
  ctaCapabilityTitle: isMetaVerified ? "Meta-verified integration" : "Secure Instagram integration",
  ctaCapabilityDescription: isMetaVerified
    ? "Official Instagram Business APIs with secure webhooks and full platform compliance."
    : "Instagram APIs with secure webhooks and platform-compliant automation.",
  pricingHeroApis: isMetaVerified
    ? "Every plan runs on official Meta APIs with real-time webhook delivery."
    : "Every plan runs on official Instagram APIs with real-time webhook delivery.",
  pricingCategoryApis: isMetaVerified
    ? "Real-time, webhook-driven Instagram automation built on official Meta APIs."
    : "Real-time, webhook-driven Instagram automation built on official Instagram APIs.",
  pricingFaqSafe: isMetaVerified
    ? "Absolutely. Liffio is an official Meta Business Partner and uses only verified Instagram APIs. All webhooks are HMAC-verified and your account stays fully compliant with Meta's terms."
    : "Yes. Liffio uses verified Instagram APIs with HMAC-verified webhooks. Your account stays fully compliant with Instagram's terms of service.",
  helpConnectAnswer: isMetaVerified
    ? "Go to your Liffio dashboard and click 'Connect Instagram'. You'll be redirected to the official Meta login page. Authorize the app and your account will be connected in seconds."
    : "Go to your Liffio dashboard and click 'Connect Instagram'. You'll be redirected to sign in with Instagram. Authorize the app and your account will be connected in seconds.",
  helpSafeAnswer: isMetaVerified
    ? "Yes! Liffio is a verified Meta Business Partner and uses only official Instagram APIs. Your account is fully compliant with Instagram's terms of service."
    : "Yes! Liffio uses official Instagram APIs. Your account is fully compliant with Instagram's terms of service.",
  navbarMobileLead: isMetaVerified ? "Meta Tech Provider" : "Early access",
  navbarDesktopLead: isMetaVerified ? "Official Meta Tech Provider" : "Early access launch",
} as const;

export function getSignupTrustRow(): string[] {
  return ["No credit card required", ...(metaCopy.signupTrustMeta ? [metaCopy.signupTrustMeta] : []), "Cancel anytime"];
}
