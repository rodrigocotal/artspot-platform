'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient, type Order } from '@/lib/api-client';
import { CheckCircle2, Package, Loader2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to allow webhook to process
    const timer = setTimeout(async () => {
      if (!session?.accessToken) {
        setLoading(false);
        return;
      }

      apiClient.setAccessToken(session.accessToken ?? null);

      try {
        const res = await apiClient.getOrders({ limit: 1 });
        if (res.data && res.data.length > 0) {
          setOrder(res.data[0]);
        }
      } catch {
        // Order might not be updated yet
      } finally {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [session?.accessToken, sessionId]);

  const formatPrice = (price: string, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));

  return (
    <Section spacing="lg" background="neutral">
      <Container size="md" className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-display font-serif text-neutral-900 mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-body-lg text-neutral-600 mb-8">
          Your order has been confirmed. You will receive an email confirmation shortly.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin mr-2" />
            <span className="text-neutral-600">Loading order details...</span>
          </div>
        ) : order ? (
          <div className="bg-white rounded-xl p-6 text-left mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-500">Order {order.orderNumber}</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                    <p className="text-xs text-neutral-600">by {item.artistName}</p>
                  </div>
                  <p className="text-sm text-neutral-900 tabular-nums">
                    {formatPrice(item.price, item.currency)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4 border-neutral-200" />

            <div className="flex justify-between font-serif">
              <span className="text-neutral-900">Total</span>
              <span className="text-neutral-900 tabular-nums">
                {formatPrice(order.subtotal, order.currency)}
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account/orders">
            <Button size="lg" variant="outline">View Orders</Button>
          </Link>
          <Link href="/artworks">
            <Button size="lg">Continue Browsing</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
