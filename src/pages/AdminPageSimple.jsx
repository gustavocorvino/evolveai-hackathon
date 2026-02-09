import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useStaticUseCases } from '../hooks/useStaticUseCases';
import { 
  saveUseCases, 
  parseCSVToUseCases, 
  generateCSVExport,
  releaseSelection 
} from '../services/data.service';

const AdminPageSimple = () => {
  const { selections, refreshSelections } = useAuth();
  const { useCases, loading, refreshUseCases } = useStaticUseCases();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalUseCase, setModalUseCase] = useState(null);
  
  // Estados para upload CSV
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);

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
    const csvContent = generateCSVExport(useCases, selections);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hackathon_selecoes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Upload CSV - Handler de arquivo
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadPreview(null);
    setUploadSuccess(null);

    if (!file.name.endsWith('.csv')) {
      setUploadError('Por favor, selecione um arquivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result;
        const parsedUseCases = parseCSVToUseCases(csvContent);
        
        if (parsedUseCases.length === 0) {
          setUploadError('Nenhum caso de uso encontrado no CSV');
          return;
        }

        setUploadPreview({
          fileName: file.name,
          useCases: parsedUseCases,
          csvContent
        });
      } catch (err) {
        setUploadError(err.message || 'Erro ao processar CSV');
      }
    };
    reader.onerror = () => {
      setUploadError('Erro ao ler arquivo');
    };
    reader.readAsText(file);
  }, []);

  // Confirmar upload
  const handleConfirmUpload = async () => {
    if (!uploadPreview?.useCases) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await saveUseCases(uploadPreview.useCases);
      
      setUploadSuccess({
        count: uploadPreview.useCases.length,
        source: result.source,
        message: result.message
      });
      
      // Atualizar lista de use cases
      if (typeof refreshUseCases === 'function') {
        await refreshUseCases();
      }
      
      // Limpar preview após sucesso
      setTimeout(() => {
        setUploadPreview(null);
        setShowUploadModal(false);
        setUploadSuccess(null);
      }, 2000);
      
    } catch (err) {
      setUploadError(err.message || 'Erro ao salvar casos de uso');
    } finally {
      setIsUploading(false);
    }
  };

  // Liberar caso específico
  const handleReleaseCase = async (useCaseId, useCaseTitle) => {
    if (!window.confirm(`🔓 Liberar o caso "${useCaseTitle}" para ser selecionado por outra equipe?`)) {
      return;
    }

    try {
      await releaseSelection(useCaseId);
      if (typeof refreshSelections === 'function') {
        await refreshSelections();
      }
      // Força refresh da página para atualizar o estado
      window.location.reload();
    } catch (err) {
      alert('Erro ao liberar caso: ' + err.message);
    }
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const template = `titulo;categoria;descricao;detalhes
"Exemplo de Caso 1";"Industria";"Descrição do primeiro caso de uso";"Detalhes adicionais aqui"
"Exemplo de Caso 2";"Praticas";"Descrição do segundo caso de uso";"Mais informações"
"Exemplo de Caso 3";"Cases";"Descrição do terceiro caso de uso";""`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_casos_uso.csv');
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
            
            <div className="flex gap-3">
              {/* Upload CSV */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-3 bg-gradient-to-r from-cosmic-purple to-neon-cyan rounded-lg
                         font-bold text-white hover:shadow-glow-cyan
                         transition-all duration-300 flex items-center gap-2"
              >
                📤 Importar CSV
              </button>

              {/* Exportar CSV */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-3 bg-gradient-to-r from-shield-green to-neon-cyan rounded-lg
                         font-bold text-white hover:shadow-glow-cyan
                         transition-all duration-300 flex items-center gap-2"
              >
                📥 Exportar CSV
              </button>
            </div>
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
                    
                    {/* Botão Liberar Caso */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReleaseCase(useCase.id, useCase.title);
                      }}
                      className="mt-2 w-full px-3 py-2 bg-nova-red/20 border border-nova-red/50 rounded-lg
                               text-nova-red text-xs font-bold hover:bg-nova-red hover:text-white
                               transition-all duration-300"
                    >
                      🔓 Liberar Caso
                    </button>
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

      {/* Modal de Upload CSV */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!isUploading) {
                setShowUploadModal(false);
                setUploadPreview(null);
                setUploadError(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-dark border-2 border-cosmic-purple/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-neon-cyan flex items-center gap-2">
                  📤 Importar Casos de Uso via CSV
                </h2>
                <button
                  onClick={() => {
                    if (!isUploading) {
                      setShowUploadModal(false);
                      setUploadPreview(null);
                      setUploadError(null);
                    }
                  }}
                  className="text-neutral-light hover:text-white text-xl"
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>

              {/* Instruções */}
              <div className="mb-6 p-4 bg-deep-space/50 border border-neon-cyan/30 rounded-xl">
                <h3 className="font-bold text-neon-cyan mb-2">📋 Formato do CSV</h3>
                <p className="text-neutral-light text-sm mb-2">
                  O CSV deve conter as colunas (separador: vírgula ou ponto-e-vírgula):
                </p>
                <ul className="text-neutral-light/70 text-sm list-disc list-inside space-y-1">
                  <li><strong>titulo</strong> ou <strong>title</strong> (obrigatório) - Nome do caso</li>
                  <li><strong>categoria</strong> ou <strong>category</strong> - Industria, Praticas ou Cases</li>
                  <li><strong>descricao</strong> ou <strong>description</strong> - Descrição breve</li>
                  <li><strong>detalhes</strong> ou <strong>details</strong> - Informações adicionais</li>
                </ul>
                <button
                  onClick={handleDownloadTemplate}
                  className="mt-3 text-cosmic-purple hover:text-neon-cyan underline text-sm"
                >
                  ⬇️ Baixar template de exemplo
                </button>
              </div>

              {/* Área de Upload */}
              <div className="mb-6">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-cosmic-purple/50 rounded-xl p-8 text-center
                           cursor-pointer hover:border-neon-cyan hover:bg-neon-cyan/5
                           transition-all duration-300"
                >
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-neutral-light font-semibold">
                    Clique para selecionar arquivo CSV
                  </p>
                  <p className="text-neutral-light/50 text-sm mt-1">
                    ou arraste e solte aqui
                  </p>
                </div>
              </div>

              {/* Erro */}
              {uploadError && (
                <div className="mb-6 p-4 bg-alert-red/20 border border-alert-red rounded-xl">
                  <p className="text-alert-red font-semibold">❌ {uploadError}</p>
                </div>
              )}

              {/* Sucesso */}
              {uploadSuccess && (
                <div className="mb-6 p-4 bg-shield-green/20 border border-shield-green rounded-xl">
                  <p className="text-shield-green font-semibold">
                    ✅ {uploadSuccess.count} casos de uso importados com sucesso!
                  </p>
                  {uploadSuccess.source === 'local' && (
                    <p className="text-shield-green/70 text-sm mt-1">
                      ⚠️ {uploadSuccess.message}
                    </p>
                  )}
                </div>
              )}

              {/* Preview */}
              {uploadPreview && !uploadSuccess && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-neon-cyan">
                      📄 Preview: {uploadPreview.fileName}
                    </h3>
                    <span className="text-shield-green font-semibold">
                      {uploadPreview.useCases.length} casos encontrados
                    </span>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto border border-neutral-light/20 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-deep-space sticky top-0">
                        <tr>
                          <th className="text-left p-2 text-neon-cyan">ID</th>
                          <th className="text-left p-2 text-neon-cyan">Título</th>
                          <th className="text-left p-2 text-neon-cyan">Categoria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadPreview.useCases.slice(0, 10).map((uc, idx) => (
                          <tr key={idx} className="border-t border-neutral-light/10">
                            <td className="p-2 text-neutral-light/70">{uc.id}</td>
                            <td className="p-2 text-neutral-light">{uc.title}</td>
                            <td className="p-2 text-cosmic-purple">{uc.category}</td>
                          </tr>
                        ))}
                        {uploadPreview.useCases.length > 10 && (
                          <tr className="border-t border-neutral-light/10">
                            <td colSpan={3} className="p-2 text-center text-neutral-light/50">
                              ... e mais {uploadPreview.useCases.length - 10} casos
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Aviso */}
                  <div className="mt-4 p-3 bg-solar-orange/20 border border-solar-orange/50 rounded-lg">
                    <p className="text-solar-orange text-sm">
                      ⚠️ <strong>Atenção:</strong> Esta operação substituirá TODOS os casos de uso existentes.
                      As seleções serão perdidas se os IDs mudarem.
                    </p>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadPreview(null);
                    setUploadError(null);
                  }}
                  disabled={isUploading}
                  className="px-6 py-3 bg-neutral-dark border border-neutral-light/30 rounded-lg
                           text-neutral-light hover:border-neutral-light
                           transition-all duration-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                
                {uploadPreview && !uploadSuccess && (
                  <button
                    onClick={handleConfirmUpload}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gradient-to-r from-shield-green to-neon-cyan rounded-lg
                             font-bold text-white hover:shadow-glow-cyan
                             transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Importando...
                      </>
                    ) : (
                      <>
                        ✅ Confirmar Importação
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPageSimple;
