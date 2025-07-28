'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';
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
  const [errorType, setErrorType] = useState(''); // 'auth', 'network', 'validation', 'server', 'email'
  const [showError, setShowError] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { updateUser } = useUser();

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  // Real-time password validation
  useEffect(() => {
    if (password) {
      const errors = validatePassword(password);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password]);

  // Real-time confirm password validation
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword, password]);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => {
          setError('');
          setErrorType('');
        }, 300); // Clear error after animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Check password validation
    if (passwordErrors.length > 0) {
      setError('Please fix password requirements before submitting.');
      return;
    }

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
      setIsSubmitting(false);
      
      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      
    } catch (err) {
      // Handle different types of errors with user-friendly messages
      let errorMessage = 'Registration failed. Please try again.';
      let type = 'server';
      
      if (err.message) {
        // Check for email-specific errors first
        if (err.message.includes('Email already exists') || err.message.includes('Email already in use') || err.message.includes('User already exists')) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
          type = 'email';
        } else if (err.message.includes('Invalid email') || err.message.includes('Email format')) {
          errorMessage = 'Please enter a valid email address.';
          type = 'email';
        } else if (err.message.includes('Password') && err.message.includes('weak') || err.message.includes('Password') && err.message.includes('requirements')) {
          errorMessage = 'Please make sure your password meets all requirements.';
          type = 'auth';
        } else if (err.message.includes('Network error') || err.message.includes('fetch')) {
          errorMessage = 'Connection problem. Please check your internet and try again.';
          type = 'network';
        } else if (err.message.includes('Server error') || err.message.includes('500')) {
          errorMessage = 'Server is having issues. Please try again in a few minutes.';
          type = 'server';
        } else if (err.message.includes('Validation failed') || err.message.includes('validation')) {
          errorMessage = 'Please check your information and try again.';
          type = 'validation';
      } else {
          errorMessage = err.message;
          type = 'server';
        }
      } else if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.map(e => e.msg).join('. ');
        type = 'validation';
      }
      
      setError(errorMessage);
      setErrorType(type);
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setIsVerifying(true);
    
    try {
      await authAPI.verifyEmailCode(email, verificationCode);
      setIsVerified(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setVerificationError(err.message || 'Invalid code. Please try again.');
    }
    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendMessage('');
    setVerificationError('');
    
    try {
      await authAPI.resendVerificationCode(email);
      setResendMessage('Verification code sent successfully!');
    } catch (err) {
      setVerificationError(err.message || 'Error sending verification code');
    }
    setIsResending(false);
  };

  const handleGoogleSignUp = () => {
    authAPI.googleLogin();
  };

  const dismissError = () => {
    setShowError(false);
    setTimeout(() => {
      setError('');
      setErrorType('');
    }, 300);
  };

  // Get error styling based on type
  const getErrorStyle = (type) => {
    switch (type) {
      case 'email':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700',
          close: 'text-blue-400 hover:text-blue-600',
          titleText: 'Email Issue'
        };
      case 'auth':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          close: 'text-red-400 hover:text-red-600',
          titleText: 'Registration Error'
        };
      case 'network':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-500',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          close: 'text-yellow-400 hover:text-yellow-600',
          titleText: 'Connection Problem'
        };
      case 'validation':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-500',
          title: 'text-orange-800',
          message: 'text-orange-700',
          close: 'text-orange-400 hover:text-orange-600',
          titleText: 'Validation Error'
        };
      case 'server':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-500',
          title: 'text-orange-800',
          message: 'text-orange-700',
          close: 'text-orange-400 hover:text-orange-600',
          titleText: 'Server Issue'
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          close: 'text-red-400 hover:text-red-600',
          titleText: 'Registration Failed'
        };
    }
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      {/* Toast Error Message - Right Side */}
      {error && (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-in-out ${
          showError ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}>
          <div className={`${getErrorStyle(errorType).bg} ${getErrorStyle(errorType).border} rounded-lg p-4 shadow-lg max-w-sm`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-5 w-5 ${getErrorStyle(errorType).icon} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${getErrorStyle(errorType).title} mb-1`}>
                  {getErrorStyle(errorType).titleText}
                </h3>
                <p className={`text-sm ${getErrorStyle(errorType).message}`}>
                  {error}
                </p>
              </div>
              <button
                type="button"
                onClick={dismissError}
                className={`${getErrorStyle(errorType).close} transition-colors`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="App Logo"
            className="mx-auto h-15 w-80 mb-5"
          />
        </div>
        
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
          <div className="relative">
          <input
            id="password"
              type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              className={`leaf-cursor w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground ${
                passwordErrors.length > 0 ? 'border-red-500' : 'border-border'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordErrors.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
              <div className="text-red-700 text-sm font-medium mb-2">Password Requirements:</div>
              <div className="space-y-1">
                {passwordErrors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-red-600 text-xs">
                    <span className="text-red-500">✕</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : password && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <span className="text-green-500">✓</span>
                <span className="font-medium">Password meets all requirements!</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-foreground">
            Confirm Password
          </label>
          <div className="relative">
          <input
            id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
              className={`leaf-cursor w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground ${
                confirmPasswordError ? 'border-red-500' : 'border-border'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPasswordError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <span className="text-red-500">✕</span>
                <span>{confirmPasswordError}</span>
              </div>
            </div>
          ) : confirmPassword && password === confirmPassword && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2">
              <div className="flex items-center gap-2 text-green-700 text-xs">
                <span className="text-green-500">✓</span>
                <span>Passwords match!</span>
              </div>
            </div>
          )}
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
