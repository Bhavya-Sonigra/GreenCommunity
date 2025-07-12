import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/login', loginUser);

// Google OAuth - Start login flow
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth - Callback after login
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    // Generate JWT on successful login
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

// Optional failure route
router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Google login failed' });
});

export default router;