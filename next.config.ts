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
        hostname: "*.bbc.co.uk",
      },
      {
        protocol: "https",
        hostname: "ichef.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "c.files.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "news.files.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "mfiles.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.bbc.co.uk",
      },
      {
        protocol: "https",
        hostname: "bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "*.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "*.bbc.com",
      },
    ],
  },
};

export default nextConfig;
