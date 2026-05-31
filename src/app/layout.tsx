import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Liffio — Automate Instagram DMs & Grow Your Engagement Fast",
  description:
    "Automate Instagram DMs, auto-reply to comments, stories & messages. The smartest way to grow your Instagram. Get started for free.",
  robots: "index, follow",
  openGraph: {
    title: "Liffio — Automate Instagram DMs & Grow Your Engagement Fast",
    description:
      "Automate Instagram DMs, auto-reply to comments, stories & messages. The smartest way to grow your Instagram. Get started for free.",
    url: "https://liffio.com",
    siteName: "Liffio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liffio — Automate Instagram DMs & Grow Your Engagement Fast",
    description:
      "Automate Instagram DMs, auto-reply to comments, stories & messages. The smartest way to grow your Instagram. Get started for free.",
  },
  icons: {
    icon: "/logo/light.png",
    apple: "/logo/light.png",
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
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col bg-white overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Liffio",
              url: "https://liffio.com",
              logo: "https://liffio.com/logo/colored.png",
              description:
                "Automate your Instagram DMs. Auto-reply to comments, stories, and messages with Liffio.",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
