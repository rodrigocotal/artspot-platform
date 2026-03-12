'use client';

import { useState, useCallback, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface UseFavoriteOptions {
  artworkId: string;
  initialFavorited?: boolean;
}

export function useFavorite({ artworkId, initialFavorited = false }: UseFavoriteOptions) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const toggle = useCallback(async () => {
    if (!session?.accessToken) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Optimistic update
    const prev = favorited;
    setFavorited(!prev);

    startTransition(async () => {
      try {
        apiClient.setAccessToken(session.accessToken!);
        const res = await apiClient.toggleFavorite(artworkId);
        setFavorited(res.data.favorited);
      } catch {
        // Revert on error
        setFavorited(prev);
      }
    });
  }, [session, artworkId, favorited, router, pathname]);

  return { favorited, isPending, toggle };
}
