import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { fetchSelections as fetchSelectionsFromAPI, saveSelection as saveSelectionToAPI } from '../services/data.service';

const STORAGE_KEY = 'hackathon_team_data';
const SELECTIONS_KEY = 'hackathon_selections';

// Context para compartilhar estado entre componentes
const AuthContext = createContext(null);

/**
 * Provider de autenticação
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});

  // Carrega dados salvos
  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setUser({ uid: parsed.id, email: parsed.email });
          setTeamData(parsed);
        } catch (e) {
          console.error('Erro ao carregar dados:', e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      
      // Tenta carregar seleções da API
      try {
        const result = await fetchSelectionsFromAPI();
        setSelections(result.selections);
      } catch (e) {
        console.error('Erro ao carregar seleções:', e);
        // Fallback para localStorage
        const savedSelections = localStorage.getItem(SELECTIONS_KEY);
        if (savedSelections) {
          setSelections(JSON.parse(savedSelections));
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  // Função para refresh de seleções
  const refreshSelections = useCallback(async () => {
    try {
      const result = await fetchSelectionsFromAPI();
      setSelections(result.selections);
    } catch (e) {
      console.error('Erro ao atualizar seleções:', e);
    }
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

  const selectUseCase = async (useCaseId, useCaseTitle) => {
    if (!teamData) return false;
    
    // Verifica se já foi selecionado por outro grupo
    if (selections[useCaseId]) {
      return false;
    }
    
    const selectionData = {
      useCaseId,
      teamId: teamData.id,
      teamName: teamData.name,
      email: teamData.email,
      useCaseTitle,
      timestamp: new Date().toISOString()
    };

    // Tenta salvar na API primeiro
    try {
      await saveSelectionToAPI(selectionData);
    } catch (err) {
      console.error('Erro ao salvar seleção:', err);
      // Se já selecionado, retorna false
      if (err.message.includes('já selecionado')) {
        return false;
      }
    }
    
    // Atualiza seleções locais
    const newSelections = {
      ...selections,
      [useCaseId]: selectionData
    };
    setSelections(newSelections);
    localStorage.setItem(SELECTIONS_KEY, JSON.stringify(newSelections));
    
    // Atualiza dados do time
    const updatedData = {
      ...teamData,
      selectedUseCaseId: useCaseId,
      selectionTimestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setTeamData(updatedData);
    
    return true;
  };

  const isUseCaseSelected = (useCaseId) => {
    return !!selections[useCaseId];
  };

  const getUseCaseSelection = (useCaseId) => {
    return selections[useCaseId] || null;
  };

  const hasTeamSelected = () => {
    return !!teamData?.selectedUseCaseId;
  };

  return (
    <AuthContext.Provider value={{
      user,
      teamData,
      loading,
      login,
      logout,
      selectUseCase,
      isUseCaseSelected,
      getUseCaseSelection,
      hasTeamSelected,
      selections,
      refreshSelections,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

