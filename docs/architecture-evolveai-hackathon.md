# Architecture Document
## EvolveAI Hackathon Brasil - Sistema de Seleção de Casos de Uso
### Technical Architecture & Implementation Guide

**Versão:** 1.0  
**Data:** 27 de Janeiro de 2026  
**Arquiteto:** Wilson - Solutions Architect Avanade  
**Status:** Ready for Implementation  
**Prazo de Desenvolvimento:** 1 dia (MVP)

---

## 📋 Executive Summary

Este documento define a arquitetura técnica completa para o Sistema de Seleção de Casos de Uso do EvolveAI Hackathon Brasil. O sistema foi projetado para suportar **300 equipes simultâneas** selecionando entre **60 casos de uso** com requisitos críticos de **race condition protection** e **sincronização real-time**.

### Decisões Arquiteturais Principais (SIMPLIFICADO)

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| **Arquitetura** | Frontend-only (SPA com backend simulado) | Deploy em 1 click, zero configuração de servidor |
| **Frontend** | React 18 + Vite | Build rápido, desenvolvimento ágil, sem TypeScript (JS puro) |
| **Backend** | **Firebase (Firestore + Auth + Hosting)** | Sem servidor, banco NoSQL online, real-time nativo, grátis até 1GB |
| **Database** | **Firestore (NoSQL)** | Setup via console web, real-time listeners nativos, zero SQL |
| **Real-Time** | **Firestore onSnapshot()** | Real-time nativo do Firebase, sem WebSocket manual |
| **Hosting** | **Firebase Hosting** | Deploy com 1 comando (`firebase deploy`), CDN global |
| **Auth** | **Firebase Auth (Email/Password)** | Login sem backend custom, UI components prontos |

### Requisitos Não-Funcionais Críticos

- ✅ **Performance**: 300 acessos simultâneos (Firestore suporta até 1M reads/dia no free tier)
- ✅ **Concurrency**: Race condition protection com **Firestore Transactions** (automático)
- ✅ **Real-Time**: Sincronização instantânea via `onSnapshot()` (< 1 segundo)
- ✅ **Reliability**: Uptime 99.95% SLA do Firebase, sem manutenção de servidor
- ✅ **Security**: Firebase Auth + Firestore Security Rules (sem código backend)

---

## 🏗️ C4 Model Architecture

### Level 1: Context Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     SYSTEM CONTEXT                           │
│                                                              │
│                                                              │
│   ┌─────────────┐                                           │
│   │ Participante│                                           │
│   │  (Equipe)   │────────────┐                              │
│   │ ~300 users  │            │                              │
│   └─────────────┘            │                              │
│                              ▼                              │
│                    ┌──────────────────┐                     │
│                    │                  │                     │
│                    │   Sistema de     │                     │
│                    │   Seleção de     │                     │
│                    │   Casos de Uso   │                     │
│                    │                  │                     │
│                    │  [Web Application]│                    │
│                    └──────────────────┘                     │
│                              ▲                              │
│                              │                              │
│   ┌─────────────┐            │                              │
│   │Organizador  │────────────┘                              │
│   │  (Admin)    │                                           │
│   │ ~5 users    │                                           │
│   └─────────────┘                                           │
│                                                              │
│  Nota: Sistema isolado, sem integrações externas           │
└──────────────────────────────────────────────────────────────┘
```

**Atores do Sistema:**
- **Participantes (Equipes)**: 300 usuários simultâneos, selecionam 1 caso de uso cada
- **Administradores (Organizadores)**: 5 usuários, gerenciam casos e monitoram seleções

**Fronteiras do Sistema:**
- Sistema web self-contained (sem APIs externas)
- Dados persistidos em database própria
- Hospedado em cloud (Vercel + Render)

---

### Level 2: Container Diagram (ARQUITETURA SIMPLIFICADA - FIREBASE)

```
┌────────────────────────────────────────────────────────────────────┐
│                   CONTAINER DIAGRAM (FIREBASE)                     │
│                                                                    │
│  ┌──────────────┐                                                 │
│  │ Participante │                                                 │
│  │   Browser    │                                                 │
│  └──────┬───────┘                                                 │
│         │ HTTPS                                                   │
│         │                                                         │
│  ┌──────▼────────────────────────────────────────────┐           │
│  │         FRONTEND (SPA)                            │           │
│  │  [React 18 + Vite + JavaScript]                   │           │
│  │                                                    │           │
│  │  - Galeria de casos de uso                        │           │
│  │  - Cadastro/Login (Firebase Auth UI)              │           │
│  │  - Timer countdown (React state)                  │           │
│  │  - Firebase SDK (modular v9+)                     │           │
│  │                                                    │           │
│  │  Hosted on: Firebase Hosting                      │           │
│  │  Deploy: firebase deploy                          │           │
│  └──────┬────────────────────────────────────────────┘           │
│         │ Firebase SDK (REST + WebSocket)                        │
│         │                                                         │
│  ┌──────▼────────────────────────────────────────────┐           │
│  │         FIREBASE SERVICES (Managed)               │           │
│  │                                                    │           │
│  │  ┌─────────────────────────────────────────────┐  │           │
│  │  │ Firebase Authentication                     │  │           │
│  │  │ - Email/Password providers                  │  │           │
│  │  │ - User management (console web)             │  │           │
│  │  │ - Custom claims (admin role)                │  │           │
│  │  └─────────────────────────────────────────────┘  │           │
│  │                                                    │           │
│  │  ┌─────────────────────────────────────────────┐  │           │
│  │  │ Cloud Firestore (NoSQL Database)            │  │           │
│  │  │ Collections:                                 │  │           │
│  │  │   - teams (doc per team)                    │  │           │
│  │  │   - useCases (doc per case)                 │  │           │
│  │  │   - selectionLogs (doc per action)          │  │           │
│  │  │                                              │  │           │
│  │  │ Real-time: onSnapshot() listeners           │  │           │
│  │  │ Transactions: runTransaction() automático   │  │           │
│  │  └─────────────────────────────────────────────┘  │           │
│  │                                                    │           │
│  │  ┌─────────────────────────────────────────────┐  │           │
│  │  │ Cloud Functions (Timer Job) - OPCIONAL      │  │           │
│  │  │ - Scheduled function (cron)                 │  │           │
│  │  │ - Runs every 1 minute                       │  │           │
│  │  │ - Releases expired selections               │  │           │
│  │  └─────────────────────────────────────────────┘  │           │
│  │                                                    │           │
│  │  ┌─────────────────────────────────────────────┐  │           │
│  │  │ Security Rules (firestore.rules)            │  │           │
│  │  │ - Validação no database (sem backend)       │  │           │
│  │  │ - Role-based access (isAdmin check)         │  │           │
│  │  └─────────────────────────────────────────────┘  │           │
│  │                                                    │           │
│  └────────────────────────────────────────────────────┘           │
│                                                                    │
│  ┌──────────────┐                                                 │
│  │Organizador   │                                                 │
│  │  Browser     │ ─────────HTTPS──────► Frontend (same SPA)      │
│  └──────────────┘          + Admin UI (conditional render)       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Comunicação Simplificada:**
1. **Frontend → Firebase Auth**: Login/register via SDK (sem REST manual)
2. **Frontend → Firestore**: Read/write via SDK (real-time automático)
3. **Firestore → Frontend**: Push updates via `onSnapshot()` (WebSocket nativo)
4. **Cloud Function → Firestore**: Timer cleanup (scheduled cron) - OPCIONAL
5. **Security Rules**: Validação no banco (substitui middleware backend)

---

