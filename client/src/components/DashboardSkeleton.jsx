import React, { useEffect } from "react";

const DashboardSkeleton = () => {
  useEffect(() => {
    // Prevent scrolling when skeleton is visible
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex flex-col pt-18">
      {/* Header skeleton */}
      <div className="space-y-4 animate-pulse px-8 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gray-300 rounded-full" />
          <div>
            <div className="h-8 w-48 bg-gray-300 rounded mb-2" />
            <div className="h-5 w-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      {/* Key Metrics Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 mt-4 flex-shrink-0">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4 animate-pulse h-40 flex flex-col justify-center">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {/* Section skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 mt-8 flex-1 pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 space-y-4 animate-pulse h-48 flex flex-col justify-center">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-100 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 space-y-4 animate-pulse h-48 flex flex-col justify-center">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-100 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton; 