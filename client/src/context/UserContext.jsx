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
    if (isClient) {
      localStorage.removeItem('token');
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
      
      console.log('🔐 Checking for token:', token ? 'Token found' : 'No token found');
      
      if (!token) {
        console.log('❌ No token in localStorage - showing Demo User');
        setUser(null);
        return;
      }
      
      console.log('🔄 Attempting to fetch user with token...');
      try {
        const data = await authAPI.getCurrentUser();
        console.log('✅ User fetched successfully:', data);
        console.log('👤 User object:', data.user);
        console.log('📝 User name:', data.user?.name);
        setUser(data.user); // The API returns { user: userData }
      } catch (error) {
        console.log('❌ Failed to fetch user:', error.message);
        // If token is invalid or any auth error occurs, clear the token and user
        if (error.message?.includes('Invalid credentials') || 
            error.message?.includes('Unauthorized') ||
            error.message?.includes('401') ||
            error.message?.includes('403')) {
          console.log('🧹 Removing invalid token from localStorage');
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