'use client';

import { useEffect, useState } from 'react';

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const icons = ['🌱', '🌿', '♻️', '🌍', '🍃', '💚'];
    const newParticles = [];
    for (let i = 0; i < 3; i++) {
      newParticles.push({
        id: i,
        left: 15 + Math.random() * 70, // Keep away from edges
        top: 20 + Math.random() * 60, // Keep in middle areas
        animationDelay: Math.random() * 12,
        icon: icons[Math.floor(Math.random() * icons.length)]
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="floating-leaf absolute opacity-5 select-none"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            zIndex: 1,
          }}
        >
          {particle.icon}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;