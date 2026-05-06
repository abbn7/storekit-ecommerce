import type { NextConfig } from "next";

// Restrict server action origins to specific production domain + localhost
// Previously "*.vercel.app" allowed ANY Vercel subdomain — security risk
const productionDomain = process.env.VERCEL_URL ? [process.env.VERCEL_URL] : [];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [...productionDomain, "localhost:3000"],
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
