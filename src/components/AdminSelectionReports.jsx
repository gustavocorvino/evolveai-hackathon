import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeUseCases } from '../hooks/useRealtimeUseCases';
import { fetchSelections, getSelectionsDownloadUrl } from '../services/selectionStorage.service';

const categoryOptions = [
  { value: 'Industria', label: '🏭 Indústria', color: 'neon-cyan' },
  { value: 'Praticas', label: '⚙️ Práticas', color: 'cosmic-purple' },
  { value: 'Cases', label: '💼 Cases', color: 'solar-orange' }
];

const AdminSelectionReports = () => {
  const { useCases, loading } = useRealtimeUseCases();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('selections'); // 'selections' or 'byIndustry'

  // Get selected cases only
  const selectedCases = useCases.filter(uc => !uc.isAvailable);

  // Group by category
  const casesByCategory = {
    Industria: selectedCases.filter(uc => uc.category === 'Industria'),
    Praticas: selectedCases.filter(uc => uc.category === 'Praticas'),
    Cases: selectedCases.filter(uc => uc.category === 'Cases')
  };

  // Group ALL cases by subcategory (industry breakdown)
  const industryBreakdown = useCases.reduce((acc, uc) => {
    const key = uc.subcategory || uc.category || 'Outros';
    if (!acc[key]) {
      acc[key] = {
        total: 0,
        selected: 0,
        available: 0,
        category: uc.category
      };
    }
    acc[key].total++;
    if (!uc.isAvailable) {
      acc[key].selected++;
    } else {
      acc[key].available++;
    }
    return acc;
  }, {});

  const industryStats = Object.entries(industryBreakdown)
    .sort((a, b) => b[1].total - a[1].total);

  // Filter cases
  const displayCases = selectedCategory === 'all' 
    ? selectedCases 
    : casesByCategory[selectedCategory];

  // Export to CSV (usando ; como separador para PT-BR Excel)
  const handleExportCSV = () => {
    if (selectedCases.length === 0) {
      alert('Não há casos selecionados para exportar.');
      return;
    }

    // CSV Headers - separador ; para Excel PT-BR
    const headers = ['Caso de Uso', 'Categoria', 'Subcategoria', 'Nome da Equipe', 'Email da Equipe', 'Data Selecao'];
    
    // Função para limpar texto para CSV
    const cleanText = (text) => {
      if (!text) return '';
      // Remove quebras de linha, aspas e ponto-e-vírgula
      return String(text).replace(/[\r\n]+/g, ' ').replace(/["';]/g, ' ').trim();
    };
    
    // CSV Rows - usando ; como separador
    const rows = selectedCases.map(uc => [
      cleanText(uc.title),
      cleanText(uc.category),
      cleanText(uc.subcategory || uc.industria || uc.pratica || ''),
      cleanText(uc.selectedByTeamName || 'N/A'),
      cleanText(uc.selectedByTeamEmail || 'N/A'),
      uc.selectionTimestamp ? new Date(uc.selectionTimestamp).toLocaleString('pt-BR') : 'N/A'
    ]);

    // Build CSV content com separador ;
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\r\n');

    // Create blob with BOM for UTF-8 recognition
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `evolveai_selecoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Load selections from blob storage (serverless)
  const [blobSelections, setBlobSelections] = useState(null);
  const [loadingBlob, setLoadingBlob] = useState(false);

  const loadBlobSelections = async () => {
    setLoadingBlob(true);
    try {
      const data = await fetchSelections();
      setBlobSelections(data);
    } catch (err) {
      console.error('Failed to load selections from blob', err);
      alert('Falha ao carregar seleções. Veja console para detalhes.');
    } finally {
      setLoadingBlob(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner border-neon-cyan"></div>
        <span className="ml-4 text-neutral-light">Carregando relatórios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('selections')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            viewMode === 'selections'
              ? 'bg-neon-cyan text-deep-space'
              : 'bg-neutral-dark/50 text-neutral-light hover:bg-neutral-dark'
          }`}
        >
          📋 Casos Selecionados
        </button>
        <button
          onClick={() => setViewMode('byIndustry')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            viewMode === 'byIndustry'
              ? 'bg-neon-cyan text-deep-space'
              : 'bg-neutral-dark/50 text-neutral-light hover:bg-neutral-dark'
          }`}
        >
          🏭 Por Indústria/Subcategoria
        </button>
      </div>

      {viewMode === 'byIndustry' ? (
        /* Industry Breakdown View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-neon-cyan mb-2">
                🏭 Distribuição por Indústria/Subcategoria
              </h2>
              <p className="text-neutral-light text-sm">
                Visualize a quantidade de casos de uso por subcategoria
              </p>
            </div>
          </div>

          {/* Blob selections viewer */}
          {blobSelections && (
            <div className="mt-6 bg-neutral-dark/40 border-2 border-neon-cyan/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-neon-cyan">☁️ Seleções (Blob)</h3>
                <button onClick={() => setBlobSelections(null)} className="text-sm text-neutral-light/60">Fechar</button>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="text-neutral-light/80 text-xs">
                    <tr>
                      <th className="px-3 py-2 text-left">Timestamp</th>
                      <th className="px-3 py-2 text-left">Nome</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">SelectionId</th>
                      <th className="px-3 py-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blobSelections.map((s, idx) => (
                      <tr key={idx} className="border-t border-neutral-light/10">
                        <td className="px-3 py-2">{s.timestamp}</td>
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{s.email}</td>
                        <td className="px-3 py-2">{s.selectionId}</td>
                        <td className="px-3 py-2">{s.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Industry Stats Table */}
          <div className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neon-cyan/10 border-b-2 border-neon-cyan/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neon-cyan">
                      Indústria / Subcategoria
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neon-cyan">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-neon-cyan">
                      Total de Casos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-shield-green">
                      Disponíveis
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-solar-orange">
                      Selecionados
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-cosmic-purple">
                      % Selecionado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {industryStats.map(([industry, stats], index) => {
                    const percentage = ((stats.selected / stats.total) * 100).toFixed(0);
                    return (
                      <motion.tr
                        key={industry}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-neutral-light/10 hover:bg-neon-cyan/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-light">
                            {industry}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            stats.category === 'Industria' ? 'bg-neon-cyan/20 text-neon-cyan' :
                            stats.category === 'Praticas' ? 'bg-cosmic-purple/20 text-cosmic-purple' :
                            'bg-solar-orange/20 text-solar-orange'
                          }`}>
                            {stats.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-neon-cyan text-lg">
                            {stats.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-shield-green">
                            {stats.available}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-solar-orange">
                            {stats.selected}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 bg-deep-space rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-solar-orange transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="font-semibold text-cosmic-purple text-sm w-12 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Original Selections View */
        <div className="space-y-6">
          {/* Header with Export Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-neon-cyan mb-2">
                📊 Casos Selecionados
              </h2>
              <p className="text-neutral-light text-sm">
                Total de {selectedCases.length} casos selecionados por equipes
              </p>
                </div>
            <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              disabled={selectedCases.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-shield-green to-neon-cyan
                       text-white font-display font-bold rounded-lg
                       hover:shadow-glow-cyan transform hover:scale-105
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:transform-none"
            >
              📥 Exportar CSV
            </button>
            <button
              onClick={loadBlobSelections}
              className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-cosmic-purple text-white font-display font-bold rounded-lg hover:shadow-glow-cyan transition-all duration-300"
            >
              ☁️ Carregar Seleções (Blob)
            </button>
            <a
              href={getSelectionsDownloadUrl()}
              className="px-6 py-3 bg-neutral-dark/30 text-neutral-light rounded-lg font-medium hover:bg-neutral-dark transition-all"
            >
              ⬇️ Baixar CSV
            </a>
            </div>
              </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedCategory === 'all'
              ? 'bg-neon-cyan/20 border-neon-cyan'
              : 'bg-neutral-dark/30 border-neutral-light/20 hover:border-neon-cyan/50'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-display text-2xl font-bold text-neon-cyan">
              {selectedCases.length}
            </div>
            <div className="text-neutral-light text-sm">Todos</div>
          </div>
        </motion.div>

        {categoryOptions.map((cat, index) => (
          <motion.div
            key={cat.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedCategory === cat.value
                ? `bg-${cat.color}/20 border-${cat.color}`
                : 'bg-neutral-dark/30 border-neutral-light/20 hover:border-neon-cyan/50'
            }`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{cat.label.split(' ')[0]}</div>
              <div className={`font-display text-2xl font-bold text-${cat.color}`}>
                {casesByCategory[cat.value].length}
              </div>
              <div className="text-neutral-light text-sm">{cat.value}</div>
            </div>
          </motion.div>
        ))}
          </div>

          {/* Selected Cases Table */}
          {displayCases.length === 0 ? (
            <div className="text-center py-12 bg-neutral-dark/30 rounded-xl border-2 border-neutral-light/10">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-neutral-light text-lg">
                {selectedCategory === 'all' 
                  ? 'Nenhum caso foi selecionado ainda.'
                  : `Nenhum caso da categoria ${selectedCategory} foi selecionado.`}
              </p>
            </div>
          ) : (
            <div className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neon-cyan/10 border-b-2 border-neon-cyan/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neon-cyan">
                        Caso de Uso
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neon-cyan">
                        Categoria
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neon-cyan">
                        Equipe
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neon-cyan">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCases.map((useCase, index) => (
                      <motion.tr
                        key={useCase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-neutral-light/10 hover:bg-neon-cyan/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-light">
                            {useCase.title}
                          </div>
                          {useCase.subcategory && (
                            <div className="text-xs text-neutral-light/60 mt-1">
                              {useCase.subcategory}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            useCase.category === 'Industria' ? 'bg-neon-cyan/20 text-neon-cyan' :
                            useCase.category === 'Praticas' ? 'bg-cosmic-purple/20 text-cosmic-purple' :
                            'bg-solar-orange/20 text-solar-orange'
                          }`}>
                            {useCase.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-neutral-light font-medium">
                            {useCase.selectedByTeamName || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-neutral-light/80 text-sm">
                            {useCase.selectedByTeamEmail || 'N/A'}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSelectionReports;
