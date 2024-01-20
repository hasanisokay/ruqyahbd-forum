/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "i.ibb.co",
        },
      ],
      formats: ["image/avif", "image/webp"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
  
    basePath: "",
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "http://localhost:3001 http://localhost:3002",
            },
          ],
        },
        {
          source: "/",
          headers: [
            {
              key: "X-DNS-Prefetch-Control",
              value: "on",
            },
          ],
        },
      ];
    },
  };

export default nextConfig;


