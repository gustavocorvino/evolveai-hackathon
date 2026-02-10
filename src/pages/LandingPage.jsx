import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isValidEmail = (email) => {
    // Validação silenciosa - só aceita @avanade.com
    const trimmed = (email || '').toLowerCase().trim();
    return trimmed.length > 0 && trimmed.endsWith('@avanade.com');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    
    const teamName = (formData.name || '').trim();
    const email = (formData.email || '').toLowerCase().trim();
    
    // Validar nome
    if (!teamName || teamName.length < 3) {
      alert('Nome da equipe deve ter pelo menos 3 caracteres');
      return false;
    }
    
    // Validar email - BLOQUEIA se não for @avanade.com
    if (!isValidEmail(email)) {
      alert('E-mail inválido');
      return false;
    }
    
    setLoading(true);
    
    try {
      login(teamName, email);
      navigate('/gallery');
    } catch (err) {
      alert(err.message || 'Erro ao entrar');
      setLoading(false);
    }
    
    return false;
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-block text-8xl animate-float">🚀</div>
          </motion.div>
          
          <h1 className="font-display text-5xl lg:text-7xl font-bold mb-6 glow-text">
            EvolveAI
            <br />
            <span className="text-neon-cyan">Hackathon Brasil</span>
          </h1>
          
          <p className="text-xl text-neutral-light mb-8 leading-relaxed">
            Explore os casos de uso e selecione o desafio que irá te fazer vencer o Hacka!
          </p>
        </motion.div>
        
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-2xl p-8 shadow-glow-cyan">
            <div className="mb-6 text-center">
              <h2 className="font-display text-3xl font-bold text-neon-cyan mb-2">
                Iniciar Jornada
              </h2>
              <p className="text-neutral-light text-sm">
                Cadastre sua equipe para começar
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-light mb-2">
                  Nome da Equipe
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                           text-neutral-light placeholder-neutral-light/50
                           focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                           transition-all outline-none"
                  placeholder="Digite o nome da sua equipe"
                  required
                  minLength={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-light mb-2">
                  Email da Equipe
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                           text-neutral-light placeholder-neutral-light/50
                           focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                           transition-all outline-none"
                  placeholder="equipe@email.com"
                  required
                />
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-nova-red/10 border-2 border-nova-red/50 rounded-lg"
                >
                  <p className="text-nova-red text-sm font-medium">{error}</p>
                </motion.div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-neon-cyan to-cosmic-purple 
                         text-white font-display font-bold text-lg rounded-lg
                         hover:shadow-glow-cyan transform hover:scale-105 
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner border-white"></div>
                    Processando...
                  </span>
                ) : (
                  <span>🌟 Começar Seleção</span>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-neon-cyan/20 text-center">
              <a 
                href="/admin" 
                className="text-neutral-light/50 hover:text-neon-cyan text-xs transition-colors"
              >
                Área Administrativa
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
