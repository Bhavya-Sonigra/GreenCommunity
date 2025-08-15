import mongoose from 'mongoose';
import { getConnection, DB_NAMES } from '../config/databases.js';

const userInfoSchema = new mongoose.Schema({
  // Reference to the user in auth database
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    unique: true,
    ref: 'User' // References the User model in auth database
  },
  
  // Basic Profile Information
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  
  phone: { 
    type: String,
    trim: true,
    maxlength: 20
  },
  
  bio: { 
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Location Information
  location: {
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
    district: { type: String, trim: true, maxlength: 100 },
    zipCode: { type: String, trim: true, maxlength: 20 },
    timezone: { type: String, trim: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  // Personal Details
  dateOfBirth: { type: Date },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    lowercase: true
  },
  
  profession: { 
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Profile Media
  avatar: {
    url: { type: String },
    publicId: { type: String }, // For cloud storage reference
    uploadedAt: { type: Date, default: Date.now }
  },
  
  // Social Links
  socialLinks: {
    website: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true }
  },
  
  // Preferences
  preferences: {
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
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    dataSharing: {
      type: Boolean,
      default: false
    }
  },
  
  // Notification Preferences
  notifications: {
    emailUpdates: { type: Boolean, default: true },
    challengeReminders: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    communityActivity: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    mobilePush: { type: Boolean, default: true },
    socialActivity: { type: Boolean, default: true }
  },
  
  // Profile Completeness Tracking
  profileCompletion: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    completedFields: [{ type: String }],
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Activity Tracking
  lastActive: { type: Date, default: Date.now },
  profileViews: { type: Number, default: 0 },
  
  // Verification Status
  verification: {
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false },
    address: { type: Boolean, default: false }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
userInfoSchema.index({ 'location.city': 1, 'location.country': 1 });
userInfoSchema.index({ lastActive: -1 });
userInfoSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps and calculate profile completion
userInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate profile completion percentage
  const totalFields = 15; // Total important fields for completion
  let completedCount = 0;
  const completedFields = [];
  
  if (this.name) { completedCount++; completedFields.push('name'); }
  if (this.phone) { completedCount++; completedFields.push('phone'); }
  if (this.bio) { completedCount++; completedFields.push('bio'); }
  if (this.location?.city) { completedCount++; completedFields.push('location.city'); }
  if (this.location?.country) { completedCount++; completedFields.push('location.country'); }
  if (this.dateOfBirth) { completedCount++; completedFields.push('dateOfBirth'); }
  if (this.gender) { completedCount++; completedFields.push('gender'); }
  if (this.profession) { completedCount++; completedFields.push('profession'); }
  if (this.avatar?.url) { completedCount++; completedFields.push('avatar'); }
  if (this.socialLinks?.website) { completedCount++; completedFields.push('socialLinks.website'); }
  if (this.preferences?.units) { completedCount++; completedFields.push('preferences.units'); }
  if (this.preferences?.privacy) { completedCount++; completedFields.push('preferences.privacy'); }
  if (this.preferences?.language) { completedCount++; completedFields.push('preferences.language'); }
  if (this.preferences?.currency) { completedCount++; completedFields.push('preferences.currency'); }
  if (this.preferences?.theme) { completedCount++; completedFields.push('preferences.theme'); }
  
  this.profileCompletion = {
    percentage: Math.round((completedCount / totalFields) * 100),
    completedFields,
    lastUpdated: Date.now()
  };
  
  next();
});

// Methods to format location display
userInfoSchema.methods.getFormattedLocation = function() {
  const parts = [];
  if (this.location?.city && this.location.city.trim()) parts.push(this.location.city.trim());
  if (this.location?.state && this.location.state.trim()) parts.push(this.location.state.trim());
  if (this.location?.country && this.location.country.trim()) parts.push(this.location.country.trim());
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
};

userInfoSchema.methods.updateLastActive = function() {
  this.lastActive = Date.now();
  return this.save();
};

// Static methods
userInfoSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

userInfoSchema.statics.createOrUpdate = function(userId, updateData) {
  return this.findOneAndUpdate(
    { userId },
    { ...updateData, userId },
    { 
      new: true, 
      upsert: true, 
      runValidators: true 
    }
  );
};

// Create UserInfo model using the USER_INFO database connection
let UserInfo;
let isInitialized = false;

const initializeUserInfoModel = async () => {
  // Return existing model if already initialized
  if (UserInfo && isInitialized) {
    return UserInfo;
  }
  
  try {
    const userInfoConnection = await getConnection('USER_INFO_DB');
    UserInfo = userInfoConnection.model('UserInfo', userInfoSchema);
    isInitialized = true;
    console.log('✅ UserInfo model initialized with USER_INFO database');
    return UserInfo;
  } catch (error) {
    console.error('❌ Error initializing UserInfo model:', error);
    throw error;
  }
};

// Initialize the model only once
if (!isInitialized) {
  initializeUserInfoModel();
}

export { UserInfo, initializeUserInfoModel };
export default UserInfo;
