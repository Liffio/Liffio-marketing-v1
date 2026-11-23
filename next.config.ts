import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Enforce non-www canonical: any www.liffio.com/* → liffio.com/*
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.liffio.com" }],
        destination: "https://liffio.com/:path*",
        permanent: true,
      },
      // /signup was the pre-launch waitlist page. Permanent redirect to
      // /register, with the query string (ref, plan) carried over.
      {
        source: "/signup",
        destination: "/register",
        permanent: true,
      },
      /*
        Short legal paths. The real pages are at the long names, but /terms
        and /privacy are what other sites, app stores and payment providers
        link to by convention, and all four were returning 404 in Search
        Console's index-coverage report on 2026-11-23. Nothing on this site
        links to them; the inbound links are external and historical, which is
        exactly why a redirect beats leaving them broken.
      */
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/tos", destination: "/terms-of-service", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/cookies", destination: "/cookie-policy", permanent: true },
      { source: "/refund", destination: "/refund-policy", permanent: true },
    ];
  },
  /*
    The icons moved to versioned paths under public/icons/ on 2026-11-23 so that
    Google would see new URLs rather than changed bytes (see src/app/layout.tsx).
    Moving them means nothing serves /favicon.ico any more, and browsers, feed
    readers and crawlers still request that path blindly without reading the
    <head>. These rewrites keep the conventional paths resolving, serving the
    same crimson files without a redirect hop.

    Bump these alongside the filenames when the icons are revved again.
  */
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icons/favicon-v2.ico" },
      { source: "/icon.png", destination: "/icons/icon-v2.png" },
      { source: "/apple-icon.png", destination: "/icons/apple-icon-v2.png" },
    ];
  },
  env: {
    IS_META_VERIFIED: process.env.IS_META_VERIFIED ?? process.env.isMetaVerified ?? "false",
    isMetaVerified: process.env.IS_META_VERIFIED ?? process.env.isMetaVerified ?? "false",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.senddm.ai" },
      { protocol: "https", hostname: "senddm.ai" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
