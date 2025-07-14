'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { authAPI } from '../../lib/api';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleContinue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const data = await authAPI.login({ email, password });
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      setIsSuccess(true);
      console.log('Login successful:', data);
      
      // Redirect to home after successful login
      setTimeout(() => {
        router.push('/');
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };
      
  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleContinue} className="w-full max-w-sm space-y-4">
        <div className="text-center">

          <img
            src="/logo1.jpg"
            alt="App Logo"
            className="mx-auto h-15 w-80 mb-5"
          />
          
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
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
          <div className="text-right mt-1">
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

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

        <div className="my-3 text-center text-gray-400 text-sm">or</div>

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
