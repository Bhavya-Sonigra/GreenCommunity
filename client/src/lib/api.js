// API Configuration - Handle both development and container environments
const API_BASE_URL = (() => {
  // In browser, use the current host's API or fallback to localhost
  if (typeof window !== 'undefined') {
    // Client-side: Use relative path for API calls (handled by Next.js rewrites)
    return '';
  }
  
  // Server-side: Use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
})();

// Create a configured fetch function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle network errors or server not responding
    if (!response) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error('Server response error. Please try again later.');
    }

    if (!response.ok) {
      // Check for specific server error messages and convert them to user-friendly ones
      let errorMessage = data.message || getFriendlyErrorMessage(response.status);
      
      // Convert server error messages to user-friendly messages
      if (errorMessage === 'Invalid credentials') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMessage === 'Email already in use') {
        errorMessage = 'An account with this email already exists. Please try logging in instead.';
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Handle fetch/network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Only log truly unexpected errors to console (not user-facing validation errors)
    if (!isExpectedError(error)) {
      console.error('Unexpected API error:', error);
    }
    
    // Re-throw the original error (it already has a user-friendly message)
    throw error;
  }
};

// Helper function to determine if an error is expected (user-facing)
function isExpectedError(error) {
  const expectedMessages = [
    'Invalid email',
    'Invalid credentials',
    'Invalid token',
    'Token expired',
    'Access denied',
    'Service not found',
    'Too many attempts',
    'Network error',
    'Server response error',
    'Email already in use',
    'Passwords do not match',
    'Invalid 2FA code',
    'Invalid 2FA token',
    'Invalid verification code',
    'Invalid or expired verification code',
    'Current password is incorrect',
    'Wrong password',
    'Wrong email',
    'User not found',
    'Account locked'
  ];
  
  return expectedMessages.some(msg => error.message.includes(msg));
}

function getFriendlyErrorMessage(status) {
  switch (status) {
    case 401:
      return 'Invalid email or password. Please check your credentials and try again.';
    case 403:
      return 'Access denied. You don\'t have permission to perform this action.';
    case 404:
      return 'Service not found. Please try again later.';
    case 423:
      return 'Account temporarily locked due to too many failed attempts. Please try again in 30 minutes.';
    case 429:
      return 'Too many attempts. Please wait a moment before trying again.';
    case 500:
      return 'Server error. We\'re working to fix this issue.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    default:
      return 'Something went wrong. Please try again later.';
  }
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/api/auth/me');
  },

  updatePassword: async (newPassword) => {
    return apiRequest('/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },

  verifyEmailCode: async (email, code) => {
    return apiRequest('/api/auth/verify-email-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  resendVerificationCode: async (email) => {
    return apiRequest('/api/auth/resend-verification-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Settings API methods
  getUserSettings: async () => {
    return apiRequest('/api/auth/settings');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/api/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  updateNotificationPreferences: async (notifications) => {
    return apiRequest('/api/auth/update-notifications', {
      method: 'POST',
      body: JSON.stringify(notifications),
    });
  },

  updateAppPreferences: async (preferences) => {
    return apiRequest('/api/auth/update-preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  },

  changePassword: async (passwordData) => {
    return apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  uploadAvatar: async (file) => {
    const url = `${API_BASE_URL}/api/avatar/upload`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - let browser set it
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'Failed to upload image');
    }

    return await response.json();
  },

  deleteAvatar: async () => {
    return apiRequest('/api/avatar', {
      method: 'DELETE',
    });
  },

  // Two-Factor Authentication methods
  generate2FASecret: async () => {
    return apiRequest('/api/auth/2fa/generate', {
      method: 'POST',
    });
  },

  verify2FAToken: async (token) => {
    return apiRequest('/api/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  disable2FA: async () => {
    return apiRequest('/api/auth/2fa/disable', {
      method: 'POST',
    });
  },

  verify2FALogin: async (tempToken, token) => {
    return apiRequest('/api/auth/2fa/verify-login', {
      method: 'POST',
      body: JSON.stringify({ tempToken, token }),
    });
  },
};

// Export the base API request function for other uses
export { apiRequest };
export default authAPI;
