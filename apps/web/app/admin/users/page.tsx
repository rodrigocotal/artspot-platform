'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type AdminUser } from '@/lib/api-client';
import { Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-error-100 text-error-800 border-error-300',
  GALLERY_STAFF: 'bg-info-100 text-info-800 border-info-300',
  COLLECTOR: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        ROLE_STYLES[role] || 'bg-neutral-100 text-neutral-700 border-neutral-300'
      )}
    >
      {role.replace('_', ' ')}
    </span>
  );
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const isAdmin = session?.user?.role === 'ADMIN';

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const params: Record<string, any> = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      if (search.trim()) params.search = search.trim();

      const response = await apiClient.getAdminUsers(params);
      setUsers(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchUsers(1);
    }
  }, [session?.accessToken, roleFilter]);

  const handleSearch = () => fetchUsers(1);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Change this user's role to ${newRole.replace('_', ' ')}?`))
      return;

    setActionLoading(userId);
    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.updateUserRole(userId, { role: newRole });
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display font-serif text-neutral-900 mb-2">
          User Management
        </h1>
        <p className="text-body-lg text-neutral-600">
          View and manage user accounts
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {['', 'COLLECTOR', 'GALLERY_STAFF', 'ADMIN'].map((value) => (
            <Button
              key={value}
              variant={roleFilter === value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(value)}
            >
              {value ? value.replace('_', ' ') : 'All'}
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

      {!loading && users.length > 0 && (
        <p className="text-sm text-neutral-600 mb-4">
          {pagination.total} {pagination.total === 1 ? 'user' : 'users'} found
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
          {users.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">
                No users found
              </h2>
              <p className="text-neutral-600">
                {roleFilter
                  ? `No ${roleFilter.replace('_', ' ').toLowerCase()} users.`
                  : 'No users found.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3">
                      User
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3">
                      Role
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                      Verified
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                      Joined
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                      Activity
                    </th>
                    {isAdmin && (
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900">
                          {user.name || '—'}
                        </p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {user.emailVerified ? (
                          <CheckCircle className="w-5 h-5 text-success-500" />
                        ) : (
                          <span className="text-sm text-neutral-400">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-sm text-neutral-600">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-sm text-neutral-600">
                        {user._count.orders} orders, {user._count.inquiries} inquiries
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          {user.id !== session?.user?.id ? (
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              disabled={actionLoading === user.id}
                              className="text-sm border border-neutral-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="COLLECTOR">COLLECTOR</option>
                              <option value="GALLERY_STAFF">GALLERY STAFF</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <span className="text-xs text-neutral-400">You</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm text-neutral-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => fetchUsers(pagination.page + 1)}
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
