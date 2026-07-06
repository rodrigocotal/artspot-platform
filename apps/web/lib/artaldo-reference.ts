import type { NavItem } from '@/components/layout/header-nav';

export const ARTALDO_HOME_IMAGES = {
  logo: '/artaldo/artaldo-logo.png',
  hero: '/artaldo/art-basel-booth.jpeg',
  advisory: '/artaldo/private-gallery-viewing.webp',
  design: '/artaldo/enrique-machado-clouds.webp',
  about: '/artaldo/aldo-castillo-gallery.webp',
};

export interface ArtAldoReferenceWork {
  artistName: string;
  title: string;
  year: string;
  status: 'AVAILABLE';
  medium: string;
  dimensions: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
}

export const ARTALDO_WORKS: ArtAldoReferenceWork[] = [
  {
    artistName: 'Julio Emilio Neira Milian',
    title: 'The Great Catch (La Gran Cojida)',
    year: '2015',
    status: 'AVAILABLE',
    medium: 'Oil on Canvas and Mixed Media',
    dimensions: '43 1/2 × 63 × 2 ¾ In.',
    price: '$9,500',
    imageUrl: '/artaldo/julio-neira-milian.webp',
    imageAlt: 'The Great Catch (La Gran Cojida) by Julio Emilio Neira Milian',
    href: '/artworks',
  },
  {
    artistName: 'Javier Guadalupe',
    title: 'Andy Warhol',
    year: '2024',
    status: 'AVAILABLE',
    medium: 'Textile Collage',
    dimensions: '51.18 × 35.43 × 10 In.',
    price: '$35,000',
    imageUrl: '/artaldo/javier-guadalupe-andy-warhol.png',
    imageAlt: 'Andy Warhol by Javier Guadalupe',
    href: '/artworks',
  },
  {
    artistName: 'Nina Surel',
    title: 'Frida',
    year: '2015',
    status: 'AVAILABLE',
    medium: 'Mixed Media on Wood',
    dimensions: '48 × 28 In.',
    price: '$12,000',
    imageUrl: '/artaldo/frida-kahlo-latin-american.png',
    imageAlt: 'Frida by Nina Surel',
    href: '/artworks',
  },
  {
    artistName: 'Marlene Rose',
    title: 'Butterfly Mandala',
    year: '2023',
    status: 'AVAILABLE',
    medium: 'Sandcast Glass & Metal',
    dimensions: '60H × 60W × 5D In.',
    price: '$99,500',
    imageUrl: '/artaldo/marlene-rose-butterfly-mandala.jpg',
    imageAlt: 'Butterfly Mandala by Marlene Rose',
    href: '/artworks',
  },
  {
    artistName: 'Carolina Sardi',
    title: 'Red Installation',
    year: '2013',
    status: 'AVAILABLE',
    medium: 'Installation',
    dimensions: '48H × 45W × 2D In.',
    price: '$13,500',
    imageUrl: '/artaldo/carolina-sardi-red-installation.png',
    imageAlt: 'Red Installation by Carolina Sardi',
    href: '/artworks',
  },
  {
    artistName: 'Lluís Barba',
    title: 'Ruins with an obelisk in the distance, Hubert Robert',
    year: '2015',
    status: 'AVAILABLE',
    medium: 'Photograph on Backlit Fabric',
    dimensions: '48 × 72 In.',
    price: '$28,000',
    imageUrl: '/artaldo/lluis-barba-ruins-obelisk.jpg',
    imageAlt: 'Ruins with an obelisk in the distance, Hubert Robert by Lluís Barba',
    href: '/artworks',
  },
];

export const ARTALDO_HOME_DEFAULTS = {
  heroBadgeText: 'Modern & Contemporary',
  heroHeadline: 'Modern & Contemporary Art —',
  heroAccent: 'Now Online',
  heroSubtitle: 'Aldo Castillo | Art Dealer & Curatorial Director',
  heroTrustCopy: 'Secure art acquisition. Trusted provenance. Guaranteed authenticity.',
  heroCtaText: 'Explore Artworks',
  heroCtaLink: '/artworks',
  heroSecondaryCtaText: 'Schedule a Private Art Consultation',
  heroSecondaryCtaLink: '/contact',
  heroImage: {
    url: ARTALDO_HOME_IMAGES.hero,
    alt: 'Aldo Castillo at Art Basel Miami',
    visible: true,
  },
  worksLabel: 'Gallery',
  worksHeadline: 'Available Works',
  highlightsLabel: 'Latin American Art',
  highlightsHeadline: 'Highlights',
  highlightsBody:
    'Latin American art holds a unique place in the global art world for its rich blend of Indigenous, European, African, and contemporary influences. Shaped by diverse histories, cultures, and social experiences, it often reflects themes of identity, resilience, spirituality, and transformation.',
  advisoryLabel: 'Advisory Services',
  advisoryHeadline: 'Personal Art Advisory Services',
  advisoryBody:
    "Whether you're building your first collection or expanding an established one, Aldo provides personalized guidance to help you acquire works that align with your vision, space, and investment goals.",
  advisoryBullets: [
    'Private collecting guidance',
    'Collection development strategy',
    'Artwork sourcing and acquisition',
    'Virtual and in-person consultations',
  ],
  advisoryCtaText: 'Request Art Advisory',
  advisoryCtaLink: '/collector-services',
  designLabel: 'Design Professionals',
  designHeadline: 'Art Sourcing for Design Professionals',
  designBody:
    'Interior designers, architects, and hospitality professionals trust ArtAldo for curated artwork recommendations, project-specific sourcing, and seamless coordination.',
  designFeatures: [
    {
      title: 'Curated Recommendations',
      description: 'Works selected for your specific project requirements',
    },
    {
      title: 'Scale & Color Matching',
      description: 'Technical specifications for seamless design integration',
    },
    {
      title: 'Installation Support',
      description: 'Professional handling and placement coordination',
    },
    {
      title: 'Project Consultation',
      description: 'Dedicated support from brief to installation',
    },
  ],
  designCtaText: 'Start a Design Project',
  designCtaLink: '/contact',
  aboutLabel: 'About',
  aboutHeadline: 'Aldo Castillo',
  aboutBody:
    "Aldo Castillo's career has always been centered on art. His studies in architecture in Guatemala City and fine arts at the School of the Art Institute of Chicago laid the foundation for a distinguished career that has established him as one of the most prominent international art dealers.\n\nHis professional journey began in Guatemala, where he spent four years as Curator of the Popol Vuh Museum. In 1993, he founded the Aldo Castillo Gallery in Chicago, over 17 years, it became a leading destination for Latin American art. He has also directed major art fairs in Chicago, Miami, and Shanghai, further strengthening his influence in the global contemporary art market.",
  aboutCtaText: 'Learn About Aldo',
  aboutCtaLink: '/about',
};

const navigationItems: NavItem[] = [
  { label: 'Artworks', href: '/artworks' },
  { label: 'Artists', href: '/artists' },
  { label: 'Collections', href: '/collections' },
  { label: 'Advisory', href: '/collector-services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const ARTALDO_SITE_SETTINGS = {
  logoText: 'ArtAldo',
  logoImage: {
    url: ARTALDO_HOME_IMAGES.logo,
    alt: 'ArtAldo',
  },
  navigation: {
    items: navigationItems,
  },
  footerBrandDescription:
    'Curated contemporary art, selected with decades of expertise and personal guidance.',
  footerNavigation: {
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
  },
};
