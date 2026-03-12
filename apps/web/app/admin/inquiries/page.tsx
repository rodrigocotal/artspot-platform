'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button, Input, Textarea } from '@/components/ui';
import { apiClient, type Inquiry } from '@/lib/api-client';
import { Loader2, Mail, Phone, ChevronDown, ChevronUp, Send, XCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning-100 text-warning-800 border-warning-300',
  RESPONDED: 'bg-info-100 text-info-800 border-info-300',
  CLOSED: 'bg-success-100 text-success-800 border-success-300',
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

export default function AdminInquiriesPage() {
  const { data: session } = useSession();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const isAuthorized =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'GALLERY_STAFF';

  const fetchInquiries = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const params: Record<string, any> = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const response = await apiClient.getAdminInquiries(params);
      setInquiries(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken && isAuthorized) {
      fetchInquiries(1);
    } else if (session && !isAuthorized) {
      setLoading(false);
    }
  }, [session?.accessToken, statusFilter]);

  const handleSearch = () => {
    fetchInquiries(1);
  };

  const handleRespond = async (inquiryId: string) => {
    if (!responseText.trim()) return;
    setResponding(true);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      await apiClient.respondToInquiry(inquiryId, {
        response: responseText.trim(),
        status: 'RESPONDED',
      });

      setResponseText('');
      setExpandedId(null);
      fetchInquiries(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send response');
    } finally {
      setResponding(false);
    }
  };

  const handleClose = async (inquiryId: string) => {
    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      await apiClient.respondToInquiry(inquiryId, { status: 'CLOSED' });
      fetchInquiries(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close inquiry');
    }
  };

  // Access denied for non-admin/staff
  if (session && !isAuthorized) {
    return (
      <Section spacing="lg" background="neutral">
        <Container>
          <div className="text-center py-20">
            <ShieldAlert className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <h1 className="text-heading-2 font-serif text-neutral-900 mb-2">
              Access Denied
            </h1>
            <p className="text-neutral-600 mb-6">
              You don&apos;t have permission to view this page.
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display font-serif text-neutral-900 mb-2">
            Inquiry Management
          </h1>
          <p className="text-body-lg text-neutral-600">
            View and respond to customer inquiries
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2">
            {['', 'PENDING', 'RESPONDED', 'CLOSED'].map((value) => (
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
              placeholder="Search by name or email..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline" size="md" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* Summary */}
        {!loading && inquiries.length > 0 && (
          <p className="text-sm text-neutral-600 mb-4">
            {pagination.total} {pagination.total === 1 ? 'inquiry' : 'inquiries'} found
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
            {inquiries.length === 0 ? (
              <div className="text-center py-20">
                <Mail className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">
                  No inquiries found
                </h2>
                <p className="text-neutral-600">
                  {statusFilter
                    ? `No ${statusFilter.toLowerCase()} inquiries.`
                    : 'No inquiries have been submitted yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry) => {
                  const isExpanded = expandedId === inquiry.id;

                  return (
                    <div
                      key={inquiry.id}
                      className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
                    >
                      {/* Summary Row */}
                      <button
                        onClick={() => {
                          setExpandedId(isExpanded ? null : inquiry.id);
                          setResponseText('');
                        }}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium text-neutral-900 truncate">
                              {inquiry.name}
                            </span>
                            <StatusBadge status={inquiry.status} />
                          </div>
                          <p className="text-sm text-neutral-500 truncate">
                            {inquiry.artwork?.title ?? 'Unknown artwork'} &middot;{' '}
                            {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
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
                          {/* Contact Info */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="inline-flex items-center gap-1.5 text-primary-600 hover:underline"
                            >
                              <Mail className="w-4 h-4" />
                              {inquiry.email}
                            </a>
                            {inquiry.phone && (
                              <a
                                href={`tel:${inquiry.phone}`}
                                className="inline-flex items-center gap-1.5 text-primary-600 hover:underline"
                              >
                                <Phone className="w-4 h-4" />
                                {inquiry.phone}
                              </a>
                            )}
                          </div>

                          {/* Artwork Link */}
                          {inquiry.artwork && (
                            <div className="text-sm">
                              <span className="text-neutral-500">Artwork: </span>
                              <Link
                                href={`/artworks/${inquiry.artwork.slug}`}
                                className="text-primary-600 hover:underline"
                              >
                                {inquiry.artwork.title}
                              </Link>
                            </div>
                          )}

                          {/* Message */}
                          <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                              Message
                            </p>
                            <p className="text-body text-neutral-700 whitespace-pre-line bg-neutral-50 rounded-lg p-3">
                              {inquiry.message}
                            </p>
                          </div>

                          {/* Existing Response */}
                          {inquiry.response && (
                            <div>
                              <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                                Staff Response
                              </p>
                              <p className="text-body text-neutral-700 whitespace-pre-line bg-info-50 rounded-lg p-3 border border-info-200">
                                {inquiry.response}
                              </p>
                              {inquiry.respondedAt && (
                                <p className="text-xs text-neutral-400 mt-1">
                                  Responded on{' '}
                                  {new Date(inquiry.respondedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          {inquiry.status !== 'CLOSED' && (
                            <div className="space-y-3 pt-2 border-t border-neutral-100">
                              {inquiry.status === 'PENDING' && (
                                <div className="space-y-2">
                                  <Textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Write your response..."
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleRespond(inquiry.id)}
                                      loading={responding}
                                      disabled={!responseText.trim()}
                                    >
                                      <Send className="w-4 h-4" />
                                      Send Response
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleClose(inquiry.id)}
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Close
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {inquiry.status === 'RESPONDED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleClose(inquiry.id)}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Close Inquiry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchInquiries(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 text-sm text-neutral-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchInquiries(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
