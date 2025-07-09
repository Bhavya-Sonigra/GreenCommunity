'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Optional: Reset success after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    alert('Google login clicked');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleContinue} className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Welcome back!</h1>
          <p className=" leaf-cursor text-gray-600 mb-6">
            Enter your email and password to log in.
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="leaf-cursor w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="leaf-cursor w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Animated Submit Button */}
        <button
          type="submit"
          className={`w-full flex items-center justify-center py-2 rounded-md font-semibold text-white transition-all ${
            isSubmitting
              ? 'bg-green-400 cursor-not-allowed'
              : isSuccess
              ? 'bg-green-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={isSubmitting || isSuccess}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-2">
              
              <span>Success</span>
            </div>
          ) : (
            'Continue'
          )}
        </button>

        <div className="my-4 text-center text-gray-400 text-sm">or</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
        >
          <FcGoogle size={20} />
          <span>Login with Google</span>
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link href="/Signup" className="text-blue-600 hover:underline">
            Get started
          </Link>
        </p>
      </form>
    </main>
  );
}
