'use client';

import { createContext, useContext, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type Cart } from '@/lib/api-client';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (artworkId: string) => Promise<void>;
  removeItem: (artworkId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (artworkId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Set token for API calls
  if (session?.accessToken) {
    apiClient.setAccessToken(session.accessToken ?? null);
  }

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      apiClient.setAccessToken(session?.accessToken ?? null);
      const res = await apiClient.getCart();
      return res.data;
    },
    enabled: !!session?.accessToken,
    staleTime: 30_000,
  });

  const { data: countData } = useQuery({
    queryKey: ['cart-count'],
    queryFn: async () => {
      apiClient.setAccessToken(session?.accessToken ?? null);
      const res = await apiClient.getCartCount();
      return res.data.count;
    },
    enabled: !!session?.accessToken,
    staleTime: 30_000,
  });

  const invalidateCart = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['cart-count'] });
  }, [queryClient]);

  const addMutation = useMutation({
    mutationFn: (artworkId: string) => {
      apiClient.setAccessToken(session?.accessToken ?? null);
      return apiClient.addToCart(artworkId);
    },
    onSuccess: () => invalidateCart(),
  });

  const removeMutation = useMutation({
    mutationFn: (artworkId: string) => {
      apiClient.setAccessToken(session?.accessToken ?? null);
      return apiClient.removeFromCart(artworkId);
    },
    onSuccess: () => invalidateCart(),
  });

  const clearMutation = useMutation({
    mutationFn: () => {
      apiClient.setAccessToken(session?.accessToken ?? null);
      return apiClient.clearCart();
    },
    onSuccess: () => invalidateCart(),
  });

  const addItem = useCallback(
    async (artworkId: string) => {
      await addMutation.mutateAsync(artworkId);
    },
    [addMutation]
  );

  const removeItem = useCallback(
    async (artworkId: string) => {
      await removeMutation.mutateAsync(artworkId);
    },
    [removeMutation]
  );

  const clearCartFn = useCallback(async () => {
    await clearMutation.mutateAsync();
  }, [clearMutation]);

  const isInCart = useCallback(
    (artworkId: string) => {
      return cartData?.items?.some((item) => item.artworkId === artworkId) ?? false;
    },
    [cartData]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart: cartData ?? null,
      itemCount: countData ?? 0,
      isLoading,
      addItem,
      removeItem,
      clearCart: clearCartFn,
      isInCart,
    }),
    [cartData, countData, isLoading, addItem, removeItem, clearCartFn, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
