'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Function to update user after login
  const updateUser = (userData) => {
    setUser(userData);
    setIsLoading(false);
    
    // Persist user data to localStorage for better session management
    if (typeof window !== 'undefined' && userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const loginAndSetUser = async (loginFunction) => {
    const response = await loginFunction();
    if (response.token) {
      localStorage.setItem('token', response.token);
      await refreshUser();
    }
    return response;
  };
  
  // Function to refresh user data
  const refreshUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    
    try {
      setIsLoading(true);
      const data = await authAPI.getCurrentUser();
      setUser(data.user);
      
      // Update localStorage with fresh data
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.warn('Failed to refresh user data:', error);
      setIsLoading(false);
    }
  };
  
  // Function to clear user on logout
  const clearUser = () => {
    setUser(null);
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // Clear any other user-related data from localStorage if needed
      // localStorage.removeItem('userPreferences');
    }
  };

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    async function fetchUser() {
      setIsLoading(true);
      
      // Check for URL token first (OAuth callback)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const auth = urlParams.get('auth');
      
      let token = localStorage.getItem('token');
      
      // If we have a token from OAuth callback, use it
      if (auth === 'success' && urlToken) {
        token = urlToken;
        localStorage.setItem('token', token);
        // Clean URL using Next.js router
        router.replace(window.location.pathname, undefined, { shallow: true });
      }
      
      if (!token) {
        // Check if we have cached user data
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
          try {
            const userData = JSON.parse(cachedUserData);
            setUser(userData);
            setIsLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem('userData');
          }
        }
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user); // The API returns { user: userData }
        
        // Also update localStorage with fresh data
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        setIsLoading(false);
      } catch (error) {
        // Silently handle authentication errors to avoid console spam
        console.warn('User authentication failed. Token may have expired.');
        
        // If token is invalid or any auth error occurs, clear the token and user
        if (error.message?.includes('Invalid credentials') ||
            error.message?.includes('Invalid token') ||
            error.message?.includes('Token expired') ||
            error.message?.includes('Unauthorized') ||
            error.message?.includes('401') ||
            error.message?.includes('403')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
        setUser(null);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [isClient]);

  return (
    <UserContext.Provider value={{ user, updateUser, loginAndSetUser, refreshUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 