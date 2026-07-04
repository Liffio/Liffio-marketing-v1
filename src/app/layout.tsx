import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { rootSeo } from "@/config/seo.config";
import { SITE_URL } from "@/config/site.config";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/seo/json-ld";
import { ReferralCapture } from "@/components/ReferralCapture";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-white overflow-x-hidden text-base [text-size-adjust:100%]`}
      >
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ReferralCapture />
        {children}
        <GoogleAnalytics gaId="G-TPNX0042QC" />
      </body>
    </html>
  );
}
