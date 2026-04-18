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
  purchaseMode: 'DIRECT' | 'INQUIRY_ONLY';
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

// ── Articles ──────────────────────────────────────────────────────────

export type ArticleCategory =
  | 'ARTIST_SPOTLIGHT'
  | 'EXHIBITION'
  | 'BEHIND_THE_SCENES'
  | 'NEWS'
  | 'GUIDE';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  author: string | null;
  category: ArticleCategory | null;
  publishedDate: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  slug: string;
  content: Record<string, any>;
  draftContent?: Record<string, any> | null;
  status?: 'DRAFT' | 'PUBLISHED';
  updatedAt: string;
  createdAt: string;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  author?: string;
  category?: ArticleCategory;
  publishedDate?: string;
  featured?: boolean;
}

export interface ArticleFilters {
  category?: ArticleCategory;
  search?: string;
  featured?: boolean;
  sortBy?: 'publishedDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ── Cart ──────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  artworkId: string;
  createdAt: string;
  artwork: Artwork;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartCount {
  count: number;
}

// ── Orders ────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  artworkId: string;
  price: string;
  currency: string;
  title: string;
  artistName: string;
  artwork?: Artwork;
}

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: string;
  currency: string;
  status: OrderStatus;
  customerEmail: string;
  customerName: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  orderId: string;
  orderNumber: string;
}

// ── Artwork Management ────────────────────────────────────────────────

export interface CreateArtworkInput {
  title: string;
  slug: string;
  artistId: string;
  medium: string;
  price: number;
  currency?: string;
  status?: string;
  purchaseMode?: 'DIRECT' | 'INQUIRY_ONLY';
  featured?: boolean;
  certificate?: boolean;
  framed?: boolean;
  description?: string;
  style?: string;
  year?: number;
  width?: number;
  height?: number;
  depth?: number;
  edition?: string;
  materials?: string;
  signature?: string;
  displayOrder?: number;
}

export interface CreateArtistInput {
  name: string;
  slug: string;
  bio?: string;
  statement?: string;
  location?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  featured?: boolean;
  verified?: boolean;
}

export interface UploadedImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
}

// ── Admin ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalArtworks: number;
  pendingInquiries: number;
  totalOrders: number;
  totalRevenue: string;
  recentOrders: number;
  recentUsers: number;
}

