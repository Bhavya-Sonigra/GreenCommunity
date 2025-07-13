'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Particles from '../components/Particles';

export default function DashboardLayout({ children }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const logoPath = '/logo.png';
  const defaultUserIcon = '/user-icon.png';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        if (data && data.isLoggedIn) {
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

  // Helper to get user icon
  const getUserIcon = () => {
    if (!user) return '/user.png';
    if (user.photo) return user.photo;
    if (user.gender === 'male') return '/male.png';
    if (user.gender === 'female') return '/woman.png';
    return '/user.png';
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-transparent shadow-md h-16 px-6 relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <Image src={logoPath} alt="Logo" width={120} height={32} className="h-8 w-auto object-contain" priority />
        </div>
        {/* Nav Links - Centered */}
        <nav className="flex items-center justify-center space-x-8 text-white font-medium text-base absolute left-1/2 transform -translate-x-1/2">
          <Link href="#" className="hover:text-green-400 transition-colors">Dashboard</Link>
          <Link href="#" className="hover:text-green-400 transition-colors">Reports</Link>
          <Link href="#" className="hover:text-green-400 transition-colors">Settings</Link>
        </nav>
        {/* User Avatar */}
        <div className="relative flex items-center pr-4">
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
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Profile</p>
                  </Link>
                  <Link href="/login">
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Logout</p>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <p className="px-4 py-2 hover:bg-gray-100 text-blue-600 cursor-pointer">Login</p>
                  </Link>
                  <Link href="/Signup">
                    <p className="px-4 py-2 hover:bg-gray-100 text-blue-600 cursor-pointer">Signup</p>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Particles Background - now below navbar */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: '4rem', left: 0, zIndex: 0 }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={120}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      {/* Main Content */}
      <main className="p-6 relative z-10">{children}</main>
    </div>
  );
}
