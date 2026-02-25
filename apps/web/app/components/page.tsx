import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

const components = [
  {
    name: 'Filters & Search',
    description: 'Complete filtering system with search input, checkboxes, price range, and sort dropdown',
    href: '/components/filters',
    status: 'Ready',
  },
  {
    name: 'Image Zoom',
    description: 'High-resolution artwork viewer with 3.0x zoom and pan functionality',
    href: '/components/image-zoom',
    status: 'Ready',
  },
  {
    name: 'Button',
    description: 'Primary, secondary, outline, ghost, and link variants with loading states',
    href: '#',
    status: 'Ready',
  },
  {
    name: 'Card',
    description: 'Composable card component with header, content, and footer sections',
    href: '#',
    status: 'Ready',
  },
  {
    name: 'Form Inputs',
    description: 'Input, textarea, and label components with error states',
    href: '#',
    status: 'Ready',
  },
];

export default function ComponentsPage() {
  return (
    <>
      <Section spacing="xl" background="neutral">
        <Container size="lg">
          <div className="mb-12">
            <h1 className="text-display font-serif text-neutral-900 mb-4">
              Component Library
            </h1>
            <p className="text-body-lg text-neutral-600 max-w-3xl">
              Luxury-themed UI components built for the ArtSpot marketplace. All components
              follow our design system with consistent styling, accessibility, and responsive behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Link key={component.name} href={component.href} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="group-hover:text-primary-600 transition-colors">
                        {component.name}
                      </CardTitle>
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded">
                        {component.status}
                      </span>
                    </div>
                    <CardDescription>{component.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-medium group-hover:gap-3 transition-all">
                      View demo
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 p-8 bg-white rounded-lg border border-neutral-200">
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-4">
              Design System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-3">
                <h3 className="font-medium text-neutral-900">Color Palette</h3>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded bg-primary-500 border border-neutral-200" title="Primary Gold" />
                  <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-200" title="Dark" />
                  <div className="w-12 h-12 rounded bg-neutral-50 border border-neutral-200" title="Light" />
                  <div className="w-12 h-12 rounded bg-white border border-neutral-200" title="White" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-neutral-900">Typography</h3>
                <p className="text-neutral-600">
                  <span className="font-serif font-medium">Cormorant Garamond</span> for headings,{' '}
                  <span className="font-sans font-medium">Inter</span> for body text
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
