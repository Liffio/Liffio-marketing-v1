export const siteConfig = {
  urls: {
    appBase: "https://app.liffio.com",
    appSignup: "https://app.liffio.com/register",
    appLogin: "https://app.liffio.com/login",
    preregister: "/signup",
  },

  brand: {
    name: "Liffio",
    tagline: "Instagram DMs, fully automated",
    description:
      "Turn every comment into a conversion. Liffio sends intelligent, human-like DMs when someone engages — with a custom 10–60s delay so replies feel natural.",
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
    title: "Liffio — Instagram DM Automation",
    description: "Automate Instagram DMs and capture more leads.",
    ogTitle: "Liffio — Instagram DM Automation",
    ogDescription: "Turn comments into conversations automatically.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
