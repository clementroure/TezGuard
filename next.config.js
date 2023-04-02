const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});
 
const nextConfig = withPWA({
  images: { domains: ['images.unsplash.com','onlyfeet.nyc3.cdn.digitaloceanspaces.com'], formats: ['image/avif', 'image/webp'] },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
});
 
module.exports = nextConfig;