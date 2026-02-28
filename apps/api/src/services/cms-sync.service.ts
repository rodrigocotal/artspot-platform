import { prisma } from '../config/database';

type StrapiEvent = 'entry.create' | 'entry.update' | 'entry.delete';

export class CmsSyncService {
  async handleEvent(event: StrapiEvent, model: string, entry: any) {
    switch (model) {
      case 'artist':
        return this.syncArtist(event, entry);
      case 'artwork':
        return this.syncArtwork(event, entry);
      case 'collection':
        return this.syncCollection(event, entry);
      case 'article':
        return this.syncArticle(event, entry);
      default:
        console.log(`CMS sync: unhandled model "${model}"`);
    }
  }

  private async syncArtist(event: StrapiEvent, entry: any) {
    const strapiId = entry.id;

    if (event === 'entry.delete') {
      await prisma.artist.deleteMany({ where: { strapiId } });
      return;
    }

    await prisma.artist.upsert({
      where: { strapiId },
      create: {
        strapiId,
        name: entry.name,
        slug: entry.slug,
        bio: entry.bio || null,
        statement: entry.statement || null,
        location: entry.location || null,
        website: entry.website || null,
        email: entry.email || null,
        phoneNumber: entry.phoneNumber || null,
        profileImageUrl: this.extractMediaUrl(entry.profileImage),
        featured: entry.featured ?? false,
        verified: entry.verified ?? false,
      },
      update: {
        name: entry.name,
        slug: entry.slug,
        bio: entry.bio || null,
        statement: entry.statement || null,
        location: entry.location || null,
        website: entry.website || null,
        email: entry.email || null,
        phoneNumber: entry.phoneNumber || null,
        profileImageUrl: this.extractMediaUrl(entry.profileImage),
        featured: entry.featured ?? false,
        verified: entry.verified ?? false,
      },
    });
  }

  private async syncArtwork(event: StrapiEvent, entry: any) {
    const strapiId = entry.id;

    if (event === 'entry.delete') {
      await prisma.artwork.deleteMany({ where: { strapiId } });
      return;
    }

    // Resolve artist relation via strapiId
    let artistId: string | undefined;
    if (entry.artist?.id) {
      const artist = await prisma.artist.findUnique({
        where: { strapiId: entry.artist.id },
        select: { id: true },
      });
      artistId = artist?.id;
    }

    if (!artistId) {
      console.error(`CMS sync: artwork "${entry.title}" has no valid artist, skipping`);
      return;
    }

    const artwork = await prisma.artwork.upsert({
      where: { strapiId },
      create: {
        strapiId,
        title: entry.title,
        slug: entry.slug,
        description: entry.description || null,
        artistId,
        medium: entry.medium || 'OTHER',
        style: entry.style || null,
        year: entry.year || null,
        width: entry.width || null,
        height: entry.height || null,
        depth: entry.depth || null,
        price: entry.price,
        currency: entry.currency || 'USD',
        status: entry.status || 'AVAILABLE',
        featured: entry.featured ?? false,
        edition: entry.edition || null,
        materials: entry.materials || null,
        signature: entry.signature || null,
        certificate: entry.certificate ?? false,
        framed: entry.framed ?? false,
      },
      update: {
        title: entry.title,
        slug: entry.slug,
        description: entry.description || null,
        artistId,
        medium: entry.medium || 'OTHER',
        style: entry.style || null,
        year: entry.year || null,
        width: entry.width || null,
        height: entry.height || null,
        depth: entry.depth || null,
        price: entry.price,
        currency: entry.currency || 'USD',
        status: entry.status || 'AVAILABLE',
        featured: entry.featured ?? false,
        edition: entry.edition || null,
        materials: entry.materials || null,
        signature: entry.signature || null,
        certificate: entry.certificate ?? false,
        framed: entry.framed ?? false,
      },
    });

    // Sync images — replace all existing images with CMS images
    if (entry.images && Array.isArray(entry.images)) {
      await prisma.artworkImage.deleteMany({ where: { artworkId: artwork.id } });

      for (let i = 0; i < entry.images.length; i++) {
        const img = entry.images[i];
        const url = img.url || '';
        await prisma.artworkImage.create({
          data: {
            artworkId: artwork.id,
            publicId: img.hash || `strapi-${strapiId}-${i}`,
            url,
            secureUrl: url.replace('http://', 'https://'),
            width: img.width || 0,
            height: img.height || 0,
            format: img.ext?.replace('.', '') || img.mime?.split('/')[1] || 'jpg',
            size: img.size ? Math.round(img.size * 1024) : 0,
            type: i === 0 ? 'MAIN' : 'ALTERNATE',
            displayOrder: i,
          },
        });
      }
    }

    // Sync collection relations
    if (entry.collections && Array.isArray(entry.collections)) {
      // Remove existing collection links
      await prisma.collectionArtwork.deleteMany({ where: { artworkId: artwork.id } });

      for (const col of entry.collections) {
        const collection = await prisma.collection.findUnique({
          where: { strapiId: col.id },
          select: { id: true },
        });
        if (collection) {
          await prisma.collectionArtwork.create({
            data: {
              collectionId: collection.id,
              artworkId: artwork.id,
            },
          });
        }
      }
    }
  }

