'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient, type Article } from '@/lib/api-client';
import { ArrowRight, Calendar, User, Loader2 } from 'lucide-react';

const DEFAULTS = {
  headline: 'Discover',
  subtitle: 'Explore the world of art through our editorial content, exhibitions, and curated inspiration.',
};

const sections = [
  {
    title: 'Editorial',
    description: 'Stories, spotlights, and insights from the art world',
    href: '/discover/editorial',
  },
  {
    title: 'Inspiration',
    description: 'Behind-the-scenes looks at artists and their creative process',
    href: '/discover/inspiration',
  },
  {
    title: 'Exhibitions',
    description: 'Current and upcoming exhibitions featuring our artists',
    href: '/discover/exhibitions',
  },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DiscoverPage() {
  const [content, setContent] = useState(DEFAULTS);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getPageContent('discover')
      .then((res) => setContent({ ...DEFAULTS, ...res.data.content }))
      .catch(() => {});

    apiClient
      .getFeaturedArticles(6)
      .then((res) => setArticles(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-display font-serif text-neutral-900 mb-4">{content.headline}</h1>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">{content.subtitle}</p>
          </div>

          {/* Section Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group bg-white rounded-xl p-8 hover:shadow-md transition-shadow"
              >
                <h3 className="text-heading-3 font-serif text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-body text-neutral-600 mb-4">{section.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>

          {/* Featured Articles */}
          <div className="mb-8">
            <h2 className="text-heading-1 font-serif text-neutral-900 mb-2">Featured Stories</h2>
            <p className="text-body-lg text-neutral-600">Highlights from our editorial team</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">No featured articles yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/discover/editorial/${article.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
                        <span className="text-neutral-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-heading-4 font-serif text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-body text-neutral-600 line-clamp-2 mb-3">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                      {article.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {article.author}
                        </span>
                      )}
                      {article.publishedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(article.publishedDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View all link */}
          {articles.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/discover/editorial">
                <Button variant="outline" size="lg">View All Articles</Button>
              </Link>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
