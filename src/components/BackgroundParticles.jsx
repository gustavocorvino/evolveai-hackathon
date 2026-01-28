import React, { useEffect, useState } from 'react';

const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate 50 random particles
    const generatedParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5
    }));
    
    setParticles(generatedParticles);
  }, []);
  
  return (
    <div className="particles fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            background: `radial-gradient(circle, rgba(6, 182, 212, ${Math.random() * 0.5 + 0.3}) 0%, transparent 70%)`
          }}
        />
      ))}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-space/50 to-deep-space pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-cosmic-purple/5 via-transparent to-neon-cyan/5 pointer-events-none" />
    </div>
  );
};

export default BackgroundParticles;
