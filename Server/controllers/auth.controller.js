import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import { UserInfo, initializeUserInfoModel } from '../models/UserInfo.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { validationResult } from 'express-validator';
import emailService from '../services/email.service.js';
import { generateJwtId, hashData, calculateDelay } from '../utils/security.js';


// Generate JWT token with additional security
const generateToken = (userId, userRole = 'user') => {
  const payload = {
    id: userId,
    role: userRole,
    iat: Math.floor(Date.now() / 1000),
    jti: generateJwtId() // JWT ID for token tracking
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256',
    issuer: 'greencommunity-app',
    audience: 'greencommunity-users'
  });
};

// User Registration
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  // Check if user exists - handle both verified and unverified accounts
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isEmailVerified) {
      return res.status(400).json({ message: 'Email already in use' });
    } else {
      // User exists but email not verified - allow re-registration with cleanup
      await User.deleteOne({ email });
      console.log(`Cleaned up unverified account for email: ${email}`);
    }
  }

  let user;
  try {
    user = await User.create({ 
      name, 
      email, 
      password, // Will be hashed by pre-save middleware
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Generate email verification code
    const verificationCode = user.generateEmailVerificationCode();
    await user.save();

    // Send verification email with code
    try {
      await emailService.sendEmailVerificationCode(user.email, verificationCode);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail registration if email fails - user can request resend
    }

    const token = generateToken(user._id);

    // Set HTTP-only cookie for security
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      token: token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    // If user creation fails, clean up any partial data
    if (user && user._id) {
      try {
        await User.deleteOne({ _id: user._id });
      } catch (cleanupError) {
        console.error('Error cleaning up user after failed registration:', cleanupError);
      }
    }
    throw error; // Re-throw the original error
  }
});

// User Login
export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Check if account is locked
  if (user.isLocked) {
    return res.status(423).json({ message: 'Account locked due to too many failed login attempts. Please try again in 30 minutes.' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    // Add delay to prevent rapid brute force
    await new Promise(resolve => setTimeout(resolve, 1000));
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();
  
  // Update last login info
  user.lastLogin = new Date();
  user.ipAddress = req.ip;
  user.userAgent = req.get('User-Agent');
  await user.save();

  const token = generateToken(user._id);

  // Set HTTP-only cookie for security
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.status(200).json({
    message: 'Login successful',
    token: token,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role
    }
  });
});

// Email Verification (legacy token-based)
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Email verified successfully' });
});

// Email Verification with Code
export const verifyEmailCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  const isValidCode = user.verifyEmailVerificationCode(code);
  if (!isValidCode) {
    return res.status(400).json({ message: 'Invalid or expired verification code' });
  }

  user.isEmailVerified = true;
  user.clearEmailVerificationCode();
  await user.save();

  res.status(200).json({ message: 'Email verified successfully' });
});

// Resend Email Verification Code
export const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email is already verified' });
  }

  // Generate new verification code
  const verificationCode = user.generateEmailVerificationCode();
  await user.save();

  // Send verification email with new code
  try {
    await emailService.sendEmailVerificationCode(user.email, verificationCode);
    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    return res.status(500).json({ message: 'Error sending verification code' });
  }
});

// Password Reset Request
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return res.status(200).json({ message: 'If the email exists, a verification code will be sent' });
  }

  const resetCode = user.generatePasswordResetCode();
  await user.save();

  try {
    await emailService.sendPasswordReset(user.email, resetCode);
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    await user.save();
    return res.status(500).json({ message: 'Error sending email' });
  }

  res.status(200).json({ message: 'If the email exists, a verification code will be sent' });
});

// Verify Reset Code
export const verifyResetCode = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  const isValidCode = user.verifyPasswordResetCode(code);
  if (!isValidCode) {
    return res.status(400).json({ message: 'Invalid or expired verification code' });
  }

  res.status(200).json({ 
    message: 'Verification code is valid',
    canResetPassword: true
  });
});

