import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminUseCaseManager from '../components/AdminUseCaseManager';
import AdminSelectionReports from '../components/AdminSelectionReports';
import { auth } from '../firebase/config';

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('usecases'); // 'usecases' or 'reports'
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsChecking(true);
      const user = auth.currentUser;

      if (!user) {
        setIsChecking(false);
        return;
      }

      // Refresh token to get latest claims
      const idTokenResult = await user.getIdTokenResult(true);
      
      if (idTokenResult.claims?.admin === true) {
        setAuthenticated(true);
        setError('');
      } else {
        setError('Você não tem permissão de administrador.');
      }
    } catch (err) {
      console.error('Admin auth check error:', err);
      setError('Erro ao verificar permissões de admin.');
    } finally {
      setIsChecking(false);
    }
  };
  
  if (!authenticated) {
    if (isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-neutral-light">Verificando permissões de administrador...</p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-nova-red/30 rounded-2xl p-8 shadow-glow-cyan">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="font-display text-3xl font-bold text-nova-red mb-2">
                Acesso Restrito
              </h2>
              <p className="text-neutral-light text-sm">
                Esta área é restrita a administradores. Por favor, faça login com sua conta corporativa.
              </p>
            </div>
            
            {error && (
              <div className="p-3 bg-nova-red/10 border-2 border-nova-red/50 rounded-lg mb-4">
                <p className="text-nova-red text-sm">{error}</p>
              </div>
            )}
            
            <a
              href="/"
              className="block w-full py-3 px-6 bg-gradient-to-r from-neon-cyan to-cosmic-purple 
                       text-white font-display font-bold rounded-lg text-center
                       hover:shadow-glow-cyan transform hover:scale-105 
                       transition-all duration-300"
            >
              ← Voltar para Área Pública
            </a>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-neon-cyan mb-2">
              🎛️ Painel Administrativo
            </h1>
            <p className="text-neutral-light">
              Gerencie casos de uso e monitore seleções em tempo real
            </p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 bg-nova-red/20 border-2 border-nova-red/50 rounded-lg
                     text-nova-red hover:bg-nova-red hover:text-white
                     transition-all duration-300 text-sm font-medium"
          >
            Sair
          </button>
        </header>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b-2 border-neon-cyan/30">
          <button
            onClick={() => setActiveTab('usecases')}
            className={`px-6 py-3 font-display font-semibold transition-all ${
              activeTab === 'usecases'
                ? 'text-neon-cyan border-b-2 border-neon-cyan -mb-[2px]'
                : 'text-neutral-light hover:text-neon-cyan'
            }`}
          >
            📦 Gerenciar Casos
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-display font-semibold transition-all ${
              activeTab === 'reports'
                ? 'text-neon-cyan border-b-2 border-neon-cyan -mb-[2px]'
                : 'text-neutral-light hover:text-neon-cyan'
            }`}
          >
            📊 Relatório de Seleções
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'usecases' ? (
          <AdminUseCaseManager />
        ) : (
          <AdminSelectionReports />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
