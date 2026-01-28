import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// IMPORTANTE: Substitua pelos valores REAIS do Firebase Console
// 
// 📋 PASSO A PASSO PARA OBTER AS CREDENCIAIS:
// 1. Acesse: https://console.firebase.google.com
// 2. Clique no seu projeto (ou crie um novo)
// 3. Vá em "Configurações do Projeto" (ícone engrenagem no canto superior esquerdo)
// 4. Role até a seção "Seus apps"
// 5. Clique no ícone "</>" (Web)
// 6. Registre o app com nome "EvolveAI Hackathon"
// 7. COPIE o objeto firebaseConfig que aparece
// 8. COLE AQUI substituindo os valores abaixo

const firebaseConfig = {
  apiKey: "AIzaSyBbXZMlarLWvw9dsbutTlBloesq_gkprxs",
  authDomain: "evolveai-hackathon.firebaseapp.com",
  projectId: "evolveai-hackathon",
  storageBucket: "evolveai-hackathon.firebasestorage.app",
  messagingSenderId: "806986913757",
  appId: "1:806986913757:web:f0013fef6fa0c83f2c0834"
};

// Verificar se Firebase está configurado
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" && 
                     firebaseConfig.apiKey.length > 20;

if (!isConfigured) {
  console.error(`
╔════════════════════════════════════════════════════════════════╗
║                   ⚠️  FIREBASE NÃO CONFIGURADO ⚠️              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Você precisa configurar o Firebase para usar a aplicação!    ║
║                                                                ║
║  📋 PASSOS RÁPIDOS:                                            ║
║                                                                ║
║  1️⃣  Acesse: https://console.firebase.google.com              ║
║                                                                ║
║  2️⃣  Crie um novo projeto (ou use existente)                  ║
║                                                                ║
║  3️⃣  Vá em "Configurações do Projeto" (engrenagem)            ║
║                                                                ║
║  4️⃣  Seção "Seus apps" → Clique no ícone Web "</>"            ║
║                                                                ║
║  5️⃣  COPIE o objeto firebaseConfig                            ║
║                                                                ║
║  6️⃣  COLE em: src/firebase/config.js (este arquivo!)          ║
║                                                                ║
║  7️⃣  Habilite Firestore Database e Authentication             ║
║                                                                ║
║  📖 Leia o arquivo QUICK_START.md para guia completo          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
  
  // Mostrar alerta visual na página
  setTimeout(() => {
    if (typeof document !== 'undefined') {
      const alertDiv = document.createElement('div');
      alertDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          background: linear-gradient(135deg, #EF4444, #DC2626);
          color: white;
          padding: 24px 32px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.4);
          max-width: 600px;
          width: 90%;
          font-family: 'Inter', sans-serif;
          animation: slideDown 0.5s ease-out;
        ">
          <style>
            @keyframes slideDown {
              from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
              to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
          </style>
          <div style="display: flex; align-items: start; gap: 16px;">
            <div style="font-size: 32px;">🔥</div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">
                Firebase Não Configurado!
              </h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; opacity: 0.95;">
                A aplicação não pode funcionar sem as credenciais do Firebase.
                Configure em <strong>5 minutos</strong> seguindo os passos:
              </p>
              <ol style="margin: 0 0 16px 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Acesse <a href="https://console.firebase.google.com" target="_blank" style="color: #FFF; text-decoration: underline;">Firebase Console</a></li>
                <li>Crie/selecione projeto</li>
                <li>Copie as credenciais (firebaseConfig)</li>
                <li>Cole em: <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">src/firebase/config.js</code></li>
              </ol>
              <a 
                href="https://console.firebase.google.com" 
                target="_blank"
                style="
                  display: inline-block;
                  background: white;
                  color: #DC2626;
                  padding: 10px 20px;
                  border-radius: 8px;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 14px;
                  transition: all 0.3s;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                🚀 Abrir Firebase Console
              </a>
              <button 
                onclick="this.parentElement.parentElement.parentElement.remove()"
                style="
                  position: absolute;
                  top: 16px;
                  right: 16px;
                  background: rgba(255,255,255,0.2);
                  border: none;
                  color: white;
                  width: 32px;
                  height: 32px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.2s;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='rgba(255,255,255,0.2)'"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(alertDiv);
    }
  }, 1000);
}

// Initialize Firebase
let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  if (isConfigured) {
    console.log('✅ Firebase inicializado com sucesso!');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error.message);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

export { db, auth };
export default app;
