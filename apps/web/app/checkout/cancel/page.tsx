'use client';

import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <Section spacing="lg" background="neutral">
      <Container size="md" className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-neutral-500" />
        </div>

        <h1 className="text-display font-serif text-neutral-900 mb-4">
          Checkout Cancelled
        </h1>
        <p className="text-body-lg text-neutral-600 mb-8">
          Your checkout was cancelled and you have not been charged.
          The items in your cart are still available.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <Button size="lg">Return to Cart</Button>
          </Link>
          <Link href="/artworks">
            <Button size="lg" variant="outline">Browse Artworks</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
