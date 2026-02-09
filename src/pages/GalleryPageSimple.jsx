import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStaticUseCases } from '../hooks/useStaticUseCases';

import UseCaseCard from '../components/UseCaseCard';
import UseCaseModal from '../components/UseCaseModal';
import FilterBar from '../components/FilterBar';

const GalleryPageSimple = () => {
  const navigate = useNavigate();
  const { 
    user, 
    teamData, 
    logout, 
    selectUseCase, 
    isUseCaseSelected, 
    getUseCaseSelection 
  } = useAuth();
  const { useCases, loading: casesLoading } = useStaticUseCases();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalUseCase, setModalUseCase] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState('');
  
  // Adiciona info de seleção aos use cases
  const useCasesWithSelection = useCases.map(uc => ({
    ...uc,
    isSelected: isUseCaseSelected(uc.id),
    selectedBy: getUseCaseSelection(uc.id)
  }));
  
  // Filter use cases by category
  const filteredUseCases = selectedCategory === 'all' 
    ? useCasesWithSelection 
    : useCasesWithSelection.filter(uc => uc.category === selectedCategory);
  
  // Contagem
  const totalCount = useCases.length;
  const availableCount = useCasesWithSelection.filter(uc => !uc.isSelected).length;
  
  const handleOpenModal = (useCase) => {
    setModalUseCase(useCase);
    setError('');
  };
  
  const handleConfirmSelection = () => {
    if (modalUseCase?.isSelected) {
      setError('Este caso de uso já foi selecionado por outra equipe!');
      return;
    }
    setShowConfirmation(true);
  };
  
  const handleSelectUseCase = async () => {
    if (!modalUseCase) return;
    
    setError('');
    setSelecting(true);
    setShowConfirmation(false);
    
    try {
      const success = selectUseCase(modalUseCase.id, modalUseCase.title);
      
      if (!success) {
        setError('Este caso de uso já foi selecionado por outra equipe!');
        setSelecting(false);
        return;
      }
      
      // Redireciona para página de sucesso
      navigate('/success');
    } catch (err) {
      setError(err.message || 'Erro ao selecionar caso de uso');
      setSelecting(false);
    }
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="relative z-10 bg-neutral-dark/80 backdrop-blur-lg border-b-2 border-neon-cyan/30 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-neon-cyan">
              🚀 EvolveAI Hackathon
            </h1>
            <p className="text-neutral-light text-sm">
              Equipe: <span className="text-solar-orange font-semibold">{teamData?.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-neutral-light/70">Disponíveis</p>
              <p className="text-lg font-bold text-shield-green">{availableCount} / {totalCount}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-nova-red/20 border-2 border-nova-red/50 rounded-lg
                       text-nova-red hover:bg-nova-red hover:text-white
                       transition-all duration-300 text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <FilterBar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          totalCount={totalCount}
        />
      </div>

      {/* Use Cases Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-4">
        {casesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-neon-cyan text-xl">Carregando casos de uso...</div>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredUseCases.map((useCase) => (
                <motion.div
                  key={useCase.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative ${useCase.isSelected ? 'opacity-50' : ''}`}
                >
                  {/* Badge de selecionado - só aparece quando selecionado */}
                  {useCase.isSelected && (
                    <div className="absolute -top-2 -right-2 z-10 px-3 py-1 bg-nova-red rounded-full text-white text-xs font-bold shadow-lg">
                      ❌ Já selecionado
                    </div>
                  )}
                  
                  <div 
                    onClick={() => !useCase.isSelected && handleOpenModal(useCase)}
                    className={`transition-all duration-300 ${
                      useCase.isSelected 
                        ? 'grayscale cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-[1.02]'
                    }`}
                  >
                    <UseCaseCard useCase={useCase} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {!casesLoading && filteredUseCases.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-neutral-light text-xl">
              Nenhum caso de uso encontrado nesta categoria
            </p>
          </div>
        )}
      </main>

      {/* Use Case Modal */}
      <AnimatePresence>
        {modalUseCase && !showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setModalUseCase(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-dark border-2 border-neon-cyan/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">
                  {modalUseCase.category === 'Industria' ? '🏭' :
                   modalUseCase.category === 'Praticas' ? '⚙️' : '💼'}
                </div>
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded-full text-cosmic-purple text-xs font-semibold mb-2">
                    {modalUseCase.category}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-neon-cyan">
                    {modalUseCase.title}
                  </h2>
                </div>
                <button
                  onClick={() => setModalUseCase(null)}
                  className="text-neutral-light hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Status de seleção */}
              {modalUseCase.isSelected && (
                <div className="mb-6 p-4 bg-nova-red/20 border-2 border-nova-red rounded-xl">
                  <p className="text-nova-red font-bold">
                    ❌ Este caso já foi selecionado pela equipe: {modalUseCase.selectedBy?.teamName}
                  </p>
                </div>
              )}

              {/* Descrição */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-bold text-neutral-light mb-2">
                  📖 Descrição
                </h3>
                <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                  {modalUseCase.description}
                </p>
              </div>

              {/* Detalhes */}
              {modalUseCase.details && (
                <div className="mb-6 p-4 bg-solar-orange/10 border-2 border-solar-orange/30 rounded-xl">
                  <h3 className="font-display text-lg font-bold text-solar-orange mb-2">
                    📌 Detalhes
                  </h3>
                  <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                    {modalUseCase.details}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-nova-red/20 border border-nova-red rounded-lg">
                  <p className="text-nova-red text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setModalUseCase(null)}
                  className="flex-1 py-3 bg-neutral-dark border-2 border-neutral-light/30 rounded-lg
                           text-neutral-light hover:border-neutral-light
                           transition-all duration-300"
                >
                  Fechar
                </button>
                
                {!modalUseCase.isSelected && (
                  <button
                    onClick={handleConfirmSelection}
                    className="flex-1 py-3 bg-gradient-to-r from-neon-cyan to-cosmic-purple rounded-lg
                             font-bold text-white hover:shadow-glow-cyan
                             transition-all duration-300"
                  >
                    🎯 Selecionar Este Caso
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-dark border-2 border-solar-orange rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="font-display text-2xl font-bold text-solar-orange mb-4">
                  Confirmar Seleção?
                </h3>
                <p className="text-neutral-light mb-6">
                  Você está prestes a selecionar <strong className="text-neon-cyan">{modalUseCase?.title}</strong>.
                  <br /><br />
                  <span className="text-nova-red font-bold">⚠️ Esta ação não pode ser desfeita!</span>
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-3 bg-neutral-dark border-2 border-neutral-light/30 rounded-lg
                             text-neutral-light hover:border-neutral-light
                             transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSelectUseCase}
                    disabled={selecting}
                    className="flex-1 py-3 bg-gradient-to-r from-shield-green to-neon-cyan rounded-lg
                             font-bold text-white hover:shadow-glow-cyan
                             transition-all duration-300 disabled:opacity-50"
                  >
                    {selecting ? '⏳ Selecionando...' : '✅ Confirmar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPageSimple;
