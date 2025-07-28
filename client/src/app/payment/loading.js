import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-40 w-full mb-4" />
      <Skeleton className="h-10 w-1/4" />
    </div>
  );
} 