import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Hide the Next.js development "N" indicator
  devIndicators: false,

  // Turbopack project root
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;