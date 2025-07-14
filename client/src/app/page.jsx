'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Particles from '../components/Particles';
import { authAPI } from '../lib/api';

export default function DashboardLayout({ children }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const logoPath = '/logo.png';
  const defaultUserIcon = '/user-icon.png';

  // Handle Google OAuth token from URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Store token in localStorage or cookie
      localStorage.setItem('token', token);
      // Clean up URL
      router.replace('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Helper to get user icon
  const getUserIcon = () => {
    if (!user) return '/user.png';
    if (user.photo) return user.photo;
    if (user.gender === 'male') return '/male.png';
    if (user.gender === 'female') return '/woman.png';
    return '/user.png';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-transparent shadow-md h-16 px-6 relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <Image src={logoPath} alt="Logo" width={120} height={32} className="h-8 w-auto object-contain" priority />
        </div>
        {/* Nav Links - Centered */}
        <nav className="flex items-center justify-center space-x-8 text-black font-medium text-base absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
          <Link href="#" className="hover:text-green-400 transition-colors">Reports</Link>
          <Link href="#" className="hover:text-green-400 transition-colors">Settings</Link>
          {user && (
            <Link href="/profile" className="hover:text-green-400 transition-colors">Profile</Link>
          )}
        </nav>
        {/* User Avatar */}
        <div className="relative flex items-center pr-4 profile-dropdown">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="focus:outline-none"
          >
            <span className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-white">
              <Image
                src={getUserIcon()}
                alt="User"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </span>
          </button>
          {/* Profile Popup */}
          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl border z-50">
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <hr />
                  <Link href="/profile">
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">More Details</p>
                  </Link>
                  <Link href="/login">
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Logout</p>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsProfileOpen(false)}>
                    <p className="px-4 py-2 hover:bg-gray-100 text-blue-600 cursor-pointer">Login</p>
                  </Link>
                  <Link href="/Signup" onClick={() => setIsProfileOpen(false)}>
                    <p className="px-4 py-2 hover:bg-gray-100 text-blue-600 cursor-pointer">Signup</p>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 relative z-10">
        {user ? (
          <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-bold text-white mb-4">Welcome, {user.name}!</h1>
            <p className="text-lg text-gray-200 mb-8">Here is your dashboard overview.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="#" className="bg-green-600 rounded-lg p-6 text-white shadow hover:bg-green-700 transition-colors">
                <h2 className="text-xl font-semibold mb-2">Reports</h2>
                <p>View your activity and reports.</p>
              </Link>
              <Link href="#" className="bg-blue-600 rounded-lg p-6 text-white shadow hover:bg-blue-700 transition-colors">
                <h2 className="text-xl font-semibold mb-2">Settings</h2>
                <p>Manage your preferences.</p>
              </Link>
              <Link href="/profile" className="bg-gray-800 rounded-lg p-6 text-white shadow hover:bg-gray-900 transition-colors">
                <h2 className="text-xl font-semibold mb-2">Profile</h2>
                <p>View and edit your profile details.</p>
              </Link>
            </div>
          </div>
        ) : (
          <RotatingSlogan />
        )}
      </main>
    </div>
  );
}

function RotatingSlogan() {
  const slogans = [
    'Nurture Nature.',
    'Plant Trees, Plant Hope.',
    'Earth is Home — Let’s Keep It Clean.',
    'Protect What Gives Us Life.'
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slogans.length);
    }, 3000); // Change slogan every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center h-[70vh]">
      <div className="text-left">
        <h1 className="text-5xl font-bold text-black mb-4">Welcome to GreenCommunity!</h1>
        <p className="text-2xl md:text-3xl text-green-300 transition-all duration-500 font-semibold">{slogans[index]}</p>
      </div>
    </div>
  );
}

