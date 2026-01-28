# 🚀 QUICK START - EvolveAI Hackathon

## ⚡ PASSOS RÁPIDOS PARA RODAR A APLICAÇÃO

### 1. Configurar Firebase (5 minutos)

#### a) Criar Projeto
1. Acesse: https://console.firebase.google.com
2. Clique em "Adicionar projeto"
3. Nome: `evolveai-hackathon`
4. Clique em "Criar projeto"

#### b) Habilitar Firestore
1. Menu lateral → **Firestore Database**
2. "Criar banco de dados"
3. Modo: **Produção**
4. Local: **southamerica-east1**
5. "Ativar"

#### c) Habilitar Authentication
1. Menu lateral → **Authentication**
2. "Começar"
3. Aba "Sign-in method"
4. Habilitar: **Email/Senha**

#### d) Copiar Credenciais
1. Menu lateral → **Configurações do Projeto** (engrenagem)
2. Seção "Seus apps" → ícone web `</>`
3. Nome do app: "EvolveAI Hackathon"
4. **COPIAR firebaseConfig**
5. Colar em `src/firebase/config.js`

```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

#### e) Configurar Security Rules
1. Firestore Database → aba **Regras**
2. Copiar conteúdo do arquivo `firestore.rules`
3. Colar no editor
4. Clicar em **Publicar**

### 2. Popular Dados (60 Casos de Uso)

Escolha UMA das opções:

**OPÇÃO A - Manual (Firebase Console):**
1. Firestore Database → "Iniciar coleção"
2. ID da coleção: `useCases`
3. Adicionar documentos manualmente

**OPÇÃO B - Script Automático:**
```bash
node seed-firestore.js
```

### 3. Rodar Aplicação

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 📋 CHECKLIST DE TESTE

### Fluxo de Equipe (Participante)
- [ ] Cadastrar nova equipe (nome + email)
- [ ] Ver galeria de 60 casos
- [ ] Filtrar por categoria (Indústria, Práticas, Cases)
- [ ] Clicar em caso disponível → Ver modal
- [ ] Selecionar caso → Ver página de sucesso
- [ ] Logout

### Fluxo de Sincronização Real-Time
- [ ] Abrir 2 navegadores (ou janelas anônimas)
- [ ] Cadastrar 2 equipes diferentes
- [ ] Equipe 1 seleciona caso X
- [ ] Verificar se caso X fica indisponível para Equipe 2 **INSTANTANEAMENTE**

### Fluxo Admin
- [ ] Acesse `/admin`
- [ ] Login: `admin` / Senha: `evolveai2026`
- [ ] Ver instruções de gerenciamento via Firebase Console

---

## 🐛 TROUBLESHOOTING RÁPIDO

### "Firebase not configured"
→ Você esqueceu de configurar `src/firebase/config.js` com suas credenciais

### "Permission denied"
→ Você não publicou as Security Rules no Firestore

### "Nenhum caso de uso aparece"
→ Você não populou a collection `useCases` no Firestore

### "Erro ao selecionar caso"
→ Verifique se as Security Rules estão corretas

---

## 🎨 TEMAS E CORES

### Paleta Space Neon
- **Deep Space**: `#0A1628` (background)
- **Neon Cyan**: `#06B6D4` (primário)
- **Solar Orange**: `#F97316` (destaque)
- **Cosmic Purple**: `#8B5CF6` (decorativo)
- **Shield Green**: `#10B981` (disponível)
- **Nova Red**: `#EF4444` (indisponível)

---

## 📦 ESTRUTURA DO PROJETO

```
src/
├── components/          # Componentes React
│   ├── BackgroundParticles.jsx
│   ├── FilterBar.jsx
│   ├── LoadingScreen.jsx
│   ├── StatsBar.jsx
│   ├── UseCaseCard.jsx
│   └── UseCaseModal.jsx
├── firebase/
│   └── config.js        # ⚠️ CONFIGURE AQUI!
├── hooks/
│   ├── useAuth.js
│   ├── useCountdownTimer.js
│   └── useRealtimeUseCases.js
├── pages/
│   ├── AdminPage.jsx
│   ├── GalleryPage.jsx
│   ├── LandingPage.jsx
│   └── SuccessPage.jsx
├── services/
│   ├── auth.service.js
│   ├── selection.service.js
│   └── usecase.service.js
└── App.jsx
```

---

## 🚀 DEPLOY (OPCIONAL)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init

# Build e Deploy
npm run build
firebase deploy
```

URL final: `https://evolveai-hackathon.web.app`

---

## ✅ PRONTO!

Aplicação completa com:
- ✅ Cadastro e autenticação de equipes
- ✅ Galeria de 60 casos com filtros
- ✅ Seleção com proteção race condition
- ✅ Sincronização real-time (< 1s)
- ✅ Tema Space Neon futurista
- ✅ Responsivo (desktop/tablet/mobile)

**Desenvolvido por Tiago - Dev Full Stack Avanade** 💻🚀
