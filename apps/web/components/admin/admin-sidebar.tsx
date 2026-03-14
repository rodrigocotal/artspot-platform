'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Newspaper, ShoppingBag, Mail, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Articles', href: '/admin/articles', icon: Newspaper },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Mail },
  { label: 'Users', href: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          Admin Panel
        </h2>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
