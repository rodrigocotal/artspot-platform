'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiClient, type ArtworkFilters, type PaginationParams, type Artwork, type ApiResponse } from '@/lib/api-client';

export function useArtworks(filters: ArtworkFilters & PaginationParams) {
  const { data: session } = useSession();

  return useQuery<ApiResponse<Artwork[]>>({
    queryKey: ['artworks', filters],
    queryFn: async () => {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      return apiClient.getArtworks(filters);
    },
  });
}

export function useArtwork(slug: string) {
  const { data: session } = useSession();

  return useQuery<ApiResponse<Artwork>>({
    queryKey: ['artwork', slug],
    queryFn: async () => {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      return apiClient.getArtwork(slug);
    },
    enabled: !!slug,
  });
}

export function useRelatedArtworks(id: string | undefined) {
  return useQuery<ApiResponse<Artwork[]>>({
    queryKey: ['artworks', 'related', id],
    queryFn: () => apiClient.getRelatedArtworks(id!, 6),
    enabled: !!id,
  });
}
