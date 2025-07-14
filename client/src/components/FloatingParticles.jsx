'use client';

import { useEffect, useState } from 'react';

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const icons = [' 33f', ' 343', ' 331', '\u267b\ufe0f', '\u1f30d', '\u1f49a'];
    const newParticles = [];
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 8,
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
          className="floating-leaf absolute opacity-30"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        >
          {particle.icon}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;