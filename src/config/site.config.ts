const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://liffio.com";

/** Canonical marketing site origin (no trailing slash). */
export const SITE_URL = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;

export const siteConfig = {
  urls: {
    site: SITE_URL,
    appBase: "https://app.liffio.com",
    appSignup: "https://app.liffio.com/register",
    appLogin: "https://app.liffio.com/login",
    preregister: "/signup",
  },

  brand: {
    name: "Liffio",
    tagline: "The best auto DM tool for Instagram",
    description:
      "Liffio is an Instagram auto DM tool for creators and brands. Auto DMs from comments, stories, and messages — with auto comment reply, keyword triggers, and DM automation running 24/7.",
    logoLight: "/logo/light.png",
    logoDark: "/logo/colored.png",
    defaultLogo: "/logo/light.png",
  },

  launch: {
    date: new Date(
      process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-06-01T00:00:00",
    ),
    badgeText: "Launching June 1, 2026",
  },

  offers: {
    tier1: {
      maxSpots: 15,
      discount: 50,
      headline: "50% off your first purchase",
      description: "Exclusive to the first 15 pre-registrations only",
    },
    tier2: {
      maxSpots: 30,
      discount: 10,
      headline: "10% off your first purchase",
      description: "Exclusive early access discount",
    },
    tier3: {
      discount: 0,
      headline: "Early access",
      description: "Be the first to know when we launch",
    },
  },

  waitlist: {
    totalSpots: 15,
    initialClaimed: 3,
    formTitle: "Get started free",
    formHint: "Join thousands growing on autopilot",
    ctaText: "Get Started Free",
    successMessage:
      "You're in! We'll email you with your early access details.",
  },

  trustBadges: [
    { icon: "star", text: "No credit card required" },
    { icon: "lock", text: "No spam, ever" },
    { icon: "none", text: "Cancel anytime" },
  ] as const,

  meta: {
    title: "Liffio — Auto DM Tool for Instagram",
    description:
      "Instagram auto DM tool with auto comment reply, comment-to-DM automation, and keyword triggers.",
    ogTitle: "Liffio — Instagram Auto DM & Comment Automation",
    ogDescription:
      "Automate Instagram DMs from comments, stories, and messages — auto DM tool for creators and brands.",
    /** 1200×630 social share card */
    ogImagePath: "/og/homepage.png",
    ogImageAlt: "Liffio — Turn Instagram Comments Into Automated DMs",
  },

  contact: {
    email: "support@liffio.com",
    /** E.164 digits only (no +). Set NEXT_PUBLIC_WHATSAPP_NUMBER in production. */
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  },

  social: {
    twitter: "https://twitter.com/liffio",
    instagram: "https://instagram.com/liffio",
    linkedin: "https://linkedin.com/company/liffio",
  },

  creatorsProgram: {
    spotsCap: 50,
    /** Shown when live API stats are unavailable */
    spotsRemainingFallback: 47,
  },
} as const;

export function getWhatsAppUrl(): string | null {
  const digits = siteConfig.contact.whatsappNumber.replace(/\D/g, "");
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
}

export type SiteConfig = typeof siteConfig;
