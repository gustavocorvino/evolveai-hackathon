import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-6xl mb-6 animate-float">🚀</div>
        <div className="spinner border-neon-cyan mb-4 mx-auto"></div>
        <p className="text-neutral-light font-display text-xl">
          Carregando sistema...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
