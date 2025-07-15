import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  requestPasswordReset, 
  resetPassword, 
  getCurrentUser, 
  logout, 
  changePassword 
} from '../controllers/auth.controller.js';
import { 
  validateRegister, 
  validateLogin, 
  validatePasswordResetRequest, 
  validatePasswordReset 
} from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Authentication Routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logout);

// Email Verification
router.post('/verify-email', verifyEmail);

// Password Reset
router.post('/forgot-password', validatePasswordResetRequest, requestPasswordReset);
router.post('/reset-password', validatePasswordReset, resetPassword);

// Protected Routes
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);

// Google OAuth - Start login flow
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth - Callback after login
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    try {
      // Generate JWT on successful login
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      // Update last login info
      req.user.lastLogin = new Date();
      req.user.ipAddress = req.ip;
      req.user.userAgent = req.get('User-Agent');
      req.user.save();

      // Set HTTP-only cookie for security
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Redirect to clean URL without token
      const redirectUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${redirectUrl}/?auth=success`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
    }
  }
);

// OAuth failure route
router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Google login failed' });
});

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Auth service is healthy' });
});

export default router;
