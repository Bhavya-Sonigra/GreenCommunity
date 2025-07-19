import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const VideoPageSkeleton = () => (
  <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 py-8 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, idx) => (
        <div key={idx} className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow p-2 w-full max-w-xs mx-auto">
          <Skeleton height={160} style={{ marginBottom: 12 }} />
          <div className="flex items-center space-x-3 px-2">
            <Skeleton circle height={40} width={40} />
            <div className="flex-1 space-y-2">
              <Skeleton height={16} width={'75%'} />
              <Skeleton height={12} width={'50%'} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VideoPageSkeleton; 