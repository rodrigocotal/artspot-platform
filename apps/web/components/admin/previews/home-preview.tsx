'use client';

interface HomePreviewProps {
  content: Record<string, any>;
}

export function HomePreview({ content }: HomePreviewProps) {
  const rawFeatures = content.features?.items ?? content.features;
  const features = Array.isArray(rawFeatures) ? rawFeatures : [];

  return (
    <div className="bg-white min-h-[600px] font-sans text-sm">
      {/* Hero */}
      <div className="bg-gradient-to-br from-neutral-100 to-neutral-50 py-12 px-6 text-center space-y-4">
        {content.heroBadgeText && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
            <span className="text-xs font-medium text-primary-700">
              {content.heroBadgeText}
            </span>
          </div>
        )}
        <h1 className="text-2xl font-serif text-neutral-900">
          {content.heroHeadline || 'Headline'}
        </h1>
        <p className="text-neutral-600 max-w-md mx-auto text-xs leading-relaxed">
          {content.heroSubtitle}
        </p>
        <div className="flex gap-2 justify-center">
          {content.heroCtaText && (
            <span className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium">
              {content.heroCtaText}
            </span>
          )}
          {content.heroSecondaryCtaText && (
            <span className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-medium">
              {content.heroSecondaryCtaText}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      {(content.featuresHeadline || features.length > 0) && (
        <div className="py-10 px-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-serif text-neutral-900 mb-1">
              {content.featuresHeadline}
            </h2>
            <p className="text-xs text-neutral-600">{content.featuresSubtitle}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {features.map((f: any, i: number) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                  <span className="text-base">{f.icon || '?'}</span>
                </div>
                <h3 className="text-xs font-semibold text-neutral-900">{f.title}</h3>
                <p className="text-[10px] text-neutral-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
