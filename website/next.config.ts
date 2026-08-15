import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    localPatterns: [{ pathname: "/images/**" }],
  },
  // Ensure trailing slashes behave consistently on Vercel
  trailingSlash: false,
};

export default nextConfig;
