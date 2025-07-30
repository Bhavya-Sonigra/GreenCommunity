'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, AlertCircle, X, Check } from 'lucide-react';
import { authAPI } from '../../lib/api';
import { useUser } from '@/context/UserContext';
import { TESTING_CONFIG, isTestingMode } from '../../config/testing';

// Simple JWT decode utility (for client-side use only)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { updateUser, loginAndSetUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // 'auth', 'network', 'validation', 'server', 'email'
  const [showError, setShowError] = useState(false);
  
  // 2FA states
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  // Testing: Force 2FA for all logins
  const [showTestingNote, setShowTestingNote] = useState(false);
  
  // Client-side validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Clear errors when user starts typing
  useEffect(() => {
    // Check for 2FA requirement from URL (for Google OAuth)
    const params = new URLSearchParams(window.location.search);
    const requires2FAFromUrl = params.get('requires2FA') === 'true';
    const tempTokenFromUrl = params.get('tempToken');
    const isTestMode = params.get('testMode') === 'true';
    
    if (requires2FAFromUrl && tempTokenFromUrl) {
      setRequires2FA(true);
      setTempToken(tempTokenFromUrl);
      setShowTestingNote(isTestMode && TESTING_CONFIG.SHOW_TESTING_INDICATORS);
      
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Clear errors when user starts typing
    if (email && emailError) setEmailError('');
    if (password && passwordError) setPasswordError('');
  }, [email, password]);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(''), 300); // Clear error after animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Client-side validation
  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else if (email.includes('@') && !email.includes('.')) {
      setEmailError('Please enter a complete email address');
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleContinue = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setEmailError('');
    setPasswordError('');
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const data = await authAPI.login({ email, password });
      
      // TESTING: Force 2FA input for all users (controlled by config)
      if (!data.requires2FA && isTestingMode()) {
        // For testing: simulate 2FA requirement even if user doesn't have it enabled
        setRequires2FA(true);
        setTempToken('testing-token'); // Use a testing token
        setShowTestingNote(TESTING_CONFIG.SHOW_TESTING_INDICATORS);
        setIsSubmitting(false);
        return;
      }
      
      // Check if 2FA is required (normal flow)
      if (data.requires2FA && data.tempToken) {
        setRequires2FA(true);
        setTempToken(data.tempToken);
        setIsSubmitting(false);
        return;
      }
      
      // For successful login without 2FA, use loginAndSetUser to get full profile
      await loginAndSetUser(() => Promise.resolve(data));
      
      setIsSuccess(true);
      
      // Small delay to ensure user state is updated before redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
    } catch (error) {
      // Handle different types of errors with user-friendly messages
      let errorMessage = 'Something went wrong. Please try again.';
      let type = 'auth';
      
      if (error.message) {
        // Check for email-specific errors first
        if (error.message.includes('User not found') || error.message.includes('Email not found') || error.message.includes('No user found')) {
          errorMessage = 'You entered wrong email. Please retype your email.';
          type = 'email';
        } else if (error.message.includes('Invalid credentials') || error.message.includes('Invalid email or password') || error.message.includes('user.loginAttempts is not a function')) {
          errorMessage = 'You entered wrong password. Please retype your password.';
          type = 'auth';
        } else if (error.message.includes('Network error') || error.message.includes('fetch')) {
          errorMessage = 'Connection problem. Please check your internet and try again.';
          type = 'network';
        } else if (error.message.includes('Too many attempts')) {
          errorMessage = 'Too many wrong attempts. Please wait a moment before trying again.';
          type = 'auth';
        } else if (error.message.includes('Account locked')) {
          errorMessage = 'Account locked due to too many wrong attempts. Please try again later.';
          type = 'auth';
        } else if (error.message.includes('Server error') || error.message.includes('500')) {
          errorMessage = 'Server is having issues. Please try again in a few minutes.';
          type = 'server';
        } else {
          errorMessage = 'Login failed. Please check your details and try again.';
          type = 'auth';
        }
      }
      
      setError(errorMessage);
      setErrorType(type);
      setIsSubmitting(false);
    }
  };
      
  const handle2FAVerification = async (e) => {
    e.preventDefault();
    
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setError('Please enter a valid 6-digit 2FA code');
      setErrorType('auth');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Attempting 2FA verification:', { tempToken: tempToken?.substring(0, 20) + '...', code: twoFactorCode });
      
      // TESTING: For testing mode, accept specific test codes and proceed with original login
      if (tempToken === 'testing-token') {
        console.log('Testing mode: Checking for valid test code');
        
        // Check if the entered code is one of the accepted test codes
        if (!TESTING_CONFIG.TEST_2FA_CODES.includes(twoFactorCode)) {
          setError(`Invalid test code. Try one of: ${TESTING_CONFIG.TEST_2FA_CODES.join(', ')}`);
          setErrorType('auth');
          setIsSubmitting(false);
          return;
        }

        // Special handling for Google OAuth testing
        const decoded = decodeJWT(tempToken);
        if (decoded && decoded.role === 'temp-2fa-google') {
            // For Google OAuth, we have the user info from the token
            const userData = { 
                id: decoded.id, 
                name: decoded.name, 
                email: decoded.email, 
                isGoogleAuth: true 
            };
            
            // Manually set user and token
            updateUser(userData);
            localStorage.setItem('token', tempToken); // Use temp token for simplicity
            
            setIsSuccess(true);
            setShowSuccessNotification(true);
            
            setTimeout(() => {
              setShowSuccessNotification(false);
              router.push('/dashboard');
            }, 2000);
            
            return;
        }
        // Perform the original login again to get the real token and full profile
        await loginAndSetUser(() => authAPI.login({ email, password }));
        
        setIsSuccess(true);
        
        // Show success notification
        setShowSuccessNotification(true);
        
        // Auto-hide success notification and redirect after 2 seconds
        setTimeout(() => {
          setShowSuccessNotification(false);
          router.push('/dashboard');
        }, 2000);
        
        return;
      }
      
      // Normal 2FA verification flow - use loginAndSetUser to get full profile
      const data = await authAPI.verify2FALogin(tempToken, twoFactorCode);
      console.log('2FA verification successful:', data);
      
      // Use loginAndSetUser to store token and get full profile
      await loginAndSetUser(() => Promise.resolve(data));
      
      setIsSuccess(true);
      
      // Show success notification
      setShowSuccessNotification(true);
      
      // Auto-hide success notification and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      // Handle 2FA verification errors gracefully with user-friendly messages
      let errorMessage = 'Invalid authentication code. Please try again.';
      let errorType = 'auth';
      
      // Check for specific 2FA error messages and provide better context
      if (error.message) {
        if (error.message.includes('Invalid 2FA') || error.message.includes('Invalid authentication') || error.message.includes('Invalid token')) {
          errorMessage = 'The authentication code you entered is incorrect. Please check your authenticator app and try again.';
        } else if (error.message.includes('expired')) {
          errorMessage = 'The authentication code has expired. Please enter the current code from your authenticator app.';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Connection problem. Please check your internet and try again.';
          errorType = 'network';
        } else {
          errorMessage = 'Authentication failed. Please verify the code and try again.';
        }
      }
      
      setError(errorMessage);
      setErrorType(errorType);
      setIsSubmitting(false);
    }
  };
  
  // Handle Enter key press for 2FA input
  const handle2FAKeyPress = (e) => {
    if (e.key === 'Enter' && twoFactorCode.length === 6 && !isSubmitting) {
      handle2FAVerification(e);
    }
  };
  
  const handleGoogleLogin = () => {
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
          titleText: 'Wrong Email'
        };
      case 'auth':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          close: 'text-red-400 hover:text-red-600',
          titleText: requires2FA ? 'Invalid Code' : 'Wrong Password'
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
          titleText: 'Login Failed'
        };
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 relative">
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

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-500 ease-in-out opacity-100 translate-x-0">
          <div className="bg-green-50 border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  2FA Verified Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {requires2FA ? (
        <form onSubmit={handle2FAVerification} className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="App Logo"
              className="mx-auto h-15 w-80 mb-5"
            />
          </div>
          
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {showTestingNote ? (
                <>
                  <span className="text-orange-600 font-medium">TESTING MODE:</span> Enter one of these codes: {TESTING_CONFIG.TEST_2FA_CODES.join(', ')}
                </>
              ) : (
                'Please enter the 6-digit code from your authenticator app'
              )}
            </p>
            {showTestingNote && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                <strong>Testing Mode Active:</strong> This forces 2FA for all users. Valid test codes: {TESTING_CONFIG.TEST_2FA_CODES.join(', ')}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="twoFactorCode" className="block text-sm font-medium mb-1 text-foreground">
              Authentication Code
            </label>
            <input
              id="twoFactorCode"
              type="text"
              maxLength="6"
              required
              placeholder="000000"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyPress={handle2FAKeyPress}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground transition-colors border-border text-center text-lg font-mono"
              autoFocus
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
                <span>Verifying...</span>
              </div>
            ) : isSuccess ? (
              <div className="flex items-center gap-2">
                <span>Success</span>
              </div>
            ) : (
              'Verify Code'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setRequires2FA(false);
              setTempToken('');
              setTwoFactorCode('');
              setError('');
              setShowTestingNote(false);
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to login
          </button>
        </form>
      ) : (
        <form onSubmit={handleContinue} className="w-full max-w-sm space-y-4">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="App Logo"
              className="mx-auto h-15 w-80 mb-5"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground transition-colors ${
              emailError ? 'border-red-500 focus:ring-red-500' : 'border-border'
            }`}
          />
          {emailError && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{emailError}</span>
            </div>
          )}
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
              className={`leaf-cursor w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground transition-colors ${
                passwordError ? 'border-red-500 focus:ring-red-500' : 'border-border'
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
          {passwordError && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{passwordError}</span>
            </div>
          )}
          <div className="text-right mt-1">
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
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
              <span>Signing in...</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-2">
              <span>Success</span>
            </div>
          ) : (
            'Continue'
          )}
        </button>

        <div className="my-3 text-center text-muted-foreground text-sm">or</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded bg-background hover:bg-accent transition"
        >
          <FcGoogle size={20} />
          <span>Login with Google</span>
        </button>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link href="/Signup" className="text-primary hover:underline">
            Get started
          </Link>
        </p>
      </form>
      )}
    </main>
  );
}
