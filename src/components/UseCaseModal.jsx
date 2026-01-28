import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons = {
  Industria: '🏭',
  Praticas: '⚙️',
  Cases: '💼'
};

const UseCaseModal = ({ useCase, onClose, onConfirm, onSelect, selecting, showConfirmation }) => {
  if (!useCase) return null;
  
  const isAvailable = useCase.isAvailable;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-space/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-neutral-dark border-2 border-neon-cyan rounded-2xl shadow-glow-cyan"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                     bg-nova-red/20 hover:bg-nova-red border-2 border-nova-red rounded-lg
                     text-nova-red hover:text-white transition-all duration-300 z-10"
          >
            ✕
          </button>
          
          {/* Modal Content */}
          <div className="p-8">
            
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">{categoryIcons[useCase.category] || '📦'}</div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded-full text-cosmic-purple text-xs font-semibold mb-3">
                  {useCase.category}
                </div>
                <h2 className="font-display text-3xl font-bold text-neon-cyan mb-2">
                  {useCase.title}
                </h2>
                {useCase.subcategory && (
                  <p className="text-neutral-light/70 text-sm">
                    Subcategoria: {useCase.subcategory}
                  </p>
                )}
              </div>
            </div>
            
            {/* Status */}
            <div className="mb-6">
              {isAvailable ? (
                <div className="p-4 bg-shield-green/10 border-2 border-shield-green/50 rounded-lg flex items-center gap-3">
                  <div className="w-3 h-3 bg-shield-green rounded-full animate-pulse"></div>
                  <span className="text-shield-green font-semibold">✅ Caso Disponível para Seleção</span>
                </div>
              ) : (
                <div className="p-4 bg-nova-red/10 border-2 border-nova-red/50 rounded-lg">
                  <p className="text-nova-red font-semibold mb-1">🔒 Caso já selecionado</p>
                  {useCase.selectedByTeamName && (
                    <p className="text-neutral-light/70 text-sm">
                      Selecionado por: <span className="text-solar-orange">{useCase.selectedByTeamName}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="font-display text-xl font-bold text-neutral-light mb-3">
                📖 Descrição do Caso
              </h3>
              <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                {useCase.description}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-neutral-dark border-2 border-neutral-light/30 rounded-lg
                         text-neutral-light font-semibold hover:bg-neutral-light hover:text-deep-space
                         transition-all duration-300"
              >
                Voltar
              </button>
              
              {isAvailable && !showConfirmation && (
                <button
                  onClick={onConfirm}
                  disabled={selecting}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-neon-cyan to-cosmic-purple
                           text-white font-display font-bold rounded-lg
                           hover:shadow-glow-cyan transform hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:transform-none"
                >
                  🚀 Selecionar Este Caso
                </button>
              )}
            </div>
            
            {/* Confirmation Dialog */}
            {showConfirmation && isAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-star-yellow/10 border-2 border-star-yellow rounded-xl"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">⚠️</div>
                  <h3 className="font-display text-xl font-bold text-star-yellow mb-2">
                    Confirmar Seleção?
                  </h3>
                  <p className="text-neutral-light text-sm">
                    Você tem certeza que deseja selecionar este caso de uso?
                    <br />
                    <strong className="text-nova-red">Esta ação não pode ser desfeita!</strong>
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => onClose()}
                    disabled={selecting}
                    className="flex-1 py-3 px-6 bg-neutral-dark border-2 border-neutral-light/30 rounded-lg
                             text-neutral-light font-semibold hover:bg-neutral-light hover:text-deep-space
                             transition-all duration-300 disabled:opacity-50"
                  >
                    ✕ Cancelar
                  </button>
                  <button
                    onClick={onSelect}
                    disabled={selecting}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-shield-green to-neon-cyan
                             text-white font-display font-bold rounded-lg
                             hover:shadow-glow-cyan transform hover:scale-105
                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none"
                  >
                    {selecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="spinner border-white w-5 h-5"></div>
                        Confirmando...
                      </span>
                    ) : (
                      '✅ Sim, Confirmar Seleção'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            
            {isAvailable && !showConfirmation && (
              <div className="mt-4 p-3 bg-star-yellow/10 border border-star-yellow/50 rounded-lg">
                <p className="text-star-yellow text-xs font-medium text-center">
                  ⚠️ Atenção: A seleção é definitiva e não poderá ser alterada!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UseCaseModal;
