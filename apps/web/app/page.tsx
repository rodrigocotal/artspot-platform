import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container, Section } from '@/components/layout';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section
        spacing="xl"
        className="relative flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50"
      >
        <Container size="md" className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700">
              Platform in Development — Phase 1
            </span>
          </div>

          <h1 className="text-display-lg font-serif text-neutral-900">
            Discover Museum-Quality Art
          </h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Elevating the experience of collecting art online. We believe collecting art
            goes beyond ownership—it is valued as a personal, intellectual, and emotional asset.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/artworks">
              <Button size="lg">Explore Collection</Button>
            </Link>
            <Link href="/artists">
              <Button size="lg" variant="outline">Browse Artists</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-heading-1 font-serif text-neutral-900 mb-4">
              Why Collectors Choose ArtSpot
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
              A premium platform designed for serious art collectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
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
            ].map((feature) => (
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
