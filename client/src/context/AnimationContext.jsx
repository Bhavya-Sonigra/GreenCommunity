'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AnimationContext = createContext();

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }) => {
  const [hasVisitedDashboard, setHasVisitedDashboard] = useState(false);

  // Check if user has visited dashboard in this session
  useEffect(() => {
    const visited = sessionStorage.getItem('dashboardVisited');
    if (visited) {
      setHasVisitedDashboard(true);
    }
  }, []);

  const markDashboardVisited = () => {
    sessionStorage.setItem('dashboardVisited', 'true');
    setHasVisitedDashboard(true);
  };

  const resetAnimationState = () => {
    sessionStorage.removeItem('dashboardVisited');
    setHasVisitedDashboard(false);
  };

  return (
    <AnimationContext.Provider
      value={{
        hasVisitedDashboard,
        markDashboardVisited,
        resetAnimationState,
        shouldSkipAnimation: hasVisitedDashboard
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
