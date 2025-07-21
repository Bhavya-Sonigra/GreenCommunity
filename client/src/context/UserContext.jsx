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
  };
  
  // Function to clear user on logout
  const clearUser = () => {
    setUser(null);
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
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
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user); // The API returns { user: userData }
        setIsLoading(false);
      } catch (error) {
        // Silently handle authentication errors to avoid console spam
        console.warn('User authentication failed. Token may have expired.');
        
        // If token is invalid or any auth error occurs, clear the token and user
        if (error.message?.includes('Invalid credentials') || 
            error.message?.includes('Unauthorized') ||
            error.message?.includes('401') ||
            error.message?.includes('403')) {
          localStorage.removeItem('token');
        }
        setUser(null);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [isClient]);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 