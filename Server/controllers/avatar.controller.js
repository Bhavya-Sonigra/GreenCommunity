import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import { UserInfo, initializeUserInfoModel } from '../models/UserInfo.model.js';
import { upload, deleteImage } from '../config/cloudinary.js';

// Upload Profile Picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get current userInfo to check for existing avatar
    const existingUserInfo = await UserInfo.findByUserId(req.user.id);
    
    // If user has an existing avatar, delete it from Cloudinary
    if (existingUserInfo?.avatar?.publicId) {
      try {
        await deleteImage(existingUserInfo.avatar.publicId);
        console.log('Previous avatar deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Error deleting previous avatar:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Create avatar object with Cloudinary data
    const avatarData = {
      url: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public ID
      uploadedAt: new Date()
    };

    // Update or create UserInfo record with new avatar
    const updatedUserInfo = await UserInfo.createOrUpdate(req.user.id, {
      name: user.name, // Ensure name is included
      avatar: avatarData
    });

    // Get the full updated user info to return
    const fullUserData = await User.findById(req.user.id).select('-password');
    const userInfo = await UserInfo.findByUserId(req.user.id);
    
    const userResponse = {
      ...fullUserData.toObject(),
      isGoogleAuth: !!fullUserData.googleId,
      userInfo: userInfo ? {
        name: userInfo.name,
        phone: userInfo.phone,
        bio: userInfo.bio,
        avatar: userInfo.avatar,
        location: userInfo.location,
        profession: userInfo.profession,
        dateOfBirth: userInfo.dateOfBirth,
        gender: userInfo.gender,
        preferences: userInfo.preferences,
        notifications: userInfo.notifications,
        profileCompletion: userInfo.profileCompletion,
        formattedLocation: userInfo.getFormattedLocation()
      } : null
    };

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    
    // Handle specific multer errors
    if (error.message && error.message.includes('Only image files are allowed')) {
      return res.status(400).json({ message: 'Only image files are allowed (JPEG, PNG, WebP)' });
    }
    if (error.message && error.message.includes('File too large')) {
      return res.status(400).json({ message: 'Image file size must be less than 5MB' });
    }
    
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
});

// Delete Profile Picture
export const deleteProfilePicture = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get current userInfo
    const userInfo = await UserInfo.findByUserId(req.user.id);
    
    if (!userInfo?.avatar?.publicId) {
      return res.status(404).json({ message: 'No profile picture found' });
    }

    // Delete image from Cloudinary
    try {
      await deleteImage(userInfo.avatar.publicId);
      console.log('Avatar deleted from Cloudinary');
    } catch (deleteError) {
      console.error('Error deleting avatar from Cloudinary:', deleteError);
      return res.status(500).json({ message: 'Error deleting image from cloud storage' });
    }

    // Remove avatar from UserInfo
    const updatedUserInfo = await UserInfo.createOrUpdate(req.user.id, {
      avatar: {
        url: null,
        publicId: null,
        uploadedAt: null
      }
    });

    res.status(200).json({
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    console.error('Profile picture deletion error:', error);
    res.status(500).json({ message: 'Error deleting profile picture' });
  }
});
