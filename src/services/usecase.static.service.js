/**
 * Service para carregar use cases de arquivo JSON estático
 * Sem dependência de Firebase
 */

let cachedUseCases = null;

/**
 * Carrega os use cases do arquivo JSON estático
 */
export async function loadUseCases() {
  if (cachedUseCases) {
    return cachedUseCases;
  }

  try {
    const response = await fetch('/data/usecases.json');
    if (!response.ok) {
      throw new Error('Falha ao carregar dados');
    }
    const data = await response.json();
    cachedUseCases = data.useCases || [];
    return cachedUseCases;
  } catch (error) {
    console.error('Erro ao carregar use cases:', error);
    return [];
  }
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
 * Simula subscription para compatibilidade (retorna unsubscribe vazio)
 * @param {function} callback - Callback function
 */
export function subscribeToUseCases(callback, errorCallback = null) {
  loadUseCases()
    .then(useCases => callback(useCases))
    .catch(error => {
      if (errorCallback) errorCallback(error);
    });
  
  // Retorna função de unsubscribe vazia para compatibilidade
  return () => {};
}
