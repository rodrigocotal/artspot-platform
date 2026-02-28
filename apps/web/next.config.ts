import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Expose server-side env vars at build time for Amplify WEB_COMPUTE
  // (Amplify doesn't pass non-NEXT_PUBLIC_ vars to the SSR Lambda runtime)
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  },
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
