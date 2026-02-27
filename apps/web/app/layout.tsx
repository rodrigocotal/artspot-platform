import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { SessionProvider } from '@/components/providers/session-provider';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArtSpot - Premium Art Marketplace',
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
        <SessionProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
