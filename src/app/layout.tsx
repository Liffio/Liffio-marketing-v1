import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { rootSeo } from "@/config/seo.config";
import { SITE_URL } from "@/config/site.config";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/seo/json-ld";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { ReferralLinkCarrier } from "@/components/consent/ReferralLinkCarrier";
import { DelegatedClicks } from "@/lib/analytics/DelegatedClicks";
import { ScrollDepthTracker } from "@/lib/analytics/ScrollDepthTracker";
import { IdentifyOnLoad } from "@/lib/analytics/IdentifyOnLoad";
import { UMAMI_BEFORE_SEND, umamiPrivacyScript } from "@/lib/analytics/umamiPrivacy";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const UMAMI_WEBSITE_ID = "a165b0eb-ac11-422f-85cf-68b32d97ae95";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// CSS var kept as --font-outfit (not renamed) since ~90 call sites across the
// marketing pages reference it directly via inline style={{ fontFamily: "var(--font-outfit,...)" }}.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  ...rootSeo,
  metadataBase: new URL(SITE_URL),
  robots: "index, follow",
  /*
    Icons are declared EXPLICITLY here and served from versioned paths under
    public/icons/, rather than through the app-directory file conventions.

    Why, as of 2026-11-23: Google caches a site's favicon PER URL, and it had
    been serving the old purple mark in search results for months. The files at
    /favicon.ico and /icon.png had been crimson since 2026-09-15 and
    /apple-icon.png since 2026-11-13, yet Google's cached icon was still
    76.7% purple pixels when checked on 2026-11-23. Changing a file's CONTENTS
    at an unchanged URL is the weakest possible refresh signal; changing the URL
    is the one lever with a track record.

    ⚠️ ALL THREE entries below are required. A previous hand-written `icons`
    key replaced the file conventions wholesale and silently dropped the
    apple-touch-icon link, which is the icon Google had most likely latched
    onto. If you add or change an entry, re-check the emitted <head> for all
    three links before shipping.

    To rev these again later: bump the filename (v3, v4...), update the three
    paths here AND the /favicon.ico rewrite in next.config.ts, then request
    indexing on / in Search Console. Google refetches on its own schedule.
  */
  icons: {
    icon: [
      { url: "/icons/favicon-v2.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icons/icon-v2.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon-v2.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icons/favicon-v2.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-white overflow-x-hidden text-base [text-size-adjust:100%]`}
      >
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {/*
          Replaces <ReferralCapture />. It still captures the ?ref= code, but it
          decides FIRST whether this visitor has to be asked before anything is
          stored, and it renders the banner that asks. Cookie Policy 2.2.
        */}
        <CookieConsent />
        {/*
          Puts the ?ref= code on the signup link the visitor clicks. Consent gates
          STORAGE, and every CTA here is a plain <a> that reloads the page, so
          without this a rejected or unanswered banner means the affiliate loses a
          signup that happened a minute later in the same tab.
        */}
        <ReferralLinkCarrier />
        <DelegatedClicks />
        <ScrollDepthTracker />
        <IdentifyOnLoad />
        {children}
        <GoogleAnalytics gaId="G-TPNX0042QC" />
        {/* Plain <script> (not next/script): Umami reads document.currentScript for
            its config, which is null when Next.js's Script component injects the tag
            dynamically after hydration. A parser-inserted tag preserves currentScript. */}
        {/* Before script.js: defines the payload scrubber and loads recorder.js only off /auth and
            /oauth, so a login token in the URL never reaches Umami. The recorder is appended by
            this inline script while the page is still parsing, not by Next.js after hydration, and
            currentScript is set for it (checked in headless Chrome). See `lib/analytics/umamiPrivacy.ts`. */}
        <script dangerouslySetInnerHTML={{ __html: umamiPrivacyScript(UMAMI_WEBSITE_ID) }} />
        <script
          defer
          src="https://umami-analytics-rkhr.srv1772252.hstgr.cloud/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          data-before-send={UMAMI_BEFORE_SEND}
        />
      </body>
    </html>
  );
}
