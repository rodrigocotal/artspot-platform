'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { Button, ArtworkGridSkeleton } from '@/components/ui';
import { Container, Section } from '@/components/layout';
import { ArtworkCard } from '@/components/artwork';
import { HeroImage } from '@/components/hero-image';
import { apiClient, type Artwork } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { ImageFieldValue } from '@/lib/seo';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureCard {
  title: string;
  description: string;
}

export interface HomeContent {
  // Hero
  heroBadgeText?: string;
  heroHeadline?: string;
  heroAccent?: string;
  heroSubtitle?: string;
  heroTrustCopy?: string;
  heroImage?: ImageFieldValue | null;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroPrimaryCta?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaLink?: string;
  heroSecondaryCta?: string;

  // Available Works
  worksLabel?: string;
  worksHeadline?: string;

  // Highlights
  highlightsLabel?: string;
  highlightsHeadline?: string;
  highlightsBody?: string;

  // Advisory services
  advisoryLabel?: string;
  advisoryHeadline?: string;
  advisoryBody?: string;
  advisoryBullets?: string[];
  advisoryCtaText?: string;
  advisoryCtaLink?: string;

  // Design professionals
  designLabel?: string;
  designHeadline?: string;
  designBody?: string;
  designFeatures?: FeatureCard[];
  designCtaText?: string;
  designCtaLink?: string;

  // About
  aboutLabel?: string;
  aboutHeadline?: string;
  aboutBody?: string;
  aboutCtaText?: string;
  aboutCtaLink?: string;

  // Legacy keys (preserved for CMS/admin compatibility)
  featuresHeadline?: string;
  featuresSubtitle?: string;
  features?: Feature[] | { items?: Feature[] };
}

const DEFAULTS = {
  heroBadgeText: 'Contemporary & Latin American Art',
  heroHeadline: 'Modern & Contemporary Art —',
  heroAccent: 'Now Online',
  heroSubtitle: 'Aldo Castillo | Art Dealer & Curatorial Director',
  heroTrustCopy: 'Secure art acquisition. Trusted provenance. Guaranteed authenticity.',
  heroCtaText: 'Explore Artworks',
  heroCtaLink: '/artworks',
  heroSecondaryCtaText: 'Schedule a Private Consultation',
  heroSecondaryCtaLink: '/contact',

  worksLabel: 'Gallery',
  worksHeadline: 'Available Works',

  highlightsLabel: 'Highlights',
  highlightsHeadline: 'Latin American Art',
  highlightsBody:
    'A focused selection of modern and contemporary works by leading Latin American artists — each piece chosen for its presence, provenance, and lasting cultural significance.',

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
    'For over three decades, Aldo Castillo has championed modern and contemporary art with a particular devotion to Latin American masters. As a dealer and curatorial director, he brings museum-level expertise and a deeply personal approach to every acquisition — guiding collectors with honesty, scholarship, and trust.',
  aboutCtaText: 'Learn About Aldo',
  aboutCtaLink: '/about',

  // Legacy defaults (preserved for CMS/admin compatibility)
  featuresHeadline: 'Why Collectors Choose ArtAldo',
  featuresSubtitle: 'A premium platform designed for serious art collectors',
  features: [
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
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{children}</p>
  );
}

function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 transition-colors hover:text-primary-600',
        className
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

/** Section visual: a real artwork image when available, else a tasteful neutral block. */
function SectionImage({
  artwork,
  fallbackLabel,
  className,
}: {
  artwork?: Artwork;
  fallbackLabel: string;
  className?: string;
}) {
  const image = artwork?.images?.[0];
  const url = image?.secureUrl || image?.url;

  if (url) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-md border border-neutral-200 bg-neutral-100',
          className
        )}
      >
        <Image
          src={url}
          alt={artwork?.title ?? ''}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md border border-neutral-200 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-50',
        className
      )}
    >
      <span className="font-serif text-xl italic text-neutral-400">{fallbackLabel}</span>
    </div>
  );
}

