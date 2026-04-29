import type { NextConfig } from "next";

// L10 NOTE: serverActions is stable in Next.js 16 but TypeScript types
// still require it under experimental. Will move to top-level when types catch up.
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*.vercel.app", "localhost:3000"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
