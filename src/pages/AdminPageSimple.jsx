import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useStaticUseCases } from '../hooks/useStaticUseCases';

const AdminPageSimple = () => {
  const { selections } = useAuth();
  const { useCases, loading } = useStaticUseCases();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalUseCase, setModalUseCase] = useState(null);

  // Adiciona info de seleção aos use cases
  const useCasesWithSelection = useCases.map(uc => ({
    ...uc,
    isSelected: !!selections[uc.id],
    selectedBy: selections[uc.id] || null
  }));

  // Filtrar por categoria
  const filteredUseCases = selectedCategory === 'all'
    ? useCasesWithSelection
    : useCasesWithSelection.filter(uc => uc.category === selectedCategory);

  // Estatísticas
  const totalCases = useCases.length;
  const selectedCases = useCasesWithSelection.filter(uc => uc.isSelected).length;
  const availableCases = totalCases - selectedCases;

  // Categorias
  const categories = [
    { id: 'all', label: 'Todos', icon: '🌌' },
    { id: 'Industria', label: 'Indústria', icon: '🏭' },
    { id: 'Praticas', label: 'Práticas', icon: '⚙️' },
    { id: 'Cases', label: 'Cases', icon: '💼' }
  ];

  // Exportar CSV
  const handleExportCSV = () => {
    const headers = ['Caso de Uso', 'Categoria', 'Status', 'Equipe', 'Email', 'Data/Hora Seleção'];
    
    const rows = useCasesWithSelection.map(uc => {
      if (uc.isSelected) {
        return [
          uc.title,
          uc.category,
          'Selecionado',
          uc.selectedBy?.teamName || '',
          uc.selectedBy?.email || '',
          uc.selectedBy?.timestamp ? new Date(uc.selectedBy.timestamp).toLocaleString('pt-BR') : ''
        ];
      } else {
        return [
          uc.title,
          uc.category,
          'Disponível',
          '',
          '',
          ''
        ];
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hackathon_selecoes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <header className="relative z-10 bg-neutral-dark/80 backdrop-blur-lg border-b-2 border-cosmic-purple/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-cosmic-purple">
                🔐 Painel Administrativo
              </h1>
              <p className="text-neutral-light text-sm">
                Acompanhe as seleções do Hackathon
              </p>
            </div>
            
            <button
              onClick={handleExportCSV}
              className="px-6 py-3 bg-gradient-to-r from-shield-green to-neon-cyan rounded-lg
                       font-bold text-white hover:shadow-glow-cyan
                       transition-all duration-300 flex items-center gap-2"
            >
              📥 Exportar CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-deep-space/50 border border-neon-cyan/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-neon-cyan">{totalCases}</p>
              <p className="text-neutral-light text-sm">Total de Casos</p>
            </div>
            <div className="bg-deep-space/50 border border-shield-green/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-shield-green">{availableCases}</p>
              <p className="text-neutral-light text-sm">Disponíveis</p>
            </div>
            <div className="bg-deep-space/50 border border-solar-orange/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-solar-orange">{selectedCases}</p>
              <p className="text-neutral-light text-sm">Selecionados</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const count = category.id === 'all' 
              ? useCasesWithSelection.length
              : useCasesWithSelection.filter(uc => uc.category === category.id).length;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all duration-300
                  flex items-center gap-2
                  ${isActive 
                    ? 'bg-gradient-to-r from-neon-cyan to-cosmic-purple text-white' 
                    : 'bg-neutral-dark/50 border border-neon-cyan/30 text-neutral-light hover:border-neon-cyan'}
                `}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Casos */}
      <main className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUseCases.map((useCase) => (
            <motion.div
              key={useCase.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                relative rounded-xl overflow-hidden cursor-pointer
                ${useCase.isSelected 
                  ? 'bg-solar-orange/10 border-2 border-solar-orange' 
                  : 'bg-neutral-dark/50 border-2 border-shield-green/50'}
                transition-all duration-300 hover:scale-[1.02]
              `}
              onClick={() => setModalUseCase(useCase)}
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                {useCase.isSelected ? (
                  <div className="px-3 py-1 bg-solar-orange rounded-full text-white text-xs font-bold">
                    ✓ Selecionado
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-shield-green/20 border border-shield-green rounded-full text-shield-green text-xs font-bold">
                    Disponível
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">
                    {useCase.category === 'Industria' ? '🏭' :
                     useCase.category === 'Praticas' ? '⚙️' : '💼'}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-cosmic-purple font-semibold mb-1">
                      {useCase.category}
                    </div>
                    <h3 className="font-display text-lg font-bold text-neutral-light line-clamp-2">
                      {useCase.title}
                    </h3>
                  </div>
                </div>

                <p className="text-neutral-light/70 text-sm line-clamp-2 mb-4">
                  {useCase.description}
                </p>

                {/* Info da Seleção */}
                {useCase.isSelected && useCase.selectedBy && (
                  <div className="mt-3 p-3 bg-solar-orange/20 rounded-lg border border-solar-orange/30">
                    <p className="text-solar-orange font-bold text-sm mb-1">
                      👥 {useCase.selectedBy.teamName}
                    </p>
                    <p className="text-neutral-light/70 text-xs">
                      📧 {useCase.selectedBy.email}
                    </p>
                    <p className="text-neutral-light/50 text-xs mt-1">
                      🕐 {new Date(useCase.selectedBy.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {modalUseCase && (
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
              className="bg-neutral-dark border-2 border-neon-cyan/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">
                  {modalUseCase.category === 'Industria' ? '🏭' :
                   modalUseCase.category === 'Praticas' ? '⚙️' : '💼'}
                </div>
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple rounded-full text-cosmic-purple text-xs font-semibold mb-2">
                    {modalUseCase.category}
                  </div>
                  <h2 className="font-display text-xl font-bold text-neon-cyan">
                    {modalUseCase.title}
                  </h2>
                </div>
                <button
                  onClick={() => setModalUseCase(null)}
                  className="text-neutral-light hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Status */}
              <div className={`mb-4 p-4 rounded-xl ${
                modalUseCase.isSelected 
                  ? 'bg-solar-orange/20 border-2 border-solar-orange' 
                  : 'bg-shield-green/20 border-2 border-shield-green'
              }`}>
                {modalUseCase.isSelected ? (
                  <div>
                    <p className="text-solar-orange font-bold mb-2">✓ Selecionado por:</p>
                    <p className="text-white font-bold text-lg">{modalUseCase.selectedBy?.teamName}</p>
                    <p className="text-neutral-light">📧 {modalUseCase.selectedBy?.email}</p>
                    <p className="text-neutral-light/70 text-sm mt-2">
                      🕐 {new Date(modalUseCase.selectedBy?.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ) : (
                  <p className="text-shield-green font-bold">✓ Disponível para seleção</p>
                )}
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <h3 className="font-display text-lg font-bold text-neutral-light mb-2">
                  📖 Descrição
                </h3>
                <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                  {modalUseCase.description}
                </p>
              </div>

              {/* Detalhes */}
              {modalUseCase.details && (
                <div className="p-4 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-xl">
                  <h3 className="font-display text-lg font-bold text-cosmic-purple mb-2">
                    📌 Detalhes
                  </h3>
                  <p className="text-neutral-light/90 leading-relaxed whitespace-pre-line">
                    {modalUseCase.details}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPageSimple;
