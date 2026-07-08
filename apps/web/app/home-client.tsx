'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { Container, Section } from '@/components/layout';
import { ArtworkCard } from '@/components/artwork/artwork-card';
import { CollectionCard } from '@/components/collection/collection-card';
import { HeroImage } from '@/components/hero-image';
import { cn } from '@/lib/utils';
import { apiClient, type Artwork, type Collection } from '@/lib/api-client';
import { editableSlugList, orderBySlug, type EditableSlugItem } from '@/lib/homepage-selections';
import type { ImageFieldValue } from '@/lib/seo';
import {
  ARTALDO_HOME_DEFAULTS,
  ARTALDO_HOME_IMAGES,
  ARTALDO_WORKS,
  type ArtAldoReferenceWork,
} from '@/lib/artaldo-reference';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureCard {
  title: string;
  description: string;
}

type EditableBullet = string | { value?: string };

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
  worksArtworkSlugs?: EditableSlugItem[];

  // Highlights
  highlightsLabel?: string;
  highlightsHeadline?: string;
  highlightsBody?: string;
  highlightsCtaText?: string;
  highlightsCtaLink?: string;
  highlightArtworkSlugs?: EditableSlugItem[];
  highlightCollectionSlugs?: EditableSlugItem[];

  // Advisory services
  advisoryLabel?: string;
  advisoryHeadline?: string;
  advisoryBody?: string;
  advisoryBullets?: EditableBullet[];
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
  ...ARTALDO_HOME_DEFAULTS,
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
    <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">{children}</p>
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

function SectionImage({
  src,
  alt,
  fallbackLabel,
  className,
}: {
  src?: string;
  alt?: string;
  fallbackLabel: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn('relative overflow-hidden bg-neutral-100', className)}>
        <Image
          src={src}
          alt={alt || fallbackLabel}
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
        'flex items-center justify-center border border-neutral-200 bg-neutral-50',
        className
      )}
    >
      <span className="font-serif text-xl italic text-neutral-400">{fallbackLabel}</span>
    </div>
  );
}

