import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { SkipToContent } from '@/components/layout/skip-to-content';
import { SessionProvider } from '@/components/providers/session-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { CartProvider } from '@/components/providers/cart-provider';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArtAldo - Modern & Contemporary Art',
  description:
    'Curated contemporary art, secure acquisition, trusted provenance, and personal advisory from Aldo Castillo.',
  keywords: [
    'ArtAldo',
    'Aldo Castillo',
    'contemporary art',
    'Latin American art',
    'art advisory',
    'fine art',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        <QueryProvider>
          <SessionProvider>
            <ToastProvider>
              <CartProvider>
                <SkipToContent />
                <Header />
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </ToastProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
