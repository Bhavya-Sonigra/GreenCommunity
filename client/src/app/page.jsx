'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const logoPath = '/logo.jpg';
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-white shadow-md h-16 px-6">
        {/* Logo */}
        <div className="flex items-center pl-4">
          <Image src={logoPath} alt="Logo" width={160} height={40} />
        </div>

        {/* Nav Links */}
        <nav className="flex items-center space-x-8 text-gray-700 font-medium text-base">
          <Link href="#">Dashboard</Link>
          <Link href="#">Reports</Link>
          <Link href="#">Settings</Link>
        </nav>

  {/* User Avatar */}
<div className="relative flex items-center pr-4">
  <button
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    className="focus:outline-none"
  >
    <Image
      src={user?.photo || defaultUserIcon}
      alt="User"
      width={36}
      height={36}
      className="rounded-full border border-gray-300"
    />
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

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
