import { Button } from '@/components/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full mb-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary-700">
              Platform in Development - Phase 1
            </span>
          </div>

          <h1 className="text-display-lg font-serif text-neutral-900">
            Discover Museum-Quality Art
          </h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Elevating the Experience of Collecting Art Online. We believe collecting art
            goes beyond ownership—it is valued as a personal, intellectual, and emotional asset.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/artworks">
              <Button size="lg">Explore Collection</Button>
            </Link>
            <Link href="/artists">
              <Button size="lg" variant="outline">
                Browse Artists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-heading-1 font-serif text-neutral-900 mb-4">
              Why Collectors Choose ArtSpot
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
              A premium platform designed for serious art collectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-heading-3 font-serif text-neutral-900">
                Curated Selection
              </h3>
              <p className="text-body text-neutral-600">
                Every artwork is carefully selected by our team of art experts guided
                by institutional standards
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-heading-3 font-serif text-neutral-900">
                Authenticity Guaranteed
              </h3>
              <p className="text-body text-neutral-600">
                Certificates of authenticity and provenance for all works based on
                honesty and trust
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-heading-3 font-serif text-neutral-900">
                Collector Services
              </h3>
              <p className="text-body text-neutral-600">
                Personalized assistance and art advisory services for discerning
                collectors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Info */}
      <section className="py-12 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-body-sm text-neutral-500">
            Built with Next.js 15 + React 19 + TypeScript + Tailwind CSS
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/components">
              <Button variant="ghost" size="sm">
                View Components →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

