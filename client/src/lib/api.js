// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
      const errorMessage = data.message || getFriendlyErrorMessage(response.status);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Only log unexpected errors to console to avoid spam
    if (!isExpectedError(error)) {
      console.error('Unexpected API error:', error);
    }
    
    // If it's already a user-friendly error, re-throw it
    if (error.message.includes('Network error') || 
        error.message.includes('Server response error') ||
        error.message.includes('Invalid email') ||
        error.message.includes('Access denied') ||
        error.message.includes('Service not found') ||
        error.message.includes('Too many attempts') ||
        error.message.includes('Server error') ||
        error.message.includes('Service temporarily unavailable')) {
      throw error;
    }
    
    // For any other unexpected errors
    throw new Error('Something went wrong. Please try again later.');
  }
};

// Helper function to determine if an error is expected (user-facing)
function isExpectedError(error) {
  const expectedMessages = [
    'Invalid email',
    'Access denied',
    'Service not found',
    'Too many attempts',
    'Network error',
    'Server response error'
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

  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },
};

// Export the base API request function for other uses
export { apiRequest };
export default authAPI;
