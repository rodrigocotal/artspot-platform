import { Container, Section } from '@/components/layout';
import { ImageZoom } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ImageZoomDemo() {
  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="lg">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="mb-12">
            <h1 className="text-heading-1 font-serif text-neutral-900 mb-4">
              Image Zoom Component
            </h1>
            <p className="text-body-lg text-neutral-600 max-w-3xl">
              High-resolution artwork viewer with 3.0x zoom capability. Click on any image to
              zoom in, then move your mouse to explore details. Click again to zoom out.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Portrait Example */}
            <div className="space-y-4">
              <h2 className="text-heading-3 font-serif text-neutral-900">
                Portrait Artwork (3:4 ratio)
              </h2>
              <ImageZoom
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=1600&fit=crop"
                alt="Abstract painting with warm tones"
                width={900}
                height={1200}
                priority
              />
              <p className="text-sm text-neutral-600">
                Typical portrait-oriented painting format. Optimized for vertical artworks.
              </p>
            </div>

            {/* Landscape Example */}
            <div className="space-y-4">
              <h2 className="text-heading-3 font-serif text-neutral-900">
                Landscape Artwork (4:3 ratio)
              </h2>
              <ImageZoom
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&h=1200&fit=crop"
                alt="Contemporary sculpture installation"
                width={1200}
                height={900}
              />
              <p className="text-sm text-neutral-600">
                Landscape-oriented format. Common for sculptures and wide installations.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg p-8 space-y-6">
            <h2 className="text-heading-2 font-serif text-neutral-900">
              Features & Usage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                  <span className="text-xl">🔍</span>
                </div>
                <h3 className="font-medium text-neutral-900">3.0x Zoom</h3>
                <p className="text-sm text-neutral-600">
                  Magnify artworks up to 3 times their original size for detailed inspection.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                  <span className="text-xl">👆</span>
                </div>
                <h3 className="font-medium text-neutral-900">Touch Support</h3>
                <p className="text-sm text-neutral-600">
                  Works seamlessly on touch devices. Touch and drag to explore zoomed images.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-medium text-neutral-900">Optimized Performance</h3>
                <p className="text-sm text-neutral-600">
                  Built on Next.js Image for automatic optimization and lazy loading.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-heading-4 font-serif text-neutral-900 mb-4">Code Example</h3>
              <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`import { ImageZoom } from '@/components/ui';

<ImageZoom
  src="/artworks/painting-001.jpg"
  alt="Contemporary abstract painting"
  width={900}
  height={1200}
  maxZoom={3}
  priority
/>`}</code>
              </pre>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
