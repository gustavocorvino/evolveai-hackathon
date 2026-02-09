import { useState, useEffect, useCallback } from 'react';
import { fetchUseCases as fetchUseCasesFromAPI } from '../services/data.service';

/**
 * Hook para carregar use cases da API ou arquivo estático
 */
export function useStaticUseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchUseCasesFromAPI();
      setUseCases(result.useCases);
      setSource(result.source);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar use cases:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Função para forçar refresh
  const refreshUseCases = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return { useCases, loading, error, source, refreshUseCases };
}
