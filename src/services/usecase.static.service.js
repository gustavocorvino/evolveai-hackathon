/**
 * Service para carregar use cases de arquivo JSON estático
 * Mescla com seleções do Blob Storage via API
 */

let cachedUseCases = null;
let cachedSelections = null;

/**
 * Busca seleções da API (Blob Storage)
 */
async function fetchSelectionsFromAPI() {
  try {
    const response = await fetch('/api/selections');
    if (!response.ok) {
      console.warn('API de seleções indisponível');
      return {};
    }
    const data = await response.json();
    return data.selections || {};
  } catch (error) {
    console.error('Erro ao buscar seleções:', error);
    return {};
  }
}

/**
 * Carrega os use cases do arquivo JSON estático
 * e mescla com as seleções do Blob Storage
 */
export async function loadUseCases(forceRefresh = false) {
  if (cachedUseCases && !forceRefresh) {
    return cachedUseCases;
  }

  try {
    // Carregar use cases estáticos e seleções em paralelo
    const [useCasesResponse, selections] = await Promise.all([
      fetch('/data/usecases.json'),
      fetchSelectionsFromAPI()
    ]);
    
    if (!useCasesResponse.ok) {
      throw new Error('Falha ao carregar dados');
    }
    
    const useCasesData = await useCasesResponse.json();
    let useCases = Array.isArray(useCasesData) ? useCasesData : (useCasesData.useCases || []);
    
    // Mesclar seleções com use cases
    useCases = useCases.map(uc => {
      const selection = selections[uc.id];
      if (selection) {
        return {
          ...uc,
          isAvailable: false,
          selectedByTeamId: selection.visitorId || selection.visitorEmail,
          selectedByTeamName: selection.visitorName || 'Equipe',
          selectedByTeamEmail: selection.visitorEmail || '',
          selectionTimestamp: selection.timestamp
        };
      }
      return uc;
    });
    
    cachedUseCases = useCases;
    cachedSelections = selections;
    return cachedUseCases;
  } catch (error) {
    console.error('Erro ao carregar use cases:', error);
    return cachedUseCases || [];
  }
}

/**
 * Invalida cache para forçar recarregamento
 */
export function invalidateCache() {
  cachedUseCases = null;
  cachedSelections = null;
}

/**
 * Lista todos os use cases com filtro opcional de categoria
 * @param {string|null} categoryFilter - Filtrar por categoria (Industria, Praticas, Cases)
 */
export async function listUseCases(categoryFilter = null) {
  const useCases = await loadUseCases();
  
  if (categoryFilter) {
    return useCases.filter(uc => uc.category === categoryFilter);
  }
  
  return useCases;
}

/**
 * Busca use case por ID
 * @param {string} useCaseId - ID do use case
 */
export async function getUseCaseById(useCaseId) {
  const useCases = await loadUseCases();
  const useCase = useCases.find(uc => uc.id === useCaseId);
  
  if (!useCase) {
    throw new Error('Caso de uso não encontrado');
  }
  
  return useCase;
}

/**
 * Retorna contagem de use cases disponíveis
 */
export async function getAvailableCount() {
  const useCases = await loadUseCases();
  return useCases.filter(uc => uc.isAvailable).length;
}

/**
 * Retorna contagem total de use cases
 */
export async function getTotalCount() {
  const useCases = await loadUseCases();
  return useCases.length;
}

/**
 * Subscription com polling para atualização periódica
 * @param {function} callback - Callback function
 * @param {function} errorCallback - Error callback function
 * @param {number} pollInterval - Intervalo de polling em ms (default: 5000)
 */
export function subscribeToUseCases(callback, errorCallback = null, pollInterval = 5000) {
  let isActive = true;
  
  // Carrega inicial
  loadUseCases(true)
    .then(useCases => {
      if (isActive) callback(useCases);
    })
    .catch(error => {
      if (errorCallback && isActive) errorCallback(error);
    });
  
  // Polling para atualizações
  const intervalId = setInterval(async () => {
    if (!isActive) return;
    try {
      const useCases = await loadUseCases(true);
      if (isActive) callback(useCases);
    } catch (error) {
      if (errorCallback && isActive) errorCallback(error);
    }
  }, pollInterval);
  
  // Retorna função unsubscribe
  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}