### Level 3: Component Diagram (Backend Monolith)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND COMPONENTS                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API Routes Layer                          │    │
│  │  /api/teams/*        → TeamController                  │    │
│  │  /api/use-cases/*    → UseCaseController               │    │
│  │  /api/admin/*        → AdminController                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                        ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Middleware Layer                          │    │
│  │  - authMiddleware (JWT validation)                     │    │
│  │  - errorHandler (global error catching)                │    │
│  │  - validationMiddleware (Zod schemas)                  │    │
│  │  - rateLimiter (admin login protection)                │    │
│  └────────────────────────────────────────────────────────┘    │
│                        ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Service Layer (Business Logic)            │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ TeamService                                      │  │    │
│  │  │ - register(name, email)                          │  │    │
│  │  │ - login(name, email)                             │  │    │
│  │  │ - getTeamInfo(teamId)                            │  │    │
│  │  │ - getTimerInfo(teamId)                           │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ UseCaseService                                   │  │    │
│  │  │ - listUseCases(filters?)                         │  │    │
│  │  │ - getUseCaseById(id)                             │  │    │
│  │  │ - createUseCase(data) [admin]                    │  │    │
│  │  │ - updateUseCase(id, data) [admin]                │  │    │
│  │  │ - deleteUseCase(id) [admin]                      │  │    │
│  │  │ - republishUseCase(id) [admin]                   │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ SelectionService  [CRITICAL]                     │  │    │
│  │  │ - selectUseCase(teamId, useCaseId)               │  │    │
│  │  │   → Race condition protection (transaction+lock) │  │    │
│  │  │   → Emit WebSocket on success                    │  │    │
│  │  │ - releaseExpiredSelections()                     │  │    │
│  │  │   → Called by TimerJob every 60s                 │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ AdminService                                     │  │    │
│  │  │ - login(username, password)                      │  │    │
│  │  │ - validateToken(token)                           │  │    │
│  │  │ - exportSelectionsToExcel()                      │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ WebSocketService                                 │  │    │
│  │  │ - emitUseCaseSelected(useCaseId)                 │  │    │
│  │  │ - emitUseCaseAvailable(useCaseId)                │  │    │
│  │  │ - emitStatsUpdated(stats)                        │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                        ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Data Access Layer (Prisma)                │    │
│  │  - PrismaClient instance (singleton)                   │    │
│  │  - Transaction support                                 │    │
│  │  - Query builders                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                        ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Database (PostgreSQL)                     │    │
│  │  [External Container]                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Background Jobs                           │    │
│  │  - TimerJob (node-cron: "*/60 * * * * *")             │    │
│  │    → Calls SelectionService.releaseExpiredSelections() │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Responsabilidades dos Componentes:**

1. **Controllers**: Recebem requests HTTP, validam input, chamam services, retornam responses
2. **Middlewares**: Cross-cutting concerns (autenticação, erro handling, validação)
3. **Services**: Lógica de negócio isolada, reutilizável, testável
4. **Data Access (Prisma)**: Abstração de database, migrations, type-safety
5. **Background Jobs**: Tarefas recorrentes (timer cleanup) independentes de requests

---Firestore Data Model (NoSQL)

### Firestore Collections Structure

```
firestore/
│
├── teams/                              (Collection)
│   ├── {teamId}/                       (Document - auto-generated ID)
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── userId: string              (Firebase Auth UID)
│   │   ├── selectedUseCaseId: string | null
│   │   ├── selectionTimestamp: timestamp | null
│   │   ├── timerStartedAt: timestamp | null
│   │   ├── createdAt: timestamp
│   │   └── (Sem subcollections)
│   │
│   └── {teamId2}/
│
├── useCases/                           (Collection)
│   ├── {useCaseId}/                    (Document - auto-generated ID)
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── category: string            ("Industria" | "Praticas" | "Cases")
│   │   ├── subcategory: string | null
│   │   ├── isAvailable: boolean
│   │   ├── selectedByTeamId: string | null
│   │   ├── selectedByTeamName: string | null  (denormalizado para UI)
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── {useCaseId2}/
│
└── selectionLogs/                      (Collection - Auditoria)
    ├── {logId}/                        (Document - auto-generated ID)
    │   ├── teamId: string
    │   ├── teamName: string            (denormalizado)
    │   ├── useCaseId: string
    │   ├── useCaseTitle: string        (denormalizado)
    │   ├── action: string              ("RESERVED" | "SELECTED" | "TIMEOUT" | "RELEASED")
    │   └── timestamp: timestamp
    │
    └── {logId2}/
```

**Diferenças vs SQL:**
- ❌ Sem foreign keys (usar IDs como strings)
- ❌ Sem JOINs (denormalizar dados quando necessário)
- ✅ Queries simples: `where('isAvailable', '==', true)`
- ✅ Real-time automático: `onSnapshot()`
- ✅ Transações nativas: `runTransaction()`
- **selection_logs.team_id** → **teams.id** (Many-to-One)
- **selection_logs.use_case_id** → **use_cases.id** (Many-to-One)

---

### Prisma Schema (schema.prisma)

```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// Admin Model
// ============================================================
model Admin {
  idFirestore Initialization (JavaScript)

```javascript
// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase config (obtido no Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "evolveai-hackathon.firebaseapp.com",
  projectId: "evolveai-hackathon",
  storageBucket: "evolveai-hackathon.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

