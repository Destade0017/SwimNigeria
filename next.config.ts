import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.9.159", "localhost", "127.0.0.1"],
  images: {
    // Photography is hot-linked from Unsplash's official CDN (Unsplash License).
    // All URLs are centralised in src/lib/images.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
