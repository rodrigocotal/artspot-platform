'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart3, Clock, Eye, MousePointerClick, Users } from 'lucide-react';
import { apiClient, type ActivityEvent, type ActivityEventType, type ActivitySummary } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

const EVENT_LABELS: Record<ActivityEventType, string> = {
  page_view: 'Page views',
  page_exit: 'Page exits',
  engagement: 'Engagement',
  click: 'Clicks',
  artwork_view: 'Artwork views',
  collection_view: 'Collection views',
  form_start: 'Form starts',
  form_submit: 'Form submits',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function AdminActivityPage() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [eventType, setEventType] = useState<ActivityEventType | ''>('');
  const [pathFilter, setPathFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      limit: 50,
      ...(eventType ? { eventType } : {}),
      ...(pathFilter ? { path: pathFilter } : {}),
    }),
    [eventType, pathFilter]
  );

  useEffect(() => {
    if (!session?.accessToken) return;

    const loadActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        apiClient.setAccessToken(session.accessToken as string);
        const [summaryResponse, eventsResponse] = await Promise.all([
          apiClient.getActivitySummary(),
          apiClient.getActivityEvents(filters),
        ]);
        setSummary(summaryResponse.data);
        setEvents(eventsResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [filters, session?.accessToken]);

  const statCards = [
    { label: 'Events', value: summary?.totalEvents ?? 0, icon: BarChart3 },
    { label: 'Page Views', value: summary?.pageViews ?? 0, icon: Eye },
    { label: 'Sessions', value: summary?.uniqueSessions ?? 0, icon: Users },
    { label: 'Last 30 Days', value: summary?.windowDays ?? 30, icon: Clock },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display font-serif text-neutral-900 mb-2">User Activity</h1>
        <p className="text-body-lg text-neutral-600">
          Track page views, engagement, sessions, and recent visitor behavior.
        </p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary-50">
                <card.icon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-neutral-500">{card.label}</span>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-neutral-900">{card.value.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-6">
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Pages</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(summary?.topPages ?? []).map((page) => (
                <div key={page.path} className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-neutral-700">{page.path}</span>
                  <span className="font-semibold text-neutral-900">{page.count}</span>
                </div>
              ))}
              {summary?.topPages.length === 0 && (
                <p className="text-sm text-neutral-500">No page views tracked yet.</p>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Recent Events</h2>
              <p className="text-sm text-neutral-500">Latest 50 matching activity events.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value as ActivityEventType | '')}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="">All events</option>
                {Object.entries(EVENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                value={pathFilter}
                onChange={(event) => setPathFilter(event.target.value)}
                placeholder="Filter path"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {events.map((event) => (
                <div key={event.id} className="py-3 flex items-start gap-3">
                  <MousePointerClick className="w-4 h-4 text-neutral-400 mt-1" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        {EVENT_LABELS[event.eventType] ?? event.eventType}
                      </span>
                      <span className="text-xs text-neutral-400">{formatDate(event.createdAt)}</span>
                    </div>
                    <p className="text-sm text-neutral-600 truncate">{event.path}</p>
                    {event.user && (
                      <p className="text-xs text-neutral-400">
                        {event.user.name || event.user.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="py-8 text-sm text-neutral-500 text-center">No activity events found.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
