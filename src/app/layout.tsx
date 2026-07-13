import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { rootSeo } from "@/config/seo.config";
import { SITE_URL } from "@/config/site.config";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/seo/json-ld";
import { ReferralCapture } from "@/components/ReferralCapture";
import { DelegatedClicks } from "@/lib/analytics/DelegatedClicks";
import { ScrollDepthTracker } from "@/lib/analytics/ScrollDepthTracker";
import { IdentifyOnLoad } from "@/lib/analytics/IdentifyOnLoad";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

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
        <ReferralCapture />
        <DelegatedClicks />
        <ScrollDepthTracker />
        <IdentifyOnLoad />
        {children}
        <GoogleAnalytics gaId="G-TPNX0042QC" />
        {/* Plain <script> (not next/script) — Umami reads document.currentScript for
            its config, which is null when Next.js's Script component injects the tag
            dynamically after hydration. A parser-inserted tag preserves currentScript. */}
        <script
          defer
          src="https://umami-analytics-rkhr.srv1772252.hstgr.cloud/script.js"
          data-website-id="a165b0eb-ac11-422f-85cf-68b32d97ae95"
        />
        <script
          defer
          src="https://umami-analytics-rkhr.srv1772252.hstgr.cloud/recorder.js"
          data-website-id="a165b0eb-ac11-422f-85cf-68b32d97ae95"
        />
      </body>
    </html>
  );
}
