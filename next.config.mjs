import cronJob from "./src/cronJob.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    cronJob();
    return config;
  },
};

export default nextConfig;
