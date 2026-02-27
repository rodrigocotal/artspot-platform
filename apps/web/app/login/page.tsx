'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-neutral-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-neutral-600">
          Sign in to your ArtSpot account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-error-50 border border-error-200 p-4 text-sm text-error-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" required>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <React.Suspense fallback={
        <div className="w-full max-w-md text-center text-neutral-500">Loading...</div>
      }>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
