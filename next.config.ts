import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.MOONCLOCK_DIST_DIR ?? ".next",
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
