export default function MainPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-white">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-border/30 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <div className="h-10 w-60 bg-gray-200 rounded animate-pulse"></div>
            <nav className="hidden lg:flex gap-1 ml-15">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </nav>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="w-full flex justify-center items-center py-8 bg-transparent">
        <div className="relative max-w-7xl w-full mx-auto rounded-3xl shadow-xl overflow-hidden border border-green-200 bg-white">
          <div className="flex flex-col items-center px-8 py-30">
            <div className="h-16 w-3/4 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="h-16 w-2/3 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
              <div className="h-12 w-64 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-12 w-48 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="flex justify-center gap-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="w-full bg-white py-36">
        <div className="max-w-5xl mx-auto px-5 -mt-15">
          <div className="h-12 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drive Real Change Section Skeleton */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-12 w-2/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-10 border border-gray-200 shadow-sm rounded-2xl bg-white">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-8"></div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-12 w-2/3 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 border-0 shadow-lg h-full bg-white rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="w-full min-h-[400px] flex items-center justify-center bg-green-600">
        <div className="max-w-2xl mx-auto text-center px-4 py-24">
          <div className="h-16 w-3/4 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex-1 min-w-[250px] mb-8">
            <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="flex gap-2 mb-8">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-8">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <hr className="my-8 border-gray-200" />
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 