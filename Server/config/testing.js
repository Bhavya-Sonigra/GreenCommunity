// Server-side Testing Configuration
// This file controls various testing features in the server

export const TESTING_CONFIG = {
  // Force 2FA for all logins including Google OAuth (for testing)
  FORCE_2FA_FOR_ALL_LOGINS: true,
  
  // Environment check - only enable in development
  ENABLE_TESTING_FEATURES: process.env.NODE_ENV === 'development',
};

// Helper function to determine if testing features should be active
export const isTestingMode = () => {
  return TESTING_CONFIG.ENABLE_TESTING_FEATURES && TESTING_CONFIG.FORCE_2FA_FOR_ALL_LOGINS;
};

export default TESTING_CONFIG;
