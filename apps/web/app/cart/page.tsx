'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { useCart } from '@/components/providers/cart-provider';
import { apiClient } from '@/lib/api-client';
import { Trash2, ShoppingBag, ArrowRight, Loader2, LogIn } from 'lucide-react';

export default function CartPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { cart, itemCount, isLoading, removeItem, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authStatus === 'loading' || isLoading) {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="lg" className="text-center py-20">
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
            Please sign in to view your cart.
          </p>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </Container>
      </Section>
    );
  }

  const subtotal = cart?.items.reduce(
    (sum, item) => sum + parseFloat(item.artwork.price),
    0
  ) ?? 0;

  const currency = cart?.items[0]?.artwork.currency || 'USD';

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError(null);
    try {
      apiClient.setAccessToken(session.accessToken ?? null);
      const res = await apiClient.createCheckout();
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setCheckingOut(false);
    }
  };

  if (itemCount === 0) {
    return (
      <Section spacing="lg" background="neutral">
        <Container size="md" className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-heading-1 font-serif text-neutral-900 mb-4">Your Cart is Empty</h1>
          <p className="text-body-lg text-neutral-600 mb-6">
            Discover artworks and add them to your cart.
          </p>
          <Link href="/artworks">
            <Button size="lg">Browse Artworks</Button>
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="neutral">
      <Container size="lg">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-display font-serif text-neutral-900">
            Cart ({itemCount})
          </h1>
          <Button variant="ghost" onClick={clearCart} className="text-sm text-neutral-600">
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items.map((item) => {
              const image = item.artwork.images?.[0];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 flex gap-4"
                >
                  {/* Image */}
                  <Link
                    href={`/artworks/${item.artwork.slug}`}
                    className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-neutral-100"
                  >
                    {image ? (
                      <img
                        src={image.secureUrl || image.url}
                        alt={item.artwork.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/artworks/${item.artwork.slug}`}
                      className="text-heading-4 font-serif text-neutral-900 hover:text-primary-600 transition-colors truncate block"
                    >
                      {item.artwork.title}
                    </Link>
                    <p className="text-sm text-neutral-600">{item.artwork.artist.name}</p>
                    <p className="text-lg font-serif text-neutral-900 mt-1 tabular-nums">
                      {formatPrice(parseFloat(item.artwork.price))}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.artworkId)}
                    className="flex-shrink-0 p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item.artwork.title} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-4">Summary</h2>
              <div className="space-y-3 text-sm border-b border-neutral-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal ({itemCount} items)</span>
                  <span className="text-neutral-900 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-serif mb-6">
                <span className="text-neutral-900">Total</span>
                <span className="text-neutral-900 tabular-nums">{formatPrice(subtotal)}</span>
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                Proceed to Checkout
              </Button>

              <Link href="/artworks" className="block mt-4">
                <Button variant="ghost" className="w-full text-sm">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
