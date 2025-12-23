/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly disabling features that might cause instability
  experimental: {
    // turbo: false, // removed as it is not needed in 15.x stable if not invoked
  },
};

export default nextConfig;