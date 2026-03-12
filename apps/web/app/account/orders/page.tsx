'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient, type Order } from '@/lib/api-client';
import { Package, LogIn, Loader2 } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Paid', className: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  CANCELLED: { label: 'Cancelled', className: 'bg-neutral-100 text-neutral-600' },
  REFUNDED: { label: 'Refunded', className: 'bg-blue-100 text-blue-800' },
};

export default function OrdersPage() {
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchOrders = async () => {
      setLoading(true);
      apiClient.setAccessToken(session.accessToken ?? null);
      try {
        const res = await apiClient.getOrders({ page, limit: 10 });
        setOrders(res.data);
        setTotalPages(res.pagination?.totalPages ?? 1);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.accessToken, page]);

  if (authStatus === 'loading') {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="lg" className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </Container>
      </Section>
    );
  }

  if (!session?.user) {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="md" className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-heading-1 font-serif text-neutral-900 mb-4">Sign In Required</h1>
          <p className="text-body-lg text-neutral-600 mb-6">
            Please sign in to view your orders.
          </p>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </Container>
      </Section>
    );
  }

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
    });

  return (
    <Section spacing="lg" background="neutral">
      <Container size="lg">
        <h1 className="text-display font-serif text-neutral-900 mb-8">Order History</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-4">No Orders Yet</h2>
            <p className="text-body-lg text-neutral-600 mb-6">
              Your order history will appear here.
            </p>
            <Link href="/artworks">
              <Button size="lg">Browse Artworks</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-heading-4 font-serif text-neutral-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">{formatDate(order.createdAt)}</p>
                      <p className="text-sm text-neutral-600 mt-1">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot;{' '}
                        {order.items.map((i) => i.title).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-serif text-neutral-900 tabular-nums">
                        {formatPrice(order.subtotal, order.currency)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
