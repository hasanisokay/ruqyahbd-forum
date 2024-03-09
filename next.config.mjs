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
    reactStrictMode: false,
    experimental: { optimizeCss: true, },
    productionBrowserSourceMaps: true,
    basePath: "",
    async headers() {
      return [
        {
          source: "/",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "https://forumsocket.ruqyahbd.org",
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