function ReferenceArtworkCard({
  work,
  priority = false,
}: {
  work: ArtAldoReferenceWork;
  priority?: boolean;
}) {
  return (
    <article className="group">
      <Link href={work.href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <Image
            src={work.imageUrl}
            alt={work.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            priority={priority}
          />
        </div>
        <div className="mt-5 space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-sans text-sm font-semibold text-neutral-950">{work.artistName}</h3>
            <span className="mt-1 flex shrink-0 items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#153d0b]" aria-hidden="true" />
              {work.status}
            </span>
          </div>
          <p className="font-serif text-sm italic text-neutral-600">
            {work.title}, {work.year}
          </p>
          <p className="text-xs text-neutral-600">{work.medium}</p>
          <p className="text-xs text-neutral-500">{work.dimensions}</p>
          <p className="pt-1 text-sm font-semibold text-neutral-950">{work.price}</p>
        </div>
      </Link>
      <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Link
          href={work.href}
          className="border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-950 hover:bg-neutral-950 hover:text-white"
        >
          View Details
        </Link>
        <Link
          href="/contact"
          className="border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-950 hover:bg-neutral-950 hover:text-white"
        >
          Inquire
        </Link>
        <Link
          href="/contact"
          className="border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-950 hover:bg-neutral-950 hover:text-white"
        >
          Request Photos
        </Link>
      </div>
    </article>
  );
}

async function fetchArtworkSelections(slugs: string[]) {
  if (slugs.length === 0) return [];
  const res = await apiClient.getArtworks({
    slugs,
    limit: Math.max(slugs.length, 1),
    status: 'AVAILABLE',
  });
  return orderBySlug(res.data, slugs);
}

async function fetchCollectionSelections(slugs: string[]) {
  if (slugs.length === 0) return [];
  const res = await apiClient.getCollections({
    slugs,
    limit: Math.max(slugs.length, 1),
  });
  return orderBySlug(res.data, slugs);
}

export function HomePageClient({ content }: { content: HomeContent | null }) {
  const c = content ?? {};
  const [selectedWorks, setSelectedWorks] = useState<Artwork[]>([]);
  const [selectedHighlightWorks, setSelectedHighlightWorks] = useState<Artwork[]>([]);
  const [selectedHighlightCollections, setSelectedHighlightCollections] = useState<Collection[]>([]);

  // CMS values authored for the prior design may be empty strings (treat as
  // unset) or hold long descriptive copy in CTA fields (never render a
  // paragraph as a button). pick() = first non-blank; ctaLabel() also caps
  // length so a misconfigured CTA falls back to the default.
  const pick = (...vals: (string | undefined)[]) => {
    for (const v of vals) {
      const t = typeof v === 'string' ? v.trim() : '';
      if (t) return t;
    }
    return '';
  };
  const ctaLabel = (...vals: (string | undefined)[]) => {
    const t = pick(...vals);
    return t.length > 0 && t.length <= 40 ? t : '';
  };
  const bulletList = (value: EditableBullet[] | undefined, fallback: string[]) => {
    const source = Array.isArray(value) && value.length > 0 ? value : fallback;
    return source
      .map((item) => (typeof item === 'string' ? item : item.value || ''))
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const primaryText = ctaLabel(c.heroCtaText, c.heroPrimaryCta) || DEFAULTS.heroCtaText;
  const primaryLink = pick(c.heroCtaLink, c.heroPrimaryCtaLink) || DEFAULTS.heroCtaLink;
  const secondaryText =
    ctaLabel(c.heroSecondaryCtaText, c.heroSecondaryCta) || DEFAULTS.heroSecondaryCtaText;
  const secondaryLink = pick(c.heroSecondaryCtaLink) || DEFAULTS.heroSecondaryCtaLink;

  const eyebrow = pick(c.heroBadgeText) || DEFAULTS.heroBadgeText;
  const headline = pick(c.heroHeadline) || DEFAULTS.heroHeadline;
  const accent = pick(c.heroAccent) || DEFAULTS.heroAccent;
  const byline = pick(c.heroSubtitle) || DEFAULTS.heroSubtitle;
  const trustCopy = pick(c.heroTrustCopy) || DEFAULTS.heroTrustCopy;

  const worksLabel = pick(c.worksLabel) || DEFAULTS.worksLabel;
  const worksHeadline = pick(c.worksHeadline) || DEFAULTS.worksHeadline;
  const worksArtworkSlugs = editableSlugList(c.worksArtworkSlugs);
  const worksArtworkSlugKey = worksArtworkSlugs.join(',');

  const highlightsLabel = pick(c.highlightsLabel) || DEFAULTS.highlightsLabel;
  const highlightsHeadline = pick(c.highlightsHeadline) || DEFAULTS.highlightsHeadline;
  const highlightsBody = pick(c.highlightsBody) || DEFAULTS.highlightsBody;
  const highlightsCtaText = pick(c.highlightsCtaText) || 'Gallery Picks';
  const highlightsCtaLink = pick(c.highlightsCtaLink) || '/collections';
  const highlightArtworkSlugs = editableSlugList(c.highlightArtworkSlugs);
  const highlightCollectionSlugs = editableSlugList(c.highlightCollectionSlugs);
  const highlightArtworkSlugKey = highlightArtworkSlugs.join(',');
  const highlightCollectionSlugKey = highlightCollectionSlugs.join(',');

  const advisoryLabel = pick(c.advisoryLabel) || DEFAULTS.advisoryLabel;
  const advisoryHeadline = pick(c.advisoryHeadline) || DEFAULTS.advisoryHeadline;
  const advisoryBody = pick(c.advisoryBody) || DEFAULTS.advisoryBody;
  const advisoryBullets = bulletList(c.advisoryBullets, DEFAULTS.advisoryBullets);
  const advisoryCtaText = pick(c.advisoryCtaText) || DEFAULTS.advisoryCtaText;
  const advisoryCtaLink = pick(c.advisoryCtaLink) || DEFAULTS.advisoryCtaLink;

  const designLabel = pick(c.designLabel) || DEFAULTS.designLabel;
  const designHeadline = pick(c.designHeadline) || DEFAULTS.designHeadline;
  const designBody = pick(c.designBody) || DEFAULTS.designBody;
  const designFeatures =
    Array.isArray(c.designFeatures) && c.designFeatures.length > 0
      ? c.designFeatures
      : DEFAULTS.designFeatures;
  const designCtaText = pick(c.designCtaText) || DEFAULTS.designCtaText;
  const designCtaLink = pick(c.designCtaLink) || DEFAULTS.designCtaLink;

  const aboutLabel = pick(c.aboutLabel) || DEFAULTS.aboutLabel;
  const aboutHeadline = pick(c.aboutHeadline) || DEFAULTS.aboutHeadline;
  const aboutBody = pick(c.aboutBody) || DEFAULTS.aboutBody;
  const aboutCtaText = pick(c.aboutCtaText) || DEFAULTS.aboutCtaText;
  const aboutCtaLink = pick(c.aboutCtaLink) || DEFAULTS.aboutCtaLink;
  const heroImage = c.heroImage?.url ? c.heroImage : DEFAULTS.heroImage;
  const highlightWorks = [
    ...ARTALDO_WORKS.slice(0, 3),
    {
      artistName: 'Fredy Villamil',
      title: 'The Second Heartbeat of the Sun',
      year: '2025',
      status: 'AVAILABLE' as const,
      medium: 'Painting',
      dimensions: '48 × 60 in.',
      price: '$18,000',
      imageUrl: '/artaldo/fredy-villamil-second-heartbeat.png',
      imageAlt: 'The Second Heartbeat of the Sun by Fredy Villamil',
      href: '/artworks',
    },
  ];

  useEffect(() => {
    let active = true;
    const slugs = worksArtworkSlugKey ? worksArtworkSlugKey.split(',') : [];

    fetchArtworkSelections(slugs)
      .then((artworks) => {
        if (active) setSelectedWorks(artworks);
      })
      .catch(() => {
        if (active) setSelectedWorks([]);
      });

    return () => {
      active = false;
    };
  }, [worksArtworkSlugKey]);

  useEffect(() => {
    let active = true;
    const artworkSlugs = highlightArtworkSlugKey ? highlightArtworkSlugKey.split(',') : [];
    const collectionSlugs = highlightCollectionSlugKey ? highlightCollectionSlugKey.split(',') : [];

    Promise.all([
      fetchArtworkSelections(artworkSlugs),
      fetchCollectionSelections(collectionSlugs),
    ])
      .then(([artworks, collections]) => {
        if (!active) return;
        setSelectedHighlightWorks(artworks);
        setSelectedHighlightCollections(collections);
      })
      .catch(() => {
        if (!active) return;
        setSelectedHighlightWorks([]);
        setSelectedHighlightCollections([]);
      });

    return () => {
      active = false;
    };
  }, [highlightArtworkSlugKey, highlightCollectionSlugKey]);

  return (
    <>
      <Section spacing="xl" background="white" className="border-b border-neutral-100">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div className="max-w-xl">
              <span className="sr-only">{eyebrow}</span>
              <h1 className="font-serif text-6xl font-medium leading-[0.98] text-neutral-950 sm:text-7xl lg:text-[5.25rem]">
                {headline}{' '}
                {accent && (
                  <span className="block italic text-[#d6aa35]">{accent}</span>
                )}
              </h1>
              <p className="mt-8 text-lg text-neutral-700">{byline}</p>
              <p className="mt-3 text-sm text-neutral-500">{trustCopy}</p>
              <div className="mt-8 flex max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row lg:flex-col lg:items-start">
                {primaryText && primaryLink && (
                  <Link href={primaryLink}>
                    <Button size="lg" variant="primary" className="rounded-none px-9 text-base">
                      {primaryText}
                    </Button>
                  </Link>
                )}
                {secondaryText && secondaryLink && (
                  <Link href={secondaryLink}>
                    <Button size="lg" variant="outline" className="rounded-none px-9 text-base">
                      {secondaryText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div>
              {heroImage?.url ? (
                <HeroImage image={heroImage} className="rounded-none border-0" />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-neutral-200 bg-neutral-50">
                  <span className="font-serif text-2xl italic text-neutral-400">ArtAldo</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="neutral" className="bg-[#faf9f7]">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>{worksLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
                {worksHeadline}
              </h2>
            </div>
            <ArrowLink href="/artworks" className="mb-2 shrink-0">
              View All
            </ArrowLink>
          </div>

          {selectedWorks.length > 0 ? (
            <div className="mt-14 grid grid-cols-1 gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {selectedWorks.map((artwork, index) => (
                <ArtworkCard key={artwork.id} artwork={artwork} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {ARTALDO_WORKS.map((work, index) => (
                <ReferenceArtworkCard
                  key={`${work.artistName}-${work.title}`}
                  work={work}
                  priority={index < 3}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>{highlightsLabel}</Eyebrow>
            <h2 className="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
              {highlightsHeadline}
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-600">{highlightsBody}</p>
            <ArrowLink href={highlightsCtaLink} className="mt-6">
              {highlightsCtaText}
            </ArrowLink>
          </div>

          {selectedHighlightWorks.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {selectedHighlightWorks.map((artwork, index) => (
                <ArtworkCard key={artwork.id} artwork={artwork} priority={index < 2} />
              ))}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {highlightWorks.map((work, index) => (
                <ReferenceArtworkCard
                  key={`${work.artistName}-${work.title}`}
                  work={work}
                  priority={index < 2}
                />
              ))}
            </div>
          )}

          {selectedHighlightCollections.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-x-9 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {selectedHighlightCollections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} priority={index < 3} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section background="neutral" className="bg-[#faf9f7]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionImage
              src={ARTALDO_HOME_IMAGES.advisory}
              alt="Private gallery viewing"
              fallbackLabel="Personal Advisory"
              className="aspect-[4/5] w-full"
            />
            <div>
              <Eyebrow>{advisoryLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
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

      <Section background="white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>{designLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
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
              src={ARTALDO_HOME_IMAGES.design}
              alt="Enrique Machado, Clouds — Art for luxury interiors"
              fallbackLabel="Design Projects"
              className="aspect-[4/5] w-full"
            />
          </div>
        </Container>
      </Section>

      <Section background="neutral" className="bg-[#faf9f7]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <Eyebrow>{aboutLabel}</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-medium text-neutral-950 sm:text-5xl">
                {aboutHeadline}
              </h2>
              <div className="mt-5 space-y-5 leading-relaxed text-neutral-600">
                {aboutBody.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ArrowLink href={aboutCtaLink} className="mt-8">
                {aboutCtaText}
              </ArrowLink>
            </div>

            <SectionImage
              src={ARTALDO_HOME_IMAGES.about}
              alt="Aldo Castillo at gallery opening"
              fallbackLabel={aboutHeadline}
              className="aspect-[4/5] w-full"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