// Update Password with Code
export const updatePasswordWithCode = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  const isValidCode = user.verifyPasswordResetCode(code);
  if (!isValidCode) {
    return res.status(400).json({ message: 'Invalid or expired verification code' });
  }

  user.password = newPassword; // Will be hashed by pre-save middleware
  user.clearPasswordResetCode();
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

// Password Reset (Legacy - kept for backwards compatibility)
export const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password; // Will be hashed by pre-save middleware
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Fetch user info from separate database
  const userInfo = await UserInfo.findByUserId(req.user.id);
  
  // Include Google authentication status and UserInfo data
  const userResponse = {
    ...user.toObject(),
    isGoogleAuth: !!user.googleId,
    userInfo: userInfo ? {
      name: userInfo.name,
      phone: userInfo.phone,
      bio: userInfo.bio,
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
  
  res.status(200).json({ user: userResponse });
});

// Logout (client-side token removal)
export const logout = asyncHandler(async (req, res) => {
  // Clear the auth cookie
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});

// Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  
  // Check if user is authenticated via Google - prevent password changes
  if (user.googleId) {
    return res.status(400).json({ 
      message: 'Password cannot be changed for Google-authenticated accounts',
      code: 'GOOGLE_PASSWORD_READONLY'
    });
  }
  
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword; // Will be hashed by pre-save middleware
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
});

// Update Password for authenticated users (without current password verification)
export const updatePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { newPassword } = req.body;

  const user = await User.findById(req.user.id);
  
  user.password = newPassword; // Will be hashed by pre-save middleware
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});

// Update Profile Information
export const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    phone,
    location,
    bio,
    preferredUnits,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    profession
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is authenticated via Google - prevent email updates
    if (email && email !== user.email && user.googleId) {
      return res.status(400).json({ 
        message: 'Email cannot be changed for Google-authenticated accounts',
        code: 'GOOGLE_EMAIL_READONLY'
      });
    }

    // Check if email is being changed and if it already exists (for non-Google users)
    if (email && email !== user.email && !user.googleId) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
      user.isEmailVerified = false; // Reset email verification if email changed
      await user.save();
    }

    // Update name in auth database if provided
    if (name && name !== user.name) {
      user.name = name;
      await user.save();
    }

    // Prepare UserInfo update data
    const userInfoUpdate = {};
    
    if (name) userInfoUpdate.name = name;
    if (phone) userInfoUpdate.phone = phone;
    if (bio) userInfoUpdate.bio = bio;
    if (profession) userInfoUpdate.profession = profession;
    if (dateOfBirth) userInfoUpdate.dateOfBirth = new Date(dateOfBirth);
    if (gender) userInfoUpdate.gender = gender.toLowerCase();
    
    // Handle location update
    if (location) {
      const locationParts = location.split(',').map(part => part.trim()).filter(part => part.length > 0);
      userInfoUpdate.location = {
        city: locationParts[0] || '',
        state: locationParts[1] || '',
        country: locationParts[2] || ''
      };
    }

    // Handle preferences
    if (preferredUnits) {
      userInfoUpdate['preferences.units'] = preferredUnits;
    }

    // Update or create UserInfo record
    const userInfo = await UserInfo.createOrUpdate(req.user.id, userInfoUpdate);

    // Get the updated user data for response
    const updatedUser = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isEmailVerified: updatedUser.isEmailVerified,
        googleId: updatedUser.googleId,
        isGoogleAuth: !!updatedUser.googleId,
        userInfo: {
          name: userInfo.name,
          phone: userInfo.phone,
          bio: userInfo.bio,
          location: userInfo.location,
          profession: userInfo.profession,
          dateOfBirth: userInfo.dateOfBirth,
          gender: userInfo.gender,
          preferences: userInfo.preferences,
          profileCompletion: userInfo.profileCompletion
        }
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Update Notification Preferences
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const {
    emailUpdates,
    challengeReminders,
    weeklyReports,
    communityActivity,
    marketingEmails,
    mobilePush,
    socialActivity
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get current userInfo or create default notifications object
    let userInfo = await UserInfo.findByUserId(req.user.id);
    let currentNotifications = userInfo?.notifications || {};

    // Update notification preferences using UserInfo model
    const notificationPreferences = {
      emailUpdates: emailUpdates !== undefined ? emailUpdates : currentNotifications.emailUpdates !== undefined ? currentNotifications.emailUpdates : true,
      challengeReminders: challengeReminders !== undefined ? challengeReminders : currentNotifications.challengeReminders !== undefined ? currentNotifications.challengeReminders : true,
      weeklyReports: weeklyReports !== undefined ? weeklyReports : currentNotifications.weeklyReports !== undefined ? currentNotifications.weeklyReports : true,
      communityActivity: communityActivity !== undefined ? communityActivity : currentNotifications.communityActivity !== undefined ? currentNotifications.communityActivity : false,
      marketingEmails: marketingEmails !== undefined ? marketingEmails : currentNotifications.marketingEmails !== undefined ? currentNotifications.marketingEmails : false,
      mobilePush: mobilePush !== undefined ? mobilePush : currentNotifications.mobilePush !== undefined ? currentNotifications.mobilePush : true,
      socialActivity: socialActivity !== undefined ? socialActivity : currentNotifications.socialActivity !== undefined ? currentNotifications.socialActivity : true
    };

    // Update or create UserInfo record with notification preferences
    const updatedUserInfo = await UserInfo.createOrUpdate(req.user.id, {
      notifications: notificationPreferences
    });

    res.status(200).json({
      message: 'Notification preferences updated successfully',
      notificationPreferences
    });
  } catch (error) {
    console.error('Notification preferences update error:', error);
    res.status(500).json({ message: 'Error updating notification preferences' });
  }
});

