/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Avoid bundling certain Node.js modules in client-side code
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      path: false,
      os: false,
    };
    return config;
  },
  // Add any other Next.js config options here
};

module.exports = nextConfig;
