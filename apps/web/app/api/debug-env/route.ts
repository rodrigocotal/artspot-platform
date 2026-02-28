import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAuthSecret: !!process.env.AUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
    hasAuthUrl: !!process.env.AUTH_URL,
    authUrl: process.env.AUTH_URL ?? 'NOT SET',
    hasAuthTrustHost: !!process.env.AUTH_TRUST_HOST,
    authTrustHost: process.env.AUTH_TRUST_HOST ?? 'NOT SET',
    hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  });
}
