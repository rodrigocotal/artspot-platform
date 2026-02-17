import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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

export default nextConfig;
