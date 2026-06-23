/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Solana programs as ESM-compatible
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
