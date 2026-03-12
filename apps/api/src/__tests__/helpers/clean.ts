import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Delete all rows from every table in FK-safe order */
export async function cleanDatabase() {
  await prisma.favorite.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.collectionArtwork.deleteMany();
  await prisma.artworkImage.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.article.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

export async function disconnectTestDb() {
  await prisma.$disconnect();
}
