import { useState, useEffect } from 'react';
import { loadUseCases } from '../services/usecase.static.service';

/**
 * Hook para carregar use cases do arquivo JSON estático
 */
export function useStaticUseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUseCases() {
      try {
        setLoading(true);
        const data = await loadUseCases();
        setUseCases(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar use cases:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUseCases();
  }, []);

  return { useCases, loading, error };
}
