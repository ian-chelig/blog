import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend docker images
  output: "standalone",
  // Allow images from localhost
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
