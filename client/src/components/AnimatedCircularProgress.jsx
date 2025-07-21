'use client';

import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const AnimatedCircularProgress = ({ 
  targetValue, 
  delay = 0,
  duration = 2000,
  className = '' 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime;
      let animationFrame;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // Smooth easing function
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        setAnimatedValue(targetValue * easedProgress);
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, delay);

    return () => clearTimeout(timeout);
  }, [targetValue, delay, duration]);

  return (
    <div className={className}>
      <CircularProgressbar
        value={animatedValue}
        text={`${Math.round(animatedValue)}%`}
        styles={buildStyles({
          textSize: '24px',
          pathColor: '#22c55e',
          textColor: '#1a2e22',
          trailColor: '#e5e7eb',
          pathTransitionDuration: 0, // Disable built-in animation
        })}
      />
    </div>
  );
};

export default AnimatedCircularProgress;
