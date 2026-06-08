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

// Default navigation (used as fallback when CMS site-settings is unreachable).
export const DEFAULT_NAV: NavItem[] = [
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
      { label: 'Online Projects & Exhibitions', href: '/collections/online-projects-and-exhibitions' },
      { label: 'Featured Art', href: '/collections/featured-art' },
      { label: 'Public Art', href: '/collections/public-art' },
      { label: 'Corporate & Decorative Art', href: '/collections/corporate-decorative-art' },
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
