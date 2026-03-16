'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { User, Heart, MessageSquare, LogIn, Package, Settings, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="md" className="text-center py-20">
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
            Please sign in to view your account.
          </p>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="neutral">
      <Container size="md">
        <h1 className="text-display font-serif text-neutral-900 mb-8">My Account</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-heading-2 font-serif text-neutral-900">
                {session.user.name || 'Art Collector'}
              </h2>
              <p className="text-body text-neutral-600">{session.user.email}</p>
            </div>
            <Link href="/account/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/favorites"
            className="group bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-heading-4 font-serif text-neutral-900 group-hover:text-primary-600 transition-colors">
                  My Favorites
                </h3>
                <p className="text-sm text-neutral-600">View your saved artworks</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/orders"
            className="group bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-heading-4 font-serif text-neutral-900 group-hover:text-primary-600 transition-colors">
                  Order History
                </h3>
                <p className="text-sm text-neutral-600">View your past purchases</p>
              </div>
            </div>
          </Link>

          <Link
            href="/artworks"
            className="group bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-heading-4 font-serif text-neutral-900 group-hover:text-primary-600 transition-colors">
                  Browse Artworks
                </h3>
                <p className="text-sm text-neutral-600">Discover new pieces</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/profile"
            className="group bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-neutral-500" />
              </div>
              <div>
                <h3 className="text-heading-4 font-serif text-neutral-900 group-hover:text-primary-600 transition-colors">
                  Edit Profile
                </h3>
                <p className="text-sm text-neutral-600">Update your info & password</p>
              </div>
            </div>
          </Link>

          {(session.user.role === 'ADMIN' || session.user.role === 'GALLERY_STAFF') && (
            <Link
              href="/admin"
              className="group bg-white rounded-xl p-6 hover:shadow-md transition-shadow border-2 border-primary-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-heading-4 font-serif text-neutral-900 group-hover:text-primary-600 transition-colors">
                    Admin Panel
                  </h3>
                  <p className="text-sm text-neutral-600">Manage site content & settings</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </Container>
    </Section>
  );
}
