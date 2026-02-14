import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // For Cloudinary images
    formats: ['image/avif', 'image/webp'],
  },
  // Transpile packages from the monorepo
  transpilePackages: ['@artspot/ui', '@artspot/types', '@artspot/utils'],
};

export default nextConfig;
