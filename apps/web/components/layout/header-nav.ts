// Shared navigation types and defaults for the header. Plain module (no
// 'use client') so it can be imported by both the server Header wrapper and
// the client HeaderClient without creating a circular dependency.

export interface NavDropdownItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

export const DEFAULT_LOGO_TEXT = 'ArtAldo';
export const DEFAULT_LOGO_IMAGE = {
  url: '/artaldo/artaldo-logo.png',
  alt: 'ArtAldo',
};

// Default navigation (used as fallback when CMS site-settings is unreachable).
export const DEFAULT_NAV: NavItem[] = [
  {
    label: 'Artworks',
    href: '/artworks',
  },
  {
    label: 'Artists',
    href: '/artists',
  },
  {
    label: 'Collections',
    href: '/collections',
  },
  {
    label: 'Advisory',
    href: '/collector-services',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];
