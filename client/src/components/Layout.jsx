'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FloatingParticles from './FloatingParticles';
import ProfessionalProgress from './ProfessionalProgress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Leaf, Menu, X, User, TrendingUp, LogOut } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Footprint Log', path: '/footprintlog' },
  { name: 'Marketplace', path: '/marketplace' },
  { name: 'Projects', path: '/projects' },
  { name: 'Community', path: '/community' },
  { name: 'Settings', path: '/settings' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, clearUser } = useUser();
  const router = useRouter();
  const isAuthenticated = !!user;
  const name = user?.name || 'Guest';
  const city = user?.city || 'Unknown';
  const country = user?.country || 'Location';
  const monthlyGoal = isAuthenticated ? 75 : 0;
  const pathname = usePathname();
  
  // Don't render the layout if logging out to prevent flash
  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Logging out...</span>
        </div>
      </div>
    );
  }
  
  // Logout functionality
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call server logout endpoint to clear cookies
      await authAPI.logout();
      
      // Clear user data and localStorage token
      clearUser();
      
      // Redirect to login page immediately
      router.replace('/login');
      
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if server logout fails, clear local data
      clearUser();
      router.replace('/login');
    }
    // Don't reset isLoggingOut here to prevent flash
  };

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border/30 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <img
                src="/logo.png"
                alt="App Logo"
                className="mx-auto h-10 w-60 mb-1.2"
              />
            </div>
            {/* Navigation Buttons */}
            <nav className="hidden lg:flex gap-1 ml-15">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 text-sm
                    ${(item.path === '/' && (pathname === '/' || pathname === '/dashboard')) || (item.path !== '/' && pathname === item.path)
                      ? 'bg-primary/90 text-white shadow-sm'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'}
                  `}
                  style={{ fontWeight: 500, letterSpacing: '0.01em' }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          {/* User Info */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground">{name}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{city}, {country}</span>
                <TrendingUp className="h-3 w-3 text-success" />
              </div>
            </div>
            {/* Enhanced Goal Progress */}
            <div className="hidden lg:flex flex-col gap-2 min-w-36">
              <ProfessionalProgress 
                value={monthlyGoal} 
                label="Monthly Goal"
                className="animate-fade-in"
              />
            </div>
            {/* User Profile Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="h-12 w-12 border-3 border-primary/30 hover:border-primary/60 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <AvatarImage src={user?.photo || ""} alt={name} />
                    <AvatarFallback className="bg-gradient-primary text-black font-bold text-lg">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 flex flex-col gap-3" align="end">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarImage src={user?.photo || ""} alt={name} />
                    <AvatarFallback className="bg-gradient-primary text-black font-bold text-lg">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{city}, {country}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/settings">
                    <Button variant="outline" className="w-full">More details</Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full flex items-center gap-2" 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        Log out
                      </>
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 min-h-screen relative z-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}