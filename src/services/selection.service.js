import { db } from '../firebase/config';
import { 
  doc, 
  getDoc,
  runTransaction, 
  serverTimestamp,
  addDoc,
  collection 
} from 'firebase/firestore';

/**
 * Select a use case (CRITICAL - Race Condition Protected!)
 * Uses Firestore transaction to ensure only ONE team can select each case
 * 
 * @param {string} teamId - Team document ID (Firebase Auth UID)
 * @param {string} useCaseId - Use case document ID
 */
export async function selectUseCase(teamId, useCaseId) {
  try {
    const result = await runTransaction(db, async (transaction) => {
      // 1. Read use case with transaction lock
      const useCaseRef = doc(db, 'useCases', useCaseId);
      const useCaseDoc = await transaction.get(useCaseRef);
      
      if (!useCaseDoc.exists()) {
        throw new Error('USE_CASE_NOT_FOUND');
      }
      
      const useCaseData = useCaseDoc.data();
      
      // 2. Check if available
      if (!useCaseData.isAvailable || useCaseData.selectedByTeamId) {
        throw new Error('USE_CASE_ALREADY_SELECTED');
      }
      
      // 3. Read team with transaction lock
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await transaction.get(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('TEAM_NOT_FOUND');
      }
      
      const teamData = teamDoc.data();
      
      // 4. Check if team already selected a case
      if (teamData.selectedUseCaseId) {
        throw new Error('TEAM_ALREADY_SELECTED');
      }
      
      // 5. Update use case (mark as unavailable)
      transaction.update(useCaseRef, {
        isAvailable: false,
        selectedByTeamId: teamId,
        selectedByTeamName: teamData.name,
        selectedByTeamEmail: teamData.email,
        updatedAt: serverTimestamp()
      });
      
      // 6. Update team (record selection)
      transaction.update(teamRef, {
        selectedUseCaseId: useCaseId,
        selectionTimestamp: serverTimestamp(),
        timerStartedAt: null // Clear timer
      });
      
      return { 
        success: true, 
        useCaseTitle: useCaseData.title,
        useCaseCategory: useCaseData.category
      };
    });
    
    // 7. Create audit log (outside transaction to avoid blocking)
    try {
      await addDoc(collection(db, 'selectionLogs'), {
        teamId,
        useCaseId,
        action: 'SELECTED',
        timestamp: serverTimestamp()
      });
    } catch (logError) {
      console.error('Error creating audit log:', logError);
      // Don't fail the whole operation if logging fails
    }
    
    return result;
    
  } catch (error) {
    console.error('Selection error:', error);
    
    // User-friendly error messages
    if (error.message === 'USE_CASE_ALREADY_SELECTED') {
      throw new Error('Este caso já foi selecionado por outra equipe. Por favor, escolha outro.');
    }
    if (error.message === 'TEAM_ALREADY_SELECTED') {
      throw new Error('Sua equipe já selecionou um caso de uso.');
    }
    if (error.message === 'USE_CASE_NOT_FOUND') {
      throw new Error('Caso de uso não encontrado.');
    }
    if (error.message === 'TEAM_NOT_FOUND') {
      throw new Error('Equipe não encontrada.');
    }
    
    throw new Error('Erro ao selecionar caso de uso. Tente novamente.');
  }
}

/**
 * Get team selection info
 * @param {string} teamId - Team document ID
 */
export async function getTeamSelection(teamId) {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    
    if (!teamDoc.exists()) {
      return null;
    }
    
    const teamData = teamDoc.data();
    
    if (!teamData.selectedUseCaseId) {
      return null;
    }
    
    // Get selected use case details
    const useCaseRef = doc(db, 'useCases', teamData.selectedUseCaseId);
    const useCaseDoc = await getDoc(useCaseRef);
    
    if (!useCaseDoc.exists()) {
      return null;
    }
    
    return {
      team: teamData,
      useCase: { id: useCaseDoc.id, ...useCaseDoc.data() }
    };
  } catch (error) {
    console.error('Error getting team selection:', error);
    return null;
  }
}