export function HomePageClient({ content }: { content: HomeContent | null }) {
  const c = content ?? {};

  // Accept both new (admin-facing) and legacy (pre-existing in DB) CTA keys
  const primaryText = c.heroCtaText ?? c.heroPrimaryCta ?? DEFAULTS.heroCtaText;
  const primaryLink = c.heroCtaLink ?? c.heroPrimaryCtaLink ?? DEFAULTS.heroCtaLink;
  const secondaryText =
    c.heroSecondaryCtaText ?? c.heroSecondaryCta ?? DEFAULTS.heroSecondaryCtaText;
  const secondaryLink = c.heroSecondaryCtaLink ?? DEFAULTS.heroSecondaryCtaLink;

  const eyebrow = c.heroBadgeText ?? DEFAULTS.heroBadgeText;
  const headline = c.heroHeadline ?? DEFAULTS.heroHeadline;
  const accent = c.heroAccent ?? DEFAULTS.heroAccent;
  const byline = c.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const trustCopy = c.heroTrustCopy ?? DEFAULTS.heroTrustCopy;

  const worksLabel = c.worksLabel ?? DEFAULTS.worksLabel;
  const worksHeadline = c.worksHeadline ?? DEFAULTS.worksHeadline;

  const highlightsLabel = c.highlightsLabel ?? DEFAULTS.highlightsLabel;
  const highlightsHeadline = c.highlightsHeadline ?? DEFAULTS.highlightsHeadline;
  const highlightsBody = c.highlightsBody ?? DEFAULTS.highlightsBody;

  const advisoryLabel = c.advisoryLabel ?? DEFAULTS.advisoryLabel;
  const advisoryHeadline = c.advisoryHeadline ?? DEFAULTS.advisoryHeadline;
  const advisoryBody = c.advisoryBody ?? DEFAULTS.advisoryBody;
  const advisoryBullets = c.advisoryBullets ?? DEFAULTS.advisoryBullets;
  const advisoryCtaText = c.advisoryCtaText ?? DEFAULTS.advisoryCtaText;
  const advisoryCtaLink = c.advisoryCtaLink ?? DEFAULTS.advisoryCtaLink;

  const designLabel = c.designLabel ?? DEFAULTS.designLabel;
  const designHeadline = c.designHeadline ?? DEFAULTS.designHeadline;
  const designBody = c.designBody ?? DEFAULTS.designBody;
  const designFeatures = c.designFeatures ?? DEFAULTS.designFeatures;
  const designCtaText = c.designCtaText ?? DEFAULTS.designCtaText;
  const designCtaLink = c.designCtaLink ?? DEFAULTS.designCtaLink;

  const aboutLabel = c.aboutLabel ?? DEFAULTS.aboutLabel;
  const aboutHeadline = c.aboutHeadline ?? DEFAULTS.aboutHeadline;
  const aboutBody = c.aboutBody ?? DEFAULTS.aboutBody;
  const aboutCtaText = c.aboutCtaText ?? DEFAULTS.aboutCtaText;
  const aboutCtaLink = c.aboutCtaLink ?? DEFAULTS.aboutCtaLink;

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    let active = true;
    apiClient
      .getArtworks({ status: 'AVAILABLE', limit: 6, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => {
        if (active) setArtworks(res.data ?? []);
      })
      .catch(() => {
        if (active) setArtworks([]);
      })
      .finally(() => {
        if (active) setLoadingArtworks(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const highlightWorks = artworks.slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <Section spacing="xl" background="neutral">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-neutral-900 sm:text-6xl">
                {headline}
                {accent && (
                  <>
                    {' '}
                    <span className="italic text-primary-600">{accent}</span>
                  </>
                )}
              </h1>
              <p className="mt-6 text-lg text-neutral-700">{byline}</p>
              <p className="mt-3 text-sm text-neutral-500">{trustCopy}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                {primaryText && primaryLink && (
                  <Link href={primaryLink}>
                    <Button size="lg" variant="secondary">
                      {primaryText}
                    </Button>
                  </Link>
                )}
                {secondaryText && secondaryLink && (
                  <Link href={secondaryLink}>
                    <Button size="lg" variant="outline">
                      {secondaryText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div>
              {c.heroImage?.url ? (
                <HeroImage image={c.heroImage} />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-50">
                  <span className="font-serif text-2xl italic text-neutral-400">ArtAldo</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Available Works */}
      <Section background="white">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>{worksLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl text-neutral-900 sm:text-5xl">
                {worksHeadline}
              </h2>
            </div>
            <ArrowLink href="/artworks" className="mb-2 shrink-0">
              View All
            </ArrowLink>
          </div>

          <div className="mt-12">
            {loadingArtworks ? (
              <ArtworkGridSkeleton count={6} />
            ) : artworks.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {artworks.map((art, i) => (
                  <ArtworkCard key={art.id} artwork={art} priority={i < 3} />
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* 3. Highlights — Latin American Art */}
      <Section background="neutral">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{highlightsLabel}</Eyebrow>
            <h2 className="mt-3 font-serif text-4xl text-neutral-900 sm:text-5xl">
              {highlightsHeadline}
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-600">{highlightsBody}</p>
            <ArrowLink href="/collections" className="mt-6">
              Gallery Picks
            </ArrowLink>
          </div>

          <div className="mt-12">
            {loadingArtworks ? (
              <ArtworkGridSkeleton count={3} />
            ) : highlightWorks.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {highlightWorks.map((art) => (
                  <ArtworkCard key={art.id} artwork={art} />
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* 4. Personal Art Advisory Services */}
      <Section background="white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionImage
              artwork={artworks[0]}
              fallbackLabel="Personal Advisory"
              className="aspect-[4/5] w-full"
            />
            <div>
              <Eyebrow>{advisoryLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl text-neutral-900 sm:text-5xl">
                {advisoryHeadline}
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-600">{advisoryBody}</p>
              <ul className="mt-8 space-y-4">
                {advisoryBullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3 text-neutral-700">
                    <CircleCheck
                      className="h-5 w-5 shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <Link href={advisoryCtaLink} className="mt-10 inline-block">
                <Button size="lg" variant="secondary">
                  {advisoryCtaText}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Art Sourcing for Design Professionals */}
      <Section background="neutral">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>{designLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl text-neutral-900 sm:text-5xl">
                {designHeadline}
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-600">{designBody}</p>

              <div className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {designFeatures.map((feature) => (
                  <div key={feature.title} className="border-t border-neutral-200 pb-3 pt-5">
                    <h3 className="font-sans font-medium text-neutral-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <Link href={designCtaLink} className="mt-10 inline-block">
                <Button size="lg" variant="secondary">
                  {designCtaText}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <SectionImage
              artwork={artworks[1]}
              fallbackLabel="Design Projects"
              className="aspect-[4/5] w-full"
            />
          </div>
        </Container>
      </Section>

      {/* 6. About Aldo */}
      <Section background="white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <Eyebrow>{aboutLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl text-neutral-900 sm:text-5xl">
                {aboutHeadline}
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-600">{aboutBody}</p>
              <ArrowLink href={aboutCtaLink} className="mt-8">
                {aboutCtaText}
              </ArrowLink>
            </div>

            <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-50">
              <span className="font-serif text-2xl italic text-neutral-400">{aboutHeadline}</span>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
