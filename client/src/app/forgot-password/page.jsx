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

const handleSendCode = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Failed to send code');
      setStep(2);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitted(false);
    }
  };

const handleVerify = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      if (!response.ok) throw new Error('Failed to verify code');
      router.push('/update-password');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={step === 1 ? handleSendCode : handleVerify} className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="App Logo"
            className="mx-auto h-15 w-80 mb-5"
          />
         
          {step === 1 ? (
            <p className="text-muted-foreground text-sm mb-4">
              Enter your email address and we will send you a code to reset your password.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm mb-4">
              Enter the verification code sent to your email.
            </p>
          )}
        </div>
        {step === 1 ? (
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
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1 text-foreground">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold text-white bg-primary hover:bg-primary/90 transition"
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