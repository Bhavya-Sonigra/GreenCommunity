'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { useUser } from '@/context/UserContext';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();
  const { updateUser } = useUser();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const data = await authAPI.register({ name, email, password });
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Update user context with user data
      if (data.user) {
        updateUser(data.user);
      }
      
      setIsSuccess(true);
      setShowVerification(true); // Show verification UI
      setIsSubmitting(false);
      // Do not redirect yet
      
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setIsVerifying(true);
    // TODO: Replace with real API call
    if (verificationCode === '123456') { // Demo: Accept 123456 as valid
      setIsVerified(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      setVerificationError('Invalid code. Please try again.');
    }
    setIsVerifying(false);
  };

  const handleGoogleSignUp = () => {
    authAPI.googleLogin();
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleVerifyCode} className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="App Logo"
              className="mx-auto h-15 w-80 mb-5"
            />
          </div>
          <div className="text-xl font-semibold text-center mb-2">Verify your email id</div>
          <div className="text-sm text-center text-muted-foreground mb-4">We have sent a verification code to your email. Please enter it below.</div>
          {verificationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{verificationError}</div>
          )}
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
            required
          />
          <button
            type="submit"
            className={`w-full flex items-center justify-center py-2 rounded-md font-semibold text-white transition-all ${isVerifying ? 'bg-primary/70 cursor-not-allowed' : isVerified ? 'bg-green-600' : 'bg-primary hover:bg-primary/90'}`}
            disabled={isVerifying || isVerified}
          >
            {isVerifying ? 'Verifying...' : isVerified ? 'Verified!' : 'Verify'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="App Logo"
            className="mx-auto h-15 w-80 mb-5"
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="leaf-cursor w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="leaf-cursor w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="leaf-cursor w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-foreground">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="leaf-cursor w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className={`w-full flex items-center justify-center py-2 rounded-md font-semibold text-white transition-all ${
            isSubmitting
              ? 'bg-primary/70 cursor-not-allowed'
              : isSuccess
              ? 'bg-primary/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
          disabled={isSubmitting || isSuccess}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing up...</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-2">
              <span>Success</span>
            </div>
          ) : (
            'Sign Up'
          )}
        </button>
        <div className="my-3 text-center text-muted-foreground text-sm">or</div>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded bg-background hover:bg-accent transition"
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
