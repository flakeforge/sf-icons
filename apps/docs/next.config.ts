import type { NextConfig } from "next";

const config: NextConfig = {
  // Add any custom Next.js configuration options here
  experimental: {
    optimizePackageImports: ["@flakeforge/sf-icons"],
  },
};

export default config;
