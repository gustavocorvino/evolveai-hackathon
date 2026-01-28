import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Register a new team
 * @param {string} name - Team name
 * @param {string} email - Team email
 * @param {string} password - Password (auto-generated from name+email for simplicity)
 */
export async function registerTeam(name, email) {
  try {
    // Use name+email as password for simplicity (hackathon context)
    const password = `${name.replace(/\s/g, '')}${email}`.substring(0, 20);
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create team document in Firestore
    await setDoc(doc(db, 'teams', user.uid), {
      name,
      email,
      userId: user.uid,
      selectedUseCaseId: null,
      selectionTimestamp: null,
      timerStartedAt: null,
      isAdmin: false,
      createdAt: serverTimestamp()
    });
    
    return { 
      success: true, 
      teamId: user.uid,
      message: 'Equipe cadastrada com sucesso!' 
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    // Firebase not configured error
    if (error.code === 'auth/invalid-api-key' || 
        error.message.includes('API key not valid') ||
        error.message.includes('API_KEY_INVALID')) {
      throw new Error('⚠️ Firebase não configurado! Configure as credenciais em src/firebase/config.js (veja console do navegador)');
    }
    
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este email já está cadastrado. Use o login para acessar.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Senha muito fraca.');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Erro de conexão. Verifique sua internet e se o Firebase está configurado.');
    }
    
    throw new Error(`Erro ao cadastrar: ${error.message}`);
  }
}

/**
 * Login existing team
 * @param {string} name - Team name
 * @param {string} email - Team email
 */
export async function loginTeam(name, email) {
  try {
    const password = `${name.replace(/\s/g, '')}${email}`.substring(0, 20);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get team data
    const teamDoc = await getDoc(doc(db, 'teams', user.uid));
    
    if (!teamDoc.exists()) {
      throw new Error('Equipe não encontrada.');
    }
    
    const teamData = teamDoc.data();
    
    return { 
      success: true, 
      user: user,
      teamData: teamData,
      message: 'Login realizado com sucesso!' 
    };
  } catch (error) {
    console.error('Login error:', error);
    
    // Firebase not configured error
    if (error.code === 'auth/invalid-api-key' || 
        error.message.includes('API key not valid') ||
        error.message.includes('API_KEY_INVALID')) {
      throw new Error('⚠️ Firebase não configurado! Configure as credenciais em src/firebase/config.js');
    }
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Nome da equipe ou email incorretos.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido.');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Erro de conexão. Verifique sua internet e se o Firebase está configurado.');
    }
    
    throw new Error(error.message || 'Erro ao fazer login. Tente novamente.');
  }
}

/**
 * Logout current user
 */
export async function logoutTeam() {
  try {
    await signOut(auth);
    return { success: true, message: 'Logout realizado com sucesso!' };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Erro ao fazer logout.');
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser() {
  return auth.currentUser;
}
