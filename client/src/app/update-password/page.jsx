'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Update Password</h1>
          <p className="text-muted-foreground text-sm mb-4">
            Enter your new password below.
          </p>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
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
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}
        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold text-white bg-primary hover:bg-primary/90 transition"
          disabled={submitted}
        >
          {submitted ? 'Password Updated!' : 'Update Password'}
        </button>
        {submitted && (
          <div className="text-green-600 text-center text-sm mt-2">
            Password updated successfully! Redirecting to login...
          </div>
        )}
      </form>
    </main>
  );
} 