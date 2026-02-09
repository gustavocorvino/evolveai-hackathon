import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hackathon_team_data';

/**
 * Hook de autenticação simplificado (sem Firebase)
 * Usa localStorage para persistir dados da equipe
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega dados salvos do localStorage
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUser({ uid: parsed.id, email: parsed.email });
        setTeamData(parsed);
      } catch (e) {
        console.error('Erro ao carregar dados salvos:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    setLoading(false);
  }, []);

  const login = (teamName, email) => {
    const id = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const data = {
      id,
      name: teamName,
      email,
      selectedUseCaseId: null,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser({ uid: id, email });
    setTeamData(data);
    
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setTeamData(null);
  };

  const selectUseCase = (useCaseId) => {
    if (!teamData) return;
    
    const updatedData = {
      ...teamData,
      selectedUseCaseId: useCaseId,
      selectionTimestamp: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setTeamData(updatedData);
  };

  return { 
    user, 
    teamData, 
    loading, 
    login, 
    logout, 
    selectUseCase,
    isAuthenticated: !!user
  };
}
