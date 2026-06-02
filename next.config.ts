import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
