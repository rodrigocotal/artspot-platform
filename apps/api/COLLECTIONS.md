# Collections Feature

## Overview

Collections are curated groupings of artworks that showcase specific themes, styles, or selections. The platform supports two special automated collections that are dynamically populated based on artwork metadata.

## Special Collections

### 1. New Arrivals
**Slug:** `new-arrivals`
**Purpose:** Showcase recently added artworks to help collectors discover the latest additions.

**Population Logic:**
- Automatically populated with artworks added in the last 30 days
- Only includes artworks with `status: AVAILABLE`
- Sorted by creation date (newest first)
- Limited to 20 most recent artworks

**Update Frequency:** Run seed script weekly or after bulk artwork imports

### 2. Museum-Quality
**Slug:** `museum-quality`
**Purpose:** Highlight premium, investment-grade artworks suitable for prestigious collections.

**Population Logic:**
- Automatically populated with featured artworks (`featured: true`)
- Only includes artworks with `status: AVAILABLE`
- Sorted by display order, then price (highest first)
- Limited to 20 best pieces

**Update Frequency:** Run seed script when featuring new artworks or quarterly

## Running the Seed Script

### Initial Setup
```bash
# From the API directory
pnpm run seed:collections
```

### Automated Updates
For production, set up a cron job or scheduled task to run the seed script periodically:

```bash
# Example: Weekly updates (every Sunday at 2 AM)
0 2 * * 0 cd /path/to/artspot/apps/api && pnpm run seed:collections
```

### Manual Updates via API
You can also create an admin endpoint to trigger collection updates:

```typescript
// POST /admin/collections/refresh
router.post('/admin/collections/refresh', async (req, res) => {
  // Import and run seed logic
  await refreshCollections();
  res.json({ success: true, message: 'Collections updated' });
});
```

## Custom Collections

Gallery staff can create custom collections through:

1. **API Endpoints:**
   - `POST /collections` - Create new collection
   - `POST /collections/:id/artworks` - Add artworks to collection
   - `DELETE /collections/:id/artworks/:artworkId` - Remove artwork from collection

2. **Strapi CMS (when implemented):**
   - Visual interface for creating and managing collections
   - Drag-and-drop artwork ordering

## Collection Schema

```typescript
interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null; // Optional custom cover image
  featured: boolean;             // Show on homepage
  displayOrder: number | null;   // Order in featured section
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionArtwork {
  collectionId: string;
  artworkId: string;
  displayOrder: number; // Order within collection
}
```

## Best Practices

1. **Cover Images:**
   - Upload custom cover images for important collections
   - If no cover image, the system uses the first artwork's main image
   - Recommended size: 1920x1080px (16:9 aspect ratio)

2. **Descriptions:**
   - Write compelling descriptions (200-400 characters)
   - Focus on the theme, style, or significance of the collection
   - Use language that appeals to collectors

3. **Featured Status:**
   - Limit to 6 featured collections maximum for homepage
   - Use displayOrder to control homepage order
   - Featured collections appear first in collection listings

4. **Artwork Selection:**
   - Keep collections focused (10-30 artworks ideal)
   - Ensure visual cohesion
   - Order artworks intentionally using displayOrder

## Future Enhancements

- [ ] Automated collection refresh via cron job
- [ ] Admin dashboard for collection management
- [ ] Collection analytics (views, inquiries)
- [ ] Collaborative collections (multiple curators)
- [ ] Time-limited collections (exhibitions)
- [ ] Collection templates (by medium, style, artist, price range)
