import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the project root to this folder. Without this, a stray lockfile in a
  // parent directory makes Next/Turbopack infer the wrong workspace root and
  // fail to resolve packages like `tailwindcss` from cms/node_modules.
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
  images: {
    domains: [],
  },
  trailingSlash: false,
};

export default nextConfig;
