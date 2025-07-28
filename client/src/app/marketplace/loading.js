import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';
export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
    </div>
  );
} 