### Firestore Security Rules (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/teams/$(request.auth.uid)).data.isAdmin == true;
    }
    
    function isOwner(teamId) {
      return isAuthenticated() && request.auth.uid == teamId;
    }
    
    // Teams collection
    match /teams/{teamId} {
      // Anyone can read team data
      allow read: if true;
      
      // Only the team owner can create/update their team
      allow create: if isAuthenticated() && request.auth.uid == teamId;
      allow update: if isOwner(teamId) || isAdmin();
      
      // Only admins can delete
      allow delete: if isAdmin();
    }
    
    // Use cases collection
    match /useCases/{useCaseId} {
      // Anyone can read
      allow read: if true;
      
      // Only admins can create/update/delete
      allow create, update, delete: if isAdmin();
    }
    
    // Selection logs collection (audit trail)
    match /selectionLogs/{logId} {
      // Anyone authenticated can read
      allow read: if isAuthenticated();
      
      // Only system can write (via transactions)
      allow create: if isAuthenticated();
      
      // No updates or deletes allowed (immutable audit log)
      allow update, delete: if false;
    }
  }
}
```

**Nota:** Sem necessidade de Prisma, migrations SQL, ou ORM. Tudo é configurado via Firebase Console! "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable: teams
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "selected_use_case_id" UUID,
    "selection_timestamp" TIMESTAMP(3),
    "timer_started_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable: use_cases
CREATE TABLE "use_cases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "subcategory" VARCHAR(100),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "selected_by_team_id" UUID,
    Firestore Initial Data (seed via Firebase Console ou script)

#### Opção 1: Via Firebase Console (MAIS FÁCIL)

1. Acesse https://console.firebase.google.com
2. Selecione projeto → Firestore Database
3. Clique "Start collection"
4. Crie collection `useCases`
5. Adicione documentos manualmente (ou importe JSON)

#### Opção 2: Via Script (seed-firestore.js)

```javascript
// seed-firestore.js
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const useCases = [
  {
    title: 'Otimização de Supply Chain com IA',
    description: 'Desenvolver modelo preditivo para otimizar logística de distribuição em rede varejista com 500+ pontos de venda.',
    category: 'Industria',
    subcategory: 'Varejo',
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Chatbot Inteligente para Atendimento',
    description: 'Criar assistente virtual com NLP para automatizar 80% das consultas de suporte ao cliente.',
    category: 'Praticas',
    subcategory: 'Customer Service',
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Dashboard de Performance Financeira',
    description: 'Desenvolver visualização interativa de KPIs financeiros em tempo real para CFOs.',
    category: 'Cases',
    subcategory: 'Cliente Banco XYZ',
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Sistema de Manutenção Preditiva Industrial',
    description: 'Implementar IoT + ML para prever falhas em equipamentos industriais 72h antes.',
    category: 'Industria',
    subcategory: 'Manufatura',
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Plataforma de Onboarding Digital',
    description: 'Criar jornada de integração de novos funcionários 100% digital com gamificação.',
    category: 'Praticas',
    subcategory: 'RH',
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function seedFirestore() {
  console.log('🌱 Seeding Firestore...');
  
  try {
    const useCasesRef = collection(db, 'useCases');
    
    for (const useCase of useCases) {
      const docRef = await addDoc(useCasesRef, useCase);
      console.log(`✅ Use case created: ${docRef.id} - ${useCase.title}`);
    }
    
    console.log('🌱 Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedFirestore();
```

**Rodar seed:**
```bash
node seed-firestore.js
```

**Admin User**: Criar manualmente via Firebase Console → Authentication → Add user → Definir custom claim `isAdmin: true        application/json:
            schema:
              type: object
              required: [name, email]
              properties:
                name:
                  type: string
                  minLength: 3
                  maxLength: 100
                  example: "Equipe Rocket"
                email:
                  type: string
                  format: email
                  example: "equipe@rocket.com"
      responses:
        '201':
          description: Equipe cadastrada com sucesso
          content:
            application/json:
              schema:
                type: object
                properties:
                  teamId:
                    type: string
                    format: uuid
                  token:
                    type: string
                    description: JWT token para autenticação
        '409':
          description: Equipe já existe (nome+email duplicado)
        '400':
          description: Dados inválidos
**Nota:** Com Firebase, NÃO criamos API REST manualmente. Usamos o SDK direto no frontend.

### Firebase Operations (JavaScript)

#### 1. Authentication Operations

```javascript
// auth.service.js
import { auth, db } from './firebase-config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Register team
export async function registerTeam(name, email, password) {
  try {
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
    
    return { success: true, teamId: user.uid };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login team
export async function loginTeam(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout
export async function logoutTeam() {
  await signOut(auth);
}
```

#### 2. Use Case Operations

```javascript
// usecase.service.js
import { db } from './firebase-config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  onSnapshot 
} from 'firebase/firestore';

// List all use cases
export async function listUseCases(categoryFilter = null) {
  const useCasesRef = collection(db, 'useCases');
  
  let q = useCasesRef;
  if (categoryFilter) {
    q = query(useCasesRef, where('category', '==', categoryFilter));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get use case by ID
export async function getUseCaseById(useCaseId) {
  const docRef = doc(db, 'useCases', useCaseId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Use case not found');
  }
  
  return { id: docSnap.id, ...docSnap.data() };
}

// Real-time listener for use cases (substitui WebSocket!)
export function subscribeToUseCases(callback) {
  const q = query(collection(db, 'useCases'));
  
  return onSnapshot(q, (snapshot) => {
    const useCases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(useCases);
  });
}
```

#### 3. Selection Operation (CRÍTICO - Race Condition Protected)

```javascript
// selection.service.js
import { db } from './firebase-config';
import { 
  doc, 
  runTransaction, 
  serverTimestamp,
  addDoc,
  collection 
} from 'firebase/firestore';

// Select use case (with transaction = race condition safe!)
export async function selectUseCase(teamId, useCaseId) {
  try {
    const result = await runTransaction(db, async (transaction) => {
      // 1. Read use case
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
      
      // 3. Read team
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await transaction.get(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('TEAM_NOT_FOUND');
      }
      
      const teamData = teamDoc.data();
      
      // 4. Check if team already selected
      if (teamData.selectedUseCaseId) {
        throw new Error('TEAM_ALREADY_SELECTED');
      }
      
      // 5. Update use case (mark as unavailable)
      transaction.update(useCaseRef, {
        isAvailable: false,
        selectedByTeamId: teamId,
        selectedByTeamName: teamData.name,
        updatedAt: serverTimestamp()
      });
      
      // 6. Update team (record selection)
      transaction.update(teamRef, {
        selectedUseCaseId: useCaseId,
        selectionTimestamp: serverTimestamp(),
        timerStartedAt: null
      });
      
      return { success: true, useCaseTitle: useCaseData.title };
    });
    
    // 7. Create audit log (fora da transaction para não bloquear)
    await addDoc(collection(db, 'selectionLogs'), {
      teamId,
      useCaseId,
      action: 'SELECTED',
      timestamp: serverTimestamp()
    });
    
    return result;
    
  } catch (error) {
    console.error('Selection error:', error);
    
    if (error.message === 'USE_CASE_ALREADY_SELECTED') {
      throw new Error('Este caso já foi selecionado por outra equipe');
    }
    if (error.message === 'TEAM_ALREADY_SELECTED') {
      throw new Error('Sua equipe já selecionou um caso de uso');
    }
    
    throw error;
  }
}
```

#### 4. Admin Operations

```javascript
// admin.service.js
import { db } from './firebase-config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';

// Create use case (admin only)
export async function createUseCase(data) {
  const docRef = await addDoc(collection(db, 'useCases'), {
    ...data,
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return { success: true, id: docRef.id };
}

// Update use case
export async function updateUseCase(useCaseId, data) {
  const docRef = doc(db, 'useCases', useCaseId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  
  return { success: true };
}

// Delete use case
export async function deleteUseCase(useCaseId) {
  await deleteDoc(doc(db, 'useCases', useCaseId));
  return { success: true };
}

// Republish use case (tornar disponível novamente)
export async function republishUseCase(useCaseId) {
  const docRef = doc(db, 'useCases', useCaseId);
  await updateDoc(docRef, {
    isAvailable: true,
    selectedByTeamId: null,
    selectedByTeamName: null,
    updatedAt: serverTimestamp()
  });
  
  // Log action
  await addDoc(collection(db, 'selectionLogs'), {
    useCaseId,
    action: 'RELEASED',
    timestamp: serverTimestamp()
  });
  
  return { success: true };
}
```

**Antiga OpenAPI (IGNORAR - não é mais necessária com Firebase):**

```yaml
#       tags: [Teams]
      summary: Login de equipe existente
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, email]
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
      responses:
        '200':
          description: Login bem-sucedido
          content:
      Firebase SDK Operations (Substitui REST API
              schema:
                type: object
                properties:
                  teamId:
                    type: string
                    format: uuid
                  token:
                    type: string
                  selectedUseCaseId:
                    type: string
                    format: uuid
                    nullable: true
        '404':
          description: Equipe não encontrada

  /api/teams/me:
    get:
      tags: [Teams]
      summary: Obter informações da equipe autenticada
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Informações da equipe
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TeamInfo'
        '401':
          description: Não autenticado

  /api/teams/timer:
    get:
      tags: [Teams]
      summary: Obter status do timer da equipe
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Informações do timer
          content:
            application/json:
              schema:
                type: object
                properties:
                  timerStartedAt:
                    type: string
                    format: date-time
                    nullable: true
                  remainingSeconds:
                    type: integer
                    nullable: true
                    description: Segundos restantes (null se timer não iniciado)

  # ============================================================
  # USE CASES ENDPOINTS (Public)
  # ============================================================
  /api/use-cases:
    get:
      tags: [Use Cases]
      summary: Listar todos os casos de uso
      parameters:
        - name: category
          in: query
          schema:
            type: string
            enum: [Industria, Praticas, Cases]
          description: Filtrar por categoria
      responses:
        '200':
          description: Lista de casos de uso
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/UseCase'

  /api/use-cases/{id}:
    get:
      tags: [Use Cases]
      summary: Obter detalhes de um caso específico
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Detalhes do caso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UseCaseDetail'
        '404':
          description: Caso não encontrado

  /api/use-cases/{id}/select:
    post:
      tags: [Use Cases]
      summary: Selecionar um caso de uso (CRITICAL - Race Condition Protected)
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Caso selecionado com sucesso
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  useCase:
                    $ref: '#/components/schemas/UseCaseDetail'
                  message:
                    type: string
                    example: "Caso selecionado com sucesso!"
        '409':
          description: Caso já foi selecionado por outra equipe
        '400':
          description: Equipe já selecionou um caso

  # ============================================================
  # ADMIN ENDPOINTS
  # ============================================================
  /api/admin/login:
    post:
      tags: [Admin]
      summary: Login de administrador
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                password:
                  type: string
                  format: password
      responses:
        '200':
          description: Login bem-sucedido
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  expiresIn:
                    type: string
                    example: "24h"
        '401':
          description: Credenciais inválidas

  /api/admin/use-cases:
    get:
      tags: [Admin]
      summary: Listar todos os casos (incluindo selecionados)
      security:
        - AdminAuth: []
      responses:
        '200':
          description: Lista completa de casos
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AdminUseCaseView'
    
    post:
      tags: [Admin]
      summary: Criar novo caso de uso
      security:
        - AdminAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UseCaseInput'
      responses:
        '201':
          description: Caso criado
        '400':
          description: Dados inválidos

  /api/admin/use-cases/{id}:
    patch:
      tags: [Admin]
      summary: Atualizar caso de uso
      security:
        - AdminAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UseCaseInput'
      responses:
        '200':
          description: Caso atualizado
        '404':
          description: Caso não encontrado

    delete:
      tags: [Admin]
      summary: Deletar caso de uso
      security:
        - AdminAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Caso deletado
        '404':
          description: Caso não encontrado

  /api/admin/use-cases/{id}/republish:
    patch:
      tags: [Admin]
      summary: Republicar caso (tornar disponível novamente)
      security:
        - AdminAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Caso republicado
        '404':
          description: Caso não encontrado

  /api/admin/export/selections:
    get:
      tags: [Admin]
      summary: Exportar relatório de seleções em Excel
      security:
        - AdminAuth: []
      responses:
        '200':
          description: Arquivo Excel
          content:
            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
              schema:
                type: string
                format: binary
          headers:
            Content-Disposition:
              schema:
                type: string
                example: 'attachment; filename="relatorio-selecoes-20260127-1430.xlsx"'

  /health:
    get:
      tags: [Health]
      summary: Health check endpoint
      responses:
        '200':
          description: Sistema operacional
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
                  timestamp:
                    type: string
                    format: date-time

# ============================================================
# COMPONENTS
# ============================================================
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token de equipe (obtido no login/register)
    
    AdminAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token de admin (obtido no login admin)

  schemas:
    UseCase:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        category:
          type: string
          enum: [Industria, Praticas, Cases]
        isAvailable:
          type: boolean

    UseCaseDetail:
      allOf:
        - $ref: '#/components/schemas/UseCase'
        - type: object
          properties:
            subcategory:
              type: string
              nullable: true
            selectedByTeamId:
              type: string
              format: uuid
              nullable: true

    UseCaseInput:
      type: object
      required: [title, description, category]
      properties:
        title:
          type: string
          minLength: 5
          maxLength: 200
        description:
          type: string
          minLength: 20
          maxLength: 2000
        category:
          type: string
          enum: [Industria, Praticas, Cases]
        subcategory:
          type: string
          maxLength: 100
          nullable: true

    AdminUseCaseView:
      allOf:
        - $ref: '#/components/schemas/UseCaseDetail'
        - type: object
          properties:
            selectedByTeam:
              type: object
              nullable: true
              properties:
                id:
                  type: string
                  format: uuid
                name:
                  type: string
                email:
                  type: string
            createdAt:
              type: string
              format: date-time
            updatedAt:
              type: string
              format: date-time

    TeamInfo:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        email:
          type: string
        selectedUseCase:
          $ref: '#/components/schemas/UseCaseDetail'
          nullable: true
        selectionTimestamp:
          type: string
          format: date-time
          nullable: true

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        code:
          type: string
```

---

## 🔌 Real-Time Strategy (Firestore onSnapshot)

### Real-Time Events (Automático via Firebase)

**Com Firebase, NÃO precisamos de WebSocket manual!** O Firestore fornece listeners real-time nativos via `onSnapshot()`.

```javascript
// Real-time listener para TODOS os casos de uso
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-config';

export function subscribeToUseCases(callback) {
  const q = query(collection(db, 'useCases'));
  
  // onSnapshot escuta mudanças em tempo real
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const useCases = [];
    
    snapshot.forEach((doc) => {
      useCases.push({ id: doc.id, ...doc.data() });
    });
    
    // Chama callback com dados atualizados
    callback(useCases);
  }, (error) => {
    console.error('Real-time listener error:', error);
  });
  
  // Retorna função para cancelar subscription
  return unsubscribe;
}
```

**Quando um caso é selecionado:**
1. Transaction do Firestore atualiza documento `useCases/{id}`
2. Firestore detecta mudança automaticamente
3. Todos os clientes conectados recebem atualização via `onSnapshot()`
4. Frontend re-renderiza com novos dados

**Vantagens:**
- ✅ Zero configuração de WebSocket
- ✅ Funciona automaticamente com múltiplos clientes
- ✅ Latência < 1 segundo (geralmente ~200ms)
- ✅ Reconexão automática em caso de perda de rede

### React Hook para Real-Time (useFirestoreRealtime.js)

```javascript
import { useEffect, useState } from 'react';
import { subscribeToUseCases } from '../services/usecase.service';

// Custom React Hook para real-time use cases
export function useRealtimeUseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUseCases(
      (updatedUseCases) => {
        setUseCases(updatedUseCases);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    // Cleanup on unmount
    return () => unsubscribe();
  }, []);
  
  return { useCases, loading, error };
}
```

**Usage em componente React:**

```javascript
import { useRealtimeUseCases } from '../hooks/useFirestoreRealtime';

function UseCaseGallery() {
  const { useCases, loading, error } = useRealtimeUseCases();
  
  if (loading) return <div>Carregando casos...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div className="gallery-grid">
      {useCases.map(useCase => (
        <UseCaseCard key={useCase.id} useCase={useCase} />
      ))}
    </div>
  );
}
```

**Resultado:** Quando QUALQUER equipe selecionar um caso, TODOS os outros browsers atualizam automaticamente!
import jwt from 'jsonwebtoken';

// ============================================================
// WebSocket Service Singleton
// ============================================================
class WebSocketService {
  private io: Server | null = null;
  private connectedClients: Set<string> = new Set();

  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'], // Fallback para polling
    });

    // Connection handler
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });

    console.log('✅ WebSocket server initialized');
  }

  private handleConnection(socket: Socket) {
    const clientId = socket.id;
    this.connectedClients.add(clientId);
    
    console.log(`🔌 Client connected: ${clientId} (Total: ${this.connectedClients.size})`);

    // Opcional: Autenticar conexão via JWT (se quiser segurança extra)
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        socket.data.userId = (decoded as any).teamId || (decoded as any).adminId;
      } catch (err) {
        console.warn('⚠️ Invalid token on WebSocket connection');
      }
    }

    // Send welcome message
    socket.emit('connected', { message: 'WebSocket connected successfully' });

    // Handle disconnect
    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
      console.log(`🔌 Client disconnected: ${clientId} (Total: ${this.connectedClients.size})`);
    });

    // Optional: Handle client-to-server events
    socket.on('refresh-use-case', (useCaseId: string) => {
      console.log(`🔄 Refresh requested for use case: ${useCaseId}`);
      // Implementar lógica se necessário
    });
  }

  // ============================================================
  // Broadcast Methods (called by SelectionService, AdminService)
  // ============================================================

  emitUseCaseSelected(useCaseId: string) {
    if (!this.io) return;
    
    const payload: UseCaseSelectedEvent = {
      useCaseId,
      timestamp: new Date().toISOString(),
    };
    
    this.io.emit('use-case-selected', payload);
    console.log(`📡 Broadcasted: use-case-selected (${useCaseId})`);
  }

  emitUseCaseAvailable(useCaseId: string, reason: 'timeout' | 'republished') {
    if (!this.io) return;
    
    const payload: UseCaseAvailableEvent = {
      useCaseId,
      reason,
      timestamp: new Date().toISOString(),
    };
    
    this.io.emit('use-case-available', payload);
    console.log(`📡 Broadcasted: use-case-available (${useCaseId}, reason: ${reason})`);
  }

  emitStatsUpdated(stats: { total: number; available: number; selected: number }) {
    if (!this.io) return;
    
    const payload: StatsUpdatedEvent = {
      ...stats,
      timestamp: new Date().toISOString(),
    };
    
    // Emit apenas para admins conectados (opcional: usar rooms)
    this.io.emit('stats-updated', payload);
    console.log(`📡 Broadcasted: stats-updated`);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}

