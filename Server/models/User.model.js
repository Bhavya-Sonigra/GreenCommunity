import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { generateSecureToken, generateSecureCode, hashData, isCommonPassword } from '../utils/security.js';
import { getConnection, DB_NAMES } from '../config/databases.js';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  password: { 
    type: String,
    minlength: 8,
    validate: {
      validator: function(password) {
        // Only validate if password is being set (not for OAuth users)
        if (!password && !this.googleId) return false;
        if (!password) return true; // OAuth users don't need password
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  googleId: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  emailVerificationCode: String,
  emailVerificationCodeExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordResetCode: String,
  passwordResetCodeExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  ipAddress: String,
  userAgent: String,

  // Marketplace Profile
  marketplace_profile: {
    is_seller: {
      type: Boolean,
      default: false
    },
    seller_status: {
      type: String,
      enum: ['pending', 'approved', 'suspended', 'rejected'],
      default: 'pending'
    },
    business_name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    business_description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    business_address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true }
    },
    tax_id: {
      type: String,
      select: false // Sensitive data - don't include by default
    },
    bank_details: {
      account_holder: String,
      account_number: {
        type: String,
        select: false // Sensitive data
      },
      routing_number: {
        type: String,
        select: false // Sensitive data
      },
      bank_name: String
    },
    seller_rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      total_reviews: { type: Number, default: 0 }
    },
    verification: {
      identity_verified: { type: Boolean, default: false },
      business_verified: { type: Boolean, default: false },
      tax_verified: { type: Boolean, default: false },
      verified_at: Date,
      verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    seller_metrics: {
      total_sales: { type: Number, default: 0 },
      total_orders: { type: Number, default: 0 },
      response_time: { type: Number, default: 0 }, // hours
      dispute_rate: { type: Number, default: 0 }, // percentage
      return_rate: { type: Number, default: 0 } // percentage
    }
  },

  // Customer Profile
  customer_profile: {
    shipping_addresses: [{
      name: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: String,
      is_default: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now }
    }],
    preferred_categories: [String],
    sustainability_preference: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    price_range_preference: {
      min: Number,
      max: Number
    },
    delivery_preferences: {
      standard: { type: Boolean, default: true },
      express: { type: Boolean, default: false },
      eco_friendly: { type: Boolean, default: true }
    }
  },

  // Activity Tracking
  marketplace_activity: {
    total_purchases: { type: Number, default: 0 },
    total_spent: { type: Number, default: 0 },
    favorite_sellers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    recent_searches: [{
      query: String,
      searched_at: { type: Date, default: Date.now }
    }],
    last_purchase_date: Date,
    loyalty_points: { type: Number, default: 0 },
    customer_tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    }
  },

  // Profile Information
  profile: {
    first_name: String,
    last_name: String,
    phone: String,
    date_of_birth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    avatar_url: String,
    bio: { type: String, maxlength: 300 },
    location: {
      city: String,
      state: String,
      country: String,
      timezone: String
    },
    social_links: {
      website: String,
      instagram: String,
      twitter: String,
      linkedin: String
    },
    preferredUnits: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    },
    // Notification Preferences
    notificationPreferences: {
      emailUpdates: { type: Boolean, default: true },
      challengeReminders: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      communityActivity: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
      mobilePush: { type: Boolean, default: true },
      socialActivity: { type: Boolean, default: true }
    },
    // App Preferences
    appPreferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'light'
      },
      language: {
        type: String,
        enum: ['en', 'hi', 'gu'],
        default: 'en'
      },
      currency: {
        type: String,
        enum: ['usd', 'eur', 'inr'],
        default: 'usd'
      },
      units: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric'
      },
      privacy: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      dataSharing: { type: Boolean, default: false }
    }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    try {
      // Increase bcrypt rounds for better security
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + (30 * 60 * 1000) }; // 30 minutes
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const token = generateSecureToken();
  
  this.passwordResetToken = hashData(token);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return token;
};

// Method to generate password reset code (6-digit)
userSchema.methods.generatePasswordResetCode = function() {
  const code = generateSecureCode();
  
  this.passwordResetCode = hashData(code);
  this.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return code;
};

