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
  showAnimation = true 
}) => {
  const { preferences } = usePreferences();
  const units = unitLabels[preferences.units] || unitLabels.metric;
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!showAnimation) {
      setAnimatedValue(percentage);
      return;
    }

    const duration = 1500; // Animation duration in ms
    const startTime = Date.now();
    const startValue = animatedValue;
    const targetValue = percentage;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Smooth easing function
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      const currentValue = startValue + (targetValue - startValue) * easedProgress;
      setAnimatedValue(currentValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage, showAnimation]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">
            {Math.round(animatedValue)}%
          </span>
        </div>
      )}
      <div className="relative">
        <Progress 
          value={animatedValue} 
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