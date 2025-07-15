'use client';
import { useState } from 'react';
import Sidebar from '@/components/ui/sidebar';
import FloatingParticles from './FloatingParticles';
import ProfessionalProgress from './ProfessionalProgress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Leaf, Menu, X, User, TrendingUp } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const isDemo = !user;
  const name = isDemo ? 'Demo User' : user?.name || 'Alex';
  const city = user?.city || 'Demo City';
  const country = user?.country || 'Demo Country';
  const monthlyGoal = isDemo ? 0 : 75;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingParticles />
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/30 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-primary/10 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <Leaf className="h-6 w-6 text-black animate-pulse-eco" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gradient">
                  EcoAction
                </span>
                <div className="text-xs text-muted-foreground font-medium">
                  Climate Platform
                </div>
              </div>
            </div>
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
            <Avatar className="h-12 w-12 border-3 border-primary/30 hover:border-primary/60 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-gradient-primary text-black font-bold text-lg">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex relative">
        <Sidebar />
        {/* Enhanced Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Main Content */}
        <main className="flex-1 min-h-screen relative z-10">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}