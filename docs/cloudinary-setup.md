# Cloudinary Setup Guide

## Overview

Cloudinary is configured for managing high-resolution artwork images with automatic optimization, transformations, and CDN delivery.

## Account Setup

### 1. Create Cloudinary Account

1. Visit: https://cloudinary.com/users/register_free
2. Sign up (free tier includes):
   - 25 GB storage
   - 25 GB bandwidth/month
   - 25,000 transformations/month

### 2. Get Credentials

From your Cloudinary Dashboard:
- **Cloud Name**: Your account identifier
- **API Key**: Public key
- **API Secret**: Private key (keep secure!)

## Configuration

### API Configuration

Add to `apps/api/.env`:
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### CMS Configuration

Add to `apps/cms/.env`:
```bash
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret
```

### Frontend Configuration

Add to `apps/web/.env.local`:
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Upload Presets

Create these upload presets in Cloudinary dashboard:

### 1. artspot_artwork
**Settings → Upload → Upload presets → Add upload preset**

- **Name**: `artspot_artwork`
- **Mode**: Unsigned (for frontend uploads) or Signed (for backend only)
- **Folder**: `artworks`
- **Allowed formats**: jpg, png, webp, avif, tiff
- **Max file size**: 50 MB
- **Transformations**:
  - Quality: Auto:best
  - Format: Auto (automatic format selection)
  - Preserve color profile: Yes
  - Keep metadata: Yes (IPTC, XMP)

### 2. artspot_artist
- **Name**: `artspot_artist`
- **Folder**: `artists`
- **Max file size**: 10 MB
- **Face detection**: Enabled
- **Transformations**:
  - Crop: Fill
  - Gravity: Face
  - Quality: Auto:good

### 3. artspot_collection
- **Name**: `artspot_collection`
- **Folder**: `collections`
- **Max file size**: 10 MB

## Image Transformations

### Automatic Sizes Generated

For each artwork image, we create:

1. **Thumbnail** (400×400px)
   - For artwork cards/listings
   - Crop: Fill with auto gravity
   - Quality: Auto:good
   - Format: Auto (WebP on supported browsers)

2. **Medium** (1200×1200px)
   - For detail pages
   - Crop: Limit (maintain aspect ratio)
   - Quality: Auto:best

3. **Large** (3600×3600px)
   - For zoom/lightbox (3.0x zoom as per designs)
   - Crop: Limit
   - Quality: Auto:best
   - Preserve transparency

4. **Original**
   - Preserve color profiles
   - Keep IPTC metadata
   - Quality: 100%

### Responsive Images

Cloudinary automatically generates responsive breakpoints:
- Min width: 400px
- Max width: 3600px
- 5 different sizes
- Optimizes bandwidth based on device

## API Endpoints

### Upload Single Image
```bash
POST /upload/artwork
Content-Type: multipart/form-data

# Form data:
image: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "image": {
    "publicId": "artworks/garden_of_dreams",
    "url": "https://res.cloudinary.com/.../image.jpg",
    "thumbnailUrl": "https://res.cloudinary.com/.../c_fill,w_400,h_400/...",
    "mediumUrl": "https://res.cloudinary.com/.../w_1200,h_1200/...",
    "largeUrl": "https://res.cloudinary.com/.../w_3600,h_3600/...",
    "width": 4000,
    "height": 3000,
    "format": "jpg",
    "size": 2500000
  }
}
```

### Upload Multiple Images
```bash
POST /upload/artworks
Content-Type: multipart/form-data

# Form data:
images[]: [file1]
images[]: [file2]
```

### Get Image Info
```bash
GET /upload/info/:publicId
```

## Testing Upload

### Using cURL
```bash
curl -X POST http://localhost:4000/upload/artwork \
  -F "image=@/path/to/artwork.jpg"
```

### Using Postman
1. Create POST request to `http://localhost:4000/upload/artwork`
2. Body → form-data
3. Key: `image`, Type: File
4. Select artwork file
5. Send

## Color Profile Preservation

Critical for art marketplace:
- ✅ ICC color profiles preserved
- ✅ IPTC metadata maintained
- ✅ EXIF data kept
- ✅ XMP data preserved

This ensures artworks appear with accurate colors across devices.

## Optimization Features

### Automatic Format Selection
- WebP for Chrome, Firefox, Edge
- AVIF for browsers that support it
- JPEG fallback for older browsers

### Quality Analysis
Cloudinary analyzes each image and applies optimal compression without visible quality loss.

### Lazy Loading
Use Cloudinary's lazy load URLs for better performance:
```javascript
<img loading="lazy" src={thumbnailUrl} />
```

## Folder Structure

```
cloudinary://
├── artworks/
│   ├── painting_001.jpg
│   ├── sculpture_002.jpg
│   └── ...
├── artists/
│   ├── carlos_oviedo.jpg
│   └── ...
└── collections/
    ├── modern_abstract.jpg
    └── ...
```

## Security

### API Keys
- ✅ API Secret never exposed to frontend
- ✅ Use signed uploads for sensitive content
- ✅ Environment variables for all credentials

### Upload Restrictions
- File type validation (server-side)
- File size limits (50MB for artworks)
- Folder restrictions per preset

## Monitoring

### Cloudinary Dashboard
Monitor usage:
- Storage used
- Bandwidth consumed
- Transformations performed
- API requests

### Alerts
Set up alerts for:
- 80% storage usage
- 80% bandwidth usage
- High error rates

## Costs

### Free Tier (Sufficient for MVP)
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

### Paid Plans (When Scaling)
- **Plus**: $99/month
  - 93 GB storage
  - 93 GB bandwidth
  - 100,000 transformations
- **Advanced**: $249/month
  - 230 GB storage
  - 230 GB bandwidth
  - 300,000 transformations

## Best Practices

1. **Use transformations** - Don't store multiple sizes, generate on-the-fly
2. **Enable auto format** - Let Cloudinary choose best format
3. **Lazy load images** - Improve page load performance
4. **Use CDN URLs** - Already included in all Cloudinary URLs
5. **Set up webhooks** - Get notified of upload events
6. **Tag images** - For better organization (artwork_id, artist_name, etc.)

## Troubleshooting

### Upload Fails
- Check file size (<50MB)
- Verify file format (jpg, png, webp, avif, tiff)
- Confirm API credentials in `.env`

### Images Not Loading
- Check public_id is correct
- Verify Cloud Name in URLs
- Ensure CDN delivery is enabled

### Color Profile Issues
- Verify `colors: true` in upload options
- Check `image_metadata: true` is set
- Confirm `quality: 100` for originals

## Next Steps

1. Get Cloudinary credentials
2. Add to environment files
3. Create upload presets
4. Test image upload
5. Integrate with artwork management (Sprint 3)
