'use client';

import { useState, FormEvent } from 'react';
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
      <p className="text-sm text-neutral-300" role="status">
        Thanks — you&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <div className="flex-1 min-w-0">
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
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        {status === 'error' && (
          <p className="mt-1 text-xs text-red-400" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors whitespace-nowrap self-start"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  );
}
