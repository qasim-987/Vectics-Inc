/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The webfont <link> is loaded by the browser; don't try to inline Google
  // Fonts CSS at build time (keeps offline/CI builds deterministic).
  optimizeFonts: false,
  images: {
    // Local photography is served through next/image in modern formats.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1672, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
