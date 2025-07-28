'use client';

import { useState, useEffect } from 'react';

const ThreeQuarterCirclePath = ({
  value,
  strokeWidth,
  pathColor,
  trailColor,
}) => {
  const radius = 45;
  const centerX = 50;
  const centerY = 50;
  const startAngle = 135;

  const polarToCartesian = (angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
    };
  };

  const getPath = (percentage) => {
    const endAngle = startAngle + (270 * (percentage / 100));
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArcFlag = percentage > 66.66 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const getTrailPath = () => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(startAngle + 270);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;
  };

  return (
    <>
      <path
        d={getTrailPath()}
        stroke={trailColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={getPath(value)}
        stroke={pathColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
};


const AnimatedCircularProgress = ({
  targetValue,
  delay = 0,
  duration = 2000,
  className = '',
  rotation = 0,
  textSize = '24px',
  pathColor = '#22c55e',
  textColor = '#1a2e22',
  trailColor = '#e5e7eb',
  textPosition = { x: 50, y: 50 },
  strokeWidth = 8,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        setAnimatedValue(targetValue * easedProgress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [targetValue, delay, duration]);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        className="three-quarter-circle-progress"
        style={{ "--circumference": "calc(2 * 3.1416 * 45)" }}
      >
        <ThreeQuarterCirclePath
          value={animatedValue}
          strokeWidth={strokeWidth}
          pathColor={pathColor}
          trailColor={trailColor}
          rotation={rotation}
        />
        <text
          x={textPosition.x}
          y={textPosition.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={textSize}
          fontWeight="bold"
        >
          {`${Math.round(animatedValue)}%`}
        </text>
      </svg>
    </div>
  );
};

export default AnimatedCircularProgress;
