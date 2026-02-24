import { useEffect, useState } from 'react';
import { subscribeToUseCases } from '../services/usecase.static.service';

/**
 * Custom React Hook for real-time use cases
 * Obtém dados do arquivo estático mesclado com seleções do Blob Storage
 * Atualiza via polling a cada 5 segundos
 */
export function useRealtimeUseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUseCases(
      (updatedUseCases) => {
        setUseCases(updatedUseCases);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  return { useCases, loading, error };
}
