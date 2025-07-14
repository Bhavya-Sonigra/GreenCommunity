'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '../lib/api';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle Google OAuth token from URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.replace('/');
    }
  }, [searchParams, router]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await authAPI.getCurrentUser();
          if (data && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">GreenCommunity</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/Signup"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {user ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user.name}!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You are successfully logged in to GreenCommunity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Reports</h3>
                  <p className="text-blue-600 mb-4">View your activity reports</p>
                  <button className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Coming Soon
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Settings</h3>
                  <p className="text-gray-600 mb-4">Configure your preferences</p>
                  <button className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to GreenCommunity
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join our community and make a difference for the environment.
              </p>
              <div className="space-x-4">
                <Link
                  href="/Signup"
                  className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="inline-block border border-green-500 text-green-500 px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
