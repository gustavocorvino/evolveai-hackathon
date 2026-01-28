import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminUseCaseManager from '../components/AdminUseCaseManager';
import AdminSelectionReports from '../components/AdminSelectionReports';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('usecases'); // 'usecases' or 'reports'
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Simple admin authentication (for hackathon purposes)
    // In production, use Firebase Admin SDK or custom claims
    if (credentials.username === 'admin' && credentials.password === 'evolveai2026') {
      try {
        // Autenticar anonimamente no Firebase para ter permissões
        await signInAnonymously(auth);
        setAuthenticated(true);
        setError('');
      } catch (err) {
        console.error('Firebase auth error:', err);
        setError('Erro ao autenticar no Firebase');
      }
    } else {
      setError('Credenciais inválidas');
    }
  };
  
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-2xl p-8 shadow-glow-cyan">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="font-display text-3xl font-bold text-neon-cyan mb-2">
                Área Administrativa
              </h2>
              <p className="text-neutral-light text-sm">
                Acesso restrito aos organizadores
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-light mb-2">
                  Usuário
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                           text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                           transition-all outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-light mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                           text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                           transition-all outline-none"
                  required
                />
              </div>
              
              {error && (
                <div className="p-3 bg-nova-red/10 border-2 border-nova-red/50 rounded-lg">
                  <p className="text-nova-red text-sm">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-neon-cyan to-cosmic-purple 
                         text-white font-display font-bold rounded-lg
                         hover:shadow-glow-cyan transform hover:scale-105 
                         transition-all duration-300"
              >
                🚀 Entrar
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <a 
                href="/" 
                className="text-neutral-light/50 hover:text-neon-cyan text-sm transition-colors"
              >
                ← Voltar para área pública
              </a>
            </div>
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
