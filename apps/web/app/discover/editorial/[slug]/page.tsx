'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  apiClient,
  type Article,
  type ArticleCategory,
} from '@/lib/api-client';
import { Loader2, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';

const categoryColors: Record<ArticleCategory, string> = {
  ARTIST_SPOTLIGHT: 'bg-purple-100 text-purple-800',
  EXHIBITION: 'bg-blue-100 text-blue-800',
  BEHIND_THE_SCENES: 'bg-amber-100 text-amber-800',
  NEWS: 'bg-green-100 text-green-800',
  GUIDE: 'bg-teal-100 text-teal-800',
};

const categoryLabels: Record<ArticleCategory, string> = {
  ARTIST_SPOTLIGHT: 'Artist Spotlight',
  EXHIBITION: 'Exhibition',
  BEHIND_THE_SCENES: 'Behind the Scenes',
  NEWS: 'News',
  GUIDE: 'Guide',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getArticle(slug);
        setArticle(response.data);

        // Fetch related articles (same category)
        if (response.data.category) {
          const relatedResponse = await apiClient.getArticles({
            category: response.data.category,
            limit: 4,
            sortBy: 'publishedDate',
            sortOrder: 'desc',
          });
          setRelatedArticles(
            relatedResponse.data.filter((a) => a.slug !== slug).slice(0, 3)
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <Section spacing="lg">
        <Container>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !article) {
    return (
      <Section spacing="lg">
        <Container>
          <div className="text-center py-20">
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-4">
              {error || 'Article not found'}
            </h2>
            <Link href="/discover/editorial">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editorial
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Cover Image */}
      {article.coverImageUrl && (
        <div className="relative h-[300px] md:h-[450px] overflow-hidden">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <Section spacing="lg">
        <Container size="md">
          {/* Back Link */}
          <Link
            href="/discover/editorial"
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editorial
          </Link>

          {/* Article Header */}
          <header className="mb-10">
            {article.category && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors[article.category]}`}
              >
                {categoryLabels[article.category]}
              </span>
            )}

            <h1 className="text-display-lg font-serif text-neutral-900 mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-body-lg text-neutral-600 mb-6">{article.excerpt}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-neutral-500 border-b border-neutral-200 pb-6">
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
              )}
              {article.publishedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedDate)}
                </span>
              )}
            </div>
          </header>

          {/* Article Content */}
          <article
            className="prose prose-lg prose-neutral max-w-none mb-16
              prose-headings:font-serif prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </Container>
      </Section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Section spacing="lg" background="neutral">
          <Container size="xl">
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/discover/editorial/${related.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {related.coverImageUrl ? (
                      <Image
                        src={related.coverImageUrl}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-200" />
                    )}
                  </div>
                  <div className="p-5">
                    {related.category && (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${categoryColors[related.category]}`}
                      >
                        {categoryLabels[related.category]}
                      </span>
                    )}
                    <h3 className="text-heading-4 font-serif text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {related.title}
                    </h3>
                    {related.publishedDate && (
                      <p className="text-sm text-neutral-500 mt-2">
                        {formatDate(related.publishedDate)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-3">
                      Read more
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
