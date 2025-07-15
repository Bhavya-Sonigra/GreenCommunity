'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Function to update user after login
  const updateUser = (userData) => {
    setUser(userData);
  };
  
  // Function to clear user on logout
  const clearUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    async function fetchUser() {
      // Only try to fetch user if there's a token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        setUser(null);
        return;
      }
      
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user); // The API returns { user: userData }
      } catch (error) {
        console.log('Failed to fetch user:', error.message);
        // If token is invalid, remove it
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 