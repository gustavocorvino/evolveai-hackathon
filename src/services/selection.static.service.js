/**
 * Service para gerenciar seleções via API (Blob Storage)
 * Substitui o Firebase para arquitetura serverless
 */

import { invalidateCache } from './usecase.static.service';

const API_URL = '/api/selections';

/**
 * Verifica se um caso de uso já foi selecionado
 */
async function checkIfSelected(useCaseId) {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return false;
    
    const data = await response.json();
    const selections = data.selections || {};
    return !!selections[useCaseId];
  } catch (error) {
    console.error('Erro ao verificar seleção:', error);
    return false;
  }
}

/**
 * Seleciona um caso de uso (envia para API)
 * @param {string} visitorId - ID do visitante (email ou UID)
 * @param {string} useCaseId - ID do caso de uso
 * @param {object} visitorData - Dados do visitante (name, email)
 */
export async function selectUseCase(visitorId, useCaseId, visitorData = {}) {
  try {
    // Verificar se já foi selecionado
    const alreadySelected = await checkIfSelected(useCaseId);
    if (alreadySelected) {
      throw new Error('USE_CASE_ALREADY_SELECTED');
    }
    
    // Obter dados do visitante do sessionStorage se não fornecidos
    const storedVisitor = sessionStorage.getItem('visitor');
    const visitor = storedVisitor ? JSON.parse(storedVisitor) : {};
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        useCaseId,
        visitorId: visitorId || visitor.email || 'anonymous',
        visitorName: visitorData.name || visitor.name || 'Visitante',
        visitorEmail: visitorData.email || visitor.email || ''
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao selecionar caso');
    }

    // Invalida cache para forçar recarregamento dos use cases
    invalidateCache();
    
    const result = await response.json();
    return { success: true, ...result };
  } catch (error) {
    console.error('Erro ao selecionar:', error);
    
    // User-friendly error messages
    if (error.message === 'USE_CASE_ALREADY_SELECTED') {
      throw new Error('Este caso já foi selecionado por outra equipe. Por favor, escolha outro.');
    }
    
    throw new Error('Erro ao selecionar caso de uso. Tente novamente.');
  }
}

/**
 * Busca a seleção de um visitante
 * @param {string} visitorId - ID do visitante
 */
export async function getTeamSelection(visitorId) {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return null;
    
    const data = await response.json();
    const selections = data.selections || {};
    
    // Buscar a seleção do visitante
    for (const [useCaseId, selection] of Object.entries(selections)) {
      if (selection.visitorId === visitorId || selection.visitorEmail === visitorId) {
        // Buscar detalhes do use case
        const useCasesResponse = await fetch('/data/usecases.json');
        const useCases = await useCasesResponse.json();
        const useCaseArray = Array.isArray(useCases) ? useCases : (useCases.useCases || []);
        const useCase = useCaseArray.find(uc => uc.id === useCaseId);
        
        return {
          team: {
            name: selection.visitorName,
            email: selection.visitorEmail
          },
          useCase: useCase || { id: useCaseId, title: 'Caso não encontrado' }
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar seleção:', error);
    return null;
  }
}

/**
 * Verifica se o visitante já tem uma seleção
 * @param {string} visitorId - ID do visitante
 */
export async function hasExistingSelection(visitorId) {
  const selection = await getTeamSelection(visitorId);
  return selection !== null;
}

/**
 * Remove uma seleção (admin only)
 * @param {string} useCaseId - ID do caso de uso
 */
export async function removeSelection(useCaseId) {
  try {
    const response = await fetch(`${API_URL}?useCaseId=${useCaseId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Falha ao remover seleção');
    }

    // Invalida cache
    invalidateCache();
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao remover seleção:', error);
    throw error;
  }
}
