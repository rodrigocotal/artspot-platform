'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type AdminOrder } from '@/lib/api-client';
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning-100 text-warning-800 border-warning-300',
  PAID: 'bg-success-100 text-success-800 border-success-300',
  CANCELLED: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  REFUNDED: 'bg-info-100 text-info-800 border-info-300',
  FAILED: 'bg-error-100 text-error-800 border-error-300',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        ORDER_STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-700 border-neutral-300'
      )}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const params: Record<string, any> = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const response = await apiClient.getAdminOrders(params);
      setOrders(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchOrders(1);
    }
  }, [session?.accessToken, statusFilter]);

  const handleSearch = () => fetchOrders(1);

  const handleStatusChange = async (orderId: string, status: string) => {
    if (
      !confirm(
        `Are you sure you want to ${status === 'CANCELLED' ? 'cancel' : 'refund'} this order?`
      )
    )
      return;

    setActionLoading(orderId);
    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.updateAdminOrderStatus(orderId, { status });
      fetchOrders(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display font-serif text-neutral-900 mb-2">
          Order Management
        </h1>
        <p className="text-body-lg text-neutral-600">
          View and manage all orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {['', 'PENDING', 'PAID', 'CANCELLED', 'REFUNDED'].map((value) => (
            <Button
              key={value}
              variant={statusFilter === value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(value)}
            >
              {value || 'All'}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, email, or name..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" size="md" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {!loading && orders.length > 0 && (
        <p className="text-sm text-neutral-600 mb-4">
          {pagination.total} {pagination.total === 1 ? 'order' : 'orders'} found
        </p>
      )}

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">
                No orders found
              </h2>
              <p className="text-neutral-600">
                {statusFilter
                  ? `No ${statusFilter.toLowerCase()} orders.`
                  : 'No orders have been placed yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const isExpanded = expandedId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-medium text-neutral-900">
                            {order.orderNumber}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-neutral-500 truncate">
                          {order.customerName || order.customerEmail} &middot;{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          &middot; ${parseFloat(order.subtotal).toLocaleString()}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-neutral-200 p-4 space-y-4">
                        {/* Customer info */}
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-neutral-500">Customer: </span>
                            <span className="text-neutral-900">
                              {order.customerName || '—'}
                            </span>
                          </p>
                          <p>
                            <span className="text-neutral-500">Email: </span>
                            <a
                              href={`mailto:${order.customerEmail}`}
                              className="text-primary-600 hover:underline"
                            >
                              {order.customerEmail}
                            </a>
                          </p>
                        </div>

                        {/* Order items */}
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                            Items
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center bg-neutral-50 rounded-lg p-3"
                              >
                                <div>
                                  <p className="font-medium text-neutral-900">
                                    {item.title}
                                  </p>
                                  <p className="text-sm text-neutral-500">
                                    {item.artistName}
                                  </p>
                                </div>
                                <p className="font-medium text-neutral-900">
                                  ${parseFloat(item.price).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-neutral-100">
                          {order.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                              loading={actionLoading === order.id}
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel Order
                            </Button>
                          )}
                          {order.status === 'PAID' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(order.id, 'REFUNDED')}
                              loading={actionLoading === order.id}
                            >
                              <RotateCcw className="w-4 h-4" />
                              Mark Refunded
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => fetchOrders(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm text-neutral-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => fetchOrders(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
