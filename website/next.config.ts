import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  // Ensure trailing slashes behave consistently on Vercel
  trailingSlash: false,
};

export default nextConfig;
