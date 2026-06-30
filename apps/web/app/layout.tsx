import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { SkipToContent } from '@/components/layout/skip-to-content';
import { SessionProvider } from '@/components/providers/session-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { CartProvider } from '@/components/providers/cart-provider';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArtAldo - Premium Art Marketplace',
  description: 'Elevating the Experience of Collecting Art Online. A curated marketplace for museum-quality artworks.',
  keywords: ['art', 'marketplace', 'gallery', 'fine art', 'contemporary art', 'paintings', 'sculpture'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
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
