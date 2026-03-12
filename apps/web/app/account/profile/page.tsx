'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button, Input, Label, useToast } from '@/components/ui';
import { ArrowLeft, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfileEditPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState('');

  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session?.user]);

  if (status === 'loading') {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="md" className="text-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        </Container>
      </Section>
    );
  }

  if (!session?.user) {
    router.push('/login?callbackUrl=/account/profile');
    return null;
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Update failed' }));
        setError(data.message || 'Update failed');
        setLoading(false);
        return;
      }

      // Update the session with new data
      await update({ name, email });
      toast('Profile updated');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Password change failed' }));
        setPasswordError(data.message || 'Password change failed');
        setPasswordLoading(false);
        return;
      }

      toast('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <Section spacing="lg" background="neutral">
      <Container size="md">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1 className="text-display font-serif text-neutral-900 mb-8">Edit Profile</h1>

        {/* Profile Info */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-heading-3 font-serif text-neutral-900 mb-6">Personal Information</h2>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {error && (
              <div role="alert" className="rounded-lg bg-error-50 border border-error-200 p-4 text-sm text-error-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl p-8">
          <h2 className="text-heading-3 font-serif text-neutral-900 mb-6">Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {passwordError && (
              <div role="alert" className="rounded-lg bg-error-50 border border-error-200 p-4 text-sm text-error-700">
                {passwordError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword" required>Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" required>New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <p className="text-xs text-neutral-500">
                At least 8 characters, one uppercase letter, and one number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" required>Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Re-enter your new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" loading={passwordLoading}>
              Change Password
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
