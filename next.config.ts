import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "favicon.im",
      },
      {
        protocol: "https",
        hostname: "www.aljazeera.com",
      },
      {
        protocol: "https",
        hostname: "c.files.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "*.twimg.com",
      },
    ],
  },
};

export default nextConfig;
