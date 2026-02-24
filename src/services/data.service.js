/**
 * Service para gerenciar dados via API (Blob Storage)
 * Com fallback para localStorage quando API não disponível
 */

const API_BASE = '/api';
const LOCAL_USECASES_KEY = 'hackathon_usecases_cache';
const LOCAL_SELECTIONS_KEY = 'hackathon_selections';

/**
 * Buscar casos de uso da API ou fallback
 */
export async function fetchUseCases() {
  try {
    const response = await fetch(`${API_BASE}/usecases`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Se API retornou dados, usar e cachear
      if (data.useCases && data.useCases.length > 0) {
        localStorage.setItem(LOCAL_USECASES_KEY, JSON.stringify(data.useCases));
        return { useCases: data.useCases, source: 'api' };
      }
    }
  } catch (error) {
    console.warn('API não disponível, usando fallback:', error.message);
  }

  // Fallback 1: Cache local
  const cached = localStorage.getItem(LOCAL_USECASES_KEY);
  if (cached) {
    return { useCases: JSON.parse(cached), source: 'cache' };
  }

  // Fallback 2: Arquivo estático
  try {
    const staticResponse = await fetch('/data/usecases.json');
    if (staticResponse.ok) {
      const data = await staticResponse.json();
      return { useCases: data.useCases || data, source: 'static' };
    }
  } catch (e) {
    console.warn('Arquivo estático não disponível');
  }

  return { useCases: [], source: 'empty' };
}

/**
 * Salvar casos de uso na API
 */
export async function saveUseCases(useCases) {
  try {
    const response = await fetch(`${API_BASE}/usecases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useCases })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(LOCAL_USECASES_KEY, JSON.stringify(data.useCases));
      return { success: true, data, source: 'api' };
    }

    const error = await response.json();
    throw new Error(error.message || error.error || 'Erro ao salvar');
  } catch (error) {
    console.warn('API não disponível, salvando localmente:', error.message);
    
    // Fallback: salvar localmente
    localStorage.setItem(LOCAL_USECASES_KEY, JSON.stringify(useCases));
    return { success: true, source: 'local', message: 'Salvo localmente (API indisponível)' };
  }
}

/**
 * Buscar seleções da API ou localStorage
 */
export async function fetchSelections() {
  try {
    const response = await fetch(`${API_BASE}/selections`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.selections && Object.keys(data.selections).length > 0) {
        localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(data.selections));
        return { selections: data.selections, source: 'api' };
      }
    }
  } catch (error) {
    console.warn('API não disponível para seleções:', error.message);
  }

  // Fallback: localStorage
  const cached = localStorage.getItem(LOCAL_SELECTIONS_KEY);
  if (cached) {
    return { selections: JSON.parse(cached), source: 'local' };
  }

  return { selections: {}, source: 'empty' };
}

/**
 * Salvar uma seleção
 */
export async function saveSelection(selectionData) {
  try {
    const response = await fetch(`${API_BASE}/selections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectionData)
    });

    const data = await response.json();
    
    if (response.ok) {
      // Atualizar cache local
      const cached = localStorage.getItem(LOCAL_SELECTIONS_KEY);
      const selections = cached ? JSON.parse(cached) : {};
      selections[selectionData.useCaseId] = data.selection;
      localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(selections));
      
      return { success: true, data, source: 'api' };
    }

    // Conflito (já selecionado)
    if (response.status === 409) {
      throw new Error(data.error || 'Caso de uso já selecionado');
    }

    throw new Error(data.error || 'Erro ao salvar seleção');
  } catch (error) {
    // Se erro de rede, salvar localmente
    if (error.message.includes('fetch') || error.message.includes('network')) {
      console.warn('API não disponível, salvando localmente');
      
      const cached = localStorage.getItem(LOCAL_SELECTIONS_KEY);
      const selections = cached ? JSON.parse(cached) : {};
      
      // Verificar conflito local
      if (selections[selectionData.useCaseId]) {
        throw new Error('Caso de uso já selecionado');
      }
      
      selections[selectionData.useCaseId] = {
        ...selectionData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(selections));
      
      return { success: true, source: 'local' };
    }
    
    throw error;
  }
}

