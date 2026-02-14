import { Router, Request, Response } from 'express';
import { uploadArtworkImage, uploadArtworkImages } from '../middleware/upload';
import { getImageUrl, getImageInfo } from '../config/cloudinary';

const router: Router = Router();

/**
 * @route   POST /upload/artwork
 * @desc    Upload single artwork image
 * @access  Private (Admin/Gallery Staff)
 */
router.post('/artwork', uploadArtworkImage, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const file = req.file as any;

    // Get different sizes
    const response: any = {
      success: true,
      message: 'Image uploaded successfully',
      image: {
        publicId: file.filename || file.path,
        url: file.path,
        width: file.width,
        height: file.height,
        format: file.format,
        size: file.size,
      },
    };

    // If Cloudinary, add transformation URLs
    if (file.filename) {
      response.image.thumbnailUrl = getImageUrl(file.filename, 'thumbnail');
      response.image.mediumUrl = getImageUrl(file.filename, 'medium');
      response.image.largeUrl = getImageUrl(file.filename, 'large');
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   POST /upload/artworks
 * @desc    Upload multiple artwork images
 * @access  Private (Admin/Gallery Staff)
 */
router.post('/artworks', uploadArtworkImages, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
      return;
    }

    const images = req.files.map((file: any) => {
      const imageData: any = {
        publicId: file.filename || file.path,
        url: file.path,
        width: file.width,
        height: file.height,
        format: file.format,
        size: file.size,
      };

      // If Cloudinary, add transformation URLs
      if (file.filename) {
        imageData.thumbnailUrl = getImageUrl(file.filename, 'thumbnail');
        imageData.mediumUrl = getImageUrl(file.filename, 'medium');
        imageData.largeUrl = getImageUrl(file.filename, 'large');
      }

      return imageData;
    });

    res.status(201).json({
      success: true,
      message: `${images.length} image(s) uploaded successfully`,
      images,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   GET /upload/info/:publicId
 * @desc    Get image information
 * @access  Public
 */
router.get('/info/:publicId', async (req: Request, res: Response): Promise<void> => {
  try {
    const publicId = req.params.publicId as string;
    const info = await getImageInfo(publicId);

    res.status(200).json({
      success: true,
      info,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Image not found',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
