'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

type Status = 'idle' | 'loading' | 'done' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await apiClient.submitContactMessage({
        name: 'Newsletter signup',
        email: trimmed,
        subject: 'Newsletter signup',
        message: `Newsletter subscription request from ${trimmed}`,
      });
      if (res.success) {
        setStatus('done');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <p className="text-sm text-neutral-400" role="status">
        Thanks — you&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={handleSubmit}
    >
      <div className="min-w-0 flex-1">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          required
          aria-label="Email address"
          className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-primary-500 focus:outline-none"
        />
        {status === 'error' && (
          <p className="mt-2 text-xs text-red-400" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? (
          'Joining…'
        ) : (
          <>
            Join
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
