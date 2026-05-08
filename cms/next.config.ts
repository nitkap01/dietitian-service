import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    domains: [],
  },
  trailingSlash: false,
};

export default nextConfig;
