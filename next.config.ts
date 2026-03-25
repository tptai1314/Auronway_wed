import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["nads.1cdn.vn", "via.placeholder.com", "placehold.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
