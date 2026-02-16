'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
} from 'lucide-react';

// Navigation data structure
const primaryNav = [
  {
    label: 'Artworks',
    href: '/artworks',
    dropdown: [
      { label: 'Painting', href: '/artworks?medium=painting' },
      { label: 'Sculpture', href: '/artworks?medium=sculpture' },
      { label: 'Photography', href: '/artworks?medium=photography' },
      { label: 'Works on Paper', href: '/artworks?medium=works-on-paper' },
      { label: 'Art Installation', href: '/artworks?medium=installation' },
      { label: 'Art Objects', href: '/artworks?medium=objects' },
    ],
  },
  {
    label: 'Artists',
    href: '/artists',
    dropdown: [
      { label: 'Browse Artists', href: '/artists' },
      { label: 'Featured Artists', href: '/artists/featured' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    dropdown: [
      { label: 'Curated Selections', href: '/collections' },
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Museum-Quality Works', href: '/collections/museum-quality' },
    ],
  },
  {
    label: 'Discover',
    href: '/discover',
    dropdown: [
      { label: 'Editorial', href: '/discover/editorial' },
      { label: 'Inspiration', href: '/discover/inspiration' },
      { label: 'Exhibitions', href: '/discover/exhibitions' },
    ],
  },
  {
    label: 'Collector Services',
    href: '/collector-services',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90',
        className
      )}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-serif font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
            >
              ArtSpot
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {primaryNav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1 text-body font-sans text-neutral-700 hover:text-neutral-900 transition-colors',
                    activeDropdown === item.label && 'text-neutral-900'
                  )}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        activeDropdown === item.label && 'rotate-180'
                      )}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-soft-lg border border-neutral-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2.5 text-body text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Utility Navigation */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="hidden sm:block p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="hidden sm:flex relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-medium text-white">
                0
              </span>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:block p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="search"
                placeholder="Search artworks, artists, or collections..."
                className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-w-8xl mx-auto px-4 py-6 space-y-6">
            {/* Primary Navigation - Mobile */}
            <nav className="space-y-4">
              {primaryNav.map((item) => (
                <div key={item.label} className="space-y-2">
                  <Link
                    href={item.href}
                    className="block text-heading-4 font-serif text-neutral-900 hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block text-body text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Utility Navigation - Mobile */}
            <div className="flex gap-4 pt-4 border-t border-neutral-200">
              <Link href="/favorites" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </Link>
              <Link href="/account" className="flex-1">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
