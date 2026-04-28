'use client';

import { Container, Section } from '@/components/layout';
import { HeroImage } from '@/components/hero-image';
import type { ImageFieldValue } from '@/lib/seo';

interface CollectionLandingContent {
  headline?: string;
  subtitle?: string;
  heroImage?: ImageFieldValue | null;
}

interface CollectionLandingProps {
  content: Record<string, any> | null;
  defaults: { headline: string; subtitle: string };
}

export function CollectionLanding({ content, defaults }: CollectionLandingProps) {
  const merged: CollectionLandingContent = { ...defaults, ...(content ?? {}) };

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-display font-serif text-neutral-900">{merged.headline}</h1>
          {merged.subtitle && (
            <p className="text-body-lg text-neutral-600 leading-relaxed">{merged.subtitle}</p>
          )}
          <HeroImage image={merged.heroImage ?? null} />
        </div>
      </Container>
    </Section>
  );
}
