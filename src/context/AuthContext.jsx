import { useState, useEffect, createContext, useContext } from 'react';

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
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedSelections = localStorage.getItem(SELECTIONS_KEY);
    
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
    
    if (savedSelections) {
      try {
        setSelections(JSON.parse(savedSelections));
      } catch (e) {
        console.error('Erro ao carregar seleções:', e);
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

  const selectUseCase = (useCaseId, useCaseTitle) => {
    if (!teamData) return false;
    
    // Verifica se já foi selecionado por outro grupo
    if (selections[useCaseId]) {
      return false;
    }
    
    // Atualiza seleções globais
    const newSelections = {
      ...selections,
      [useCaseId]: {
        teamId: teamData.id,
        teamName: teamData.name,
        email: teamData.email,
        useCaseTitle,
        timestamp: new Date().toISOString()
      }
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
    
    // Tenta enviar para API (não bloqueia se falhar)
    submitToAPI(newSelections[useCaseId]).catch(console.error);
    
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

/**
 * Tenta enviar seleção para API (opcional)
 */
async function submitToAPI(selectionData) {
  try {
    const response = await fetch('/api/append-selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: selectionData.timestamp,
        userId: selectionData.teamId,
        name: selectionData.teamName,
        email: selectionData.email,
        selectionId: selectionData.useCaseId,
        details: selectionData.useCaseTitle
      })
    });
    
    if (!response.ok) {
      console.warn('API não configurada ou indisponível');
    }
  } catch (error) {
    console.warn('Não foi possível enviar para API:', error.message);
  }
}
