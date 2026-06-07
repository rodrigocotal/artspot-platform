'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Input } from '@/components/ui';
import { apiClient, type ContactMessage } from '@/lib/api-client';
import { Loader2, Mail, ChevronDown, ChevronUp, Check, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-warning-100 text-warning-800 border-warning-300',
  READ: 'bg-info-100 text-info-800 border-info-300',
  ARCHIVED: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-700 border-neutral-300'
      )}
    >
      {status}
    </span>
  );
}

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const params: Record<string, any> = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const response = await apiClient.getAdminContactMessages(params);
      setMessages(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchMessages(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, statusFilter]);

  const handleSearch = () => {
    fetchMessages(1);
  };

  const updateStatus = async (id: string, status: 'READ' | 'ARCHIVED') => {
    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.updateContactMessage(id, { status });
      fetchMessages(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display font-serif text-neutral-900 mb-2">Contact Messages</h1>
        <p className="text-body-lg text-neutral-600">
          Messages submitted through the public contact form
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {['', 'NEW', 'READ', 'ARCHIVED'].map((value) => (
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
            placeholder="Search by name, email or subject..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" size="md" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* Summary */}
      {!loading && messages.length > 0 && (
        <p className="text-sm text-neutral-600 mb-4">
          {pagination.total} {pagination.total === 1 ? 'message' : 'messages'} found
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <Mail className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">No messages found</h2>
              <p className="text-neutral-600">
                {statusFilter
                  ? `No ${statusFilter.toLowerCase()} messages.`
                  : 'No contact messages have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => {
                const isExpanded = expandedId === message.id;

                return (
                  <div
                    key={message.id}
                    className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
                  >
                    {/* Summary Row */}
                    <button
                      onClick={() => {
                        const opening = !isExpanded;
                        setExpandedId(opening ? message.id : null);
                        if (opening && message.status === 'NEW') {
                          updateStatus(message.id, 'READ');
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-neutral-900 truncate">{message.name}</span>
                          <StatusBadge status={message.status} />
                        </div>
                        <p className="text-sm text-neutral-500 truncate">
                          {message.subject || 'General enquiry'} &middot;{' '}
                          {new Date(message.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                      )}
                    </button>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="border-t border-neutral-200 p-4 space-y-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <a
                            href={`mailto:${message.email}`}
                            className="inline-flex items-center gap-1.5 text-primary-600 hover:underline"
                          >
                            <Mail className="w-4 h-4" />
                            {message.email}
                          </a>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Message</p>
                          <p className="text-body text-neutral-700 whitespace-pre-line bg-neutral-50 rounded-lg p-3">
                            {message.message}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(message.id, 'READ')}
                            disabled={message.status === 'READ'}
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Mark Read
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(message.id, 'ARCHIVED')}
                            disabled={message.status === 'ARCHIVED'}
                          >
                            <Archive className="w-4 h-4 mr-1.5" />
                            Archive
                          </Button>
                          <a
                            href={`mailto:${message.email}?subject=${encodeURIComponent(
                              'Re: ' + (message.subject || 'Your message to ArtAldo')
                            )}`}
                          >
                            <Button variant="primary" size="sm">
                              Reply by Email
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchMessages(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-neutral-600 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchMessages(pagination.page + 1)}
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
