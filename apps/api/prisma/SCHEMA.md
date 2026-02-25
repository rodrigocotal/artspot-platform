# Database Schema Documentation

## Overview

ArtSpot uses PostgreSQL with Prisma ORM. This document describes the Phase 1 database schema for artwork browsing, artist management, collections, and collector inquiries.

## Entity Relationship Diagram

```
┌─────────┐         ┌─────────┐         ┌─────────────┐
│  User   │────────<│ Inquiry │>────────│   Artwork   │
└─────────┘         └─────────┘         └─────────────┘
     │                                          │
     │                                          │
     ├──────────<┌──────────┐                  │
     │           │ Favorite │>─────────────────┤
     │           └──────────┘                  │
     │                                          │
     │                                          │
     │                                    ┌─────┴─────┐
     │                                    │   Artist  │
     │                                    └───────────┘
     │                                          │
     │                                          │
     └──────────<┌──────────────────┐          │
                 │ ArtworkImage     │<─────────┤
                 └──────────────────┘          │
                                               │
     ┌──────────────────┐                      │
     │   Collection     │                      │
     └──────────────────┘                      │
              │                                │
              │                                │
              └────<┌──────────────────┐>──────┘
                    │CollectionArtwork │
                    └──────────────────┘
```

## Models

### User
**Purpose:** Authentication and user management for collectors, gallery staff, and admins.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| email | String | Unique email address |
| name | String? | User's display name |
| role | UserRole | COLLECTOR, GALLERY_STAFF, ADMIN |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:**
- `inquiries[]` - Artwork inquiries submitted by user
- `favorites[]` - User's saved/favorited artworks

---

### Artist
**Purpose:** Artist profiles with biography, statement, and contact information.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Artist's full name |
| slug | String | URL-friendly unique identifier |
| bio | Text? | Biography |
| statement | Text? | Artist statement |
| location | String? | Geographic location |
| website | String? | Personal website URL |
| email | String? | Contact email |
| phoneNumber | String? | Contact phone |
| profileImageUrl | String? | Profile photo URL (Cloudinary) |
| featured | Boolean | Featured on homepage (default: false) |
| verified | Boolean | Verified artist badge (default: false) |
| displayOrder | Int? | Sort order for listings |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:**
- `artworks[]` - Artworks created by this artist

**Indexes:**
- Unique on `slug`

---

### Artwork
**Purpose:** Core artwork entity with details, pricing, availability, and metadata.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Artwork title |
| slug | String | URL-friendly unique identifier |
| description | Text? | Detailed description |
| artistId | String | Foreign key to Artist |
| medium | ArtworkMedium | PAINTING, SCULPTURE, PHOTOGRAPHY, etc. |
| style | ArtworkStyle? | ABSTRACT, CONTEMPORARY, FIGURATIVE, etc. |
| year | Int? | Year created |
| width | Decimal? | Width in centimeters |
| height | Decimal? | Height in centimeters |
| depth | Decimal? | Depth in centimeters |
| price | Decimal | Price (with 2 decimal precision) |
| currency | String | Currency code (default: USD) |
| status | AvailabilityStatus | AVAILABLE, SOLD, RESERVED, etc. |
| featured | Boolean | Featured artwork (default: false) |
| edition | String? | Edition info (e.g., "1/10") |
| materials | String? | Additional materials info |
| signature | String? | Signature details |
| certificate | Boolean | Has certificate of authenticity |
| framed | Boolean | Is framed |
| views | Int | View count (default: 0) |
| displayOrder | Int? | Sort order for listings |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:**
- `artist` - Artist who created this artwork
- `images[]` - Multiple high-resolution images
- `collectionItems[]` - Collections containing this artwork
- `inquiries[]` - Collector inquiries for this artwork
- `favorites[]` - Users who favorited this artwork

**Indexes:**
- Unique on `slug`
- Index on `artistId`
- Index on `medium`
- Index on `status`
- Index on `featured`

**Enums:**

**ArtworkMedium:**
```
PAINTING, SCULPTURE, PHOTOGRAPHY, PRINT, DRAWING, MIXED_MEDIA,
DIGITAL, INSTALLATION, TEXTILE, CERAMICS, GLASS, METAL, WOOD, OTHER
```

**ArtworkStyle:**
```
ABSTRACT, CONTEMPORARY, FIGURATIVE, IMPRESSIONIST, MINIMALIST,
REALISM, EXPRESSIONISM, SURREALISM, POP_ART, CONCEPTUAL,
LANDSCAPE, PORTRAIT, STILL_LIFE, OTHER
```

**AvailabilityStatus:**
```
AVAILABLE, SOLD, RESERVED, NOT_FOR_SALE, ON_LOAN
```

---

