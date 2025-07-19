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
          <div key={idx} className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 flex flex-col gap-4">
            <Skeleton height={20} width={140} />
            <Skeleton height={36} width={120} />
            <Skeleton height={16} width={100} />
            <Skeleton height={12} width={'80%'} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Footprint Breakdown */}
          <div>
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
              <Skeleton height={28} width={260} style={{ marginBottom: 8 }} />
              <Skeleton height={16} width={220} style={{ marginBottom: 24 }} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-accent/10">
                    <div className="flex items-center gap-4">
                      <Skeleton circle height={48} width={48} />
                      <div>
                        <Skeleton height={20} width={120} />
                        <Skeleton height={14} width={80} />
                      </div>
                    </div>
                    <Skeleton height={48} width={48} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Recent Activities */}
          <div>
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
              <Skeleton height={28} width={220} style={{ marginBottom: 8 }} />
              <Skeleton height={16} width={180} style={{ marginBottom: 24 }} />
              <div className="space-y-4">
                {[1,2,3].map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-accent/5">
                    <div className="flex-1">
                      <Skeleton height={18} width={220} style={{ marginBottom: 4 }} />
                      <Skeleton height={12} width={120} />
                    </div>
                    <div className="text-right">
                      <Skeleton height={20} width={60} />
                      <Skeleton height={10} width={30} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Achievements */}
          <div>
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
              <Skeleton height={28} width={220} style={{ marginBottom: 8 }} />
              <Skeleton height={16} width={180} style={{ marginBottom: 24 }} />
              <div className="space-y-4">
                {[1,2,3].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 bg-accent/5">
                    <Skeleton circle height={40} width={40} />
                    <div className="flex-1">
                      <Skeleton height={16} width={120} />
                      <Skeleton height={12} width={100} />
                    </div>
                    <Skeleton height={24} width={60} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
              <Skeleton height={28} width={180} style={{ marginBottom: 8 }} />
              <Skeleton height={16} width={140} style={{ marginBottom: 24 }} />
              <Skeleton height={56} width={'100%'} style={{ marginBottom: 12 }} />
              <Skeleton height={56} width={'100%'} style={{ marginBottom: 12 }} />
              <Skeleton height={56} width={'100%'} />
            </div>
          </div>
          {/* Calendar Streak */}
          <div>
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6">
              <Skeleton height={28} width={180} style={{ marginBottom: 8 }} />
              <Skeleton height={16} width={140} style={{ marginBottom: 24 }} />
              <Skeleton height={240} width={'100%'} />
            </div>
          </div>
          {/* Tip of the Day */}
          <div>
            <div className="rounded-xl shadow bg-white dark:bg-gray-900 p-6 relative overflow-hidden">
              <Skeleton height={28} width={180} style={{ marginBottom: 8 }} />
              <Skeleton height={16} width={140} style={{ marginBottom: 24 }} />
              <Skeleton height={48} width={'80%'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default DashboardSkeleton; 