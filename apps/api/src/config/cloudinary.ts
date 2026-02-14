import { v2 as cloudinary } from 'cloudinary';
import { config } from './environment';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

/**
 * Upload presets for different image types
 */
export const UPLOAD_PRESETS = {
  ARTWORK: 'artspot_artwork',
  ARTIST: 'artspot_artist',
  COLLECTION: 'artspot_collection',
} as const;

/**
 * Image transformation presets for artwork images
 */
export const ARTWORK_TRANSFORMATIONS = {
  // Thumbnail (for cards/listings)
  thumbnail: {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
    format: 'auto',
  },
  // Medium (for detail pages)
  medium: {
    width: 1200,
    height: 1200,
    crop: 'limit',
    quality: 'auto:best',
    format: 'auto',
  },
  // Large (for zoom/lightbox - 3.0x)
  large: {
    width: 3600,
    height: 3600,
    crop: 'limit',
    quality: 'auto:best',
    format: 'auto',
    flags: 'preserve_transparency',
  },
  // Original (preserve color profiles for art)
  original: {
    quality: 100,
    flags: 'preserve_transparency.keep_iptc',
  },
} as const;

/**
 * Helper to generate image URL with transformations
 */
export function getImageUrl(
  publicId: string,
  transformation: keyof typeof ARTWORK_TRANSFORMATIONS = 'medium'
): string {
  return cloudinary.url(publicId, ARTWORK_TRANSFORMATIONS[transformation]);
}

/**
 * Helper to upload artwork image
 */
export async function uploadArtworkImage(
  file: string | Buffer,
  options: {
    publicId?: string;
    folder?: string;
    tags?: string[];
  } = {}
) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'artworks',
      public_id: options.publicId,
      upload_preset: UPLOAD_PRESETS.ARTWORK,
      tags: options.tags || [],
      // Preserve color profiles for art
      colors: true,
      image_metadata: true,
      quality_analysis: true,
      // Auto-detect and optimize format
      format: 'auto',
      // Create responsive breakpoints
      responsive_breakpoints: {
        create_derived: true,
        bytes_step: 20000,
        min_width: 400,
        max_width: 3600,
        max_images: 5,
      },
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      colors: result.colors,
      thumbnailUrl: getImageUrl(result.public_id, 'thumbnail'),
      mediumUrl: getImageUrl(result.public_id, 'medium'),
      largeUrl: getImageUrl(result.public_id, 'large'),
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Helper to delete image
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Helper to get image info
 */
export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      colors: true,
      image_metadata: true,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    throw new Error('Failed to get image info from Cloudinary');
  }
}

export default cloudinary;
