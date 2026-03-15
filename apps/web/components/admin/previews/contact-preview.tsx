'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactPreviewProps {
  content: Record<string, any>;
}

export function ContactPreview({ content }: ContactPreviewProps) {
  return (
    <div className="bg-neutral-50 min-h-[600px] font-sans text-sm p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-neutral-900 mb-2">
          {content.headline || 'Contact Us'}
        </h1>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">{content.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 space-y-4">
          {content.email && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 mb-0.5">Email</h3>
                <p className="text-[10px] text-primary-600">{content.email}</p>
              </div>
            </div>
          )}
          {content.phone && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 mb-0.5">Phone</h3>
                <p className="text-[10px] text-neutral-600">{content.phone}</p>
              </div>
            </div>
          )}
          {content.address && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 mb-0.5">Address</h3>
                <p className="text-[10px] text-neutral-600 whitespace-pre-line">{content.address}</p>
              </div>
            </div>
          )}
          {content.businessHours && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 mb-0.5">Hours</h3>
                <p className="text-[10px] text-neutral-600 whitespace-pre-line">{content.businessHours}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-sm font-serif text-neutral-900 mb-1">
            {content.formHeadline || 'Send Us a Message'}
          </h2>
          <p className="text-[10px] text-neutral-600 mb-3">{content.formSubtitle}</p>
          <div className="space-y-2">
            <div className="h-6 bg-neutral-100 rounded" />
            <div className="h-6 bg-neutral-100 rounded" />
            <div className="h-12 bg-neutral-100 rounded" />
            <div className="h-7 bg-primary-100 rounded text-center text-[10px] text-primary-700 leading-7">
              Send Message
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
