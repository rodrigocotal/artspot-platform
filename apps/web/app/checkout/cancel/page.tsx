'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { XCircle } from 'lucide-react';

function CheckoutCancelInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { data: session, status } = useSession();
  const [released, setReleased] = useState(false);
  const attempted = useRef(false);

  // Release the reservation that createCheckoutSession placed (artwork ->
  // RESERVED, cart cleared) so the user isn't locked out for 30 minutes and
  // their cart is restored. Safe/no-op if the order already paid.
  useEffect(() => {
    if (!orderId || status !== 'authenticated' || attempted.current) return;
    attempted.current = true;

    apiClient.setAccessToken(session?.accessToken ?? null);
    apiClient
      .cancelOrder(orderId)
      .then(() => setReleased(true))
      .catch(() => {
        // Even if release fails, the Stripe session expires in 30 min and the
        // expiry webhook releases the reservation — so don't alarm the user.
      });
  }, [orderId, status, session?.accessToken]);

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
          {released
            ? ' Your items are back in your cart, ready when you are.'
            : ' Your items remain available.'}
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

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCancelInner />
    </Suspense>
  );
}
