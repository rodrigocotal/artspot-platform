'use client';

import { useState, FormEvent } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 min-w-0 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
