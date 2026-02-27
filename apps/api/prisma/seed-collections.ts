import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script for creating special curated collections
 * - New Arrivals: Recently added artworks
 * - Museum-Quality: Premium featured artworks
 */

async function main() {
  console.log('🎨 Seeding collections...\n');

  // Create "New Arrivals" collection
  const newArrivals = await prisma.collection.upsert({
    where: { slug: 'new-arrivals' },
    update: {},
    create: {
      title: 'New Arrivals',
      slug: 'new-arrivals',
      description: `Discover the latest additions to our collection. Each piece has been carefully selected for its exceptional quality and artistic merit. Be among the first to explore these newly available works from both emerging and established artists.`,
      featured: true,
      displayOrder: 1,
    },
  });

  console.log(`✓ Created collection: ${newArrivals.title}`);

  // Create "Museum-Quality" collection
  const museumQuality = await prisma.collection.upsert({
    where: { slug: 'museum-quality' },
    update: {},
    create: {
      title: 'Museum-Quality',
      slug: 'museum-quality',
      description: `A curated selection of exceptional artworks that meet the highest standards of artistic excellence. These pieces represent the finest examples of contemporary and modern art, suitable for prestigious collections and institutions. Each work demonstrates exceptional craftsmanship, cultural significance, and investment value.`,
      featured: true,
      displayOrder: 2,
    },
  });

  console.log(`✓ Created collection: ${museumQuality.title}\n`);

  // Populate "New Arrivals" with recently added artworks (last 30 days)
  console.log('📦 Populating "New Arrivals" collection...');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentArtworks = await prisma.artwork.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: 'AVAILABLE',
    },
    orderBy: { createdAt: 'desc' },
    take: 20, // Limit to 20 most recent
  });

  // Clear existing artworks from New Arrivals
  await prisma.collectionArtwork.deleteMany({
    where: { collectionId: newArrivals.id },
  });

  // Add recent artworks to New Arrivals
  if (recentArtworks.length > 0) {
    await prisma.collectionArtwork.createMany({
      data: recentArtworks.map((artwork, index) => ({
        collectionId: newArrivals.id,
        artworkId: artwork.id,
        displayOrder: index,
      })),
    });
    console.log(`  ✓ Added ${recentArtworks.length} artworks to "New Arrivals"\n`);
  } else {
    console.log('  ⚠ No recent artworks found (last 30 days)\n');
  }

  // Populate "Museum-Quality" with featured artworks
  console.log('🏛️  Populating "Museum-Quality" collection...');

  const featuredArtworks = await prisma.artwork.findMany({
    where: {
      featured: true,
      status: 'AVAILABLE',
    },
    orderBy: [
      { displayOrder: 'asc' },
      { price: 'desc' }, // Highest priced first
    ],
    take: 20, // Limit to 20 best pieces
  });

  // Clear existing artworks from Museum-Quality
  await prisma.collectionArtwork.deleteMany({
    where: { collectionId: museumQuality.id },
  });

  // Add featured artworks to Museum-Quality
  if (featuredArtworks.length > 0) {
    await prisma.collectionArtwork.createMany({
      data: featuredArtworks.map((artwork, index) => ({
        collectionId: museumQuality.id,
        artworkId: artwork.id,
        displayOrder: index,
      })),
    });
    console.log(`  ✓ Added ${featuredArtworks.length} artworks to "Museum-Quality"\n`);
  } else {
    console.log('  ⚠ No featured artworks found\n');
  }

  console.log('✅ Collections seeding complete!\n');
  console.log('📋 Summary:');
  console.log(`   - New Arrivals: ${recentArtworks.length} artworks`);
  console.log(`   - Museum-Quality: ${featuredArtworks.length} artworks\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding collections:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
