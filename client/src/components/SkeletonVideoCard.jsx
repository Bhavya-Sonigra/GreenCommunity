import React from "react";

const SkeletonVideoCard = () => (
  <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow p-2 w-full max-w-xs mx-auto">
    {/* Thumbnail skeleton */}
    <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-3" />
    <div className="flex items-center space-x-3 px-2">
      {/* Avatar skeleton */}
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
        {/* Subtitle skeleton */}
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  </div>
);

export default SkeletonVideoCard; 