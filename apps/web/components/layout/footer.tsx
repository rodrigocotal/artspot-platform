import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';
import { Container } from './container';
import { NewsletterForm } from './newsletter-form';
import { fetchCmsPage } from '@/lib/page-metadata';
import { ARTALDO_SITE_SETTINGS } from '@/lib/artaldo-reference';

const DEFAULT_NAVIGATION = {
  explore: [
    { label: 'All Artworks', href: '/artworks' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Sculpture', href: '/artworks?medium=sculpture' },
    { label: 'Paintings', href: '/artworks?medium=painting' },
    { label: 'Photography', href: '/artworks?medium=photography' },
  ],
  artists: [
    { label: 'Browse Artists', href: '/artists' },
    { label: 'Featured Artists', href: '/artists/featured' },
    { label: 'Latin American Art', href: '/collections' },
  ],
  services: [
    { label: 'Advisory', href: '/collector-services' },
    { label: 'Private Viewing', href: '/contact' },
    { label: 'Design Professionals', href: '/contact' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

const DEFAULTS = {
  brandName: 'ArtAldo',
  brandDescription: ARTALDO_SITE_SETTINGS.footerBrandDescription,
  logoImage: ARTALDO_SITE_SETTINGS.logoImage,
  newsletterLabel: 'Join the Collector List',
  copyrightName: 'ArtAldo',
  footerNavigation: DEFAULT_NAVIGATION,
};

// Server component: CMS footer content is fetched server-side (SSR + ISR with
// on-publish revalidation via the 'cms' tag), so the footer renders in the
// initial HTML instead of flashing defaults on the client.
export async function Footer() {
  const cms = (await fetchCmsPage('footer')) as Record<string, any> | null;
  const content = { ...DEFAULTS, ...(cms ?? {}) };
  const nav: Record<string, { label: string; href: string }[]> =
    content.footerNavigation || DEFAULT_NAVIGATION;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      {/* Newsletter band */}
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              {content.newsletterLabel}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
              Receive early access to new arrivals, private viewing invitations, and Aldo&apos;s
              curated selections.
            </p>
          </div>
          <div className="lg:pl-8">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      {/* Main footer content */}
      <div className="border-t border-white/10">
        <Container className="py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-flex items-center gap-2.5">
                {content.logoImage?.url ? (
                  <Image
                    src={content.logoImage.url}
                    alt={content.logoImage.alt || content.brandName}
                    width={132}
                    height={50}
                    className="h-auto w-[126px] brightness-0 invert"
                  />
                ) : (
                  <span className="font-serif text-2xl text-white">{content.brandName}</span>
                )}
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
                {content.brandDescription}
              </p>

              {/* Social */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${content.brandName} on Instagram`}
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${content.brandName} on LinkedIn`}
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>

              {/* Contact */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  Contact
                </h3>
                <div className="space-y-1.5 text-sm text-neutral-400">
                  <a
                    href="mailto:info@artaldo.com"
                    className="block transition-colors hover:text-white"
                  >
                    info@artaldo.com
                  </a>
                  <p>Available by appointment</p>
                  <p>Response within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Navigation columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 lg:col-span-3 gap-8">
              {Object.entries(nav).map(([key, items]) => (
                <div key={key} className="space-y-4">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h3>
                  <ul className="space-y-3">
                    {(items as any[]).map((item: any) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm text-neutral-400 transition-colors hover:text-white"
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
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              &copy; {year} {content.copyrightName}. All rights reserved.
            </p>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            >
              <Link
                href="/privacy"
                className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping"
                className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
              >
                Shipping Policy
              </Link>
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  );
}
