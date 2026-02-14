import multer from 'multer';
import type { RequestHandler } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Allowed file types for artwork images
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'];

// Maximum file size (50MB for high-res art)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Cloudinary storage configuration for artwork images
 */
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    return {
      folder: 'artworks',
      allowed_formats: ALLOWED_FORMATS,
      // Use original filename (sanitized)
      public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_'),
      resource_type: 'auto' as const,
    };
  },
});

/**
 * File filter to validate uploads
 */
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const ext = file.originalname.split('.').pop()?.toLowerCase();
  if (ext && ALLOWED_FORMATS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_FORMATS.join(', ')}`));
  }
};

/**
 * Multer upload middleware - configured to use Cloudinary storage
 */
export const upload = multer({
  storage: cloudinaryStorage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Upload single artwork image
 */
export const uploadArtworkImage: RequestHandler = upload.single('image');

/**
 * Upload multiple artwork images (up to 10)
 */
export const uploadArtworkImages: RequestHandler = upload.array('images', 10);