### ArtworkImage
**Purpose:** Multiple high-resolution images per artwork with Cloudinary integration.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| artworkId | String | Foreign key to Artwork |
| publicId | String | Cloudinary public ID (unique) |
| url | String | Image URL |
| secureUrl | String | HTTPS image URL |
| width | Int | Image width in pixels |
| height | Int | Image height in pixels |
| format | String | Image format (jpg, png, etc.) |
| size | Int | File size in bytes |
| type | ImageType | MAIN, DETAIL, INSTALLATION, etc. |
| displayOrder | Int | Sort order (default: 0) |
| caption | String? | Image caption |
| createdAt | DateTime | Upload timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:**
- `artwork` - Artwork this image belongs to

**Indexes:**
- Unique on `publicId`
- Index on `artworkId`

**ImageType Enum:**
```
MAIN, DETAIL, INSTALLATION, ALTERNATE, FRAME
```

---

### Collection
**Purpose:** Curated groupings of artworks (e.g., "New Arrivals", "Museum-Quality").

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Collection title |
| slug | String | URL-friendly unique identifier |
| description | Text? | Collection description |
| coverImageUrl | String? | Cover image URL (Cloudinary) |
| featured | Boolean | Featured collection (default: false) |
| displayOrder | Int? | Sort order for listings |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:**
- `artworks[]` - Artworks in this collection (via join table)

**Indexes:**
- Unique on `slug`

---

### CollectionArtwork
**Purpose:** Many-to-many relationship between Collections and Artworks.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| collectionId | String | Foreign key to Collection |
| artworkId | String | Foreign key to Artwork |
| displayOrder | Int | Sort order within collection (default: 0) |
| createdAt | DateTime | Addition timestamp |

**Relations:**
- `collection` - Collection this entry belongs to
- `artwork` - Artwork in the collection

**Indexes:**
- Unique constraint on `(collectionId, artworkId)`
- Index on `collectionId`
- Index on `artworkId`

---

### Inquiry
**Purpose:** Collector inquiries for artworks (Phase 1: contact form, Phase 2: messaging system).

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String | Foreign key to User |
| artworkId | String | Foreign key to Artwork |
| name | String | Contact name |
| email | String | Contact email |
| phone | String? | Contact phone |
| message | Text | Inquiry message |
| status | InquiryStatus | PENDING, RESPONDED, CLOSED |
| response | Text? | Gallery staff response |
| respondedAt | DateTime? | Response timestamp |
| respondedBy | String? | Staff user ID who responded |
| createdAt | DateTime | Inquiry submission timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relations:**
- `user` - User who submitted inquiry
- `artwork` - Artwork being inquired about

**Indexes:**
- Index on `userId`
- Index on `artworkId`
- Index on `status`

**InquiryStatus Enum:**
```
PENDING, RESPONDED, CLOSED
```

---

### Favorite
**Purpose:** User's saved/favorited artworks (wishlist).

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String | Foreign key to User |
| artworkId | String | Foreign key to Artwork |
| createdAt | DateTime | Favorite timestamp |

**Relations:**
- `user` - User who favorited the artwork
- `artwork` - Favorited artwork

**Indexes:**
- Unique constraint on `(userId, artworkId)`
- Index on `userId`
- Index on `artworkId`

---

## Common Query Patterns

### Get all available artworks with artist info
```prisma
prisma.artwork.findMany({
  where: { status: 'AVAILABLE' },
  include: {
    artist: true,
    images: {
      where: { type: 'MAIN' },
      take: 1
    }
  },
  orderBy: { displayOrder: 'asc' }
})
```

### Get artwork details with all images
```prisma
prisma.artwork.findUnique({
  where: { slug: 'artwork-slug' },
  include: {
    artist: true,
    images: {
      orderBy: { displayOrder: 'asc' }
    }
  }
})
```

### Get featured collections with artworks
```prisma
prisma.collection.findMany({
  where: { featured: true },
  include: {
    artworks: {
      include: {
        artwork: {
          include: {
            artist: true,
            images: {
              where: { type: 'MAIN' },
              take: 1
            }
          }
        }
      },
      orderBy: { displayOrder: 'asc' }
    }
  }
})
```

### Get user's favorites with artwork info
```prisma
prisma.favorite.findMany({
  where: { userId: 'user-id' },
  include: {
    artwork: {
      include: {
        artist: true,
        images: {
          where: { type: 'MAIN' },
          take: 1
        }
      }
    }
  },
  orderBy: { createdAt: 'desc' }
})
```

---

## Migration Commands

```bash
# Create a new migration after schema changes
pnpm prisma migrate dev --name migration_name

# Apply migrations in production
pnpm prisma migrate deploy

# Generate Prisma client (after schema changes)
pnpm prisma generate

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Reset database (development only)
pnpm prisma migrate reset
```

---

## Future Enhancements (Phase 2+)

- **Orders** - Purchase transactions
- **Payments** - Stripe integration
- **ShippingAddresses** - User addresses
- **Certificates** - Digital certificates of authenticity
- **ArtworkProvenance** - Ownership history
- **Messages** - Direct messaging system
- **Reviews** - Artwork/artist reviews
- **Analytics** - View tracking, conversion metrics
