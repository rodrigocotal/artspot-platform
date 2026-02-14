export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="font-serif text-display text-neutral-900">
            ArtSpot
          </h1>
          <p className="font-serif text-heading-4 text-neutral-600 italic">
            Atelier ArtSpot
          </p>
        </div>

        {/* Tagline */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-serif text-heading-2 text-neutral-800">
            Elevating the Experience of Collecting Art Online
          </h2>
          <p className="text-body-lg text-neutral-600 leading-relaxed">
            We believe collecting art goes beyond ownership or decoration—it is valued as a personal,
            intellectual, and emotional asset. Our platform prioritizes curation and expertise guided
            by institutional standards and values based on honesty and trust.
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-primary-700">
            Platform in Development - Phase 1
          </span>
        </div>

        {/* Tech Stack Info */}
        <div className="pt-8 border-t border-neutral-200">
          <p className="text-body-sm text-neutral-500 mb-4">
            Built with Next.js 15 + React 19 + TypeScript + Tailwind CSS
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
              <svg className="w-2 h-2 fill-current" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" />
              </svg>
              Development Server Running
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
