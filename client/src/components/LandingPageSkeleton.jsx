<<<<<<< HEAD
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
=======
import { Skeleton } from "@/components/ui/skeleton";
import HeroSkeleton from "./HeroSkeleton";
import FeaturesSkeleton from "./FeaturesSkeleton";
import StatsSkeleton from "./StatsSkeleton";
import TestimonialsSkeleton from "./TestimonialsSkeleton";

const CTASkeleton = () => {
  return (
    <section className="w-full min-h-[400px] flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-800">
      <div className="max-w-2xl mx-auto text-center px-4 py-24">
        {/* CTA Title Skeleton */}
        <div className="space-y-4 mb-6">
          <Skeleton className="h-12 w-80 mx-auto bg-gray-500" />
          <Skeleton className="h-12 w-64 mx-auto bg-gray-500" />
        </div>
        
        {/* CTA Description Skeleton */}
        <div className="space-y-2 mb-8">
          <Skeleton className="h-4 w-96 mx-auto bg-gray-500" />
          <Skeleton className="h-4 w-80 mx-auto bg-gray-500" />
          <Skeleton className="h-4 w-72 mx-auto bg-gray-500" />
        </div>
        
        {/* CTA Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Skeleton className="h-12 w-40 bg-gray-500" />
          <Skeleton className="h-12 w-48 bg-gray-500" />
        </div>
        
        {/* CTA Footer Text Skeleton */}
        <Skeleton className="h-3 w-80 mx-auto bg-gray-500" />
      </div>
    </section>
  );
};

const FooterSkeleton = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo and Newsletter Section */}
        <div className="flex-1 min-w-[250px] mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
        
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index}>
              <Skeleton className="h-5 w-20 mb-2" />
              <div className="space-y-1">
                {[1, 2, 3, 4].map((_, linkIndex) => (
                  <Skeleton key={linkIndex} className="h-3 w-24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

const LandingPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200"></div>
      </div>

      {/* Hero Section */}
      <HeroSkeleton />

      {/* Features Section */}
      <FeaturesSkeleton />

      {/* Stats/Community Section */}
      <StatsSkeleton />

      {/* Testimonials Section */}
      <TestimonialsSkeleton />

      {/* CTA Section */}
      <CTASkeleton />

      {/* Footer */}
      <FooterSkeleton />
    </div>
  );
};

export default LandingPageSkeleton;
>>>>>>> f139eff97435b96d0ad16d5851a415a0dd07a54d
