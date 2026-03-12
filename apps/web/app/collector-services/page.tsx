'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient } from '@/lib/api-client';

const DEFAULTS = {
  headline: 'Collector Services',
  subtitle: 'Personalized assistance for discerning collectors at every stage of their journey.',
  introContent: '',
  services: [
    {
      icon: '🔍',
      title: 'Art Advisory',
      description: 'Our expert advisors help you discover and acquire works that align with your vision, taste, and investment goals.',
    },
    {
      icon: '✓',
      title: 'Authentication & Provenance',
      description: 'Comprehensive verification services to ensure the authenticity and documented history of every piece.',
    },
    {
      icon: '🛡️',
      title: 'Insurance Guidance',
      description: 'Professional guidance on insuring your collection with specialized fine art insurance partners.',
    },
    {
      icon: '📦',
      title: 'White-Glove Shipping',
      description: 'Museum-standard packing, crating, and delivery for safe transportation of your artworks worldwide.',
    },
    {
      icon: '🖼️',
      title: 'Installation & Framing',
      description: 'Expert installation and custom framing services to present your collection at its finest.',
    },
    {
      icon: '📋',
      title: 'Collection Management',
      description: 'Digital cataloguing, condition reporting, and strategic planning for your growing collection.',
    },
  ],
};

export default function CollectorServicesPage() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    apiClient
      .getPageContent('collector-services')
      .then((res) => setContent({ ...DEFAULTS, ...res.data.content }))
      .catch(() => {});
  }, []);

  const rawServices = content.services?.items ?? content.services;
  const services = Array.isArray(rawServices) ? rawServices : DEFAULTS.services;

  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-display font-serif text-neutral-900 mb-4">{content.headline}</h1>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">{content.subtitle}</p>
          </div>

          {/* Intro content */}
          {content.introContent && (
            <div
              className="prose prose-neutral mx-auto mb-12 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: content.introContent }}
            />
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service: any) => (
              <div key={service.title} className="bg-white rounded-xl p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="text-heading-3 font-serif text-neutral-900">{service.title}</h3>
                <p className="text-body text-neutral-600">{service.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-white rounded-xl p-12">
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-4">
              Ready to Start Your Collection Journey?
            </h2>
            <p className="text-body-lg text-neutral-600 mb-6 max-w-xl mx-auto">
              Get in touch with our team to discuss how we can help you build and manage your art collection.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
