/**
 * Seed CMS page content with ArtAldo reference defaults.
 *
 * Usage:
 *   cd apps/api
 *   DATABASE_URL=<postgres-url> npx tsx scripts/seed-page-content.ts
 */

import { Prisma, PrismaClient, PageContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

const image = (url: string, alt: string) => ({
  url,
  alt,
  visible: true,
});

const homePage = {
  heroBadgeText: 'Modern & Contemporary',
  heroHeadline: 'Modern & Contemporary Art —',
  heroAccent: 'Now Online',
  heroSubtitle: 'Aldo Castillo | Art Dealer & Curatorial Director',
  heroTrustCopy: 'Secure art acquisition. Trusted provenance. Guaranteed authenticity.',
  heroCtaText: 'Explore Artworks',
  heroCtaLink: '/artworks',
  heroSecondaryCtaText: 'Schedule a Private Art Consultation',
  heroSecondaryCtaLink: '/contact',
  heroImage: image('/artaldo/art-basel-booth.jpeg', 'Aldo Castillo at Art Basel Miami'),
  worksLabel: 'Gallery',
  worksHeadline: 'Available Works',
  worksArtworkSlugs: [],
  highlightsLabel: 'Latin American Art',
  highlightsHeadline: 'Highlights',
  highlightsBody:
    'Latin American art holds a unique place in the global art world for its rich blend of Indigenous, European, African, and contemporary influences. Shaped by diverse histories, cultures, and social experiences, it often reflects themes of identity, resilience, spirituality, and transformation.',
  highlightsCtaText: 'Gallery Picks',
  highlightsCtaLink: '/collections',
  highlightArtworkSlugs: [],
  highlightCollectionSlugs: [],
  advisoryLabel: 'Advisory Services',
  advisoryHeadline: 'Personal Art Advisory Services',
  advisoryBody:
    "Whether you're building your first collection or expanding an established one, Aldo provides personalized guidance to help you acquire works that align with your vision, space, and investment goals.",
  advisoryBullets: [
    { value: 'Private collecting guidance' },
    { value: 'Collection development strategy' },
    { value: 'Artwork sourcing and acquisition' },
    { value: 'Virtual and in-person consultations' },
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
  _seo: {
    title: 'ArtAldo - Modern & Contemporary Art',
    description:
      'Curated contemporary art, secure acquisition, trusted provenance, and personal advisory from Aldo Castillo.',
    image: image('/artaldo/art-basel-booth.jpeg', 'Aldo Castillo at Art Basel Miami'),
  },
};

const contactPage = {
  headline: 'Contact ArtAldo',
  subtitle:
    'Reach out for artwork inquiries, private viewing appointments, advisory requests, or design project support.',
  contactImage: image('/artaldo/private-gallery-viewing.webp', 'Private gallery viewing'),
  email: 'info@artaldo.com',
  phone: '+1 (305) 000-0000',
  address: 'Miami, Florida\nPrivate appointments available by request',
  businessHours:
    'Monday – Friday: 10am – 6pm\nSaturday: By appointment\nSunday: By appointment',
  formHeadline: 'Start the Conversation',
  formSubtitle:
    'Tell us what you are looking for and Aldo’s team will follow up with curated guidance.',
  submitButtonText: 'Send Message',
  successHeadline: 'Message Sent',
  successMessage:
    'Thank you for reaching out. The ArtAldo team will get back to you shortly.',
  _seo: {
    title: 'Contact ArtAldo',
    description:
      'Contact ArtAldo for artwork inquiries, art advisory, private viewings, and design professional sourcing.',
  },
};

const collectorServicesPage = {
  headline: 'Personal Art Advisory Services',
  subtitle:
    'Personalized guidance to help you acquire works aligned with your vision, space, and investment goals.',
  introContent:
    "Whether you're building your first collection or expanding an established one, Aldo provides private collecting guidance, collection development strategy, artwork sourcing, and virtual or in-person consultations.",
  services: {
    items: [
      {
        icon: '🔍',
        title: 'Private Collecting Guidance',
        description:
          'One-on-one advisory for collectors seeking works with clear aesthetic, cultural, and market relevance.',
      },
      {
        icon: '✓',
        title: 'Collection Development',
        description:
          'Strategic support for building a coherent collection across artists, periods, mediums, and budgets.',
      },
      {
        icon: '🤝',
        title: 'Artwork Sourcing',
        description:
          'Targeted sourcing and acquisition support for specific artists, spaces, or collecting goals.',
      },
      {
        icon: '🖼️',
        title: 'Design Professional Support',
        description:
          'Curated recommendations, scale and color matching, and project coordination for interiors and hospitality.',
      },
    ],
  },
  ctaHeadline: 'Request Art Advisory',
  ctaSubtitle:
    'Share your collecting goals or project brief and receive tailored guidance from ArtAldo.',
  ctaButtonText: 'Request Art Advisory',
  ctaButtonLink: '/contact',
  _seo: {
    title: 'Art Advisory Services',
    description:
      'Private art advisory, collection strategy, artwork sourcing, and design professional support from ArtAldo.',
  },
};

const discoverPage = {
  headline: 'Discover ArtAldo',
  subtitle:
    'Explore contemporary art through curated selections, Latin American art highlights, advisory perspectives, and private viewing opportunities.',
  sections: {
    items: [
      {
        title: 'Available Works',
        description: 'Browse curated contemporary artworks available for acquisition.',
        href: '/artworks',
      },
      {
        title: 'Artists',
        description: 'Explore artists represented and curated by ArtAldo.',
        href: '/artists',
      },
      {
        title: 'Advisory',
        description: 'Learn how ArtAldo supports collectors and design professionals.',
        href: '/collector-services',
      },
    ],
  },
  featuredHeadline: 'Latin American Art Highlights',
  featuredSubtitle:
    'Selections shaped by identity, resilience, spirituality, and transformation.',
  _seo: {
    title: 'Discover ArtAldo',
    description:
      'Curated contemporary art, Latin American art highlights, advisory services, and available works from ArtAldo.',
  },
};

const siteSettings = {
  logoText: 'ArtAldo',
  logoImage: image('/artaldo/artaldo-logo.png', 'ArtAldo'),
  navigation: {
    items: [
      { label: 'Artworks', href: '/artworks' },
      { label: 'Artists', href: '/artists' },
      { label: 'Collections', href: '/collections' },
      { label: 'Advisory', href: '/collector-services' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  _seo: {
    siteName: 'ArtAldo',
    defaultTitle: 'ArtAldo - Modern & Contemporary Art',
    defaultDescription:
      'Curated contemporary art, secure acquisition, trusted provenance, and personal advisory from Aldo Castillo.',
    defaultImage: image('/artaldo/art-basel-booth.jpeg', 'Aldo Castillo at Art Basel Miami'),
  },
};

const footer = {
  brandName: 'ArtAldo',
  logoImage: image('/artaldo/artaldo-logo.png', 'ArtAldo'),
  brandDescription:
    'Curated contemporary art, selected with decades of expertise and personal guidance.',
  newsletterLabel: 'Join the Collector List',
  copyrightName: 'ArtAldo',
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

const pages = {
  home: homePage,
  contact: contactPage,
  'collector-services': collectorServicesPage,
  discover: discoverPage,
  'site-settings': siteSettings,
  footer,
};

async function main() {
  console.log('=== Seed ArtAldo CMS page content ===');

  for (const [slug, content] of Object.entries(pages)) {
    await prisma.pageContent.upsert({
      where: { slug },
      update: {
        content,
        draftContent: Prisma.JsonNull,
        status: PageContentStatus.PUBLISHED,
      },
      create: {
        slug,
        content,
        status: PageContentStatus.PUBLISHED,
      },
    });

    console.log(`  ✓ ${slug}`);
  }

  console.log('\nDone. ArtAldo CMS defaults are published.');
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
