'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiClient, type PaginationParams, type Favorite, type ApiResponse } from '@/lib/api-client';

export function useFavoritesQuery(params: PaginationParams = {}) {
  const { data: session } = useSession();

  return useQuery<ApiResponse<Favorite[]>>({
    queryKey: ['favorites', params],
    queryFn: async () => {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      return apiClient.getFavorites(params);
    },
    enabled: !!session?.accessToken,
  });
}
