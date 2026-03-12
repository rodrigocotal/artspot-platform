'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient, type Order } from '@/lib/api-client';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Paid', className: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  CANCELLED: { label: 'Cancelled', className: 'bg-neutral-100 text-neutral-600' },
  REFUNDED: { label: 'Refunded', className: 'bg-blue-100 text-blue-800' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken || !orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      apiClient.setAccessToken(session.accessToken ?? null);
      try {
        const res = await apiClient.getOrder(orderId);
        setOrder(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [session?.accessToken, orderId]);

  const formatPrice = (price: string, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="lg" className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        </Container>
      </Section>
    );
  }

  if (error || !order) {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="md" className="text-center py-20">
          <p className="text-neutral-600 mb-4">{error || 'Order not found'}</p>
          <Link href="/account/orders">
            <Button>Back to Orders</Button>
          </Link>
        </Container>
      </Section>
    );
  }

  const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;

  return (
    <Section spacing="lg" background="neutral">
      <Container size="lg">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <h1 className="text-display font-serif text-neutral-900">
            {order.orderNumber}
          </h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.className}`}
          >
            {statusInfo.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            {order.items.map((item) => {
              const image = item.artwork?.images?.[0];
              return (
                <div key={item.id} className="bg-white rounded-xl p-4 flex gap-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100">
                    {image ? (
                      <img
                        src={image.secureUrl || image.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-heading-4 font-serif text-neutral-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-neutral-600">by {item.artistName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-serif text-neutral-900 tabular-nums">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-4">Order Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Order Date</span>
                  <span className="text-neutral-900">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Items</span>
                  <span className="text-neutral-900">{order.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <hr className="my-4 border-neutral-200" />
              <div className="flex justify-between text-lg font-serif">
                <span className="text-neutral-900">Total</span>
                <span className="text-neutral-900 tabular-nums">
                  {formatPrice(order.subtotal, order.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
