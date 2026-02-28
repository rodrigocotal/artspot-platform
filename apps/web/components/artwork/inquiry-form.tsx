'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Input, Textarea, Label } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2 } from 'lucide-react';

interface InquiryFormProps {
  artworkId: string;
}

export function InquiryForm({ artworkId }: InquiryFormProps) {
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      await apiClient.createInquiry({
        artworkId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim(),
      });

      setSubmitted(true);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Failed to send inquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border-2 border-success-200 bg-success-50 p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-success-600 mx-auto mb-3" />
        <h3 className="text-heading-4 font-serif text-neutral-900 mb-2">
          Inquiry Sent
        </h3>
        <p className="text-body text-neutral-600">
          Thank you for your interest. Our gallery team will respond to your inquiry shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border-2 border-neutral-200 p-6">
      <h3 className="text-heading-4 font-serif text-neutral-900 mb-1">
        Inquire About This Artwork
      </h3>
      <p className="text-body-sm text-neutral-500 mb-4">
        Fill in your details and our team will get back to you.
      </p>

      {errors.form && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3 text-sm text-error-700">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="inquiry-name" required>Name</Label>
          <Input
            id="inquiry-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            error={!!errors.name}
          />
          {errors.name && <p className="text-xs text-error-600">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inquiry-email" required>Email</Label>
          <Input
            id="inquiry-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={!!errors.email}
          />
          {errors.email && <p className="text-xs text-error-600">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry-phone">Phone (optional)</Label>
        <Input
          id="inquiry-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inquiry-message" required>Message</Label>
        <Textarea
          id="inquiry-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I'm interested in this artwork and would like to know more about..."
          rows={4}
          error={!!errors.message}
        />
        {errors.message && <p className="text-xs text-error-600">{errors.message}</p>}
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Send Inquiry
      </Button>
    </form>
  );
}
