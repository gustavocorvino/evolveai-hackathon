import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPageSimple = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      login(formData.name, formData.email);
      // O hook vai atualizar o estado e o App vai redirecionar
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
                  <p className="text-nova-red text-sm">{error}</p>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-neon-cyan to-cosmic-purple 
                         rounded-lg font-bold text-white text-lg
                         hover:shadow-glow-cyan transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  '🚀 Iniciar Jornada'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPageSimple;
