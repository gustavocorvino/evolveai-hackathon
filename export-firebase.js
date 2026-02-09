// Script para exportar dados do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyBbXZMlarLWvw9dsbutTlBloesq_gkprxs",
  authDomain: "evolveai-hackathon.firebaseapp.com",
  projectId: "evolveai-hackathon",
  storageBucket: "evolveai-hackathon.firebasestorage.app",
  messagingSenderId: "806986913757",
  appId: "1:806986913757:web:f0013fef6fa0c83f2c0834"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportData() {
  console.log('📦 Exportando dados do Firebase...');
  
  // Exportar casos de uso
  const useCasesSnapshot = await getDocs(collection(db, 'useCases'));
  const useCases = [];
  useCasesSnapshot.forEach(doc => {
    useCases.push({ id: doc.id, ...doc.data() });
  });
  
  // Exportar equipes
  const teamsSnapshot = await getDocs(collection(db, 'teams'));
  const teams = [];
  teamsSnapshot.forEach(doc => {
    teams.push({ id: doc.id, ...doc.data() });
  });
  
  const exportData = {
    exportDate: new Date().toISOString(),
    useCases,
    teams
  };
  
  writeFileSync('firebase-backup.json', JSON.stringify(exportData, null, 2));
  console.log(`✅ Exportado: ${useCases.length} casos, ${teams.length} equipes`);
  console.log('📄 Arquivo salvo: firebase-backup.json');
  process.exit(0);
}

exportData().catch(console.error);
