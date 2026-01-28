import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  onSnapshot,
  orderBy 
} from 'firebase/firestore';

/**
 * List all use cases with optional category filter
 * @param {string|null} categoryFilter - Filter by category (Industria, Praticas, Cases)
 */
export async function listUseCases(categoryFilter = null) {
  try {
    const useCasesRef = collection(db, 'useCases');
    
    let q = query(useCasesRef, orderBy('createdAt', 'asc'));
    
    if (categoryFilter) {
      q = query(useCasesRef, where('category', '==', categoryFilter), orderBy('createdAt', 'asc'));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error listing use cases:', error);
    throw new Error('Erro ao carregar casos de uso.');
  }
}

/**
 * Get use case by ID
 * @param {string} useCaseId - Use case document ID
 */
export async function getUseCaseById(useCaseId) {
  try {
    const docRef = doc(db, 'useCases', useCaseId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Caso de uso não encontrado');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error getting use case:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time use cases updates
 * @param {function} callback - Callback function to receive updates
 * @param {function} errorCallback - Error callback function
 */
export function subscribeToUseCases(callback, errorCallback = null) {
  const q = query(collection(db, 'useCases'), orderBy('createdAt', 'asc'));
  
  return onSnapshot(
    q, 
    (snapshot) => {
      const useCases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(useCases);
    },
    (error) => {
      console.error('Real-time listener error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  );
}

/**
 * Get available use cases count
 */
export async function getAvailableCount() {
  try {
    const q = query(collection(db, 'useCases'), where('isAvailable', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting available count:', error);
    return 0;
  }
}

/**
 * Get total use cases count
 */
export async function getTotalCount() {
  try {
    const snapshot = await getDocs(collection(db, 'useCases'));
    return snapshot.size;
  } catch (error) {
    console.error('Error getting total count:', error);
    return 0;
  }
}
