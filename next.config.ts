import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    buildActivity: false, // This will disable the static optimization indicator
  },
};

export default nextConfig;
