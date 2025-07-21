'use client';

import { useEffect, useState } from 'react';

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  decimals = 0, 
  suffix = '', 
  className = '',
  skipAnimation = false 
}) => {
  const [count, setCount] = useState(skipAnimation ? end : 0);

  useEffect(() => {
    if (skipAnimation) {
      setCount(end);
      return;
    }

    // Add a delay to sync with progress bar animations
    const initialDelay = 800; // Wait for card animations to complete
    
    const timeout = setTimeout(() => {
      let startTime;
      let animationFrame;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // Easing function for smooth animation
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        setCount(end * easedProgress);
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [end, duration, skipAnimation]);

  return (
    <span className={`animate-carbon-count ${className}`}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default AnimatedCounter;