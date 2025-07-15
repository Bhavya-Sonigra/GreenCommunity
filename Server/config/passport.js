import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile);
    const email = profile.emails[0].value;
    
    // First, check if user exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // If no user with Google ID, check if user exists with this email
    user = await User.findOne({ email: email });
    
    if (user) {
      // User exists with this email, update to include Google ID
      user.googleId = profile.id;
      user.isEmailVerified = true; // Google emails are verified
      await user.save();
      return done(null, user);
    }
    
    // Create new user if no existing user found
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
      isEmailVerified: true // Google emails are verified
    });
    
    return done(null, user);
  } catch (error) {
    console.error('Google auth error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Save user ID to session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});