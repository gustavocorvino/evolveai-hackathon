# EvolveAI Hackathon Brasil - Sistema de Seleção de Casos de Uso

## 🚀 Visão Geral

Sistema web para gerenciar a seleção de casos de uso durante o EvolveAI Hackathon Brasil. Permite que 300 equipes escolham entre 60 casos disponíveis com sincronização em tempo real e proteção contra race conditions.

## ✨ Funcionalidades

- 🎯 **Cadastro de Equipes**: Sistema de autenticação simplificado com Firebase Auth
- 🌌 **Galeria de Casos**: Interface visual com 60 casos organizados por categoria
- ⚡ **Seleção em Tempo Real**: Sincronização instantânea via Firestore
- 🛡️ **Proteção Race Condition**: Firestore Transactions garantem seleções únicas
- 🎨 **Tema Space Neon**: Design futurista inspirado em astronautas e galáxias
- 📊 **Dashboard Admin**: Gerenciamento via Firebase Console

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + Vite + JavaScript
- **Backend**: Firebase (Firestore + Authentication + Hosting)
- **Styling**: Tailwind CSS + Custom Space Neon Theme
- **Animations**: Framer Motion
- **State Management**: React Hooks + Context API

## 📋 Pré-requisitos

- Node.js 18+ LTS
- npm ou yarn
- Conta Firebase (gratuita)

## 🔧 Configuração do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

#### 2.1 Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `evolveai-hackathon`
4. Desabilite Google Analytics (opcional para MVP)
5. Clique em "Criar projeto"

#### 2.2 Habilitar Firestore Database

1. No menu lateral, vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Modo: **Produção** (vamos configurar as regras depois)
4. Local: **southamerica-east1 (São Paulo)**
5. Clique em "Ativar"

#### 2.3 Habilitar Authentication

1. No menu lateral, vá em **Authentication**
2. Clique em "Começar"
3. Na aba **Sign-in method**, habilite:
   - **Email/Senha** (ativar)
4. Salvar

#### 2.4 Obter Credenciais Firebase

1. No menu lateral, vá em **Configurações do Projeto** (ícone engrenagem)
2. Na seção "Seus apps", clique no ícone web `</>`
3. Registre o app: "EvolveAI Hackathon"
4. **COPIE o objeto `firebaseConfig`**
5. Cole as credenciais em `src/firebase/config.js` substituindo os valores de exemplo

```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "evolveai-hackathon.firebaseapp.com",
  projectId: "evolveai-hackathon",
  storageBucket: "evolveai-hackathon.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

#### 2.5 Configurar Firestore Security Rules

1. No Firestore Database, vá na aba **Regras**
2. Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Teams collection
    match /teams/{teamId} {
      // Allow read for authenticated users (only their own data)
      allow read: if request.auth != null && request.auth.uid == teamId;
      
      // Allow create only via Authentication (handled by SDK)
      allow create: if request.auth != null && request.auth.uid == teamId;
      
      // Allow update only for own team data
      allow update: if request.auth != null && request.auth.uid == teamId;
    }
    
    // Use Cases collection
    match /useCases/{useCaseId} {
      // Everyone can read use cases
      allow read: if true;
      
      // Only admins can write use cases (create via console)
      allow write: if request.auth != null && get(/databases/$(database)/documents/teams/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Selection Logs (audit)
    match /selectionLogs/{logId} {
      // Allow create for authenticated users
      allow create: if request.auth != null;
      
      // Only admins can read logs
      allow read: if request.auth != null && get(/databases/$(database)/documents/teams/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. Clique em **Publicar**

#### 2.6 Popular Dados Iniciais (60 Casos de Uso)

1. No Firestore Database, clique em **Iniciar coleção**
2. ID da coleção: `useCases`
3. Adicione documentos manualmente ou use o script de seed:

**Exemplo de documento:**

```json
{
  "title": "Otimização de Supply Chain com IA",
  "description": "Desenvolver modelo preditivo para otimizar logística de distribuição em rede varejista com 500+ pontos de venda",
  "category": "Industria",
  "subcategory": "Varejo",
  "isAvailable": true,
  "selectedByTeamId": null,
  "selectedByTeamName": null,
  "createdAt": "2026-01-27T10:00:00Z",
  "updatedAt": "2026-01-27T10:00:00Z"
}
```

**Categorias válidas:** `Industria`, `Praticas`, `Cases`

*Repita para criar 60 casos de uso diferentes*

### 3. Executar Aplicação

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

## 📦 Deploy

### Deploy no Firebase Hosting

1. Instalar Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login no Firebase:

```bash
firebase login
```

3. Inicializar Firebase no projeto:

```bash
firebase init
```

Selecione:
- ✅ Hosting
- Projeto: `evolveai-hackathon`
- Public directory: `dist`
- Single-page app: **Yes**
- GitHub deploys: **No**

4. Build e Deploy:

```bash
npm run build
firebase deploy
```

Sua aplicação estará disponível em: `https://evolveai-hackathon.web.app`

## 🎮 Como Usar

### Para Participantes (Equipes)

1. Acesse a URL da aplicação
2. Cadastre sua equipe com nome e email
3. Navegue pela galeria de 60 casos de uso
4. Filtre por categoria (Indústria, Práticas, Cases)
5. Clique em um caso disponível para ver detalhes
6. Confirme a seleção (atenção: escolha é definitiva!)
7. Receba próximos passos do hackathon

### Para Administradores

1. Acesse `/admin`
2. Login: `admin` / Senha: `evolveai2026`
3. Gerencie casos via Firebase Console
4. Monitore seleções em tempo real

## 🧪 Estrutura do Projeto

```
evolveai-hackathon/
├── src/
│   ├── components/          # Componentes React
│   │   ├── BackgroundParticles.jsx
│   │   ├── FilterBar.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── StatsBar.jsx
│   │   ├── UseCaseCard.jsx
│   │   └── UseCaseModal.jsx
│   ├── firebase/
│   │   └── config.js        # Firebase configuration
│   ├── hooks/
│   │   ├── useAuth.js       # Authentication hook
│   │   ├── useCountdownTimer.js
│   │   └── useRealtimeUseCases.js
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── LandingPage.jsx
│   │   └── SuccessPage.jsx
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── selection.service.js
│   │   └── usecase.service.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/                    # Documentação do projeto
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Tema Visual

**Space Neon Palette:**
- Deep Space Blue: `#0A1628` (background)
- Neon Cyan: `#06B6D4` (primary actions)
- Solar Orange: `#F97316` (highlights)
- Cosmic Purple: `#8B5CF6` (decorative)
- Shield Green: `#10B981` (available status)
- Nova Red: `#EF4444` (unavailable/errors)

## 🐛 Troubleshooting

### Erro: "Firebase not configured"

- Verifique se você configurou `src/firebase/config.js` com suas credenciais reais do Firebase Console

### Erro: "Permission denied" no Firestore

- Verifique se as Security Rules foram publicadas corretamente no Firebase Console

### Aplicação não carrega casos de uso

- Verifique se você populou a collection `useCases` no Firestore Database

## 📝 Licença

MIT License - EvolveAI Hackathon Brasil 2026

## 🤝 Suporte

Para dúvidas técnicas durante o hackathon, procure a equipe de suporte na área central.

---

**Desenvolvido por Tiago - Desenvolvedor Full Stack Avanade** 🚀✨
