import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuthSimple';
import { getUseCaseById } from '../services/usecase.static.service';

const SuccessPageSimple = () => {
  const { user, teamData, logout } = useAuth();
  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUseCase() {
      if (teamData?.selectedUseCaseId) {
        try {
          const data = await getUseCaseById(teamData.selectedUseCaseId);
          setUseCase(data);
        } catch (error) {
          console.error('Erro ao carregar use case:', error);
        }
      }
      setLoading(false);
    }
    loadUseCase();
  }, [teamData?.selectedUseCaseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan text-xl">Carregando...</div>
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
              🎉 Seleção Confirmada!
            </h1>
            <p className="text-neutral-light text-sm mt-1">
              Equipe: <span className="text-solar-orange font-semibold">{teamData?.name}</span>
            </p>
          </div>
          
          <button
            onClick={logout}
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
            Sua escolha foi registrada. Boa sorte no hackathon!
          </p>
        </motion.div>

        {/* Selected Use Case Details */}
        {useCase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">
                {useCase.category === 'Industria' ? '🏭' :
                 useCase.category === 'Praticas' ? '⚙️' : '💼'}
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded-full text-cosmic-purple text-xs font-semibold mb-3">
                  {useCase.category}
                </div>
                <h3 className="font-display text-3xl font-bold text-neon-cyan mb-2">
                  {useCase.title}
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-display text-xl font-bold text-neutral-light mb-3">
                📖 Descrição
              </h4>
              <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                {useCase.description}
              </p>
            </div>

            {useCase.details && (
              <div className="mb-6 p-6 bg-solar-orange/10 border-2 border-solar-orange/30 rounded-xl">
                <h4 className="font-display text-xl font-bold text-solar-orange mb-3">
                  📌 Detalhes do Caso de Uso
                </h4>
                <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                  {useCase.details}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-cosmic-purple/30 rounded-2xl p-8"
        >
          <h4 className="font-display text-2xl font-bold text-cosmic-purple mb-6">
            🎯 Próximos Passos
          </h4>
          <ul className="space-y-4 text-neutral-light">
            <li className="flex items-start gap-3">
              <span className="text-shield-green text-xl">1.</span>
              <span>Reúna sua equipe e discuta a abordagem para o caso de uso</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-shield-green text-xl">2.</span>
              <span>Defina as tecnologias e ferramentas que serão utilizadas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-shield-green text-xl">3.</span>
              <span>Comece a desenvolver sua solução inovadora!</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-shield-green text-xl">4.</span>
              <span>Prepare sua apresentação final para os jurados</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPageSimple;
