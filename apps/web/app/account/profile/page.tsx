'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button, Input, Label } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [name, setName] = React.useState(session?.user?.name || '');
  const [email, setEmail] = React.useState(session?.user?.email || '');
  const [profileLoading, setProfileLoading] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [passwordLoading, setPasswordLoading] = React.useState(false);

  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session?.user]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast(data.message || 'Failed to update profile', 'error');
        return;
      }

      toast('Profile updated successfully', 'success');
    } catch {
      toast('Something went wrong', 'error');
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast('New passwords do not match', 'error');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast(data.message || 'Failed to change password', 'error');
        return;
      }

      toast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      toast('Something went wrong', 'error');
    } finally {
      setPasswordLoading(false);
    }
  }

  if (!session?.user) {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="md" className="text-center py-20">
          <p className="text-neutral-600">Please sign in to edit your profile.</p>
          <Link href="/login"><Button className="mt-4">Sign In</Button></Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="neutral">
      <Container size="md">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Account
        </Link>

        <h1 className="text-display font-serif text-neutral-900 mb-8">Edit Profile</h1>

        <div className="bg-white rounded-xl p-8 mb-8">
          <h2 className="text-heading-3 font-serif text-neutral-900 mb-6">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" loading={profileLoading}>Save Changes</Button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-8">
          <h2 className="text-heading-3 font-serif text-neutral-900 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" required>Current Password</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" required>New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
              <p className="text-xs text-neutral-500">At least 8 characters, one uppercase letter, and one number</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" required>Confirm New Password</Label>
              <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            </div>
            <Button type="submit" loading={passwordLoading}>Change Password</Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
