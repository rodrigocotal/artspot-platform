'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
  Menu,
  X,
  Search,
  Heart,
  User,
  ChevronDown,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import type { NavItem } from './header-nav';

interface HeaderClientProps {
  logoText: string;
  logoImage?: {
    url: string;
    alt?: string;
  } | null;
  navItems: NavItem[];
  className?: string;
}

export function HeaderClient({ logoText, logoImage, navItems, className }: HeaderClientProps) {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Subtle active-state detection for nav links
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

  // Keyboard handler for nav dropdown
  const handleNavKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (!item.dropdown) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveDropdown(activeDropdown === item.label ? null : item.label);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    } else if (e.key === 'ArrowDown' && activeDropdown === item.label) {
      e.preventDefault();
      const menu = (e.currentTarget as HTMLElement).parentElement?.querySelector('[role="menu"]');
      const firstItem = menu?.querySelector('a') as HTMLElement | null;
      firstItem?.focus();
    }
  };

  // Keyboard handler for dropdown menu items
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      (e.currentTarget as HTMLElement).closest('[role="menu"]')?.querySelectorAll('a') ?? []
    ) as HTMLElement[];
    const idx = items.indexOf(e.target as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActiveDropdown(null);
      const trigger = (e.currentTarget as HTMLElement).closest('.relative')?.querySelector('a') as HTMLElement | null;
      trigger?.focus();
    }
  };

  // Keyboard handler for user menu
  const handleUserMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setUserMenuOpen(!userMenuOpen);
    } else if (e.key === 'Escape') {
      setUserMenuOpen(false);
    } else if (e.key === 'ArrowDown' && userMenuOpen) {
      e.preventDefault();
      const menu = (e.currentTarget as HTMLElement).parentElement?.querySelector('[role="menu"]');
      const firstItem = menu?.querySelector('a, button') as HTMLElement | null;
      firstItem?.focus();
    }
  };

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
              className="group flex items-center"
              aria-label={`${logoText} — home`}
            >
              {logoImage?.url ? (
                <Image
                  src={logoImage.url}
                  alt={logoImage.alt || logoText}
                  width={132}
                  height={50}
                  priority
                  className="h-auto w-[126px] object-contain"
                />
              ) : (
                <span className="text-2xl font-serif font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700">
                  {logoText}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-500',
                    isActive(item.href)
                      ? 'text-neutral-900'
                      : 'text-neutral-700 hover:text-neutral-900',
                    activeDropdown === item.label && 'text-neutral-900'
                  )}
                  aria-haspopup={item.dropdown ? 'true' : undefined}
                  aria-expanded={item.dropdown ? activeDropdown === item.label : undefined}
                  onKeyDown={(e) => handleNavKeyDown(e, item)}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        activeDropdown === item.label && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {/* Dropdown Menu — outer div provides invisible hover bridge */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div
                      role="menu"
                      aria-label={`${item.label} submenu`}
                      className="w-56 rounded-md bg-white shadow-sm border border-neutral-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          role="menuitem"
                          className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                          onKeyDown={handleDropdownKeyDown}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
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
              className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="hidden sm:block p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="hidden sm:block relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label={`Cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {session?.user ? (
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-2 p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                  aria-label="Account menu"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  onKeyDown={handleUserMenuKeyDown}
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {session.user.name || 'Account'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full pt-2">
                    <div
                      role="menu"
                      aria-label="Account menu"
                      className="w-48 rounded-md bg-white shadow-sm border border-neutral-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <Link
                        href="/account"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/favorites"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        Favorites
                      </Link>
                      <Link
                        href="/cart"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        Cart{itemCount > 0 ? ` (${itemCount})` : ''}
                      </Link>
                      <Link
                        href="/account/orders"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        Orders
                      </Link>
                      {(session.user.role === 'ADMIN' || session.user.role === 'GALLERY_STAFF') && (
                        <>
                          <hr className="my-1 border-neutral-200" />
                          <Link
                            href="/admin"
                            role="menuitem"
                            className="block px-4 py-2.5 text-sm text-neutral-900 font-medium hover:bg-neutral-50 transition-colors"
                          >
                            Admin Panel
                          </Link>
                        </>
                      )}
                      <hr className="my-1 border-neutral-200" />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        role="menuitem"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Sign in"
              >
                <User className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}

            {/* Private Viewing CTA */}
            <Link
              href="/contact"
              className="hidden lg:inline-flex h-11 items-center bg-neutral-950 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Private Viewing
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (q) {
                  router.push(`/artworks?search=${encodeURIComponent(q)}`);
                  setSearchOpen(false);
                  setSearchQuery('');
                }
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks, artists, or collections..."
                className="w-full h-12 pl-12 pr-4 rounded-md border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:ring-offset-0"
                autoFocus
                aria-label="Search artworks, artists, or collections"
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-w-8xl mx-auto px-4 py-6 space-y-6">
            {/* Primary Navigation - Mobile */}
            <nav className="space-y-4" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <Link
                    href={item.href}
                    className="block text-heading-4 font-serif text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Private Viewing CTA - Mobile */}
            <Link
              href="/contact"
              className="flex h-11 items-center justify-center rounded-md bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Private Viewing
            </Link>

            {/* Utility Navigation - Mobile */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-200">
              <Link href="/favorites" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" aria-hidden="true" />
                  Favorites
                </Button>
              </Link>
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" aria-hidden="true" />
                  Cart{itemCount > 0 ? ` (${itemCount})` : ''}
                </Button>
              </Link>
              {session?.user ? (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  Sign Out
                </Button>
              ) : (
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
