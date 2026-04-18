'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container, Section } from '@/components/layout';
import { HeroImage } from '@/components/hero-image';
import type { ImageFieldValue } from '@/lib/seo';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  heroBadgeText?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroImage?: ImageFieldValue | null;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroPrimaryCta?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaLink?: string;
  heroSecondaryCta?: string;
  featuresHeadline?: string;
  featuresSubtitle?: string;
  features?: Feature[] | { items?: Feature[] };
}

const DEFAULTS = {
  heroBadgeText: 'Platform in Development — Phase 1',
  heroHeadline: 'Discover Museum-Quality Art',
  heroSubtitle:
    'Elevating the experience of collecting art online. We believe collecting art goes beyond ownership—it is valued as a personal, intellectual, and emotional asset.',
  heroCtaText: 'Explore Collection',
  heroCtaLink: '/artworks',
  heroSecondaryCtaText: 'Browse Artists',
  heroSecondaryCtaLink: '/artists',
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

export function HomePageClient({ content }: { content: HomeContent | null }) {
  const c = content ?? {};

  // Accept both new (admin-facing) and legacy (pre-existing in DB) CTA keys
  const primaryText = c.heroCtaText ?? c.heroPrimaryCta ?? DEFAULTS.heroCtaText;
  const primaryLink = c.heroCtaLink ?? c.heroPrimaryCtaLink ?? DEFAULTS.heroCtaLink;
  const secondaryText =
    c.heroSecondaryCtaText ?? c.heroSecondaryCta ?? DEFAULTS.heroSecondaryCtaText;
  const secondaryLink = c.heroSecondaryCtaLink ?? DEFAULTS.heroSecondaryCtaLink;

  const badgeText = c.heroBadgeText ?? DEFAULTS.heroBadgeText;
  const headline = c.heroHeadline ?? DEFAULTS.heroHeadline;
  const subtitle = c.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const featuresHeadline = c.featuresHeadline ?? DEFAULTS.featuresHeadline;
  const featuresSubtitle = c.featuresSubtitle ?? DEFAULTS.featuresSubtitle;

  const rawFeatures = Array.isArray(c.features)
    ? c.features
    : (c.features as { items?: Feature[] } | undefined)?.items ?? DEFAULTS.features;
  const features: Feature[] = Array.isArray(rawFeatures) ? rawFeatures : DEFAULTS.features;

  return (
    <>
      {/* Hero Section */}
      <Section
        spacing="xl"
        className="relative flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50"
      >
        <Container size="md" className="text-center space-y-8">
          {badgeText && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-700">{badgeText}</span>
            </div>
          )}

          <h1 className="text-display-lg font-serif text-neutral-900">{headline}</h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Layout F: HeroImage between subtitle and CTAs */}
          <HeroImage image={c.heroImage ?? null} />

          <div className="flex gap-4 justify-center flex-wrap">
            {primaryText && primaryLink && (
              <Link href={primaryLink}>
                <Button size="lg">{primaryText}</Button>
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
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-heading-1 font-serif text-neutral-900 mb-4">{featuresHeadline}</h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">{featuresSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-heading-3 font-serif text-neutral-900">{feature.title}</h3>
                <p className="text-body text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
