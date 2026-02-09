/**
 * Service para enviar seleções para a Azure Function
 * Salva as seleções em CSV via API
 */

const API_URL = '/api/append-selection';

/**
 * Envia uma seleção para ser salva no CSV
 * @param {Object} selectionData - Dados da seleção
 */
export async function submitSelection(selectionData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        userId: selectionData.teamId,
        name: selectionData.teamName,
        email: selectionData.email,
        selectionId: selectionData.useCaseId,
        details: selectionData.useCaseTitle || ''
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao enviar seleção');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar seleção:', error);
    throw error;
  }
}

/**
 * Busca todas as seleções do CSV
 */
export async function getSelections() {
  try {
    const response = await fetch(`${API_URL}?format=json`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar seleções');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar seleções:', error);
    throw error;
  }
}

/**
 * Baixa o CSV de seleções
 */
export function downloadSelectionsCSV() {
  window.open(`${API_URL}?download=true`, '_blank');
}
