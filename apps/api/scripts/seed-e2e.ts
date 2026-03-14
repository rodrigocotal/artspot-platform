/**
 * Seeds the E2E test database with an admin user and sample artworks.
 * Run after prisma db push in CI.
 *
 * Usage: npx tsx scripts/seed-e2e.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[E2E Seed] Seeding test database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('AdminPass123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'e2e-admin@test.com' },
    update: {},
    create: {
      email: 'e2e-admin@test.com',
      name: 'E2E Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('[E2E Seed] Admin user created:', admin.id);

  // Create test artist
  const artist = await prisma.artist.upsert({
    where: { slug: 'e2e-test-artist' },
    update: {},
    create: {
      name: 'E2E Test Artist',
      slug: 'e2e-test-artist',
      bio: 'An artist created for E2E testing',
      location: 'Test Studio',
    },
  });
  console.log('[E2E Seed] Artist created:', artist.id);

  // Create test artworks
  const artworks = [
    { title: 'Sunset Over Mountains', slug: 'sunset-over-mountains', medium: 'PAINTING', style: 'LANDSCAPE', price: 2500 },
    { title: 'Abstract Composition No. 7', slug: 'abstract-composition-no-7', medium: 'PAINTING', style: 'ABSTRACT', price: 3200 },
    { title: 'Urban Reflections', slug: 'urban-reflections', medium: 'PHOTOGRAPHY', style: 'CONTEMPORARY', price: 1800 },
  ];

  for (const aw of artworks) {
    await prisma.artwork.upsert({
      where: { slug: aw.slug },
      update: {},
      create: {
        title: aw.title,
        slug: aw.slug,
        description: `A beautiful ${aw.medium.toLowerCase()} for E2E testing.`,
        medium: aw.medium as any,
        style: aw.style as any,
        price: aw.price,
        currency: 'USD',
        year: 2024,
        status: 'AVAILABLE' as any,
        artistId: artist.id,
      },
    });
  }
  console.log('[E2E Seed] 3 artworks created.');
  console.log('[E2E Seed] Done.');
}

main()
  .catch((e) => {
    console.error('[E2E Seed] Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
