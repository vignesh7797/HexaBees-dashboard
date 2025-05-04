import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
});

module.exports = withPWA({
  reactStrictMode: true,
})

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    buildActivity: false, // This will disable the static optimization indicator
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname : 'firebasestorage.googleapis.com',
        pathname: "/v0/b/**"
      }
    ],
    
  },
  reactStrictMode: false,
};

export default nextConfig;