export const webSocketService = new WebSocketService();
```

### Frontend Integration (useWebSocket.ts - React Hook)

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// ============================================================
// React Hook for WebSocket Connection
// ============================================================
export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // JWT de equipe/admin
    
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connected', (data) => {
      console.log('📩 Server says:', data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

// ============================================================
// Hook para escutar evento específico
// ============================================================
export function useWebSocketEvent<T>(
  eventName: string,
  callback: (data: T) => void
) {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);
}
```

### Usage Example (Galeria de Casos - React Component)

```typescript
import { useEffect, useState } from 'react';
import { useWebSocketEvent } from '@/hooks/useWebSocket';

function UseCaseGallery() {
  const [useCases, setUseCases] = useState([]);

  // Listen to use-case-selected event
  useWebSocketEvent<UseCaseSelectedEvent>(
    'use-case-selected',
    (data) => {
      console.log('🔴 Case selected:', data.useCaseId);
      
      // Update local state to mark case as unavailable
      setUseCases(prev =>
        prev.map(uc =>
          uc.id === data.useCaseId
            ? { ...uc, isAvailable: false }
            : uc
        )
      );
      
      // Show toast notification
      toast.info('Um caso foi selecionado por outra equipe');
    }
  );

  // Listen to use-case-available event
  useWebSocketEvent<UseCaseAvailableEvent>(
    'use-case-available',
    (data) => {
      console.log('🟢 Case available:', data.useCaseId);
      
      setUseCases(prev =>
        prev.map(uc =>
          uc.id === data.useCaseId
            ? { ...uc, isAvailable: true }
            : uc
        )
      );
      
      if (data.reason === 'timeout') {
        toast.success('Um caso voltou a ficar disponível!');
      }
    }
  );

  // ... rest of component
}
```

---

## 🔐 Race Condition Protection (CRITICAL)

### Sequence Diagram: Concurrent Selection Attempt

