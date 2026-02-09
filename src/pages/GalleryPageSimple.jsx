import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuthSimple';
import { useStaticUseCases } from '../hooks/useStaticUseCases';
import { submitSelection } from '../services/selection.api.service';
import { getUseCaseById } from '../services/usecase.static.service';

import UseCaseCard from '../components/UseCaseCard';
import UseCaseModal from '../components/UseCaseModal';
import FilterBar from '../components/FilterBar';

const GalleryPageSimple = () => {
  const { user, teamData, logout, selectUseCase } = useAuth();
  const { useCases, loading: casesLoading } = useStaticUseCases();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalUseCase, setModalUseCase] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState('');
  const [selectedUseCaseDetails, setSelectedUseCaseDetails] = useState(null);
  
  // Filter use cases by category
  const filteredUseCases = selectedCategory === 'all' 
    ? useCases 
    : useCases.filter(uc => uc.category === selectedCategory);
  
  const totalCount = useCases.length;
  
  const handleConfirmSelection = () => {
    setShowConfirmation(true);
  };
  
  const handleSelectUseCase = async () => {
    if (!modalUseCase) return;
    
    setError('');
    setSelecting(true);
    setShowConfirmation(false);
    
    try {
      // Enviar para a API (salvar no CSV)
      await submitSelection({
        teamId: user.uid,
        teamName: teamData?.name,
        email: user.email,
        useCaseId: modalUseCase.id,
        useCaseTitle: modalUseCase.title
      });
      
      // Atualizar estado local
      selectUseCase(modalUseCase.id);
      
      // Buscar detalhes completos do use case
      const useCaseDetails = await getUseCaseById(modalUseCase.id);
      setSelectedUseCaseDetails({
        useCase: useCaseDetails,
        selection: {
          teamId: user.uid,
          teamName: teamData?.name,
          timestamp: new Date().toISOString()
        }
      });
      
      setModalUseCase(null);
    } catch (err) {
      setError(err.message || 'Erro ao selecionar caso de uso');
      setSelecting(false);
      setModalUseCase(null);
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Se já selecionou, mostrar apenas o caso selecionado
  if (selectedUseCaseDetails) {
    return (
      <div className="min-h-screen pb-20">
        {/* Header */}
        <header className="relative z-10 bg-neutral-dark/80 backdrop-blur-lg border-b-2 border-neon-cyan/30">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-neon-cyan">
                🎉 Seleção Confirmada!
              </h1>
              <p className="text-neutral-light text-sm mt-1">
                Equipe: <span className="text-solar-orange font-semibold">{teamData?.name}</span>
              </p>
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
        </header>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          {/* Success Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-8 bg-gradient-to-r from-shield-green/20 to-neon-cyan/20 
                     border-2 border-shield-green rounded-2xl text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-display text-3xl font-bold text-shield-green mb-2">
              Caso de Uso Selecionado com Sucesso!
            </h2>
            <p className="text-neutral-light">
              Sua escolha foi registrada e você já pode começar a trabalhar
            </p>
          </motion.div>

          {/* Selected Use Case Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">
                {selectedUseCaseDetails.useCase.category === 'Industria' ? '🏭' :
                 selectedUseCaseDetails.useCase.category === 'Praticas' ? '⚙️' : '💼'}
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded-full text-cosmic-purple text-xs font-semibold mb-3">
                  {selectedUseCaseDetails.useCase.category}
                </div>
                <h3 className="font-display text-3xl font-bold text-neon-cyan mb-2">
                  {selectedUseCaseDetails.useCase.title}
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-display text-xl font-bold text-neutral-light mb-3">
                📖 Descrição
              </h4>
              <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                {selectedUseCaseDetails.useCase.description}
              </p>
            </div>

            {selectedUseCaseDetails.useCase.details && (
              <div className="mb-6 p-6 bg-solar-orange/10 border-2 border-solar-orange/30 rounded-xl">
                <h4 className="font-display text-xl font-bold text-solar-orange mb-3">
                  📌 Detalhes do Caso de Uso
                </h4>
                <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                  {selectedUseCaseDetails.useCase.details}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

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
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-nova-red/20 border-2 border-nova-red/50 rounded-lg
                     text-nova-red hover:bg-nova-red hover:text-white
                     transition-all duration-300 text-sm font-medium"
          >
            Sair
          </button>
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
                <UseCaseCard
                  key={useCase.id}
                  useCase={useCase}
                  onClick={() => setModalUseCase(useCase)}
                />
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
        {modalUseCase && (
          <UseCaseModal
            useCase={modalUseCase}
            onClose={() => setModalUseCase(null)}
            onSelect={handleConfirmSelection}
            isSelecting={selecting}
          />
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
                  <span className="text-nova-red">Esta ação não pode ser desfeita!</span>
                </p>
                
                {error && (
                  <div className="mb-4 p-3 bg-nova-red/20 border border-nova-red rounded-lg">
                    <p className="text-nova-red text-sm">{error}</p>
                  </div>
                )}
                
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
                    {selecting ? 'Selecionando...' : 'Confirmar'}
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
