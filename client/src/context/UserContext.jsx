'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Function to update user after login
  const updateUser = (userData) => {
    setUser(userData);
  };
  
  // Function to clear user on logout
  const clearUser = () => {
    setUser(null);
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
      // Only try to fetch user if there's a token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return;
      }
      
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user); // The API returns { user: userData }
      } catch (error) {
        // If token is invalid or any auth error occurs, clear the token and user
        if (error.message?.includes('Invalid credentials') || 
            error.message?.includes('Unauthorized') ||
            error.message?.includes('401') ||
            error.message?.includes('403')) {
          localStorage.removeItem('token');
        }
        setUser(null);
      }
    }
    fetchUser();
  }, [isClient]);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 