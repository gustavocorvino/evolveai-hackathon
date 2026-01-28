import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeUseCases } from '../hooks/useRealtimeUseCases';
import { selectUseCase, getTeamSelection } from '../services/selection.service';
import { logoutTeam } from '../services/auth.service';

import UseCaseCard from '../components/UseCaseCard';
import UseCaseModal from '../components/UseCaseModal';
import FilterBar from '../components/FilterBar';

const GalleryPage = () => {
  const { user, teamData } = useAuth();
  const { useCases, loading: casesLoading } = useRealtimeUseCases();
  
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
      await selectUseCase(user.uid, modalUseCase.id);
      
      // Fetch complete selection details
      const selectionDetails = await getTeamSelection(user.uid);
      setSelectedUseCaseDetails(selectionDetails);
      setModalUseCase(null);
    } catch (err) {
      setError(err.message);
      setSelecting(false);
      setModalUseCase(null);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logoutTeam();
    } catch (err) {
      console.error('Logout error:', err);
    }
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

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-nebula-dark/30 backdrop-blur-lg border-2 border-cosmic-purple/30 rounded-xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-cosmic-purple mb-6">
              📋 Próximos Passos do Hackathon
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-neon-cyan/20 border-2 border-neon-cyan rounded-full flex items-center justify-center text-neon-cyan font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-neutral-light mb-2">Análise do Caso</h4>
                  <p className="text-neutral-light/70 text-sm">
                    Reúna sua equipe e faça uma análise detalhada do caso de uso selecionado. 
                    Identifique os principais desafios e oportunidades.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-solar-orange/20 border-2 border-solar-orange rounded-full flex items-center justify-center text-solar-orange font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-neutral-light mb-2">Desenvolvimento da Solução</h4>
                  <p className="text-neutral-light/70 text-sm">
                    Desenvolva uma solução inovadora utilizando IA e tecnologias Microsoft Azure. 
                    Foque em criar valor real para o caso apresentado.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cosmic-purple/20 border-2 border-cosmic-purple rounded-full flex items-center justify-center text-cosmic-purple font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-neutral-light mb-2">Preparação da Apresentação</h4>
                  <p className="text-neutral-light/70 text-sm">
                    Monte uma apresentação clara e convincente da sua solução. 
                    Destaque o impacto, a viabilidade técnica e a inovação.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-shield-green/20 border-2 border-shield-green rounded-full flex items-center justify-center text-shield-green font-bold text-xl">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-neutral-light mb-2">Apresentação para Banca</h4>
                  <p className="text-neutral-light/70 text-sm">
                    Apresente sua solução para a banca avaliadora do EvolveAI Hackathon Brasil. 
                    Esteja preparado para responder perguntas técnicas e de negócio.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-star-yellow/10 border-2 border-star-yellow/50 rounded-lg">
              <p className="text-star-yellow text-sm text-center font-medium">
                ⭐ Boa sorte! Estamos ansiosos para ver sua solução inovadora!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="relative z-10 bg-neutral-dark/80 backdrop-blur-lg border-b-2 border-neon-cyan/30">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-neon-cyan">
              🚀 EvolveAI Hackathon
            </h1>
            <p className="text-neutral-light text-sm mt-1">
              Bem-vindo, <span className="text-solar-orange font-semibold">{teamData?.name}</span>
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
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-nebula-dark/30 backdrop-blur-lg border-2 border-cosmic-purple/30 rounded-xl"
        >
          <h2 className="font-display text-2xl font-bold text-cosmic-purple mb-3">
            🌌 Como Selecionar Seu Caso
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-neutral-light text-sm">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong className="text-neon-cyan">Explore os casos</strong>
                <p className="text-neutral-light/70">Navegue pelos cards e filtre por categoria</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong className="text-neon-cyan">Clique para detalhes</strong>
                <p className="text-neutral-light/70">Leia a descrição completa antes de escolher</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong className="text-neon-cyan">Confirme a seleção</strong>
                <p className="text-neutral-light/70">Atenção: a escolha é definitiva!</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Filter Bar */}
        <FilterBar 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
          categoryCounts={{
            all: totalCount,
            Industria: useCases.filter(uc => uc.category === 'Industria').length,
            Praticas: useCases.filter(uc => uc.category === 'Praticas').length,
            Cases: useCases.filter(uc => uc.category === 'Cases').length,
          }}
        />
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-nova-red/10 border-2 border-nova-red/50 rounded-lg"
            >
              <p className="text-nova-red font-medium">⚠️ {error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Use Cases Grid */}
        {casesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner border-neon-cyan"></div>
            <span className="ml-4 text-neutral-light">Carregando casos...</span>
          </div>
        ) : filteredUseCases.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-light text-lg">
              Nenhum caso encontrado nesta categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUseCases.map((useCase, index) => (
              <UseCaseCard
                key={useCase.id}
                useCase={useCase}
                index={index}
                onClick={() => setModalUseCase(useCase)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Use Case Detail Modal */}
      <UseCaseModal
        useCase={modalUseCase}
        onClose={() => {
          setModalUseCase(null);
          setShowConfirmation(false);
        }}
        onConfirm={handleConfirmSelection}
        onSelect={handleSelectUseCase}
        selecting={selecting}
        showConfirmation={showConfirmation}
      />
    </div>
  );
};

export default GalleryPage;
