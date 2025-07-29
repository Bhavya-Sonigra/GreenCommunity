import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'greencommunity/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face:auto',
        quality: 'auto:good',
        format: 'webp'
      }
    ],
    public_id: (req, file) => {
      // Generate unique public ID using user ID and timestamp
      const userId = req.user?.id || 'anonymous';
      const timestamp = Date.now();
      return `avatar_${userId}_${timestamp}`;
    }
  }
});

// Configure multer with file validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
      return;
    }

    // Check specific image formats
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
      return;
    }

    cb(null, true);
  }
});

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    if (!publicId) return null;
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to optimize image URL
const optimizeImageUrl = (url, options = {}) => {
  if (!url) return null;
  
  const {
    width = 400,
    height = 400,
    quality = 'auto:good',
    format = 'webp'
  } = options;
  
  try {
    // Extract public ID from Cloudinary URL
    const publicIdMatch = url.match(/\/v\d+\/(.+)\./);
    if (!publicIdMatch) return url;
    
    const publicId = publicIdMatch[1];
    
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      gravity: 'face:auto',
      quality,
      format,
      secure: true
    });
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return url;
  }
};

export { 
  cloudinary, 
  upload, 
  deleteImage, 
  optimizeImageUrl 
};

export default cloudinary;