```
┌─────────┐                  ┌─────────┐                  ┌──────────┐
│ Team A  │                  │ Backend │                  │ Database │
└────┬────┘                  └────┬────┘                  └─────┬────┘
     │                            │                             │
     │ POST /api/use-cases/X/select                            │
     ├───────────────────────────>│                             │
     │                            │                             │
     │                            │ BEGIN TRANSACTION           │
     │                            ├────────────────────────────>│
     │                            │                             │
     │                            │ SELECT * FROM use_cases     │
     │                            │ WHERE id='X' FOR UPDATE     │
     │                            ├────────────────────────────>│
     │                            │                             │
     │                            │ <----- LOCK ACQUIRED ---    │
     │                            │ { isAvailable: true }       │
     │                            │<────────────────────────────┤
     │                                                          │
     │                            [Team B tenta aqui]          │
     │                                    │                     │
┌────┴────┐                              │                     │
│ Team B  │                              │                     │
└────┬────┘                              │                     │
     │ POST /api/use-cases/X/select      │                     │
     ├───────────────────────────────────>│                     │
     │                                    │ BEGIN TRANSACTION   │
     │                                    ├────────────────────>│
     │                                    │                     │
     │                                    │ SELECT ... FOR UPDATE
     │                                    ├────────────────────>│
     │                                    │ [BLOCKED - WAITING] │
     │                                    │ (espera Team A)     │
     │                                                          │
     │ (Team A continua...)               │                     │
     │                            │ UPDATE use_cases            │
     │                            │ SET isAvailable=false,      │
     │                            │     selectedByTeamId='A'    │
     │                            ├────────────────────────────>│
     │                            │                             │
     │                            │ UPDATE teams                │
     │                            │ SET selectedUseCaseId='X'   │
     │                            ├────────────────────────────>│
     │                            │                             │
     │                            │ INSERT INTO selection_logs  │
     │                            ├────────────────────────────>│
     │                            │                             │
     │                            │ COMMIT                      │
     │                            ├────────────────────────────>│
     │                            │ <----- LOCK RELEASED ---    │
     │<───────────────────────────┤                             │
     │ 200 OK { success: true }   │                             │
     │                            │                             │
     │                            │ Emit WebSocket:             │
     │                            │ 'use-case-selected'         │
     │                            │                             │
     │                                                          │
     │ (Team B agora continua...)        │                     │
     │                                    │ [LOCK ACQUIRED]     │
     │                                    │ { isAvailable: false}│
     │                                    │<────────────────────┤
     │                                    │                     │
     │                                    │ ROLLBACK (já selecionado)
     │                                    ├────────────────────>│
     │                                    │                     │
     │<───────────────────────────────────┤                     │
     │ 409 Conflict                       │                     │
     │ "Caso já foi selecionado"          │                     │
     │                                                          │
└──────────────────────────────────────────────────────────────┘
```

### Implementation (selection.service.ts)

```typescript
import { PrismaClient } from '@prisma/client';
import { webSocketService } from './websocket.service';

const prisma = new PrismaClient();

// ============================================================
// CRITICAL: Race Condition Protected Selection
// ============================================================
export async function selectUseCase(teamId: string, useCaseId: string) {
  // Use Prisma transaction with interactive transaction for fine-grained control
  return await prisma.$transaction(
    async (tx) => {
      // STEP 1: Lock the use case row (SELECT FOR UPDATE)
      const useCase = await tx.useCase.findUnique({
        where: { id: useCaseId },
        // Prisma doesn't have explicit FOR UPDATE syntax, but using
        // serializable isolation level achieves similar protection
      });

      if (!useCase) {
        throw new Error('USE_CASE_NOT_FOUND');
      }

      // STEP 2: Check availability
      if (!useCase.isAvailable || useCase.selectedByTeamId) {
        throw new Error('USE_CASE_ALREADY_SELECTED');
      }

      // STEP 3: Check if team already selected another case
      const team = await tx.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new Error('TEAM_NOT_FOUND');
      }

      if (team.selectedUseCaseId) {
        throw new Error('TEAM_ALREADY_SELECTED_A_CASE');
      }

      // STEP 4: Update use case (mark as unavailable)
      await tx.useCase.update({
        where: { id: useCaseId },
        data: {
          isAvailable: false,
          selectedByTeamId: teamId,
        },
      });

      // STEP 5: Update team (record selection)
      await tx.team.update({
        where: { id: teamId },
        data: {
          selectedUseCaseId: useCaseId,
          selectionTimestamp: new Date(),
          timerStartedAt: null, // Clear timer since selection is confirmed
        },
      });

      // STEP 6: Create audit log
      await tx.selectionLog.create({
        data: {
          teamId,
          useCaseId,
          action: 'SELECTED',
        },
      });

      // Transaction commits here if all succeed
      return { success: true, useCase };
    },
    {
      isolationLevel: 'Serializable', // Strongest isolation level
      timeout: 10000, // 10 seconds timeout
    }
  );
}

// ============================================================
// After successful transaction, emit WebSocket
// ============================================================
export async function handleUseCaseSelection(teamId: string, useCaseId: string) {
  try {
    const result = await selectUseCase(teamId, useCaseId);
    
    // Emit WebSocket event AFTER commit
    webSocketService.emitUseCaseSelected(useCaseId);
    
    // Update stats for admin dashboard
    const stats = await getUseCaseStats();
    webSocketService.emitStatsUpdated(stats);
    
    return result;
  } catch (error) {
    if (error.message === 'USE_CASE_ALREADY_SELECTED') {
      throw new AppError('Caso de uso já foi selecionado por outra equipe', 409);
    }
    if (error.message === 'TEAM_ALREADY_SELECTED_A_CASE') {
      throw new AppError('Sua equipe já selecionou um caso de uso', 400);
    }
    throw error;
  }
}

async function getUseCaseStats() {
  const [total, available] = await Promise.all([
    prisma.useCase.count(),
    prisma.useCase.count({ where: { isAvailable: true } }),
  ]);
  
  return {
    total,
    available,
    selected: total - available,
  };
}
```

### PostgreSQL Explicit Lock (Alternative)

Se preferir usar raw SQL para garantia máxima:

```typescript
export async function selectUseCaseWithExplicitLock(
  teamId: string,
  useCaseId: string
) {
  return await prisma.$transaction(async (tx) => {
    // Raw SQL com FOR UPDATE explícito
    const [useCase] = await tx.$queryRaw<UseCaseRow[]>`
      SELECT * FROM use_cases 
      WHERE id = ${useCaseId}::uuid 
      FOR UPDATE
    `;

    if (!useCase) {
      throw new Error('USE_CASE_NOT_FOUND');
    }

    if (!useCase.is_available) {
      throw new Error('USE_CASE_ALREADY_SELECTED');
    }

    // Continue com os updates...
    await tx.$executeRaw`
      UPDATE use_cases 
      SET is_available = false, selected_by_team_id = ${teamId}::uuid 
      WHERE id = ${useCaseId}::uuid
    `;

    await tx.$executeRaw`
      UPDATE teams 
      SET selected_use_case_id = ${useCaseId}::uuid, 
          selection_timestamp = NOW() 
      WHERE id = ${teamId}::uuid
    `;

    // ... audit log, etc
  });
}
```

---

## ⏱️ Timer System (Cloud Functions - OPCIONAL)

### Timer Logic Overview (Simplificado)

```
┌──────────────────────────────────────────────────────────────┐
│              TIMER WORKFLOW (2 OPÇÕES)                       │
│                                                              │
│  OPÇÃO 1: Frontend-Only (Mais Simples - RECOMENDADO)        │
│  ─────────────────────────────────────────────────────────   │
│  1. Team clicks "Confirmar Seleção" → Salva no Firestore    │
│  2. Timer é VISUAL apenas (não bloqueia backend)            │
│  3. Após 15 min, botão "Confirmar" fica disabled            │
│  4. Equipe perde direito de seleção (mas caso fica locked)  │
│  5. Admin pode republicar manualmente se necessário         │
│                                                              │
│  OPÇÃO 2: Cloud Functions (Automático - Requer Deploy)      │
│  ─────────────────────────────────────────────────────────   │
│  1. Team inicia timer → timerStartedAt salvo no Firestore   │
│  2. Cloud Function scheduled (cron) roda a cada 1 minuto    │
│  3. Function busca teams com timer expirado (>15 min)       │
│  4. Function libera caso automaticamente (transaction)      │
│  5. Frontend recebe update via onSnapshot (real-time)       │
│                                                              │
│  POpção 1: Timer Frontend-Only (SIMPLES - RECOMENDADO)

```javascript
// Timer local no React (sem backend)\nimport { useState, useEffect } from 'react';\n\nexport function useCountdownTimer(startTime, durationMs = 15 * 60 * 1000) {\n  const [remainingSeconds, setRemainingSeconds] = useState(null);\n  \n  useEffect(() => {\n    if (!startTime) {\n      setRemainingSeconds(null);\n      return;\n    }\n    \n    const updateTimer = () => {\n      const now = Date.now();\n      const elapsed = now - startTime.toMillis(); // Firestore timestamp\n      const remaining = Math.max(0, durationMs - elapsed);\n      setRemainingSeconds(Math.floor(remaining / 1000));\n    };\n    \n    updateTimer();\n    const interval = setInterval(updateTimer, 1000);\n    \n    return () => clearInterval(interval);\n  }, [startTime, durationMs]);\n  \n  const isExpired = remainingSeconds !== null && remainingSeconds <= 0;\n  const minutes = Math.floor(remainingSeconds / 60);\n  const seconds = remainingSeconds % 60;\n  \n  return { remainingSeconds, isExpired, minutes, seconds };\n}\n```\n\n### Opção 2: Cloud Function (Auto-Release - AVANÇADO)

```javascript
// functions/index.js (Firebase Cloud Functions)──────────────────────────────────────────────────┘
```

### Backend Implementation (timer.job.ts)

