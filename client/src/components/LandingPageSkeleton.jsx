import { Skeleton } from './ui/skeleton';

export default function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-white flex flex-col items-center p-8">
      {/* Logo and header */}
      <div className="w-full flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-48 rounded" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
      {/* Main card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-green-100 p-12 flex flex-col items-center mb-12">
        <Skeleton className="h-14 w-3/4 mb-4" />
        <Skeleton className="h-14 w-2/3 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <div className="flex gap-6 mb-8 w-full justify-center">
          <Skeleton className="h-12 w-64 rounded-full" />
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>
        <Skeleton className="h-5 w-2/3 mb-6" />
        <div className="flex gap-12 justify-center w-full mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
} 