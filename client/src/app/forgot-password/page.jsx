'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSendCode = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setStep(2);
      setSubmitted(false);
    }, 1000);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push('/update-password');
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={step === 1 ? handleSendCode : handleVerify} className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <img
            src="/logo1.jpg"
            alt="App Logo"
            className="mx-auto h-15 w-80 mb-5"
          />
          <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
          {step === 1 ? (
            <p className="text-gray-600 text-sm mb-4">
              Enter your email address and we will send you a code to reset your password.
            </p>
          ) : (
            <p className="text-gray-600 text-sm mb-4">
              Enter the verification code sent to your email.
            </p>
          )}
        </div>
        {step === 1 ? (
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
        ) : (
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition"
          disabled={submitted}
        >
          {submitted
            ? (step === 1 ? 'Sending...' : 'Verifying...')
            : (step === 1 ? 'Send Code' : 'Verify')}
        </button>
        
      </form>
    </main>
  );
} 