```typescript
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { webSocketService } from './websocket.service';

const prisma = new PrismaClient();

// ============================================================
// Timer Expiration Constants
// ============================================================
const TIMER_DURATION_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const JOB_INTERVAL = '*/60 * * * * *'; // Every 60 seconds

// ============================================================
// Background Job: Release Expired Selections
// ============================================================
export function startTimerJob() {
  console.log('⏱️  Starting timer cleanup job (runs every 60 seconds)...');

  cron.schedule(JOB_INTERVAL, async () => {
    try {
      await releaseExpiredSelections();
    } catch (error) {
      console.error('❌ Timer job failed:', error);
    }
  });
}

async function releaseExpiredSelections() {
  const now = new Date();
  const expirationTime = new Date(now.getTime() - TIMER_DURATION_MS);

  // Find teams with expired timers (started >15min ago, not confirmed)
  const expiredTeams = await prisma.team.findMany({
    where: {
      timerStartedAt: {
        lte: expirationTime, // Started before 15 min ago
      },
      selectionTimestamp: null, // Never confirmed selection
      selectedUseCaseId: {
        not: null, // Has a reserved case
      },
    },
    include: {
      selectedUseCase: true,
    },
  });

  if (expiredTeams.length === 0) {
    // console.log('⏱️  No expired timers to process');
    return;
  }

  console.log(`⏱️  Found ${expiredTeams.length} expired timer(s). Releasing...`);

  for (const team of expiredTeams) {
    await releaseReservation(team);
  }
}

async function releaseReservation(team: any) {
  const useCaseId = team.selectedUseCaseId!;

  try {
    await prisma.$transaction(async (tx) => {
      // Release use case
      await tx.useCase.update({
        where: { id: useCaseId },
        data: {
          isAvailable: true,
          selectedByTeamId: null,
        },
      });

      // Clear team timer
      await tx.team.update({
        where: { id: team.id },
        data: {
          selectedUseCaseId: null,
          timerStartedAt: null,
          selectionTimestamp: null,
        },
      });

      // Log timeout action
      await tx.selectionLog.create({
        data: {
          teamId: team.id,
          useCaseId,
          action: 'TIMEOUT',
        },
      });
    });

    console.log(`✅ Released use case ${useCaseId} from team ${team.name} (timeout)`);

    // Emit WebSocket event
    webSocketService.emitUseCaseAvailable(useCaseId, 'timeout');

    // Update stats
    const stats = await getUseCaseStats();
    webSocketService.emitStatsUpdated(stats);
  } catch (error) {
    console.error(`❌ Failed to release case ${useCaseId}:`, error);
  }
}

async function getUseCaseStats() {
  const [total, available] = await Promise.all([
    prisma.useCase.count(),
    prisma.useCase.count({ where: { isAvailable: true } }),
  ]);
  return {
    total,
    available,
    selected: total - available,
  };
}
```

### Timer Start Endpoint

```typescript
// When team clicks "Ver Detalhes" or enters gallery
export async function startTimer(teamId: string) {
  await prisma.team.update({
    where: { id: teamId },
    data: {
      timerStartedAt: new Date(),
    },
  });
}

// Get timer info for frontend countdown
export async function getTimerInfo(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { timerStartedAt: true },
  });

  if (!team?.timerStartedAt) {
    return { timerStartedAt: null, remainingSeconds: null };
  }

  const now = new Date();
  const elapsed = now.getTime() - team.timerStartedAt.getTime();
  const remaining = Math.max(0, TIMER_DURATION_MS - elapsed);
  const remainingSeconds = Math.floor(remaining / 1000);

  return {
    timerStartedAt: team.timerStartedAt,
    remainingSeconds,
  };
}
```

### Frontend Timer Component (React)

```typescript
import { useEffect, useState } from 'react';
import axios from 'axios';

export function TimerCountdown() {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial timer state
    async function fetchTimer() {
      const { data } = await axios.get('/api/teams/timer');
      setRemainingSeconds(data.remainingSeconds);
    }
    fetchTimer();

    // Update every second
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (remainingSeconds === null) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isUrgent = remainingSeconds < 60;

  return (
    <div className={`timer-container ${isUrgent ? 'urgent' : ''}`}>
      <span className="timer-icon">⏱️</span>
      <div className="timer-display">
        <span className="timer-label">Tempo Restante:</span>
        <div className="timer-countdown">
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
``` (SIMPLIFICADO - Firebase)

### Infrastructure Overview (SEM BACKEND!)

```
┌────────────────────────────────────────────────────────────┐
│          DEPLOYMENT ARCHITECTURE (FIREBASE ALL-IN-ONE)     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              FIREBASE HOSTING                        │ │
│  │  - Frontend SPA (React build)                        │ │
│  │  - Deploy: firebase deploy --only hosting           │ │
│  │  - CDN: Global edge network (automático)            │ │
│  │  - Domain: evolveai-hackathon.web.app               │ │
│  │  - Custom domain: hackathon.seudominio.com.br       │ │
│  │  - SSL: Automático (Let's Encrypt)                  │ │
│  └────────────────┬─────────────────────────────────────┘ │
│                   │ Firebase SDK (HTTPS + WebSocket)      │
│                   ▼                                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              FIREBASE SERVICES                       │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Authentication (Email/Password)                │  │ │
│  │  │ - Managed users, zero config                   │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Firestore Database (NoSQL)                     │  │ │
│  │  │ - Real-time sync (< 1s latency)                │  │ │
│  │  │ - Security Rules (validation)                  │  │ │
│  │  │ - Automatic indexing                           │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Cloud Functions (OPCIONAL)                     │  │ │
│  │  │ - Timer cleanup (scheduled)                    │  │ │
│  │  │ - Deploy: firebase deploy --only functions     │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  TUDO gerenciado pelo Firebase Console + CLI!             │
│  Sem Vercel, Render, PostgreSQL separados.               │
│  │  - Automated backups (daily)                        │ │
│  │  - Connection pooling                               │ │
│  │  - SSL required                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Step-by-Step Deployment Guide

#### 1. Setup GitHub Repository

```bash
# Initialize Git repo (if not already)
git init
git add .
git commit -m "Initial commit: EvolveAI Hackathon project"

# Create GitHub repo and push
git remote add origin https://github.com/your-org/evolveai-hackathon.git
git branch -M main
git push -u origin main
```

###No console Firebase, clique "Firestore Database" (menu lateral)
2. Clique "Create database"
3. Escolha modo: **Production mode** (com Security Rules)
4. Escolha localização: **southamerica-east1 (São Paulo)** → Próximo do Brasil!
5. Clique "Enable" → Aguarde ~1 minuto
6. Database criado! ✅
4. Copy **Internal Database URL** (for backend ENV)
5. Copy **External Database URL** (for local migrations)

#### 3. Run Database Migrations

```bash
# Locally, set DATABASE_URL to external URL
export DATABASE_URL="postgresql://hackathon_user:PASSWORD@HOST:5432/hackathon"

# Run migrations
npx prisma migrate deploy

# Run seed (populate initial data)
npx prisma db seed
```

#### 5. Configurar Projeto Localmente

1. Instale Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login no Firebase:
```bash
firebase login
```

3. Inicialize projeto:
```bash
firebase init

# Selecione (com ESPAÇO):
# - Hosting (para deploy frontend)
# - Firestore (para security rules)
# - Functions (OPCIONAL - apenas se usar timer automático)

# Configure:
# - Use existing project → evolveai-hackathon
# - Public directory: dist (build folder do Vite)
# - Single-page app: Yes
# - GitHub auto-deploy: No (ou Yes se preferir)
``Build React app
npm run build

# Deploy tudo (Hosting + Firestore Rules)
firebase deploy

# Ou deploy apenas hosting
firebase deploy --only hosting
```

**Output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/evolveai-hackathon
Hosting URL: https://evolveai-hackathon.web.app
```

**Pronto! Aplicação no ar com:**
- ✅ Frontend React hospedado (CDN global)
- ✅ Database Firestore configurado
- ✅ Authentication funcionando
- ✅ Real-time sync ativo
- ✅ SSL automático
- ✅ ZERO configuração de servidor backend!
Configure Environment Variables in Vercel Dashboard:
```
VITE_API_URL=https://evolveai-hackathon-api.onrender.com
VITE_WS_URL=https://evolveai-hackathon-api.onrender.com
```

Redeploy:
```bash
vercel --prod
```

#### 6. Setup CI/CD (GitHub Actions)

Creat7. (OPCIONAL) Setup CI/CD com GitHub Actions

Create `.github/workflows/firebase-
name: Deploy to Production

on:Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Firebase Hosting
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build React app
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: evolveai-hackathon
          channelId: live
```

**Configurar Secret:**
1. Firebase Console → Project Settings → Service accounts
2. Gere nova chave privada (JSON)
3. GitHub Repo → Settings → Secrets → New secret
4. Nome: `FIREBASE_SERVICE_ACCOUNT`
5. Valor: Cole o conteúdo do JSON

## 🧪 Testing Strategy (SIMPLIFICADO)

