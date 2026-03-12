/**
 * Sync existing API data → Strapi CMS
 *
 * Usage:
 *   cd apps/api
 *   STRAPI_URL=https://rwaxtjdazy.ap-southeast-2.awsapprunner.com \
 *   STRAPI_TOKEN=<your-api-token> \
 *   npx tsx scripts/sync-to-strapi.ts
 *
 * Before running:
 *   1. Create a Full Access API token in Strapi (Settings > API Tokens)
 *   2. Pause the CMS webhook (Settings > Webhooks > toggle off)
 * After running:
 *   Re-enable the webhook
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('ERROR: Set STRAPI_TOKEN env var (Strapi full-access API token)');
  process.exit(1);
}

async function strapiPost(endpoint: string, data: any): Promise<any> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Strapi POST ${endpoint} failed (${res.status}): ${err}`);
  }

  return res.json();
}

async function syncArtists() {
  const artists = await prisma.artist.findMany();
  console.log(`\nSyncing ${artists.length} artists...`);

  for (const artist of artists) {
    if (artist.strapiId) {
      console.log(`  skip "${artist.name}" (already has strapiId=${artist.strapiId})`);
      continue;
    }

    try {
      const result = await strapiPost('/artists', {
        name: artist.name,
        slug: artist.slug,
        bio: artist.bio || undefined,
        statement: artist.statement || undefined,
        location: artist.location || undefined,
        website: artist.website || undefined,
        email: artist.email || undefined,
        phoneNumber: artist.phoneNumber || undefined,
        featured: artist.featured,
        verified: artist.verified,
      });

      const strapiId = result.data.id;
      await prisma.artist.update({
        where: { id: artist.id },
        data: { strapiId },
      });
      console.log(`  synced "${artist.name}" -> strapiId=${strapiId}`);
    } catch (err: any) {
      console.error(`  FAILED "${artist.name}": ${err.message}`);
    }
  }
}

async function syncCollections() {
  const collections = await prisma.collection.findMany();
  console.log(`\nSyncing ${collections.length} collections...`);

  for (const col of collections) {
    if (col.strapiId) {
      console.log(`  skip "${col.title}" (already has strapiId=${col.strapiId})`);
      continue;
    }

    try {
      const result = await strapiPost('/collections', {
        title: col.title,
        slug: col.slug,
        description: col.description || undefined,
        featured: col.featured,
      });

      const strapiId = result.data.id;
      await prisma.collection.update({
        where: { id: col.id },
        data: { strapiId },
      });
      console.log(`  synced "${col.title}" -> strapiId=${strapiId}`);
    } catch (err: any) {
      console.error(`  FAILED "${col.title}": ${err.message}`);
    }
  }
}

async function syncArtworks() {
  const artworks = await prisma.artwork.findMany({
    include: {
      artist: { select: { strapiId: true } },
      collectionItems: {
        include: { collection: { select: { strapiId: true } } },
      },
    },
  });
  console.log(`\nSyncing ${artworks.length} artworks...`);

  for (const artwork of artworks) {
    if (artwork.strapiId) {
      console.log(`  skip "${artwork.title}" (already has strapiId=${artwork.strapiId})`);
      continue;
    }

    if (!artwork.artist.strapiId) {
      console.error(`  SKIP "${artwork.title}": artist has no strapiId (sync artists first)`);
      continue;
    }

    try {
      // Build collection relations (only those that have been synced)
      const collectionStrapiIds = artwork.collectionItems
        .map((ci) => ci.collection.strapiId)
        .filter((id): id is number => id !== null);

      const result = await strapiPost('/artworks', {
        title: artwork.title,
        slug: artwork.slug,
        description: artwork.description || undefined,
        artist: artwork.artist.strapiId,
        medium: artwork.medium || undefined,
        style: artwork.style || undefined,
        year: artwork.year || undefined,
        width: artwork.width ? Number(artwork.width) : undefined,
        height: artwork.height ? Number(artwork.height) : undefined,
        depth: artwork.depth ? Number(artwork.depth) : undefined,
        price: Number(artwork.price),
        currency: artwork.currency,
        availabilityStatus: artwork.status,
        purchaseMode: artwork.purchaseMode,
        featured: artwork.featured,
        edition: artwork.edition || undefined,
        materials: artwork.materials || undefined,
        signature: artwork.signature || undefined,
        certificate: artwork.certificate,
        framed: artwork.framed,
        collections: collectionStrapiIds.length > 0 ? collectionStrapiIds : undefined,
      });

      const strapiId = result.data.id;
      await prisma.artwork.update({
        where: { id: artwork.id },
        data: { strapiId },
      });
      console.log(`  synced "${artwork.title}" -> strapiId=${strapiId}`);
    } catch (err: any) {
      console.error(`  FAILED "${artwork.title}": ${err.message}`);
    }
  }
}

async function main() {
  console.log('=== Sync API data → Strapi CMS ===');
  console.log(`Strapi URL: ${STRAPI_URL}`);

  // Order matters: artists first, then collections, then artworks (which reference both)
  await syncArtists();
  await syncCollections();
  await syncArtworks();

  console.log('\nDone! Re-enable the Strapi webhook now.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  prisma.$disconnect();
  process.exit(1);
});
