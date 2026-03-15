'use client';

interface GenericPreviewProps {
  content: Record<string, any>;
}

export function GenericPreview({ content }: GenericPreviewProps) {
  const arrayFields = Object.entries(content).filter(
    ([, value]) => Array.isArray(value) || (value && typeof value === 'object' && Array.isArray(value.items))
  );

  return (
    <div className="bg-white min-h-[400px] font-sans text-sm p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-neutral-900 mb-2">
          {content.headline || content.title || 'Page Preview'}
        </h1>
        {content.subtitle && (
          <p className="text-xs text-neutral-600 max-w-md mx-auto">{content.subtitle}</p>
        )}
      </div>

      {content.introContent && (
        <p className="text-xs text-neutral-600 mb-6 whitespace-pre-line">{content.introContent}</p>
      )}

      {arrayFields.map(([key, value]) => {
        const items = Array.isArray(value) ? value : value.items || [];
        return (
          <div key={key} className="grid grid-cols-2 gap-3 mb-4">
            {items.map((item: any, i: number) => (
              <div key={i} className="border border-neutral-200 rounded-lg p-3">
                {item.icon && (
                  <span className="text-lg mb-1 block">{item.icon}</span>
                )}
                <h3 className="text-xs font-semibold text-neutral-900 mb-1">
                  {item.title || item.label || `Item ${i + 1}`}
                </h3>
                {item.description && (
                  <p className="text-[10px] text-neutral-600">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
