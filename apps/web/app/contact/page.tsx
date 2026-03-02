'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { Input, Textarea, Button } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const DEFAULTS = {
  headline: 'Contact Us',
  subtitle: 'We would love to hear from you. Reach out to our team for any inquiries about artworks, services, or collaboration.',
  email: 'hello@artspot.com',
  phone: '+1 (555) 000-0000',
  address: '123 Gallery Street\nNew York, NY 10001',
  businessHours: 'Monday – Friday: 9am – 6pm\nSaturday: 10am – 4pm\nSunday: Closed',
  formHeadline: 'Send Us a Message',
  formSubtitle: 'Fill out the form below and we will get back to you within 24 hours.',
};

export default function ContactPage() {
  const [content, setContent] = useState(DEFAULTS);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    apiClient
      .getPageContent('contact')
      .then((res) => setContent({ ...DEFAULTS, ...res.data.content }))
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || 'Inquiry from ArtSpot');
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:${content.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-display font-serif text-neutral-900 mb-4">{content.headline}</h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-heading-4 font-serif text-neutral-900 mb-1">Email</h3>
                  <a href={`mailto:${content.email}`} className="text-body text-primary-600 hover:text-primary-700">
                    {content.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-heading-4 font-serif text-neutral-900 mb-1">Phone</h3>
                  <p className="text-body text-neutral-600">{content.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-heading-4 font-serif text-neutral-900 mb-1">Address</h3>
                  <p className="text-body text-neutral-600 whitespace-pre-line">{content.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-heading-4 font-serif text-neutral-900 mb-1">Business Hours</h3>
                  <p className="text-body text-neutral-600 whitespace-pre-line">{content.businessHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-2">{content.formHeadline}</h2>
            <p className="text-body text-neutral-600 mb-6">{content.formSubtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">Subject</label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
