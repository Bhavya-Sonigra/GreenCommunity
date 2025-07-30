'use client';

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="App Logo"
          className="h-15 w-80 mb-4"
        />
        
        {/* Spinning loader */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-muted-foreground">Loading your profile...</span>
        </div>
      </div>
    </div>
  );
};