// Method to verify password reset code
userSchema.methods.verifyPasswordResetCode = function(code) {
  if (!this.passwordResetCode || !this.passwordResetCodeExpires) {
    return false;
  }
  
  if (this.passwordResetCodeExpires < Date.now()) {
    return false; // Code expired
  }
  
  const hashedCode = hashData(code);
  return hashedCode === this.passwordResetCode;
};

// Method to clear password reset code
userSchema.methods.clearPasswordResetCode = function() {
  this.passwordResetCode = undefined;
  this.passwordResetCodeExpires = undefined;
};

// Method to generate email verification token (legacy)
userSchema.methods.generateEmailVerificationToken = function() {
  const token = generateSecureToken();
  
  this.emailVerificationToken = hashData(token);
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Method to generate email verification code (6-digit)
userSchema.methods.generateEmailVerificationCode = function() {
  const code = generateSecureCode();
  
  this.emailVerificationCode = hashData(code);
  this.emailVerificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return code;
};

// Method to verify email verification code
userSchema.methods.verifyEmailVerificationCode = function(code) {
  if (!this.emailVerificationCode || !this.emailVerificationCodeExpires) {
    return false;
  }
  
  if (this.emailVerificationCodeExpires < Date.now()) {
    return false; // Code expired
  }
  
  const hashedCode = hashData(code);
  return hashedCode === this.emailVerificationCode;
};

// Method to clear email verification code
userSchema.methods.clearEmailVerificationCode = function() {
  this.emailVerificationCode = undefined;
  this.emailVerificationCodeExpires = undefined;
};

// Indexes for performance optimization
userSchema.index({ 'marketplace_profile.is_seller': 1 });
userSchema.index({ 'marketplace_profile.seller_status': 1 });
userSchema.index({ 'marketplace_profile.seller_rating.average': -1 });
userSchema.index({ 'marketplace_activity.customer_tier': 1 });
userSchema.index({ 'marketplace_activity.total_purchases': -1 });
userSchema.index({ 'profile.location.city': 1, 'profile.location.country': 1 });
userSchema.index({ role: 1, isEmailVerified: 1 });
userSchema.index({ createdAt: -1 });

// Instance methods for marketplace
userSchema.methods.becomeSeller = function(businessData) {
  this.marketplace_profile.is_seller = true;
  this.marketplace_profile.business_name = businessData.business_name;
  this.marketplace_profile.business_description = businessData.business_description;
  this.marketplace_profile.business_address = businessData.business_address;
  this.marketplace_profile.seller_status = 'pending';
  return this.save();
};

userSchema.methods.updateSellerRating = function(newRating) {
  const currentTotal = this.marketplace_profile.seller_rating.total_reviews;
  const currentAverage = this.marketplace_profile.seller_rating.average;
  
  const newTotal = currentTotal + 1;
  const newAverage = ((currentAverage * currentTotal) + newRating) / newTotal;
  
  this.marketplace_profile.seller_rating.average = Math.round(newAverage * 10) / 10;
  this.marketplace_profile.seller_rating.total_reviews = newTotal;
  
  return this.save();
};

userSchema.methods.addToWishlist = function(productId) {
  if (!this.marketplace_activity.wishlist) {
    this.marketplace_activity.wishlist = [];
  }
  if (!this.marketplace_activity.wishlist.includes(productId)) {
    this.marketplace_activity.wishlist.push(productId);
  }
  return this.save();
};

// Static methods
userSchema.statics.findSellers = function(criteria = {}) {
  const query = { 'marketplace_profile.is_seller': true };
  
  if (criteria.status) {
    query['marketplace_profile.seller_status'] = criteria.status;
  }
  
  if (criteria.minRating) {
    query['marketplace_profile.seller_rating.average'] = { $gte: criteria.minRating };
  }
  
  return this.find(query)
    .select('name email marketplace_profile.business_name marketplace_profile.seller_rating profile.location')
    .sort({ 'marketplace_profile.seller_rating.average': -1 });
};

// Create User model (will be connected to auth database when app starts)
const User = mongoose.model('User', userSchema);
export default User;
