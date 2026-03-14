'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  DollarSign,
  ShoppingBag,
  Mail,
  Image,
  Users,
  TrendingUp,
} from 'lucide-react';
import { apiClient, type AdminStats } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

const STAT_CARDS = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: DollarSign, format: 'currency' },
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingBag, format: 'number' },
  { key: 'pendingInquiries', label: 'Pending Inquiries', icon: Mail, format: 'number' },
  { key: 'totalArtworks', label: 'Total Artworks', icon: Image, format: 'number' },
  { key: 'totalUsers', label: 'Total Users', icon: Users, format: 'number' },
  { key: 'recentOrders', label: 'Orders (30d)', icon: TrendingUp, format: 'number' },
] as const;

function formatValue(value: number | string, format: string) {
  if (format === 'currency') {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
  return value.toLocaleString();
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchStats = async () => {
      try {
        apiClient.setAccessToken(session.accessToken!);
        const response = await apiClient.getAdminStats();
        setStats(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session?.accessToken]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display font-serif text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-body-lg text-neutral-600">Overview of your gallery</p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary-50">
                <card.icon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-neutral-500">
                {card.label}
              </span>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : stats ? (
              <p className="text-2xl font-bold text-neutral-900">
                {formatValue(stats[card.key], card.format)}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
