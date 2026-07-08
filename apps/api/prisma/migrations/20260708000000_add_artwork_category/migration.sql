-- CreateEnum
CREATE TYPE "ArtworkCategory" AS ENUM ('LATIN_AMERICAN_ART', 'KINETIC_ART', 'OTHER');

-- AlterTable
ALTER TABLE "artworks" ADD COLUMN "category" "ArtworkCategory";

-- CreateIndex
CREATE INDEX "artworks_category_idx" ON "artworks"("category");
