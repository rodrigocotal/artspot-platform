import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, { UPLOAD_PRESETS } from '../config/cloudinary';
import { config } from '../config/environment';

// Allowed file types for artwork images
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'];

// Maximum file size (50MB for high-res art)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Cloudinary storage configuration for artwork images
 */
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'artworks',
      upload_preset: UPLOAD_PRESETS.ARTWORK,
      allowed_formats: ALLOWED_FORMATS,
      // Use original filename (sanitized)
      public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_'),
    };
  },
});

/**
 * Local storage configuration (fallback if Cloudinary not configured)
 */
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

/**
 * File filter to validate uploads
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const ext = file.originalname.split('.').pop()?.toLowerCase();
  if (ext && ALLOWED_FORMATS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_FORMATS.join(', ')}`));
  }
};

/**
 * Multer upload middleware
 */
const storage = config.cloudinary.cloudName ? cloudinaryStorage : localStorage;

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Upload single artwork image
 */
export const uploadArtworkImage = upload.single('image');

/**
 * Upload multiple artwork images (up to 10)
 */
export const uploadArtworkImages = upload.array('images', 10);
