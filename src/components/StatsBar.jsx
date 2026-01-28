import React from 'react';
import { motion } from 'framer-motion';

const StatsBar = ({ availableCount, totalCount }) => {
  const selectedCount = totalCount - availableCount;
  const availablePercentage = totalCount > 0 ? (availableCount / totalCount) * 100 : 0;
  
  return (
    <div className="relative z-10 bg-nebula-dark/50 backdrop-blur-lg border-b-2 border-neon-cyan/30">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Cases */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-cosmic-purple/10 border-2 border-cosmic-purple/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-cosmic-purple text-sm font-semibold">Total de Casos</span>
              <span className="text-3xl">🌌</span>
            </div>
            <div className="font-display text-4xl font-bold text-cosmic-purple">
              {totalCount}
            </div>
          </motion.div>
          
          {/* Available Cases */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-shield-green/10 border-2 border-shield-green/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-shield-green text-sm font-semibold">Disponíveis</span>
              <span className="text-3xl">✅</span>
            </div>
            <div className="font-display text-4xl font-bold text-shield-green">
              {availableCount}
            </div>
            <div className="mt-2 bg-deep-space rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${availablePercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-shield-green"
              />
            </div>
          </motion.div>
          
          {/* Selected Cases */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-solar-orange/10 border-2 border-solar-orange/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-solar-orange text-sm font-semibold">Selecionados</span>
              <span className="text-3xl">🔒</span>
            </div>
            <div className="font-display text-4xl font-bold text-solar-orange">
              {selectedCount}
            </div>
            <div className="mt-2 bg-deep-space rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - availablePercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-solar-orange"
              />
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
