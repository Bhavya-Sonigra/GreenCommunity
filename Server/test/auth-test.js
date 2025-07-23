import dotenv from 'dotenv';
dotenv.config();

import { connectAllDatabases } from '../config/databases.js';
import User from '../models/User.model.js';

const testAuth = async () => {
  try {
    console.log('🧪 Testing Authentication System...');
    
    // Connect to databases
    await connectAllDatabases();
    console.log('✅ Database connections established');
    
    // Test User model creation
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!'
    };
    
    console.log('🔍 Testing User model...');
    
    // Check if test user exists and delete it
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      await User.deleteOne({ email: testUser.email });
      console.log('🗑️ Cleaned up existing test user');
    }
    
    // Create new user
    const user = await User.create(testUser);
    console.log('✅ User created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role
    });
    
    // Test password comparison
    const isPasswordValid = await user.comparePassword('TestPassword123!');
    console.log('✅ Password comparison test:', isPasswordValid);
    
    const isWrongPassword = await user.comparePassword('WrongPassword');
    console.log('✅ Wrong password test:', !isWrongPassword);
    
    // Test token generation
    const token = user.generateEmailVerificationToken();
    console.log('✅ Email verification token generated:', !!token);
    
    const resetCode = user.generatePasswordResetCode();
    console.log('✅ Password reset code generated:', !!resetCode);
    
    // Test reset code verification
    const isValidCode = user.verifyPasswordResetCode(resetCode);
    console.log('✅ Reset code verification:', isValidCode);
    
    // Clean up test user
    await User.deleteOne({ email: testUser.email });
    console.log('🧹 Test user cleaned up');
    
    console.log('🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  } finally {
    process.exit(0);
  }
};

testAuth();
