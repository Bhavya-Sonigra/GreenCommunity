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
import { useMediaQuery } from 'react-responsive';

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
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  
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
      
      // Redirect to home page immediately
      router.replace('/');
      
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
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 h-16 md:h-20 relative">
          {/* Logo and Navigation */}
          {isMobile ? (
            <>
              {/* Hamburger menu for sidebar */}
              <Button variant="ghost" size="icon" className="p-2 sm:p-3 z-10" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-8 w-8 sm:h-10 sm:w-10" />
              </Button>
              {/* Centered logo */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img
                  src="/logo.png"
                  alt="GreenCommunity Logo"
                  className="h-10 w-auto sm:h-12 sm:w-auto max-w-[140px] sm:max-w-[160px] object-contain"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
              <img
                src="/logo.png"
                alt="GreenCommunity Logo"
                className="h-12 w-auto md:h-16 lg:h-14 max-w-[180px] md:max-w-[280px] lg:max-w-[220px] object-contain"
              />
            </div>
          )}
          {/* Navigation Buttons (desktop only) */}
          {!isMobile && (
            <nav className="hidden lg:flex gap-0.5 md:gap-1 lg:gap-2 ml-2 md:ml-4 lg:ml-6">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-1.5 md:px-2 lg:px-2 py-1.5 md:py-2 lg:py-2 rounded-full font-medium transition-colors duration-200 text-xs md:text-sm lg:text-sm whitespace-nowrap
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
          )}
          {/* User Info and Profile (desktop only) */}
          {!isMobile && (
            <div className="flex items-center gap-1 md:gap-2 lg:gap-2">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs md:text-sm font-semibold text-foreground">{name}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{city}, {country}</span>
                  <TrendingUp className="h-3 w-3 text-success" />
                </div>
              </div>
              {/* Enhanced Goal Progress */}
              <div className="hidden xl:flex flex-col gap-2 min-w-24 md:min-w-32">
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
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 lg:h-9 lg:w-9 border-3 border-primary/30 hover:border-primary/60 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <AvatarImage src={user?.photo || ""} alt={name} />
                      <AvatarFallback className="bg-gradient-primary text-black font-bold text-xs md:text-sm lg:text-sm">
                        <User className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 md:w-60 lg:w-64 p-4 flex flex-col gap-3" align="end">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 border-2 border-primary/30">
                      <AvatarImage src={user?.photo || ""} alt={name} />
                      <AvatarFallback className="bg-gradient-primary text-black font-bold text-xs md:text-sm lg:text-sm">
                        <User className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-xs md:text-sm lg:text-sm text-foreground">{name}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{city}, {country}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <Link href="/settings">
                      <Button variant="outline" className="w-full text-xs md:text-sm lg:text-sm h-8 md:h-9 lg:h-10">Settings</Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center gap-2 text-xs md:text-sm lg:text-sm h-8 md:h-9 lg:h-10" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-3 w-3 md:h-4 md:w-4 lg:h-4 lg:w-4" />
                          Log out
                        </>
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {/* Sidebar for mobile */}
          {isMobile && (
            <>
              {/* Sidebar Drawer */}
              <div>
                {sidebarOpen && (
                  <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
                )}
                <div className={`fixed top-0 left-0 z-50 h-full w-64 md:w-80 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 flex flex-col`}>
                  <div className="flex items-center justify-between p-4 md:p-6 border-b">
                    <img src="/logo.png" alt="GreenCommunity Logo" className="h-10 w-auto sm:h-12 sm:w-auto max-w-[140px] sm:max-w-[160px] object-contain" />
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </div>
                  <nav className="flex-1 flex flex-col gap-2 md:gap-3 p-4 md:p-6">
                    {sidebarItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-colors duration-200 text-sm md:text-base text-left ${pathname === item.path ? 'bg-primary/90 text-white shadow-sm' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}
                        style={{ fontWeight: 500, letterSpacing: '0.01em' }}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto p-4 md:p-6 border-t flex flex-col items-center">
                    <Avatar className="h-14 w-14 md:h-16 md:w-16 border-3 border-primary/30 mb-3">
                      <AvatarImage src={user?.photo || ""} alt={name} />
                      <AvatarFallback className="bg-gradient-primary text-black font-bold text-base md:text-lg">
                        <User className="h-5 w-5 md:h-6 md:w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm md:text-base text-muted-foreground">{name}</span>
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center gap-2 mt-3 text-sm md:text-base" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                          Log out
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
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