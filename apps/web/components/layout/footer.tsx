'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from './container';
import { NewsletterForm } from './newsletter-form';
import { apiClient } from '@/lib/api-client';

const DEFAULT_NAVIGATION = {
  explore: [
    { label: 'Paintings', href: '/artworks?medium=painting' },
    { label: 'Sculpture', href: '/artworks?medium=sculpture' },
    { label: 'Photography', href: '/artworks?medium=photography' },
    { label: 'Works on Paper', href: '/artworks?medium=works-on-paper' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
  ],
  artists: [
    { label: 'Browse All Artists', href: '/artists' },
    { label: 'Featured Artists', href: '/artists/featured' },
    { label: 'Collections', href: '/collections' },
  ],
  services: [
    { label: 'Collector Services', href: '/collector-services' },
    { label: 'Contact Us', href: '/contact' },
  ],
  company: [
    { label: 'Discover', href: '/discover' },
    { label: 'Editorial', href: '/discover/editorial' },
  ],
};

const DEFAULTS = {
  brandName: 'ArtAldo',
  brandDescription: 'Elevating the experience of collecting art online. A curated marketplace for museum-quality artworks by exceptional artists.',
  newsletterLabel: 'Stay Informed',
  copyrightName: 'ArtAldo',
  footerNavigation: DEFAULT_NAVIGATION,
};

export function Footer() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    apiClient.getPageContent('footer')
      .then((res) => setContent({ ...DEFAULTS, ...res.data.content }))
      .catch(() => {});
  }, []);

  const nav = content.footerNavigation || DEFAULT_NAVIGATION;

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main footer content */}
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-light tracking-widest text-white">
                {content.brandName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 max-w-xs">
              {content.brandDescription}
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                {content.newsletterLabel}
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 lg:col-span-3 gap-8">
            {Object.entries(nav).map(([key, items]) => (
              <div key={key} className="space-y-4">
                <h3 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h3>
                <ul className="space-y-2.5">
                  {(items as any[]).map((item: any) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} {content.copyrightName}. All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
