// Testing Configuration
// This file controls various testing features in the application

export const TESTING_CONFIG = {
  // Force 2FA input for all logins (regardless of user's 2FA setting)
  FORCE_2FA_FOR_ALL_LOGINS: true,
  
  // Accepted test codes (any of these will work in testing mode)
  TEST_2FA_CODES: ['123456', '000000', '111111', '999999'],
  
  // Show testing indicators in UI
  SHOW_TESTING_INDICATORS: true,
  
  // Other testing features can be added here
  SKIP_EMAIL_VERIFICATION: false,
  MOCK_PAYMENT_GATEWAY: false,
};

// Helper function to check if we're in development mode
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Helper function to determine if testing features should be active
export const isTestingMode = () => {
  return isDevelopment() && TESTING_CONFIG.FORCE_2FA_FOR_ALL_LOGINS;
};

export default TESTING_CONFIG;
