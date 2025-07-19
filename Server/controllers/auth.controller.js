import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { validationResult } from 'express-validator';
import emailService from '../services/email.service.js';


// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

// User Registration
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ 
    name, 
    email, 
    password, // Will be hashed by pre-save middleware
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email
  try {
    await emailService.sendEmailVerification(user.email, verificationToken, process.env.CLIENT_URL);
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    // Don't fail registration if email fails
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
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      isEmailVerified: user.isEmailVerified
    }
  });
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
    return res.status(401).json({ message: 'Invalid credentials' });
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
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role
    }
  });
});

// Email Verification
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
  res.status(200).json({ user });
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
