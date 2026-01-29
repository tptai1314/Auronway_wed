import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["nads.1cdn.vn"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
