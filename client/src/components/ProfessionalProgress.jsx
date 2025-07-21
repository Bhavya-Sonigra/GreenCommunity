'use client';

import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { usePreferences } from "@/context/PreferencesContext";

const unitLabels = {
  metric: { distance: "km", weight: "kg" },
  imperial: { distance: "mi", weight: "lb" },
};

const ProfessionalProgress = ({ 
  value, 
  max = 100, 
  label, 
  className = '',
  showAnimation = true,
  skipAnimation = false 
}) => {
  const { preferences } = usePreferences();
  const units = unitLabels[preferences.units] || unitLabels.metric;
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!showAnimation || skipAnimation) {
      setAnimatedValue(value);
      return;
    }

    // Add a delay to sync with page load and card animations
    const initialDelay = 800; // Wait for card animations to complete
    const duration = 2000; // Animation duration in ms (match AnimatedCounter)
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      const currentValue = value * easedProgress; // Animate based on actual value
      setAnimatedValue(currentValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [value, showAnimation, skipAnimation]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">
            {Math.round((animatedValue / max) * 100)}%
          </span>
        </div>
      )}
      <div className="relative">
        <Progress 
          value={(animatedValue / max) * 100} 
          className="h-3 progress-eco relative overflow-hidden"
        />
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"
          style={{
            width: '30%',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>
    </div>
  );
};

export default ProfessionalProgress;