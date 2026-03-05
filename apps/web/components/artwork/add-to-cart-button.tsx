'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useCart } from '@/components/providers/cart-provider';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  artworkId: string;
  className?: string;
}

export function AddToCartButton({ artworkId, className }: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inCart = isInCart(artworkId);

  const handleAdd = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addItem(artworkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  if (inCart) {
    return (
      <Link href="/cart" className={className}>
        <Button size="lg" variant="outline" className="w-full gap-2">
          <Check className="w-5 h-5 text-green-600" />
          In Cart — View
        </Button>
      </Link>
    );
  }

  return (
    <div className={className}>
      <Button
        size="lg"
        variant="primary"
        className="w-full gap-2"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ShoppingBag className="w-5 h-5" />
        )}
        Add to Cart
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
