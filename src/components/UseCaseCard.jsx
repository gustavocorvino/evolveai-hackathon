import React from 'react';
import { motion } from 'framer-motion';

const categoryIcons = {
  Industria: '🏭',
  Praticas: '⚙️',
  Cases: '💼'
};

const UseCaseCard = ({ useCase, index, onClick }) => {
  const isAvailable = useCase.isAvailable;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={isAvailable ? { scale: 1.05, y: -10 } : {}}
      className={`
        relative group cursor-pointer rounded-xl overflow-hidden
        ${isAvailable 
          ? 'bg-neutral-dark/70 border-2 border-shield-green/50 hover:border-neon-cyan hover:shadow-glow-cyan' 
          : 'bg-neutral-dark/30 border-2 border-neutral-light/20 opacity-60 cursor-not-allowed'}
        transition-all duration-300
      `}
      onClick={() => isAvailable && onClick()}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        {isAvailable ? (
          <div className="px-3 py-1 bg-shield-green/20 border border-shield-green rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-shield-green rounded-full animate-pulse"></div>
            <span className="text-shield-green text-xs font-semibold">Disponível</span>
          </div>
        ) : (
          <div className="px-3 py-1 bg-nova-red/20 border border-nova-red rounded-full flex items-center gap-2">
            <span className="text-nova-red text-xs font-semibold">🔒 Selecionado</span>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-4xl">{categoryIcons[useCase.category] || '📦'}</div>
          <div className="flex-1">
            <div className="inline-block px-2 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded text-cosmic-purple text-xs font-semibold mb-2">
              {useCase.category}
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-light group-hover:text-neon-cyan transition-colors line-clamp-2">
              {useCase.title}
            </h3>
          </div>
        </div>
        
        {/* Prática e Indústria */}
        {(useCase.pratica || useCase.industria) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {useCase.pratica && (
              <span className="px-2 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded text-neon-cyan text-xs font-medium">
                ⚙️ {useCase.pratica}
              </span>
            )}
            {useCase.industria && (
              <span className="px-2 py-1 bg-solar-orange/10 border border-solar-orange/30 rounded text-solar-orange text-xs font-medium">
                🏭 {useCase.industria}
              </span>
            )}
          </div>
        )}
        
        <p className="text-neutral-light/70 text-sm leading-relaxed line-clamp-3 mb-4">
          {useCase.description}
        </p>
        
        {!isAvailable && useCase.selectedByTeamName && (
          <div className="pt-4 border-t border-neutral-light/10">
            <p className="text-neutral-light/50 text-xs">
              Selecionado por: <span className="text-solar-orange font-semibold">{useCase.selectedByTeamName}</span>
            </p>
          </div>
        )}
        
        {isAvailable && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-neon-cyan font-semibold">Clique para detalhes →</span>
            <span className="text-neutral-light/50">👁️</span>
          </div>
        )}
      </div>
      
      {/* Hover Glow Effect */}
      {isAvailable && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-cyan/5 to-cosmic-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
    </motion.div>
  );
};

export default UseCaseCard;
