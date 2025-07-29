'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card } from '@/components/ui/card';

const ProjectCardSkeleton = () => {
  return (
    <Card className="card-gradient p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative">
          <Skeleton height={200} className="rounded-lg" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Skeleton height={28} width="60%" className="mb-2" />
            <div className="flex gap-2 mb-3">
              <Skeleton width={100} height={20} />
              <Skeleton width={100} height={20} />
            </div>
            <Skeleton count={3} className="mt-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton height={40} className="rounded-lg" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton height={20} />
            <Skeleton height={12} />
          </div>
          <div className="flex gap-3 pt-2">
            <Skeleton width={120} height={40} className="rounded-md" />
            <Skeleton width={120} height={40} className="rounded-md" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCardSkeleton;
