/** @type {import('next').NextConfig} */
const disableImageOptimization = process.env.DISABLE_IMAGE_OPTIMIZATION === "true";

const nextConfig = {
  /** Windows dev: filesystem webpack cache can throw ENOENT on pack renames (AV/sync). Memory cache is slower but stable. */
  webpack: (config, { dev }) => {
    if (dev && process.platform === "win32") {
      config.cache = { type: "memory" };
    }
    return config;
  },
  images: {
    // Without sharp, Next falls back to WASM optimization and remote images can fail sporadically.
    unoptimized: disableImageOptimization,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
