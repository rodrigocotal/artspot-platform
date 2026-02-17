import Link from 'next/link';
import { Container } from './container';

const navigation = {
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
    { label: 'Emerging Artists', href: '/artists/emerging' },
    { label: 'Collections', href: '/collections' },
  ],
  services: [
    { label: 'Art Advisory', href: '/services/advisory' },
    { label: 'Authentication', href: '/services/authentication' },
    { label: 'Insurance', href: '/services/insurance' },
    { label: 'White-Glove Shipping', href: '/services/shipping' },
    { label: 'Consignment', href: '/services/consignment' },
  ],
  company: [
    { label: 'About ArtSpot', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Press', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main footer content */}
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-light tracking-widest text-white">
                ARTSPOT
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 max-w-xs">
              Elevating the experience of collecting art online. A curated marketplace
              for museum-quality artworks by exceptional artists.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                Stay Informed
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 min-w-0 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 lg:col-span-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                Explore
              </h3>
              <ul className="space-y-2.5">
                {navigation.explore.map((item) => (
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

            <div className="space-y-4">
              <h3 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                Artists
              </h3>
              <ul className="space-y-2.5">
                {navigation.artists.map((item) => (
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

            <div className="space-y-4">
              <h3 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                Services
              </h3>
              <ul className="space-y-2.5">
                {navigation.services.map((item) => (
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

            <div className="space-y-4">
              <h3 className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                Company
              </h3>
              <ul className="space-y-2.5">
                {navigation.company.map((item) => (
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
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} ArtSpot. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
