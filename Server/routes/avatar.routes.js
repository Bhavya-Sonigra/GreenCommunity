import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import {
  uploadProfilePicture,
  deleteProfilePicture
} from '../controllers/avatar.controller.js';

const router = express.Router();

// @route   POST /api/avatar/upload
// @desc    Upload profile picture
// @access  Private
router.post('/upload', 
  authenticate, 
  upload.single('avatar'), // 'avatar' should match the field name in the form data
  uploadProfilePicture
);

// @route   DELETE /api/avatar
// @desc    Delete profile picture
// @access  Private
router.delete('/', 
  authenticate, 
  deleteProfilePicture
);

export default router;
