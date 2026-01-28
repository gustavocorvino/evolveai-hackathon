import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { logoutTeam } from '../services/auth.service';

const SuccessPage = () => {
  const { user, teamData } = useAuth();
  const [useCaseData, setUseCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUseCaseData = async () => {
      if (teamData?.selectedUseCaseId) {
        try {
          const useCaseDoc = await getDoc(doc(db, 'useCases', teamData.selectedUseCaseId));
          if (useCaseDoc.exists()) {
            setUseCaseData({ id: useCaseDoc.id, ...useCaseDoc.data() });
          }
        } catch (error) {
          console.error('Error fetching use case:', error);
        }
      }
      setLoading(false);
    };
    
    fetchUseCaseData();
  }, [teamData]);
  
  const handleLogout = async () => {
    try {
      await logoutTeam();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-neon-cyan"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        {/* Success Card */}
        <div className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-shield-green/50 rounded-2xl p-8 shadow-glow-green">
          
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-center mb-6"
          >
            <div className="inline-block text-8xl animate-bounce">🎉</div>
          </motion.div>
          
          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-shield-green mb-4">
              Caso de Uso Selecionado!
            </h1>
            <p className="text-neutral-light text-lg">
              Parabéns, <span className="text-solar-orange font-semibold">{teamData?.name}</span>! 
              Sua missão foi confirmada com sucesso.
            </p>
          </div>
          
          {/* Selected Use Case Details */}
          {useCaseData && (
            <div className="mb-8 p-6 bg-deep-space/50 border-2 border-neon-cyan/30 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded-full text-cosmic-purple text-xs font-semibold mb-3">
                    {useCaseData.category}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-neon-cyan mb-2">
                    {useCaseData.title}
                  </h2>
                </div>
                <div className="text-4xl">🚀</div>
              </div>
              <p className="text-neutral-light leading-relaxed">
                {useCaseData.description}
              </p>
            </div>
          )}
          
          {/* Next Steps */}
          <div className="mb-8 p-6 bg-nebula-dark/30 border-2 border-cosmic-purple/30 rounded-xl">
            <h3 className="font-display text-xl font-bold text-cosmic-purple mb-4 flex items-center gap-2">
              <span>🌟</span> Próximos Passos
            </h3>
            <ul className="space-y-3 text-neutral-light">
              <li className="flex items-start gap-3">
                <span className="text-neon-cyan font-bold">1.</span>
                <span>Junte-se ao canal Discord: <span className="text-neon-cyan font-mono">#caso-{useCaseData?.id.substring(0, 8)}</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-cyan font-bold">2.</span>
                <span>Encontre seu mentor designado até às 14h</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-cyan font-bold">3.</span>
                <span>Prepare o pitch inicial para apresentação às 16h</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-cyan font-bold">4.</span>
                <span>Acesse materiais de apoio na área central</span>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="p-4 bg-solar-orange/10 border-2 border-solar-orange/30 rounded-lg text-center mb-6">
            <p className="text-neutral-light text-sm">
              <span className="text-solar-orange font-semibold">Dúvidas?</span> Procure a equipe de suporte na área central ou no canal #suporte do Discord.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 px-6 bg-neon-cyan/20 border-2 border-neon-cyan rounded-lg
                       text-neon-cyan font-semibold hover:bg-neon-cyan hover:text-deep-space
                       transition-all duration-300"
            >
              🖨️ Imprimir Detalhes
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 py-3 px-6 bg-neutral-dark border-2 border-neutral-light/30 rounded-lg
                       text-neutral-light font-semibold hover:bg-neutral-light hover:text-deep-space
                       transition-all duration-300"
            >
              Sair do Sistema
            </button>
          </div>
          
          {/* Footer Message */}
          <div className="mt-8 text-center">
            <p className="text-neutral-light/70 text-sm">
              Boa sorte no hackathon! 🚀✨
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