  private async syncCollection(event: StrapiEvent, entry: any) {
    const strapiId = entry.id;

    if (event === 'entry.delete') {
      await prisma.collection.deleteMany({ where: { strapiId } });
      return;
    }

    const collection = await prisma.collection.upsert({
      where: { strapiId },
      create: {
        strapiId,
        title: entry.title,
        slug: entry.slug,
        description: entry.description || null,
        coverImageUrl: this.extractMediaUrl(entry.coverImage),
        featured: entry.featured ?? false,
      },
      update: {
        title: entry.title,
        slug: entry.slug,
        description: entry.description || null,
        coverImageUrl: this.extractMediaUrl(entry.coverImage),
        featured: entry.featured ?? false,
      },
    });

    // Sync artwork relations
    if (entry.artworks && Array.isArray(entry.artworks)) {
      await prisma.collectionArtwork.deleteMany({ where: { collectionId: collection.id } });

      for (let i = 0; i < entry.artworks.length; i++) {
        const aw = entry.artworks[i];
        const artwork = await prisma.artwork.findUnique({
          where: { strapiId: aw.id },
          select: { id: true },
        });
        if (artwork) {
          await prisma.collectionArtwork.create({
            data: {
              collectionId: collection.id,
              artworkId: artwork.id,
              displayOrder: i,
            },
          });
        }
      }
    }
  }

  private async syncArticle(event: StrapiEvent, entry: any) {
    const strapiId = entry.id;

    if (event === 'entry.delete') {
      await prisma.article.deleteMany({ where: { strapiId } });
      return;
    }

    await prisma.article.upsert({
      where: { strapiId },
      create: {
        strapiId,
        title: entry.title,
        slug: entry.slug,
        content: entry.content || '',
        excerpt: entry.excerpt || null,
        coverImageUrl: this.extractMediaUrl(entry.coverImage),
        author: entry.author || null,
        category: entry.category || null,
        publishedDate: entry.publishedDate ? new Date(entry.publishedDate) : null,
        featured: entry.featured ?? false,
      },
      update: {
        title: entry.title,
        slug: entry.slug,
        content: entry.content || '',
        excerpt: entry.excerpt || null,
        coverImageUrl: this.extractMediaUrl(entry.coverImage),
        author: entry.author || null,
        category: entry.category || null,
        publishedDate: entry.publishedDate ? new Date(entry.publishedDate) : null,
        featured: entry.featured ?? false,
      },
    });
  }

  private extractMediaUrl(media: any): string | null {
    if (!media) return null;
    return media.url || null;
  }
}

export const cmsSyncService = new CmsSyncService();
