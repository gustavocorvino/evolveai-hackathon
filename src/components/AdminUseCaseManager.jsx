import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeUseCases } from '../hooks/useRealtimeUseCases';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import StatsBar from './StatsBar';
import * as XLSX from 'xlsx';

const categoryOptions = [
  { value: 'Industria', label: '🏭 Indústria', color: 'neon-cyan' },
  { value: 'Praticas', label: '⚙️ Práticas', color: 'cosmic-purple' },
  { value: 'Cases', label: '💼 Cases', color: 'solar-orange' }
];

const AdminUseCaseManager = () => {
  const { useCases, loading } = useRealtimeUseCases();
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    category: 'Industria',
    pratica: '',
    industria: '',
    subcategory: 'Cliente'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  // Stats
  const availableCount = useCases.filter(uc => uc.isAvailable).length;
  const totalCount = useCases.length;
  const selectedCount = totalCount - availableCount;

  // Filtered cases
  const filteredCases = filterCategory === 'all' 
    ? useCases 
    : useCases.filter(uc => uc.category === filterCategory);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      details: '',
      category: 'Industria',
      pratica: '',
      industria: '',
      subcategory: 'Cliente'
    });
    setEditingCase(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (useCase) => {
    setEditingCase(useCase);
    setFormData({
      title: useCase.title,
      description: useCase.description,
      details: useCase.details || '',
      category: useCase.category,
      pratica: useCase.pratica || '',
      industria: useCase.industria || '',
      subcategory: useCase.subcategory || 'Cliente'
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingCase) {
        // Update existing
        const useCaseRef = doc(db, 'useCases', editingCase.id);
        await updateDoc(useCaseRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new
        await addDoc(collection(db, 'useCases'), {
          ...formData,
          isAvailable: true,
          selectedByTeamId: null,
          selectedByTeamName: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      resetForm();
    } catch (err) {
      console.error('Error saving use case:', err);
      setError('Erro ao salvar caso de uso: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (useCaseId) => {
    if (!window.confirm('Tem certeza que deseja excluir este caso de uso?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'useCases', useCaseId));
    } catch (err) {
      console.error('Error deleting use case:', err);
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = `⚠️ ATENÇÃO: Você está prestes a excluir TODOS os ${useCases.length} casos de uso!\n\nEsta ação é IRREVERSÍVEL!\n\nDigite "EXCLUIR TUDO" para confirmar:`;
    const confirmation = window.prompt(confirmMessage);
    
    if (confirmation !== 'EXCLUIR TUDO') {
      alert('Operação cancelada.');
      return;
    }

    setUploading(true);
    setUploadStatus('Excluindo todos os casos de uso...');

    try {
      let deletedCount = 0;
      for (const useCase of useCases) {
        await deleteDoc(doc(db, 'useCases', useCase.id));
        deletedCount++;
        setUploadStatus(`Excluindo ${deletedCount}/${useCases.length} casos...`);
      }
      
      setUploadStatus(`✅ ${deletedCount} casos de uso excluídos com sucesso!`);
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      console.error('Error deleting all:', err);
      setError('Erro ao excluir casos: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Lendo arquivo...');
    setError('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setUploadStatus(`${jsonData.length} casos encontrados. Validando...`);

      // Validar e processar dados
      const validCases = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        const rowNum = index + 2; // +2 porque linha 1 é header e index começa em 0

        // Validar campos obrigatórios
        if (!row.titulo && !row.title && !row.Titulo && !row.Title) {
          errors.push(`Linha ${rowNum}: Campo 'titulo' é obrigatório`);
          return;
        }
        if (!row.descricao && !row.description && !row.Descricao && !row.Description) {
          errors.push(`Linha ${rowNum}: Campo 'descricao' é obrigatório`);
          return;
        }
        if (!row.categoria && !row.category && !row.Categoria && !row.Category) {
          errors.push(`Linha ${rowNum}: Campo 'categoria' é obrigatório`);
          return;
        }

        // Extrair dados (suporta nomes em português e inglês)
        const title = row.titulo || row.title || row.Titulo || row.Title;
        const description = row.descricao || row.description || row.Descricao || row.Description;
        const details = row.detalhes || row.details || row.Detalhes || row.Details || '';
        const category = row.categoria || row.category || row.Categoria || row.Category;
        const pratica = row.pratica || row.practice || row.Pratica || row.Practice || '';
        const industria = row.industria || row.industry || row.Industria || row.Industry || '';
        const subcategory = row.subcategoria || row.subcategory || row.Subcategoria || row.Subcategory || 'Cliente';

        // Validar categoria
        const validCategories = ['Industria', 'Praticas', 'Cases'];
        if (!validCategories.includes(category)) {
          errors.push(`Linha ${rowNum}: Categoria '${category}' inválida. Use: Industria, Praticas ou Cases`);
          return;
        }

        // Validar subcategoria
        const validSubcategories = ['Cliente', 'Interno'];
        if (subcategory && !validSubcategories.includes(subcategory)) {
          errors.push(`Linha ${rowNum}: Subcategoria '${subcategory}' inválida. Use: Cliente ou Interno`);
          return;
        }

        validCases.push({
          title: String(title).trim(),
          description: String(description).trim(),
          details: String(details).trim(),
          category,
          pratica: String(pratica).trim(),
          industria: String(industria).trim(),
          subcategory: subcategory || 'Cliente',
          isAvailable: true,
          selectedByTeamId: null,
          selectedByTeamName: null,
          selectedByTeamEmail: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      // Se houver erros, mostrar e parar
      if (errors.length > 0) {
        setError(`Erros encontrados:\n${errors.join('\n')}`);
        setUploading(false);
        setUploadStatus('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (validCases.length === 0) {
        setError('Nenhum caso de uso válido encontrado no arquivo');
        setUploading(false);
        setUploadStatus('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Inserir casos individualmente (melhor compatibilidade com regras de segurança)
      setUploadStatus(`Inserindo ${validCases.length} casos...`);
      const useCasesRef = collection(db, 'useCases');
      
      let successCount = 0;
      for (const caseData of validCases) {
        try {
          await addDoc(useCasesRef, caseData);
          successCount++;
          setUploadStatus(`Inserindo ${successCount}/${validCases.length} casos...`);
        } catch (docError) {
          console.error('Error inserting case:', docError);
          errors.push(`Erro ao inserir "${caseData.title}": ${docError.message}`);
        }
      }

      if (errors.length > 0) {
        setError(`${successCount} casos importados com sucesso.\n\nErros:\n${errors.join('\n')}`);
        setUploadStatus('');
      } else {
        setUploadStatus(`✅ ${successCount} casos de uso importados com sucesso!`);
        setTimeout(() => {
          setUploadStatus('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 3000);
      }

    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Erro ao processar arquivo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Função para importar JSON
  const handleJsonUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Lendo arquivo JSON...');
    setError('');

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Se não for array, tenta extrair array do objeto
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

      setUploadStatus(`${dataArray.length} casos encontrados. Validando...`);

      const validCases = [];
      const errors = [];

      dataArray.forEach((item, index) => {
        // Validar campos obrigatórios
        if (!item.title) {
          errors.push(`Item ${index + 1}: Campo 'title' é obrigatório`);
          return;
        }
        if (!item.description) {
          errors.push(`Item ${index + 1}: Campo 'description' é obrigatório`);
          return;
        }

        // Mapear categoria do JSON para o formato do app
        let category = item.category || 'Praticas';
        // Se a categoria vier como texto diferente, mapear
        if (!['Industria', 'Praticas', 'Cases'].includes(category)) {
          // Tentar mapear categorias conhecidas
          if (category.toLowerCase().includes('industria') || category.toLowerCase().includes('industry')) {
            category = 'Industria';
          } else if (category.toLowerCase().includes('case')) {
            category = 'Cases';
          } else {
            category = 'Praticas'; // Default
          }
        }

        // Mapear subcategory
        let subcategory = item.subcategory || 'Cliente';
        if (!['Cliente', 'Interno'].includes(subcategory)) {
          subcategory = subcategory.toLowerCase().includes('interno') ? 'Interno' : 'Cliente';
        }

        validCases.push({
          title: String(item.title || '').trim(),
          description: String(item.description || '').trim(),
          details: String(item.details || '').trim(),
          category,
          pratica: String(item.pratica || item.practice || '').trim(),
          industria: String(item.industria || item.industry || '').trim(),
          subcategory,
          isAvailable: item.isAvailable !== false, // Default true
          selectedByTeamId: null,
          selectedByTeamName: null,
          selectedByTeamEmail: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      if (errors.length > 0 && validCases.length === 0) {
        setError(`Erros encontrados:\n${errors.join('\n')}`);
        setUploading(false);
        setUploadStatus('');
        if (jsonInputRef.current) jsonInputRef.current.value = '';
        return;
      }

      if (validCases.length === 0) {
        setError('Nenhum caso de uso válido encontrado no arquivo JSON');
        setUploading(false);
        setUploadStatus('');
        if (jsonInputRef.current) jsonInputRef.current.value = '';
        return;
      }

      // Inserir casos
      setUploadStatus(`Inserindo ${validCases.length} casos...`);
      const useCasesRef = collection(db, 'useCases');
      
      let successCount = 0;
      for (const caseData of validCases) {
        try {
          await addDoc(useCasesRef, caseData);
          successCount++;
          setUploadStatus(`Inserindo ${successCount}/${validCases.length} casos...`);
        } catch (docError) {
          console.error('Error inserting case:', docError);
          errors.push(`Erro ao inserir "${caseData.title}": ${docError.message}`);
        }
      }

      if (errors.length > 0) {
        setError(`${successCount} casos importados com sucesso.\n\nErros:\n${errors.join('\n')}`);
        setUploadStatus('');
      } else {
        setUploadStatus(`✅ ${successCount} casos de uso importados do JSON!`);
        setTimeout(() => {
          setUploadStatus('');
          if (jsonInputRef.current) jsonInputRef.current.value = '';
        }, 3000);
      }

    } catch (err) {
      console.error('Error uploading JSON:', err);
      if (err instanceof SyntaxError) {
        setError('Erro: O arquivo não é um JSON válido. Verifique a formatação.');
      } else {
        setError('Erro ao processar arquivo JSON: ' + err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Criar template Excel
    const template = [
      {
        titulo: 'Automação de Processos com IA',
        descricao: 'Implementação de IA para otimizar processos de produção e reduzir custos operacionais',
        detalhes: 'Requisitos: Python, Azure ML, conhecimento em manufatura',
        categoria: 'Industria',
        pratica: 'Data & AI',
        industria: 'Manufacturing',
        subcategoria: 'Cliente'
      },
      {
        titulo: 'Telemedicina e Prontuário Digital',
        descricao: 'Plataforma completa de saúde digital com telemedicina e prontuário eletrônico',
        detalhes: 'HIPAA compliant, integração HL7',
        categoria: 'Industria',
        pratica: 'Digital Apps',
        industria: 'Health',
        subcategoria: 'Cliente'
      },
      {
        titulo: 'Implementação DevOps Azure',
        descricao: 'Estabelecer cultura DevOps com CI/CD, automação de testes e monitoramento contínuo',
        detalhes: 'Ferramentas: Azure DevOps, GitHub Actions, Terraform',
        categoria: 'Praticas',
        pratica: 'DevOps',
        industria: 'Retail',
        subcategoria: 'Interno'
      },
      {
        titulo: 'Consultoria em Transformação Digital',
        descricao: 'Assessoria estratégica para modernização de processos e tecnologias',
        detalhes: 'Framework: Avanade Digital Maturity Assessment',
        categoria: 'Praticas',
        pratica: 'Advisory',
        industria: 'Financial Services',
        subcategoria: 'Cliente'
      },
      {
        titulo: 'Case Banco ABC - Open Banking',
        descricao: 'Implementação completa de plataforma Open Banking com segurança de nível bancário',
        detalhes: 'Cliente: Banco ABC, Duração: 6 meses, Resultados: 200% aumento em transações',
        categoria: 'Cases',
        pratica: 'Cloud',
        industria: 'Financial Services',
        subcategoria: 'Cliente'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Casos de Uso');

    // Ajustar largura das colunas
    worksheet['!cols'] = [
      { wch: 35 }, // titulo
      { wch: 50 }, // descricao
      { wch: 50 }, // detalhes
      { wch: 15 }, // categoria
      { wch: 20 }, // pratica
      { wch: 25 }, // industria
      { wch: 15 }  // subcategoria
    ];

    XLSX.writeFile(workbook, 'template_casos_de_uso.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <StatsBar 
        availableCount={availableCount} 
        totalCount={totalCount}
        selectedCount={selectedCount}
      />

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-neon-cyan text-deep-space'
                : 'bg-neutral-dark/50 text-neutral-light hover:bg-neutral-dark'
            }`}
          >
            Todos ({totalCount})
          </button>
          {categoryOptions.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterCategory === cat.value
                  ? `bg-${cat.color} text-deep-space`
                  : 'bg-neutral-dark/50 text-neutral-light hover:bg-neutral-dark'
              }`}
            >
              {cat.label} ({useCases.filter(uc => uc.category === cat.value).length})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDeleteAll}
            disabled={useCases.length === 0 || uploading}
            className={`px-6 py-3 font-display font-bold rounded-lg transition-all duration-300
                     ${
                       useCases.length === 0 || uploading
                         ? 'bg-neutral-dark/50 text-neutral-light cursor-not-allowed'
                         : 'bg-nova-red text-white hover:shadow-glow-red transform hover:scale-105'
                     }`}
          >
            🗑️ Excluir Todos ({useCases.length})
          </button>
          
          <button
            onClick={downloadTemplate}
            className="px-6 py-3 bg-cosmic-purple text-white font-display font-bold rounded-lg
                     hover:shadow-glow-purple transform hover:scale-105 transition-all duration-300"
          >
            📥 Baixar Template
          </button>
          
          <label
            className={`px-6 py-3 font-display font-bold rounded-lg cursor-pointer
                     transform hover:scale-105 transition-all duration-300
                     ${uploading 
                       ? 'bg-neutral-dark/50 text-neutral-light cursor-not-allowed' 
                       : 'bg-solar-orange text-white hover:shadow-glow-orange'
                     }`}
          >
            {uploading ? '⏳ Processando...' : '📤 Importar Excel'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <label
            className={`px-6 py-3 font-display font-bold rounded-lg cursor-pointer
                     transform hover:scale-105 transition-all duration-300
                     ${uploading 
                       ? 'bg-neutral-dark/50 text-neutral-light cursor-not-allowed' 
                       : 'bg-neon-cyan text-deep-space hover:shadow-glow-cyan'
                     }`}
          >
            {uploading ? '⏳ Processando...' : '📤 Importar JSON'}
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('=== CLIQUE NO BOTÃO ===');
              console.log('showForm antes:', showForm);
              const newValue = !showForm;
              console.log('Novo valor será:', newValue);
              setShowForm(newValue);
            }}
            className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-cosmic-purple
                     text-white font-display font-bold rounded-lg
                     hover:shadow-glow-cyan transform hover:scale-105 transition-all duration-300"
          >
            {showForm ? '✕ Cancelar' : '➕ Adicionar Caso'}
          </button>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-neon-cyan/20 border-2 border-neon-cyan rounded-lg"
        >
          <p className="text-neon-cyan font-medium">{uploadStatus}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-nova-red/20 border-2 border-nova-red rounded-lg"
        >
          <p className="text-nova-red font-medium whitespace-pre-line">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      {console.log('Renderizando, showForm =', showForm)}
      {showForm && (
        <div className="overflow-hidden">
          <form onSubmit={handleSubmit} className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/30 rounded-xl p-6 space-y-4">
              <h3 className="font-display text-2xl font-bold text-neon-cyan mb-4">
                {editingCase ? '✏️ Editar Caso de Uso' : '➕ Novo Caso de Uso'}
              </h3>

              {error && (
                <div className="p-4 bg-nova-red/10 border-2 border-nova-red/50 rounded-lg">
                  <p className="text-nova-red text-sm">{error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none"
                    required
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Prática
                  </label>
                  <p className="text-xs text-neutral-light/60 mb-2">
                    Ex: Advisory, DevOps, Cloud, Data & AI, Digital Apps, Security
                  </p>
                  <input
                    type="text"
                    value={formData.pratica}
                    onChange={(e) => setFormData({ ...formData, pratica: e.target.value })}
                    placeholder="Digite o nome da prática"
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Indústria
                  </label>
                  <p className="text-xs text-neutral-light/60 mb-2">
                    Ex: Health, Manufacturing, Retail, Financial Services, Energy
                  </p>
                  <input
                    type="text"
                    value={formData.industria}
                    onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                    placeholder="Digite o nome da indústria"
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none"
                    required
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Interno">Interno</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none resize-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Detalhes do Caso de Uso (opcional)
                  </label>
                  <p className="text-xs text-neutral-light/60 mb-2">
                    Informações complementares que serão exibidas apenas após a seleção
                  </p>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={4}
                    placeholder="Ex: Requisitos técnicos, recursos necessários, orientações específicas..."
                    className="w-full px-4 py-3 bg-deep-space border-2 border-neon-cyan/30 rounded-lg 
                             text-neutral-light focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 
                             transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 px-6 bg-neutral-dark border-2 border-neutral-light/30 rounded-lg
                           text-neutral-light font-semibold hover:bg-neutral-light hover:text-deep-space
                           transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-shield-green to-neon-cyan
                           text-white font-display font-bold rounded-lg
                           hover:shadow-glow-cyan transform hover:scale-105
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '⏳ Salvando...' : (editingCase ? '💾 Atualizar' : '➕ Criar Caso')}
                </button>
              </div>
            </form>
          </div>
        )}

      {/* Cases List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner border-neon-cyan"></div>
            <span className="ml-4 text-neutral-light">Carregando casos...</span>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-20 bg-neutral-dark/30 rounded-xl border-2 border-neutral-light/10">
            <p className="text-neutral-light text-lg">Nenhum caso encontrado.</p>
          </div>
        ) : (
          filteredCases.map((useCase) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-dark/50 backdrop-blur-lg border-2 border-neon-cyan/20 rounded-xl p-6
                       hover:border-neon-cyan/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      useCase.category === 'Industria' ? 'bg-neon-cyan/20 text-neon-cyan' :
                      useCase.category === 'Praticas' ? 'bg-cosmic-purple/20 text-cosmic-purple' :
                      'bg-solar-orange/20 text-solar-orange'
                    }`}>
                      {useCase.category}
                    </span>
                    {useCase.pratica && (
                      <span className="px-2 py-1 bg-neutral-dark/50 border border-neon-cyan/30 rounded text-xs text-neutral-light">
                        ⚙️ {useCase.pratica}
                      </span>
                    )}
                    {useCase.industria && (
                      <span className="px-2 py-1 bg-neutral-dark/50 border border-cosmic-purple/30 rounded text-xs text-neutral-light">
                        🏭 {useCase.industria}
                      </span>
                    )}
                    {useCase.subcategory && (
                      <span className="px-2 py-1 bg-neutral-dark/50 border border-solar-orange/30 rounded text-xs text-neutral-light">
                        {useCase.subcategory === 'Cliente' ? '👤' : '🏢'} {useCase.subcategory}
                      </span>
                    )}
                    {useCase.isAvailable ? (
                      <span className="flex items-center gap-2 text-shield-green text-sm font-medium">
                        <div className="w-2 h-2 bg-shield-green rounded-full animate-pulse"></div>
                        Disponível
                      </span>
                    ) : (
                      <span className="text-nova-red text-sm font-medium">
                        🔒 Selecionado por: {useCase.selectedByTeamName}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-light mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-neutral-light/70 text-sm line-clamp-2">
                    {useCase.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(useCase)}
                    className="px-4 py-2 bg-cosmic-purple/20 border-2 border-cosmic-purple/50 rounded-lg
                             text-cosmic-purple hover:bg-cosmic-purple hover:text-white
                             transition-all duration-300 text-sm font-medium"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(useCase.id)}
                    className="px-4 py-2 bg-nova-red/20 border-2 border-nova-red/50 rounded-lg
                             text-nova-red hover:bg-nova-red hover:text-white
                             transition-all duration-300 text-sm font-medium"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUseCaseManager;
