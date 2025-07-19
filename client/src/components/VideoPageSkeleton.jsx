import React from "react";
import SkeletonVideoCard from "./SkeletonVideoCard";

const VideoPageSkeleton = () => (
  <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 py-8 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, idx) => (
        <SkeletonVideoCard key={idx} />
      ))}
    </div>
  </div>
);

export default VideoPageSkeleton; 