### Abordagem para MVP de 1 Dia

```
        ┌──────────────────┐
        │  Manual Testing  │  ← 70% (durante dev)
        │  (navegador)     │
        └──────────────────┘
      ┌────────────────────┐
      │ Firestore Rules   │  ← 20% (security testing)
      │ Testing (Emulator)│
      └────────────────────┘
    ┌──────────────────────┐
    │   Component Tests   │  ← 10% (React Testing Library)
    │   (Jest - OPCIONAL) │
    └──────────────────────┘
```

**Para MVP:** Foco em testes manuais + Firestore Security Rules. Unit/Load testing são OPCIONAIS.

### 1. Manual Testing (PRIORITÁRIO)

**Abrir 2 navegadores lado a lado (Chrome + Firefox ou 2 abas anônimas):**

- [ ] **Cadastro**: Criar 2 equipes (nomes/emails diferentes)
- [ ] **Login**: Fazer login com as 2 equipes
- [ ] **Listação**: Ver galeria de casos nos 2 navegadores
- [ ] **Real-Time**: Equipe A seleciona caso, verificar se Equipe B vê atualização instantânea
- [ ] **Race Condition**: Tentar selecionar MESMO caso simultaneamente (apenas 1 deve conseguir)
- [ ] **Timer**: Verificar countdown de 15 minutos funciona
- [ ] **Admin**: Login como admin, ver dashboard, republicar caso
- [ ] **Responsivo**: Testar em celular (Chrome DevTools > Mobile view)

#### Setup (OPCIONAL - apenas se quiser testes automatizados)

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0"
  }
}
```

#### Jest Config (jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

#### Example Unit Test (validation.test.ts)

```typescript
import { validateEmail, validateTeamName } from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validateTeamName', () => {
    it('should accept names with 3+ characters', () => {
      expect(validateTeamName('ABC')).toBe(true);
      expect(validateTeamName('Equipe Rocket')).toBe(true);
    });

    it('should reject short names', () => {
      expect(validateTeamName('AB')).toBe(false);
      expect(validateTeamName('')).toBe(false);
    });
  });
});
```

#### Example Service Test (selection.service.test.ts)

```typescript
import { selectUseCase } from '../services/selection.service';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $transaction: jest.fn(),
    useCase: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    team: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe('SelectionService', () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as any;
    jest.clearAllMocks();
  });

  describe('selectUseCase', () => {
    it('should successfully select an available use case', async () => {
      // Mock transaction callback
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(prisma);
      });

      // Mock use case (available)
      (prisma.useCase.findUnique as jest.Mock).mockResolvedValue({
        id: 'case-1',
        isAvailable: true,
        selectedByTeamId: null,
      });

      // Mock team (no selection yet)
      (prisma.team.findUnique as jest.Mock).mockResolvedValue({
        id: 'team-1',
        selectedUseCaseId: null,
      });

      const result = await selectUseCase('team-1', 'case-1');

      expect(result.success).toBe(true);
      expect(prisma.useCase.update).toHaveBeenCalledWith({
        where: { id: 'case-1' },
        data: {
          isAvailable: false,
          selectedByTeamId: 'team-1',
        },
      });
    });

    it('should reject if use case already selected', async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(prisma);
      });

      // Mock use case (NOT available)
      (prisma.useCase.findUnique as jest.Mock).mockResolvedValue({
        id: 'case-1',
        isAvailable: false,
        selectedByTeamId: 'team-2',
      });

      await expect(selectUseCase('team-1', 'case-1')).rejects.toThrow(
        'USE_CASE_ALREADY_SELECTED'
      );
    });
  });
});
```

### 2. Integration Tests (Supertest)

#### Setup

```bash
npm install --save-dev supertest @types/supertest
```

#### Example Integration Test (use-cases.integration.test.ts)

```typescript
import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Use Cases API Integration Tests', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear tables before each test
    await prisma.selectionLog.deleteMany();
    await prisma.team.deleteMany();
    await prisma.useCase.deleteMany();

    // Seed test data
    await prisma.useCase.create({
      data: {
        id: 'test-case-1',
        title: 'Test Use Case',
        description: 'This is a test use case',
        category: 'Industria',
        isAvailable: true,
      },
    });
  });

  describe('POST /api/use-cases/:id/select', () => {
    it('should select an available use case', async () => {
      // Create test team
      const teamResponse = await request(app)
        .post('/api/teams/register')
        .send({ name: 'Test Team', email: 'test@team.com' });

      const { token } = teamResponse.body;

      // Select use case
      const response = await request(app)
        .post('/api/use-cases/test-case-1/select')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify database state
      const useCase = await prisma.useCase.findUnique({
        where: { id: 'test-case-1' },
      });

      expect(useCase?.isAvailable).toBe(false);
    });

    it('should prevent concurrent selection (race condition test)', async () => {
      // Create two teams
      const team1Response = await request(app)
        .post('/api/teams/register')
        .send({ name: 'Team 1', email: 'team1@test.com' });

      const team2Response = await request(app)
        .post('/api/teams/register')
        .send({ name: 'Team 2', email: 'team2@test.com' });

      const token1 = team1Response.body.token;
      const token2 = team2Response.body.token;

      // Attempt concurrent selection
      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/use-cases/test-case-1/select')
          .set('Authorization', `Bearer ${token1}`),
        request(app)
          .post('/api/use-cases/test-case-1/select')
          .set('Authorization', `Bearer ${token2}`),
      ]);

      // One should succeed (200), one should fail (409)
      const statuses = [response1.status, response2.status].sort();
      expect(statuses).toEqual([200, 409]);

      // Verify only one team has the case
      const selections = await prisma.team.count({
        where: { selectedUseCaseId: 'test-case-1' },
      });

      expect(selections).toBe(1);
    });
  });
});
```

### 3. Load Testing (k6)

#### Install k6

```bash
# macOS
brew install k6

# Windows (via Chocolatey)
choco install k6

# Linux
sudo apt-get install k6
```

#### Load Test Script (load-test.js)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 300 },   // Ramp up to 300 users (peak)
    { duration: '2m', target: 300 },   // Stay at 300 for 2 min
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests < 2s
    http_req_failed: ['rate<0.05'],    // Error rate < 5%
    errors: ['rate<0.05'],
  },
};

const BASE_URL = 'https://evolveai-hackathon-api.onrender.com';

export default function () {
  // Simulate user flow
  const teamName = `Team-${__VU}-${__ITER}`;
  const email = `team${__VU}_${__ITER}@test.com`;

  // 1. Register team
  const registerRes = http.post(`${BASE_URL}/api/teams/register`, JSON.stringify({
    name: teamName,
    email: email,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'register status 201': (r) => r.status === 201,
  }) || errorRate.add(1);

  if (registerRes.status !== 201) {
    return; // Exit if registration failed
  }

  const token = registerRes.json('token');
  sleep(1);

  // 2. List use cases
  const listRes = http.get(`${BASE_URL}/api/use-cases`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(listRes, {
    'list status 200': (r) => r.status === 200,
    'list has cases': (r) => r.json().length > 0,
  }) || errorRate.add(1);

  sleep(2);

  // 3. Attempt to select first available case
  const useCases = listRes.json();
  const availableCase = useCases.find(uc => uc.isAvailable);

  if (availableCase) {
    const selectRes = http.post(
      `${BASE_URL}/api/use-cases/${availableCase.id}/select`,
      null,
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    check(selectRes, {
      'select status 200 or 409': (r) => [200, 409].includes(r.status),
    }) || errorRate.add(1);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
```

#### Run Load Test

```bash
# Run locally (against staging)
k6 run load-test.js

# Run with more virtual users
k6 run --vus 500 --duration 3m load-test.js

# Run in cloud (k6 cloud)
k6 cloud load-test.js
```

### 4. Manual Testing Checklist

#### Pre-Event Testing (Day Before)

- [ ] **Smoke Test**: All endpoints return 200/201
- [ ] **Race Condition**: 10 concurrent selections on same case (only 1 succeeds)
- [ ] **Timer Expiration**: Start timer, wait 15 min, verify case released
- [ ] **WebSocket**: Connect from 2 browsers, select case in one, verify update in other
- [ ] **Admin Login**: Valid/invalid credentials
- [ ] **Excel Export**: Download and verify format
- [ ] **Responsiveness**: Test on iPhone, iPad, Desktop (Chrome, Safari, Firefox)
- [ ] **Accessibility**: Tab navigation, screen reader (NVDA/JAWS)

#### During Event Monitoring

- [ ] Monitor error rate (< 1%)
- [ ] Monitor response times (p95 < 2s)
- [ ] Monitor WebSocket connections (should match active users)
- [ ] Monitor database CPU/memory (< 80%)
- [ ] Check logs for exceptions

---

## 🔒 Security & Error Handling

