import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardSkeleton = () => (
  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-accent/5 to-primary/5 min-h-screen relative">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton height={32} width={8} style={{ borderRadius: 8 }} />
          <div>
            <Skeleton height={40} width={320} style={{ marginBottom: 8 }} />
            <Skeleton height={20} width={400} />
          </div>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 flex flex-col gap-4 min-h-[180px] w-full">
            <Skeleton height={20} width={120} style={{ marginBottom: 8 }} />
            <Skeleton height={36} width={90} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={80} style={{ marginBottom: 8 }} />
            <Skeleton height={10} width={'80%'} />
          </div>
        ))}
      </div>
      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: spans 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Emissions by category (breakdown) */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
            <Skeleton height={28} width={260} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={220} style={{ marginBottom: 24 }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map((_, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-accent/10 min-h-[90px] w-full">
                  <div className="flex items-center gap-4">
                    <Skeleton circle height={40} width={40} />
                    <div>
                      <Skeleton height={18} width={100} />
                      <Skeleton height={12} width={60} />
                    </div>
                  </div>
                  <Skeleton height={40} width={40} />
                </div>
              ))}
            </div>
          </div>
          {/* Recent Activities */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
            <Skeleton height={28} width={220} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={180} style={{ marginBottom: 24 }} />
            <div className="space-y-4">
              {[1,2,3].map((_, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-accent/5 min-h-[60px] w-full">
                  <div className="flex-1">
                    <Skeleton height={16} width={180} style={{ marginBottom: 4 }} />
                    <Skeleton height={10} width={100} />
                  </div>
                  <div className="text-right">
                    <Skeleton height={16} width={40} />
                    <Skeleton height={8} width={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Achievements */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
            <Skeleton height={28} width={220} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={180} style={{ marginBottom: 24 }} />
            <div className="space-y-4">
              {[1,2,3].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 bg-accent/5 min-h-[60px] w-full">
                  <Skeleton circle height={32} width={32} />
                  <div className="flex-1">
                    <Skeleton height={14} width={80} />
                    <Skeleton height={10} width={60} />
                  </div>
                  <Skeleton height={18} width={40} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right column: 3 stacked cards */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 min-h-[220px] w-full">
            <Skeleton height={28} width={180} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={140} style={{ marginBottom: 24 }} />
            <Skeleton height={44} width={'100%'} style={{ marginBottom: 12 }} />
            <Skeleton height={44} width={'100%'} style={{ marginBottom: 12 }} />
            <Skeleton height={44} width={'100%'} />
          </div>
          {/* Calendar Streak */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 min-h-[220px] w-full">
            <Skeleton height={28} width={180} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={140} style={{ marginBottom: 24 }} />
            <Skeleton height={120} width={'100%'} />
          </div>
          {/* Tip of the Day */}
          <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 min-h-[120px] w-full relative overflow-hidden">
            <Skeleton height={28} width={180} style={{ marginBottom: 8 }} />
            <Skeleton height={16} width={140} style={{ marginBottom: 24 }} />
            <Skeleton height={32} width={'80%'} />
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
  );

export default DashboardSkeleton; 