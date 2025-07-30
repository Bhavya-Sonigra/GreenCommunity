
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { FullScreenLoader } from '@/components/FullScreenLoader';

const ProtectedLayout = ({ children }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // If data is still loading, show a full-screen loader
  if (isLoading) {
    return <FullScreenLoader />;
  }

  // If user is authenticated, render the children
  return user ? <>{children}</> : null;
};

export default ProtectedLayout;

