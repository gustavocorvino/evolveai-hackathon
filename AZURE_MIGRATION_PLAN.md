# 🚀 Plano de Migração - Azure Static Web Apps

## 📊 Status da Migração
- **Data Início**: 06/02/2026
- **Projeto**: EvolveAI Hackathon
- **Plataforma Origem**: Vercel + Firebase
- **Plataforma Destino**: Azure Static Web Apps + Firebase

---

## 1️⃣ PRÉ-REQUISITOS

### Ferramentas Necessárias
- [x] Node.js 18+
- [ ] Azure CLI (`az`)
- [ ] GitHub CLI (opcional)
- [ ] Conta Azure (com subscription ativa)
- [ ] Conta GitHub (repositório já existe)

### Passos de Configuração Inicial
```bash
# 1. Instalar Azure CLI
# Windows: https://aka.ms/installazurecliwindows

# 2. Fazer login na Azure
az login

# 3. Instalar extensão de Static Web Apps
az extension add --name staticwebapp
```

---

## 2️⃣ ARQUITETURA AZURE

### Componentes
```
┌─────────────────────────────────────────┐
│   Azure Static Web Apps (SWA)           │
│  - Build automático via GitHub Actions  │
│  - Hosting estático + API (Node/Python) │
│  - SSL/TLS automático                   │
│  - Custom domain                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Firebase (Mantém-se igual)            │
│  - Authentication                       │
│  - Firestore Database                   │
│  - Real-time updates                    │
└─────────────────────────────────────────┘
```

### URLs
- **Produção**: `https://[seu-recurso].azurestaticapps.com`
- **Preview**: Automático por Pull Request

---

## 3️⃣ CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE

### Arquivo `.env.local` (local - NÃO fazer commit)
```env
VITE_FIREBASE_API_KEY=AIzaSyBbXZMlarLWvw9dsbutTlBloesq_gkprxs
VITE_FIREBASE_AUTH_DOMAIN=evolveai-hackathon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=evolveai-hackathon
VITE_FIREBASE_STORAGE_BUCKET=evolveai-hackathon.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=806986913757
VITE_FIREBASE_APP_ID=1:806986913757:web:f0013fef6fa0c83f2c0834
```

### Arquivo `.env.production` (para referência)
```env
# Deixar como template, será preenchido pelo GitHub Secrets
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
...
```

### Secrets do GitHub (configurar no repositório)
1. Ir para: **Settings → Secrets and variables → Actions**
2. Criar cada variável:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

---

## 4️⃣ ALTERAÇÕES DE CÓDIGO NECESSÁRIAS

### A. Atualizar `src/firebase/config.js`
```javascript
// Usar variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

### B. Criar `staticwebapp.config.json`
Na raiz do projeto - configura routing, autenticação e rules de acesso.

### C. Atualizar GitHub Actions
Criar workflow que:
1. Faz checkout do código
2. Instala dependências
3. Constrói a aplicação
4. Faz deploy no Azure SWA

---

## 5️⃣ CONFIGURAÇÃO AZURE

### Criando o Static Web App (via CLI)

```bash
# 1. Criar grupo de recursos
az group create \
  --name evolveai-rg \
  --location eastus

# 2. Criar Static Web App
az staticwebapp create \
  --name evolveai-hackathon-swa \
  --resource-group evolveai-rg \
  --source https://github.com/seu-usuario/seu-repo \
  --location eastus \
  --branch main \
  --app-location "src" \
  --output-location "dist" \
  --token SEU_GITHUB_TOKEN
```

Ou via **Portal Azure**:
1. Search: "Static Web Apps"
2. Create
3. Conectar GitHub repository
4. Configurar build presets (Vite)

---

## 6️⃣ SEGURANÇA NA MIGRAÇÃO

### ⚠️ Correções Críticas (conforme análise anterior)

1. **Remover credenciais hardcoded**
   - Use apenas variáveis de ambiente
   - Secrets do GitHub para valores sensíveis

2. **Firestore Rules**
   - Implementar segurança adequada
   - Exemplo fornecido abaixo

3. **Admin Authentication**
   - Migrar de hardcoded para Firebase Custom Claims
   - Ou usar Azure AD/B2C

### Exemplo de Firestore Rules Melhorado
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Teams collection
    match /teams/{teamId} {
      allow read, write: if request.auth != null && request.auth.uid == teamId;
    }
    
    // Use cases (público para leitura, admin para escrita)
    match /useCases/{useCaseId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Helper function
    function isAdmin() {
      return request.auth.token.admin == true;
    }
  }
}
```

---

## 7️⃣ MIGRAÇÃO PASSO A PASSO

### Fase 1: Preparação Local ✅
- [ ] Instalar Azure CLI
- [ ] Configurar `.env.local`
- [ ] Testar build local com `npm run build`
- [ ] Verificar que tudo funciona em `localhost:5173`

### Fase 2: GitHub Setup 🔄
- [ ] Criar GitHub Secrets
- [ ] Criar/atualizar GitHub Actions workflow
- [ ] Fazer commit e push

### Fase 3: Azure Setup 🌐
- [ ] Criar Static Web App no Azure
- [ ] Configurar domínio personalizado (opcional)
- [ ] Revisar deployment automático

### Fase 4: Testes 🧪
- [ ] Testar funcionalidades principais
- [ ] Verificar autenticação Firebase
- [ ] Testar em múltiplos navegadores
- [ ] Performance (Lighthouse)

### Fase 5: Go-Live 🚀
- [ ] Atualizar DNS (se custom domain)
- [ ] Fazer cutover de Vercel → Azure
- [ ] Monitoramento

---

## 8️⃣ DIFERENÇAS VERCEL → AZURE SWA

| Aspecto | Vercel | Azure SWA |
|--------|--------|----------|
| **Build** | `package.json` scripts | GitHub Actions |
| **Env Vars** | `vercel.json` | GitHub Secrets |
| **Preview** | Automático por branch | Automático por PR |
| **Domínio** | Incluído | Incluído |
| **SSL** | Automático | Automático |
| **Pricing** | Free até 100GB | Generoso (500MB) |
| **API Functions** | Serverless native | Node.js/Python |

---

## 9️⃣ TROUBLESHOOTING COMUM

### Build falha no Azure
```bash
# Verificar logs locais primeiro
npm run build

# Se OK localmente, verificar logs do SWA
az staticwebapp logs --name evolveai-hackathon-swa
```

### Firebase não conecta
- Verificar secrets no GitHub
- Confirmar CORS no Firebase Console
- Validar `staticwebapp.config.json`

### Autenticação não funciona
- Testar em navegador incógnito
- Verificar Firebase rules
- Confirmar que Firebase config está correto

---

## 🔟 PRÓXIMAS ETAPAS

1. **AGORA**: Você vai seguir os passos de Fase 1
2. **PRÓXIMO**: Configurar GitHub Secrets
3. **DEPOIS**: Criar e testar Azure SWA
4. **FINAL**: Deploy e validação

---

**Precisa de ajuda com algum passo?** Posso:
- Gerar os arquivos de configuração prontos
- Criar o GitHub Actions workflow
- Ajudar com Azure CLI commands
- Debugar qualquer erro

