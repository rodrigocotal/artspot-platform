/**
 * API client for ArtSpot backend
 * Handles all HTTP requests to the Node.js API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ArtworkFilters {
  artistId?: string;
  medium?: string;
  style?: string;
  status?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'year' | 'title' | 'views' | 'displayOrder';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  profileImageUrl: string | null;
}

export interface ArtworkImage {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  type: string;
  displayOrder: number;
  caption: string | null;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  medium: string;
  style: string | null;
  year: number | null;
  width: string | null;
  height: string | null;
  depth: string | null;
  price: string;
  currency: string;
  status: string;
  featured: boolean;
  edition: string | null;
  materials: string | null;
  signature: string | null;
  certificate: boolean;
  framed: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  artist: Artist;
  images: ArtworkImage[];
  _count?: {
    favorites: number;
    inquiries: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get list of artworks with filtering and pagination
   */
  async getArtworks(
    params: ArtworkFilters & PaginationParams = {}
  ): Promise<ApiResponse<Artwork[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Artwork[]>(`/artworks${queryString}`);
  }

  /**
   * Get single artwork by ID or slug
   */
  async getArtwork(id: string): Promise<ApiResponse<Artwork>> {
    return this.fetch<Artwork>(`/artworks/${id}`);
  }

  /**
   * Get related artworks
   */
  async getRelatedArtworks(
    id: string,
    limit = 6
  ): Promise<ApiResponse<Artwork[]>> {
    return this.fetch<Artwork[]>(`/artworks/${id}/related?limit=${limit}`);
  }
}

export const apiClient = new ApiClient(API_URL);