// Update App Preferences
export const updateAppPreferences = asyncHandler(async (req, res) => {
  const {
    theme,
    language,
    currency,
    units,
    privacy,
    dataSharing
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get current userInfo or create default preferences object
    let userInfo = await UserInfo.findByUserId(req.user.id);
    let currentPreferences = userInfo?.preferences || {};

    // Update app preferences using UserInfo model
    const appPreferences = {
      theme: theme !== undefined ? theme : currentPreferences.theme || 'light',
      language: language !== undefined ? language : currentPreferences.language || 'en',
      currency: currency !== undefined ? currency : currentPreferences.currency || 'usd',
      units: units !== undefined ? units : currentPreferences.units || 'metric',
      privacy: privacy !== undefined ? privacy : currentPreferences.privacy || 'public',
      dataSharing: dataSharing !== undefined ? dataSharing : currentPreferences.dataSharing || false
    };

    // Update or create UserInfo record with app preferences
    const updatedUserInfo = await UserInfo.createOrUpdate(req.user.id, {
      preferences: appPreferences
    });

    res.status(200).json({
      message: 'App preferences updated successfully',
      appPreferences
    });
  } catch (error) {
    console.error('App preferences update error:', error);
    res.status(500).json({ message: 'Error updating app preferences' });
  }
});

// Get User Profile and Settings
export const getUserSettings = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user info from separate database
    const userInfo = await UserInfo.findByUserId(req.user.id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        marketplace_activity: user.marketplace_activity,
        googleId: user.googleId, // Include Google ID to determine authentication method
        isGoogleAuth: !!user.googleId, // Boolean flag for easier frontend use
        userInfo: userInfo ? {
          name: userInfo.name,
          phone: userInfo.phone,
          bio: userInfo.bio,
          location: userInfo.location,
          profession: userInfo.profession,
          dateOfBirth: userInfo.dateOfBirth,
          gender: userInfo.gender,
          preferences: userInfo.preferences,
          notifications: userInfo.notifications,
          profileCompletion: userInfo.profileCompletion,
          formattedLocation: userInfo.getFormattedLocation()
        } : null
      }
    });
  } catch (error) {
    console.error('Get user settings error:', error);
    res.status(500).json({ message: 'Error fetching user settings' });
  }
});
