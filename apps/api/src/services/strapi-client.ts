import { config } from '../config/environment';

/**
 * Lightweight Strapi 5 REST client for reverse-syncing data
 * from the API back to the CMS (e.g., marking artworks as SOLD).
 */
class StrapiClient {
  private get baseUrl() {
    return `${config.cms.strapiUrl}/api`;
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.cms.strapiToken}`,
    };
  }

  private get isConfigured() {
    return !!config.cms.strapiToken && !!config.cms.strapiUrl;
  }

  /**
   * Find a Strapi documentId by the numeric id we store as strapiId.
   * Strapi 5 REST API requires documentId for PUT/DELETE.
   */
  private async getDocumentId(pluralApiId: string, numericId: number): Promise<string | null> {
    const res = await fetch(
      `${this.baseUrl}/${pluralApiId}?filters[id][$eq]=${numericId}&fields[0]=id`,
      { headers: this.headers }
    );

    if (!res.ok) return null;

    const json = (await res.json()) as { data?: Array<{ documentId?: string }> };
    return json.data?.[0]?.documentId ?? null;
  }

  /**
   * Update an artwork's fields in Strapi by its numeric strapiId.
   */
  async updateArtwork(strapiId: number, data: Record<string, unknown>) {
    if (!this.isConfigured) {
      console.warn('Strapi reverse sync skipped: STRAPI_TOKEN not configured');
      return;
    }

    try {
      const documentId = await this.getDocumentId('artworks', strapiId);
      if (!documentId) {
        console.warn(`Strapi reverse sync: artwork with id=${strapiId} not found`);
        return;
      }

      const res = await fetch(`${this.baseUrl}/artworks/${documentId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Strapi reverse sync failed (${res.status}): ${err}`);
      }
    } catch (err) {
      console.error('Strapi reverse sync error:', err);
    }
  }
}

export const strapiClient = new StrapiClient();
