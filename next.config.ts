import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/join#faq",
        permanent: true,
      },
      {
        source: "/timeline",
        destination: "/join#timeline",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
