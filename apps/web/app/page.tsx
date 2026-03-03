'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container, Section } from '@/components/layout';
import { apiClient } from '@/lib/api-client';

const DEFAULTS = {
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

export default function HomePage() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    apiClient
      .getPageContent('home')
      .then((res) => {
        setContent({ ...DEFAULTS, ...res.data.content });
      })
      .catch(() => {
        // CMS unreachable — keep defaults
      });
  }, []);

  const rawFeatures = content.features?.items ?? content.features;
  const features = Array.isArray(rawFeatures) ? rawFeatures : DEFAULTS.features;

  return (
    <>
      {/* Hero Section */}
      <Section
        spacing="xl"
        className="relative flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50"
      >
        <Container size="md" className="text-center space-y-8">
          {content.heroBadgeText && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-700">
                {content.heroBadgeText}
              </span>
            </div>
          )}

          <h1 className="text-display-lg font-serif text-neutral-900">
            {content.heroHeadline}
          </h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {content.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={content.heroPrimaryCtaLink}>
              <Button size="lg">{content.heroPrimaryCta}</Button>
            </Link>
            <Link href={content.heroSecondaryCtaLink}>
              <Button size="lg" variant="outline">{content.heroSecondaryCta}</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-heading-1 font-serif text-neutral-900 mb-4">
              {content.featuresHeadline}
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
              {content.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature: any) => (
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
