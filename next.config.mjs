/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/components/:category/:slug.md",
        destination: "/r/:slug.md?category=:category",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/components/:category/:slug/:internal(.+)",
        destination: "/components/:category/:slug",
        permanent: true,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/components/*": [
      "./components/motion/**/*",
      "./components/previews/**/*",
    ],
    "/r/*": [
      "./components/motion/**/*",
      "./components/previews/**/*",
      "./lib/**/*",
    ],
    "/*": [
      "./components/motion/**/*",
      "./lib/**/*",
    ],
  },
};

export default nextConfig;
