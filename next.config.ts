import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@21st-dev/magic"],
  // Optimize for production
  experimental: {
    optimizePackageImports: ["@21st-dev/magic"]
  }
};

export default nextConfig;