/**
 * Liberar uma seleção específica (admin)
 */
export async function releaseSelection(useCaseId) {
  try {
    const response = await fetch(`${API_BASE}/selections`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useCaseId })
    });

    if (response.ok) {
      // Atualizar cache local
      const cached = localStorage.getItem(LOCAL_SELECTIONS_KEY);
      if (cached) {
        const selections = JSON.parse(cached);
        delete selections[useCaseId];
        localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(selections));
      }
      return { success: true, source: 'api' };
    }

    const data = await response.json();
    throw new Error(data.error || 'Erro ao liberar seleção');
  } catch (error) {
    // Se erro de rede, liberar localmente
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed')) {
      console.warn('API não disponível, liberando localmente');
      
      const cached = localStorage.getItem(LOCAL_SELECTIONS_KEY);
      if (cached) {
        const selections = JSON.parse(cached);
        delete selections[useCaseId];
        localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(selections));
      }
      
      return { success: true, source: 'local' };
    }
    
    throw error;
  }
}

/**
 * Parsear CSV para array de casos de uso
 */
export function parseCSVToUseCases(csvContent) {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV deve conter cabeçalho e pelo menos uma linha de dados');
  }

  // Parsear cabeçalho
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().trim());

  // Mapear colunas possíveis
  const columnMap = {
    id: headers.findIndex(h => h === 'id'),
    title: headers.findIndex(h => ['title', 'titulo', 'título', 'nome'].includes(h)),
    category: headers.findIndex(h => ['category', 'categoria'].includes(h)),
    description: headers.findIndex(h => ['description', 'descricao', 'descrição'].includes(h)),
    details: headers.findIndex(h => ['details', 'detalhes'].includes(h)),
  };

  // Validar colunas obrigatórias
  if (columnMap.title === -1) {
    throw new Error('CSV deve conter coluna "titulo" ou "title"');
  }

  // Parsear linhas de dados
  const useCases = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === 0 || values.every(v => !v.trim())) continue;

    const useCase = {
      id: columnMap.id >= 0 ? values[columnMap.id]?.trim() : `uc${String(i).padStart(3, '0')}`,
      title: values[columnMap.title]?.trim() || '',
      category: columnMap.category >= 0 ? values[columnMap.category]?.trim() : 'Cases',
      description: columnMap.description >= 0 ? values[columnMap.description]?.trim() : '',
      details: columnMap.details >= 0 ? values[columnMap.details]?.trim() : '',
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    if (useCase.title) {
      useCases.push(useCase);
    }
  }

  return useCases;
}

/**
 * Parsear uma linha de CSV (com suporte a campos entre aspas)
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === ';') && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values.map(v => v.replace(/^"|"$/g, '').trim());
}

/**
 * Gerar CSV a partir de casos de uso e seleções
 */
export function generateCSVExport(useCases, selections) {
  // BOM UTF-8 para Excel reconhecer corretamente
  const BOM = '\uFEFF';
  const headers = ['ID', 'Titulo', 'Categoria', 'Subcategoria', 'Status', 'Equipe', 'Email', 'Data Selecao'];
  
  // Função para limpar texto
  const clean = (text) => {
    if (!text) return '';
    return String(text).replace(/[\r\n;]+/g, ' ').replace(/"/g, "'").trim();
  };
  
  const rows = useCases.map(uc => {
    const selection = selections[uc.id];
    // Aceita tanto formato antigo (teamName/email) quanto novo (visitorName/visitorEmail)
    const teamName = selection?.visitorName || selection?.teamName || '';
    const teamEmail = selection?.visitorEmail || selection?.email || '';
    const timestamp = selection?.timestamp;
    
    return [
      clean(uc.id),
      clean(uc.title),
      clean(uc.category),
      clean(uc.subcategory || uc.industria || uc.pratica || ''),
      selection ? 'Selecionado' : 'Disponivel',
      clean(teamName),
      clean(teamEmail),
      timestamp ? new Date(timestamp).toLocaleString('pt-BR') : ''
    ];
  });

  const csvContent = BOM + [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\r\n');

  return csvContent;
}