### Security Measures

#### 1. Authentication & Authorization

```typescript
// JWT Generation (team/admin)
import jwt from 'jsonwebtoken';

export function generateTeamToken(teamId: string) {
  return jwt.sign(
    { teamId, type: 'team' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

export function generateAdminToken(adminId: string) {
  return jwt.sign(
    { adminId, type: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

// Auth Middleware
export function authTeamMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (decoded.type !== 'team') {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    req.teamId = decoded.teamId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function authAdminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

#### 2. Password Hashing (bcrypt)

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage in admin login
export async function loginAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  
  if (!admin) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValidPassword = await comparePassword(password, admin.passwordHash);
  
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateAdminToken(admin.id);
  
  return { token, expiresIn: '24h' };
}
```

#### 3. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Admin login rate limiter (prevent brute force)
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to admin login route
app.post('/api/admin/login', adminLoginLimiter, adminLoginController);

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: 'Too many requests. Please slow down.',
});

app.use('/api/', apiLimiter);
```

#### 4. Input Validation (Zod)

```typescript
import { z } from 'zod';

// Team registration schema
export const teamRegisterSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
});

// Use case creation schema
export const useCaseCreateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  category: z.enum(['Industria', 'Praticas', 'Cases']),
  subcategory: z.string().max(100).optional(),
});

// Validation middleware
export function validate(schema: z.ZodSchema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// Usage
app.post(
  '/api/teams/register',
  validate(teamRegisterSchema),
  teamRegisterController
);
```

#### 5. CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

### Error Handling

#### Global Error Handler

```typescript
// Custom error class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Global error middleware (place last)
export function globalErrorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid authentication token',
    });
  }

  // Default: Internal server error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
}

app.use(globalErrorHandler);
```

#### Structured Logging (Winston)

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Usage
logger.info('Team registered', { teamId: 'abc-123', name: 'Equipe Rocket' });
logger.error('Selection failed', { error: err.message, teamId, useCaseId });
```

---

## 📝 Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT
JWT_SECRET="your-256-bit-secret-key-here-change-in-production"
JWT_EXPIRES_IN="24h"

# Server
NODE_ENV="production"
PORT="3000"

# Frontend URL (for CORS)
FRONTEND_URL="https://hackathon-cases.vercel.app"

# Admin Default Password (for seed)
ADMIN_DEFAULT_PASSWORD="hackathon2026"

# Timer
TIMER_DURATION_MS="900000"  # 15 minutes in ms

# Logging
LOG_LEVEL="info"  # debug | info | warn | error
```

### Frontend (.env)

```bash
# API Base URL
VITE_API_URL="https://evolveai-hackathon-api.onrender.com"
VITE_WS_URL="https://evolveai-hackathon-api.onrender.com"

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS="false"
VITE_ENABLE_DEBUG_LOGS="false"
```

---

## 📊 Monitoring & Observability

### Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check WebSocket
    const wsConnections = webSocketService.getConnectedClientsCount();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      connections: {
        database: 'connected',
        websocket: wsConnections,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message,
    });
  }
});
```

### Metrics Dashboard (Simple)

```typescript
let metrics = {
  totalRequests: 0,
  totalErrors: 0,
  totalSelections: 0,
  totalTimeouts: 0,
};

// Middleware to track requests
app.use((req, res, next) => {
  metrics.totalRequests++;
  next();
});

// Expose metrics (for admin only)
app.get('/api/admin/metrics', authAdminMiddleware, (req, res) => {
  res.json(metrics);
});
```

---

## ✅ Architecture Review Checklist (FIREBASE EDITION)

### Completeness

- [x] **C4 Model diagrams** (Context, Container simplificado)
- [x] **Database schema** (Firestore collections structure)
- [x] **Firebase SDK operations** (substitui REST API)
- [x] **Real-time strategy** (onSnapshot listeners)
- [x] **Race condition protection** (Firestore transactions)
- [x] **Timer system** (frontend-only + Cloud Function opcional)
- [x] **Deployment plan** (Firebase Console + CLI em 6 passos)
- [x] **Testing strategy** (manual + Firestore Rules)
- [x] **Security measures** (Firebase Auth + Security Rules)

### Implementation Readiness

- [x] Stack tecnológica defi (FIREBASE)

- [x] Stack tecnológica simplificada (Firebase all-in-one)
- [x] Firestore collections documentadas (3 collections)
- [x] Security Rules prontas (copy-paste)
- [x] Firebase SDK operations especificadas (JavaScript)
- [x] Real-time listeners implementados (onSnapshot)
- [x] Transações Firestore (race-safe)
- [x] Deploy em 1 comando (`firebase deploy`)
- [x] Seed data script (ou manu (FIREBASE)

- [x] Suporta 300 usuários simultâneos (Firestore Free: 1M reads/day, 50K writes/day)
- [x] Race condition protection (Firestore `runTransaction()` automático)
- [x] Timer de 15 minutos (frontend countdown + Cloud Function opcional)
- [x] Real-time sync (Firestore `onSnapshot()` < 1s latency)
- [x] CRUD completo de casos de uso (via Firebase SDK)
- [x] Exportação dados (Firestore Console ou script)
- [x] Autenticação segura (Firebase Auth + Security Rules)
- [x] Prazo de 1 dia AINDA MAIS viável (sem backend para desenvolver!
- [x] Prazo de 1 dia viável (monolith simples, stack familiar)

---

## 🚀 Next Steps for Development Team (FIREBASE WORKFLOW)

### Day 1 - Sprint Plan (6 horas - REDUZIDO!)

**Morning (0-3h)**
1. ✅ Criar projeto Firebase (Console web - 5 min)
2. ✅ Habilitar Firestore + Authentication (Console - 5 min)
3. ✅ Popular 5 casos de uso (Console ou script - 15 min)
4. ✅ Inicializar projeto React + Vite (30 min)
5. ✅ Configurar Firebase SDK (`firebase-config.js`) (15 min)
6. ✅ Implementar cadastro/login (Firebase Auth) (1h)

**Afternoon (3-6h)**
7. ✅ Implementar galeria de casos (Firestore query) (45 min)
8. ✅ Implementar real-time listeners (`onSnapshot`) (30 min)
9. ✅ Implementar seleção com transaction (45 min)
10. ✅ Implementar timer countdown (React state) (30 min)
11. ✅ Estilizar com Space Neon theme (1h)
12. ✅ Deploy Firebase Hosting (`firebase deploy`) (10 min)

**Handoff Materials Provided:**
- ✅ Firestore data model (copy-paste collections)
- ✅ Security Rules (copy-paste firestore.rules)
- ✅ Firebase SDK operations (JavaScript completo)
- ✅ React hooks (useRealtimeUseCases)
- ✅ Transaction code (race-safe selection)
- ✅ Deploy commands (firebase CLI)

---

## 📞 Contact & Support

**Architect:** Wilson - Solutions Architect Avanade  
**Email:** wilson.architect@avanade.com  
**Slack:** @wilson-architect  

**For clarifications:**
- Architecture questions → Wilson
- UX design → Sofia (@sofia-ux)
- Project planning → João (@joao-pm)
 (FIREBASE SIMPLIFIED)**  
**Last Updated:** 27/01/2026  
**Version:** 2.0 - Firebase Edition

---

## 📊 Comparação: Arquitetura Anterior vs Firebase

| Aspecto | Arquitetura Original | Arquitetura Firebase |
|---------|---------------------|----------------------|
| **Backend** | Node.js + Express + TypeScript | ❌ Não necessário (Firebase SDK) |
| **Database** | PostgreSQL + Prisma ORM | Firestore (NoSQL, console web) |
| **Real-Time** | Socket.io (manual) | Firestore onSnapshot (nativo) |
| **Auth** | JWT + bcrypt (código custom) | Firebase Auth (zero código) |
| **Hosting** | Vercel (FE) + Render (BE) | Firebase Hosting (tudo junto) |
| **Deploy** | 2 serviços separados | 1 comando (`firebase deploy`) |
| **Setup Time** | 2-3 horas | 15-30 minutos |
| **Migrations** | Prisma migrate (SQL) | ❌ Não necessário (NoSQL) |
| **Environment Vars** | 10+ variáveis | 1 config object (público) |
| **Manutenção** | Gerenciar 3 serviços | Zero (Firebase gerencia) |
| **Custo Free Tier** | Limited (Render sleep) | 1GB Firestore + 10GB Hosting |
| **Complexidade** | ⭐⭐⭐⭐ (Média-Alta) | ⭐⭐ (Baixa) |

**Veredicto:** Firebase é **3-4x mais rápido** de desenvolver para MVP de 1 dia!

---

*"When in doubt, choose simplicity. Firebase lets you build fast without sacrificing quality."* 🏗️🔥
---

*"Build fast, build right, build secure. This architecture enables all three."* 🏗️🚀
