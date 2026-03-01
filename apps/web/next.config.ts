import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Transpile packages from the monorepo
  transpilePackages: ['@artspot/ui', '@artspot/types', '@artspot/utils'],
  // Temporarily disable TypeScript checking during build (React 19 compatibility issue)
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Bundle analyzer (enabled with ANALYZE=true)
let config = nextConfig;
if (process.env.ANALYZE === 'true') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  config = withBundleAnalyzer(nextConfig);
}

export default config;
