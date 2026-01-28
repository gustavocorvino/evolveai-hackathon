import { useEffect, useState } from 'react';
import { subscribeToUseCases } from '../services/usecase.service';

/**
 * Custom React Hook for real-time use cases
 * Automatically updates when any use case changes in Firestore
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