export interface AdminOrder extends Order {
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  _count: {
    orders: number;
    inquiries: number;
  };
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
   * Create artwork (admin)
   */
  async createArtwork(data: CreateArtworkInput): Promise<ApiResponse<Artwork>> {
    return this.fetch<Artwork>('/artworks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update artwork (admin)
   */
  async updateArtwork(id: string, data: Partial<CreateArtworkInput>): Promise<ApiResponse<Artwork>> {
    return this.fetch<Artwork>(`/artworks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete artwork (admin)
   */
  async deleteArtwork(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.fetch<{ message: string }>(`/artworks/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Upload artwork image to Cloudinary
   */
  async uploadArtworkImage(file: File): Promise<{ success: boolean; image: UploadedImage }> {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${this.baseUrl}/upload/artwork`;
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Upload a CMS image to Cloudinary (folder: cms/)
   */
  async uploadCmsImage(file: File): Promise<{ success: boolean; image: UploadedImage }> {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${this.baseUrl}/upload/cms`;
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Add uploaded image to artwork
   */
  async addArtworkImage(artworkId: string, imageData: {
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    size: number;
    type?: string;
  }): Promise<ApiResponse<ArtworkImage>> {
    return this.fetch<ArtworkImage>(`/artworks/${artworkId}/images`, {
      method: 'POST',
      body: JSON.stringify(imageData),
    });
  }

  /**
   * Remove image from artwork
   */
  async removeArtworkImage(artworkId: string, imageId: string): Promise<void> {
    await this.fetch(`/artworks/${artworkId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Create artist (admin)
   */
  async createArtist(data: CreateArtistInput): Promise<ApiResponse<Artist>> {
    return this.fetch<Artist>('/artists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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

  // ── Articles ──────────────────────────────────────────────────────────

  /**
   * Get list of articles with filtering and pagination
   */
  async getArticles(
    params: ArticleFilters & PaginationParams = {}
  ): Promise<ApiResponse<Article[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Article[]>(`/articles${queryString}`);
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit = 6): Promise<ApiResponse<Article[]>> {
    return this.fetch<Article[]>(`/articles/featured?limit=${limit}`);
  }

  /**
   * Get single article by slug
   */
  async getArticle(slug: string): Promise<ApiResponse<Article>> {
    return this.fetch<Article>(`/articles/${slug}`);
  }

  /**
   * Get single article by ID (admin)
   */
  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    return this.fetch<Article>(`/articles/id/${id}`);
  }

  /**
   * Create article (admin)
   */
  async createArticle(data: CreateArticleInput): Promise<ApiResponse<Article>> {
    return this.fetch<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update article (admin)
   */
  async updateArticle(id: string, data: Partial<CreateArticleInput>): Promise<ApiResponse<Article>> {
    return this.fetch<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete article (admin)
   */
  async deleteArticle(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.fetch<{ message: string }>(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // ── Page Content ──────────────────────────────────────────────────────

  /**
   * Get CMS page content by slug
   */
  async getPageContent(slug: string): Promise<ApiResponse<PageContent>> {
    return this.fetch<PageContent>(`/pages/${slug}`);
  }

  /**
   * List all page contents (admin)
   */
  async listPageContents(): Promise<ApiResponse<PageContent[]>> {
    return this.fetch<PageContent[]>('/pages');
  }

  /**
   * Get CMS page content with draft (admin)
   */
  async getPageContentDraft(slug: string): Promise<ApiResponse<PageContent>> {
    return this.fetch<PageContent>(`/pages/${slug}?draft=true`);
  }

  /**
   * Update page content by slug (saves as draft)
   */
  async updatePageContent(slug: string, content: Record<string, any>): Promise<ApiResponse<PageContent>> {
    return this.fetch<PageContent>(`/pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  /**
   * Publish page content by slug
   */
  async publishPageContent(slug: string): Promise<ApiResponse<PageContent>> {
    return this.fetch<PageContent>(`/pages/${slug}/publish`, {
      method: 'POST',
    });
  }

  // ── Cart ────────────────────────────────────────────────────────────

  async getCart(): Promise<ApiResponse<Cart>> {
    return this.fetch<Cart>('/cart');
  }

  async getCartCount(): Promise<ApiResponse<CartCount>> {
    return this.fetch<CartCount>('/cart/count');
  }

  async addToCart(artworkId: string): Promise<ApiResponse<Cart>> {
    return this.fetch<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ artworkId }),
    });
  }

  async removeFromCart(artworkId: string): Promise<ApiResponse<Cart>> {
    return this.fetch<Cart>(`/cart/items/${artworkId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<Cart>> {
    return this.fetch<Cart>('/cart', { method: 'DELETE' });
  }

  // ── Orders ──────────────────────────────────────────────────────────

  async createCheckout(): Promise<ApiResponse<CheckoutResult>> {
    return this.fetch<CheckoutResult>('/orders/checkout', {
      method: 'POST',
    });
  }

  async getOrders(
    params: PaginationParams & { status?: string } = {}
  ): Promise<ApiResponse<Order[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<Order[]>(`/orders${queryString}`);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.fetch<Order>(`/orders/${id}`);
  }

  // ── Admin ──────────────────────────────────────────────────────────

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.fetch<AdminStats>('/admin/stats');
  }

  async getAdminOrders(
    params: PaginationParams & { status?: string; search?: string } = {}
  ): Promise<ApiResponse<AdminOrder[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<AdminOrder[]>(`/admin/orders${queryString}`);
  }

  async updateAdminOrderStatus(
    id: string,
    data: { status: string }
  ): Promise<ApiResponse<AdminOrder>> {
    return this.fetch<AdminOrder>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAdminUsers(
    params: PaginationParams & { search?: string; role?: string } = {}
  ): Promise<ApiResponse<AdminUser[]>> {
    const queryString = this.buildQueryString(params);
    return this.fetch<AdminUser[]>(`/admin/users${queryString}`);
  }

  async updateUserRole(
    id: string,
    data: { role: string }
  ): Promise<ApiResponse<AdminUser>> {
    return this.fetch<AdminUser>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_URL);
