import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  requestPasswordReset, 
  resetPassword, 
  getCurrentUser, 
  logout, 
  changePassword,
  verifyResetCode,
  updatePasswordWithCode,
  updatePassword
} from '../controllers/auth.controller.js';
import { 
  validateRegister, 
  validateLogin, 
  validatePasswordResetRequest, 
  validatePasswordReset,
  validateVerifyResetCode,
  validateUpdatePasswordWithCode,
  validateUpdatePassword
} from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: 15 * 60 * 1000 // 15 minutes in milliseconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 forgot password requests per windowMs
  message: {
    error: 'Too many password reset requests, please try again later.',
    retryAfter: 15 * 60 * 1000 // 15 minutes in milliseconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

const router = express.Router();

// Authentication Routes
router.post('/register', validateRegister, registerUser);
router.post('/login', loginLimiter, validateLogin, loginUser);
router.post('/logout', logout);

// Email Verification
router.post('/verify-email', verifyEmail);

// Password Reset
router.post('/forgot-password', forgotPasswordLimiter, validatePasswordResetRequest, requestPasswordReset);
router.post('/reset-password', validatePasswordReset, resetPassword);
router.post('/verify-reset-code', validateVerifyResetCode, verifyResetCode);
router.post('/update-password-with-code', validateUpdatePasswordWithCode, updatePasswordWithCode);

// Protected Routes
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);
router.post('/update-password', authenticate, validateUpdatePassword, updatePassword);

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

      // Redirect with token as URL parameter for client-side storage
      const redirectUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${redirectUrl}/?auth=success&token=${token}`);
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
