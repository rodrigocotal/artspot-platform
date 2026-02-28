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

export interface ArtistFilters {
  featured?: boolean;
  verified?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'displayOrder';
  sortOrder?: 'asc' | 'desc';
}

export interface CollectionFilters {
  featured?: boolean;
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'displayOrder';
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
  bio: string | null;
  statement: string | null;
  location: string | null;
  website: string | null;
  email: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  featured: boolean;
  verified: boolean;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  artworks?: Artwork[];
  _count?: {
    artworks: number;
  };
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  featured: boolean;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  artworks?: {
    displayOrder: number;
    artwork: Artwork;
  }[];
  _count?: {
    artworks: number;
  };
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
  isFavorited?: boolean;
  _count?: {
    favorites: number;
    inquiries: number;
  };
}

export interface Favorite {
  id: string;
  artworkId: string;
  createdAt: string;
  artwork: Artwork;
}

export interface ToggleFavoriteResult {
  favorited: boolean;
  id?: string;
}

export interface CreateInquiryInput {
  artworkId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface Inquiry {
  id: string;
  userId: string | null;
  artworkId: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  response: string | null;
  respondedAt: string | null;
  respondedBy: string | null;
  createdAt: string;
  updatedAt: string;
  artwork?: {
    id: string;
    title: string;
    slug: string;
    images?: ArtworkImage[];
  };
  user?: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export interface RespondInquiryInput {
  response?: string;
  status?: 'RESPONDED' | 'CLOSED';
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
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

  /**
   * Get list of artists with filtering and pagination
   */
  async getArtists(
    params: ArtistFilters & PaginationParams = {}
  ): Promise<ApiResponse<Artist[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Artist[]>(`/artists${queryString}`);
  }

  /**
   * Get single artist by ID or slug
   */
  async getArtist(id: string): Promise<ApiResponse<Artist>> {
    return this.fetch<Artist>(`/artists/${id}`);
  }

  /**
   * Get featured artists
   */
  async getFeaturedArtists(limit = 6): Promise<ApiResponse<Artist[]>> {
    return this.fetch<Artist[]>(`/artists/featured?limit=${limit}`);
  }

  /**
   * Get list of collections with filtering and pagination
   */
  async getCollections(
    params: CollectionFilters & PaginationParams = {}
  ): Promise<ApiResponse<Collection[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Collection[]>(`/collections${queryString}`);
  }

  /**
   * Get single collection by ID or slug
   */
  async getCollection(id: string): Promise<ApiResponse<Collection>> {
    return this.fetch<Collection>(`/collections/${id}`);
  }

  /**
   * Get featured collections
   */
  async getFeaturedCollections(limit = 6): Promise<ApiResponse<Collection[]>> {
    return this.fetch<Collection[]>(`/collections/featured?limit=${limit}`);
  }

  // ── Favorites ──────────────────────────────────────────────────────────

  /**
   * Toggle favorite on an artwork (add if not favorited, remove if already)
   */
  async toggleFavorite(artworkId: string): Promise<ApiResponse<ToggleFavoriteResult>> {
    return this.fetch<ToggleFavoriteResult>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ artworkId }),
    });
  }

  /**
   * List the authenticated user's favorites
   */
  async getFavorites(
    params: PaginationParams = {}
  ): Promise<ApiResponse<Favorite[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Favorite[]>(`/favorites${queryString}`);
  }

  /**
   * Remove a favorite by its ID
   */
  async removeFavorite(favoriteId: string): Promise<void> {
    await this.fetch(`/favorites/${favoriteId}`, { method: 'DELETE' });
  }

  // ── Inquiries ──────────────────────────────────────────────────────────

  /**
   * Submit an inquiry on an artwork (works for guests and authenticated users)
   */
  async createInquiry(data: CreateInquiryInput): Promise<ApiResponse<Inquiry>> {
    return this.fetch<Inquiry>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * List the authenticated user's inquiries
   */
  async getUserInquiries(
    params: PaginationParams & { status?: string } = {}
  ): Promise<ApiResponse<Inquiry[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Inquiry[]>(`/inquiries${queryString}`);
  }

  /**
   * List all inquiries (admin/staff only)
   */
  async getAdminInquiries(
    params: PaginationParams & { status?: string; search?: string } = {}
  ): Promise<ApiResponse<Inquiry[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Inquiry[]>(`/inquiries/admin${queryString}`);
  }

  /**
   * Respond to or update an inquiry (admin/staff only)
   */
  async respondToInquiry(
    id: string,
    data: RespondInquiryInput
  ): Promise<ApiResponse<Inquiry>> {
    return this.fetch<Inquiry>(`/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_URL);
