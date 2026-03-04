/**
 * Seed Strapi page single types with current default content
 *
 * Usage:
 *   cd apps/api
 *   STRAPI_URL=https://rwaxtjdazy.ap-southeast-2.awsapprunner.com \
 *   STRAPI_TOKEN=<your-api-token> \
 *   npx tsx scripts/seed-page-content.ts
 *
 * Before running:
 *   1. Create a Full Access API token in Strapi (Settings > API Tokens)
 *   2. Make sure the 4 single types are visible in the admin
 *      (you may need to configure permissions under Settings > Roles)
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('ERROR: Set STRAPI_TOKEN env var (Strapi full-access API token)');
  process.exit(1);
}

async function strapiPut(endpoint: string, data: any): Promise<any> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Strapi PUT ${endpoint} failed (${res.status}): ${err}`);
  }

  return res.json();
}

// ── Page defaults (mirrors the DEFAULTS objects in each frontend page) ──

const homePage = {
  heroBadgeText: 'Platform in Development — Phase 1',
  heroHeadline: 'Discover Museum-Quality Art',
  heroSubtitle:
    'Elevating the experience of collecting art online. We believe collecting art goes beyond ownership—it is valued as a personal, intellectual, and emotional asset.',
  heroPrimaryCta: 'Explore Collection',
  heroPrimaryCtaLink: '/artworks',
  heroSecondaryCta: 'Browse Artists',
  heroSecondaryCtaLink: '/artists',
  featuresHeadline: 'Why Collectors Choose ArtSpot',
  featuresSubtitle: 'A premium platform designed for serious art collectors',
  features: {
    items: [
      {
        icon: '🎨',
        title: 'Curated Selection',
        description:
          'Every artwork is carefully selected by our team of art experts guided by institutional standards.',
      },
      {
        icon: '✓',
        title: 'Authenticity Guaranteed',
        description:
          'Certificates of authenticity and provenance for all works based on honesty and trust.',
      },
      {
        icon: '🤝',
        title: 'Collector Services',
        description:
          'Personalized assistance and art advisory services for discerning collectors.',
      },
    ],
  },
};

const contactPage = {
  headline: 'Contact Us',
  subtitle:
    'We would love to hear from you. Reach out to our team for any inquiries about artworks, services, or collaboration.',
  email: 'hello@artspot.com',
  phone: '+1 (555) 000-0000',
  address: '123 Gallery Street\nNew York, NY 10001',
  businessHours:
    'Monday – Friday: 9am – 6pm\nSaturday: 10am – 4pm\nSunday: Closed',
  formHeadline: 'Send Us a Message',
  formSubtitle:
    'Fill out the form below and we will get back to you within 24 hours.',
};

const collectorServicesPage = {
  headline: 'Collector Services',
  subtitle:
    'Personalized assistance for discerning collectors at every stage of their journey.',
  introContent: '',
  services: {
    items: [
      {
        icon: '🔍',
        title: 'Art Advisory',
        description:
          'Our expert advisors help you discover and acquire works that align with your vision, taste, and investment goals.',
      },
      {
        icon: '✓',
        title: 'Authentication & Provenance',
        description:
          'Comprehensive verification services to ensure the authenticity and documented history of every piece.',
      },
      {
        icon: '🛡️',
        title: 'Insurance Guidance',
        description:
          'Professional guidance on insuring your collection with specialized fine art insurance partners.',
      },
      {
        icon: '📦',
        title: 'White-Glove Shipping',
        description:
          'Museum-standard packing, crating, and delivery for safe transportation of your artworks worldwide.',
      },
      {
        icon: '🖼️',
        title: 'Installation & Framing',
        description:
          'Expert installation and custom framing services to present your collection at its finest.',
      },
      {
        icon: '📋',
        title: 'Collection Management',
        description:
          'Digital cataloguing, condition reporting, and strategic planning for your growing collection.',
      },
    ],
  },
};

const discoverPage = {
  headline: 'Discover',
  subtitle:
    'Explore the world of art through our editorial content, exhibitions, and curated inspiration.',
};

const siteSettings = {
  logoText: 'ArtSpot',
  navigation: {
    items: [
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
    ],
  },
};

// ── Main ──

async function main() {
  console.log('=== Seed Strapi page single types ===');
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  const pages: [string, string, any][] = [
    ['Home Page', '/home-page', homePage],
    ['Contact Page', '/contact-page', contactPage],
    ['Collector Services Page', '/collector-services-page', collectorServicesPage],
    ['Discover Page', '/discover-page', discoverPage],
    ['Site Settings', '/site-setting', siteSettings],
  ];

  for (const [label, endpoint, data] of pages) {
    try {
      await strapiPut(endpoint, data);
      console.log(`  ✓ ${label} seeded`);
    } catch (err: any) {
      console.error(`  ✗ ${label}: ${err.message}`);
    }
  }

  console.log('\nDone! Content is now editable in the Strapi admin panel.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
