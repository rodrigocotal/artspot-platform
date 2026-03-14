'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const isAuthorized =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'GALLERY_STAFF';

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!session || !isAuthorized) {
    return (
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
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-neutral-50 p-8">{children}</main>
    </div>
  );
}
