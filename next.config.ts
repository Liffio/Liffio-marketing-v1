import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.senddm.ai" },
      { protocol: "https", hostname: "senddm.ai" },
    ],
  },
};

export default nextConfig;
